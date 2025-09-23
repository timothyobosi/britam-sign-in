import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Button, Grid, Typography, IconButton, CircularProgress, Skeleton } from '@mui/material';
import { FaUndo, FaArrowRight } from 'react-icons/fa';
import { useNavigate, useLocation, useParams, useMatch } from 'react-router-dom';
import MainCard from 'ui-component/cards/MainCard';
import SkeletonTotalOrderCard from 'ui-component/cards/Skeleton/EarningCard';
import { fetchModules, fetchModuleById, saveProgress } from 'services/audioService' 
import JWTContext from 'contexts/JWTContext';

interface TrainingAudioCardProps {
  isLoading?: boolean;
}

// Normalize time to seconds with better error handling (can be removed once service is fully trusted)
const normalizeToSeconds = (value: any): number => {
  if (!value && value !== 0) return 0;
  if (typeof value === 'number' && !isNaN(value)) return Math.floor(value);
  if (typeof value === 'string') {
    const parts = value.split(':').map(Number).filter(n => !isNaN(n));
    if (parts.length === 2) {
      const [m, s] = parts;
      return m * 60 + s;
    }
    console.warn(`Invalid time format for value: ${value}, defaulting to 0`);
  }
  console.warn(`Invalid time value: ${value}, defaulting to 0`);
  return 0;
};

const TrainingAudioCard: React.FC<TrainingAudioCardProps> = ({ isLoading: propLoading = false }) => {
  const getCachedModules = () => {
    try {
      const cached = localStorage.getItem('trainingModules_cache');
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp > 60 * 60 * 1000) {
          localStorage.removeItem('trainingModules_cache');
          return [];
        }
        if (Array.isArray(data)) {
          return data.map((m) => ({
            ...m,
            duration: normalizeToSeconds(m.duration),
            watchTime: Math.min(normalizeToSeconds(m.watchTime), normalizeToSeconds(m.duration)),
          }));
        }
      }
    } catch (e) {
      console.warn('Failed to parse cached modules:', e);
    }
    return [];
  };

  const theme = useTheme();
  const jwtContext = React.useContext(JWTContext);
  const agentId = jwtContext?.user?.agentId;
  const token = localStorage.getItem('serviceToken');
  const navigate = useNavigate();
  const location = useLocation();
  const { moduleId } = useParams<{ moduleId?: string }>();
  const match = useMatch('/training/:moduleId');
  const [isLoading, setIsLoading] = useState(propLoading);
  const [modules, setModules] = useState<authApi.TrainingModule[]>(getCachedModules());
  const [selectedModule, setSelectedModule] = useState<authApi.TrainingModule | null>(null);
  const [audioError, setAudioError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [initialPlaybackTime, setInitialPlaybackTime] = useState<number>(0);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isPollingDisabled, setIsPollingDisabled] = useState<boolean>(false);

  const formatTime = (seconds: number): string => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const totalSeconds = Math.floor(seconds);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Fetch all modules
  useEffect(() => {
    if (!jwtContext?.isInitialized || !jwtContext.user || !token) return;
    setIsLoading(true);
    if (navigator.onLine) {
      fetchModules(token, Number(agentId))
        .then((normalized) => {
          console.log('Normalized API data:', normalized);
          localStorage.setItem('trainingModules_cache', JSON.stringify({ data: normalized, timestamp: Date.now() }));
          setModules(normalized.sort((a, b) => (a.sequence || a.moduleId) - (b.sequence || b.moduleId)));
          setAudioError(null);
        })
        .catch((err) => {
          console.error('Error fetching modules:', err);
          const cached = getCachedModules();
          if (cached.length > 0) {
            setModules(cached);
            setAudioError('Loaded cached modules due to network issue.');
          } else {
            setAudioError(`Failed to load modules: ${err.message}`);
          }
        })
        .finally(() => setIsLoading(false));
    } else {
      const cached = getCachedModules();
      if (cached.length > 0) {
        setModules(cached);
        setAudioError('Loaded cached modules due to offline mode.');
      } else {
        setAudioError('No cached data available offline.');
      }
      setIsLoading(false);
    }
  }, [jwtContext, token, agentId]);

  // Initialize selected module and currentTime
  useEffect(() => {
    const id = moduleId ? parseInt(moduleId, 10) : null;
    if (id && !isNaN(id) && token && match) {
      setIsLoading(true);
      const cachedModules = getCachedModules();
      const cachedModule = cachedModules.find((m) => m.moduleId === id);
      const savedProgress = localStorage.getItem(`audioProgress_${id}`);
      const savedSeconds = savedProgress ? normalizeToSeconds(savedProgress) : 0;

      if (cachedModule && !navigator.onLine) {
        setSelectedModule(cachedModule);
        setCurrentTime(cachedModule.isComplete ? cachedModule.duration : savedSeconds);
        console.log(`Loaded cached module ${id}, currentTime: ${formatTime(currentTime)}`);
        setIsLoading(false);
      } else {
        fetchModuleById(token, id)
          .then((normalizedModule) => {
            console.log('Normalized module data:', normalizedModule);
            setSelectedModule(normalizedModule);
            setCurrentTime(normalizedModule.isComplete ? normalizedModule.duration : savedSeconds);
            console.log(`Fetched module ${id}, currentTime: ${formatTime(currentTime)}`);
          })
          .catch((err) => {
            console.error('Error fetching module by ID:', err);
            setAudioError(`Failed to load module ${id}: ${err.message}`);
          })
          .finally(() => setIsLoading(false));
      }
    } else {
      setSelectedModule(null);
      setCurrentTime(0);
      setAudioError(null);
      setIsLoading(false);
    }
  }, [moduleId, token, match]);

  // Polling for real-time updates
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (selectedModule && token && navigator.onLine && !isPollingDisabled) {
      interval = setInterval(() => {
        fetchModuleById(token, selectedModule.moduleId)
          .then((updatedModule) => {
            const duration = updatedModule.duration;
            const watchTime = updatedModule.watchTime;
            const cappedWatchTime = Math.min(watchTime, duration);
            if (cappedWatchTime > currentTime) {
              setSelectedModule(prev => prev ? { ...prev, watchTime: cappedWatchTime, isComplete: updatedModule.isComplete } : null);
              setModules(prev => prev.map(m => m.moduleId === updatedModule.moduleId ? { ...m, watchTime: cappedWatchTime, isComplete: updatedModule.isComplete } : m));
            }
            console.log(`Polled module ${selectedModule.moduleId}, watchTime: ${formatTime(cappedWatchTime)}, currentTime: ${formatTime(currentTime)}`);
          })
          .catch(err => {
            console.error('Polling failed:', err);
            if (err.response?.status === 500) {
              setIsPollingDisabled(true);
              console.log('Polling disabled due to repeated 500 errors');
            }
          });
      }, 15000);
    }
    return () => clearInterval(interval);
  }, [selectedModule, token, currentTime, isPollingDisabled]);

  // Save progress to localStorage (skip for completed modules)
  useEffect(() => {
    if (moduleId && selectedModule && !selectedModule.isComplete) {
      const cappedCurrentTime = Math.min(currentTime, selectedModule.duration);
      localStorage.setItem(`audioProgress_${moduleId}`, String(cappedCurrentTime));
      console.log(`Saved progress for ${moduleId}: ${formatTime(cappedCurrentTime)}`);
    }
  }, [currentTime, moduleId, selectedModule]);

  // Save progress before unload (skip for completed modules)
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (audioRef.current && selectedModule && !selectedModule.isComplete) {
        const time = Math.floor(audioRef.current.currentTime);
        localStorage.setItem(`audioProgress_${moduleId}`, String(time));
        if (navigator.onLine && token) {
          saveProgress(token, selectedModule.moduleId, time).catch((err) => console.error('Failed to save progress on unload:', err));
        }
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [moduleId, selectedModule, token]);

  // Update progress on server (skip for completed modules)
  const updateProgress = async (moduleId: number, watchedSeconds: number) => {
    if (selectedModule?.isComplete) {
      console.log(`Skipping progress update for completed module ${moduleId}`);
      return;
    }

    if (token && selectedModule && !isUpdating) {
      setIsUpdating(true);
      try {
        const newWatchTime = Math.min(watchedSeconds, selectedModule.duration);
        console.log(`Updating progress → moduleId=${moduleId}, watchedSeconds=${formatTime(watchedSeconds)}, final newWatchTime=${formatTime(newWatchTime)}`);
        await saveProgress(token, moduleId, newWatchTime);
        setSelectedModule(prev => prev?.moduleId === moduleId ? { ...prev, watchTime: newWatchTime } : prev);
        setModules(prev => prev.map(m => m.moduleId === moduleId ? { ...m, watchTime: newWatchTime } : m));
      } catch (error) {
        console.error('Error saving progress:', error);
        setAudioError('Failed to save progress');
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleModuleSelect = (moduleId: number) => {
    const module = modules.find((m) => m.moduleId === moduleId);
    if (module) {
      const previousModule = modules.find(m => m.moduleId === moduleId - 1);
      if (moduleId > 1 && previousModule && !previousModule.isComplete) {
        setAudioError('You must complete the previous module first.');
        return;
      }
      navigate(`/training/${moduleId}`);
    }
  };

  const handleClose = () => {
    if (selectedModule) {
      if (audioRef.current && !selectedModule.isComplete) {
        const watchedSeconds = Math.floor(audioRef.current.currentTime);
        updateProgress(selectedModule.moduleId, watchedSeconds);
      }
      setSelectedModule(null);
      navigate('/training');
    }
  };

  const handleRewind = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
    }
  };

  const handleRestart = () => {
    if (audioRef.current) {
      if (selectedModule?.isComplete && !window.confirm('Restart completed audio from the beginning?')) return;
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      localStorage.setItem(`audioProgress_${moduleId}`, '0');
      audioRef.current.play();
    }
  };

  const handleNextModule = () => {
    if (selectedModule && modules.length > 0) {
      const nextIndex = modules.findIndex(m => m.moduleId > selectedModule.moduleId && !m.isComplete);
      console.log(`Next module index: ${nextIndex}`);
      if (nextIndex !== -1) navigate(`/training/${modules[nextIndex].moduleId}`);
    }
  };

  if (isLoading) return <SkeletonTotalOrderCard />;

  return (
    <MainCard border={false} content={false} sx={{ minHeight: '300px', height: 'auto', maxWidth: '100%', overflow: 'visible', [theme.breakpoints.down('sm')]: { minHeight: '200px', padding: 1 } }}>
      <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: theme.palette.grey[100] }}>
        {audioError ? (
          <Box sx={{ textAlign: 'center' }}>
            <Typography color="error" align="center">{audioError}</Typography>
            <Button variant="contained" onClick={() => { setAudioError(null); navigate('/training'); }} sx={{ mt: 2 }}>Get back to Course Outline</Button>
            <Button variant="outlined" onClick={() => localStorage.clear()} sx={{ mt: 2, ml: 2 }}>Clear Cache (Debug)</Button>
          </Box>
        ) : (
          <>
            {!match ? (
              <Grid container spacing={2}>
                {modules.length > 0 ? modules.map((module) => (
                  <Grid item xs={12} sm={6} md={3} key={`module-${module.moduleId || module.title}`}>
                    {module.moduleId ? (
                      <MainCard
                        title={`Lesson ${module.moduleId} - ${module.title || 'Untitled'}`}
                        sx={{ cursor: 'pointer', border: '1px solid', borderColor: theme.palette.divider, backgroundColor: '#fff', transition: 'background 0.2s', '&:hover': { backgroundColor: theme.palette.action.hover } }}
                        onClick={() => handleModuleSelect(module.moduleId)}
                      >
                        <Typography variant="h6">{module.title || 'Untitled'}</Typography>
                        <Typography>Duration: {formatTime(module.duration)}</Typography>
                        <Typography>Watch Time: {formatTime(module.watchTime)}</Typography>
                        <Typography>Status: {module.status || 'Not Started'}</Typography>
                        {module.isComplete && <Typography color="success.main">Completed!</Typography>}
                      </MainCard>
                    ) : <Typography color="error">Invalid module data</Typography>}
                  </Grid>
                )) : (
                  <>
                    <Box sx={{ width: '100%', mb: 2, textAlign: 'center' }}>
                      <CircularProgress color="primary" size={40} />
                      <Typography variant="h6" sx={{ mt: 1, color: theme.palette.text.secondary }}>Preparing audio training lessons...</Typography>
                    </Box>
                    <Grid container spacing={2}>
                      {Array.from({ length: 6 }).map((_, index) => (
                        <Grid item xs={12} sm={6} md={3} key={`skeleton-${index}`}>
                          <Box sx={{ p: 2, border: '1px solid', borderColor: theme.palette.divider, borderRadius: theme.shape.borderRadius, backgroundColor: theme.palette.background.paper, height: 150, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <Skeleton variant="text" sx={{ fontSize: '1.2rem', mb: 1 }} />
                            <Skeleton variant="text" width="80%" />
                            <Skeleton variant="text" width="60%" />
                            <Skeleton variant="rounded" width="40%" height={20} />
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </>
                )}
              </Grid>
            ) : selectedModule && (
              <MainCard
                title={`Lesson ${selectedModule.moduleId} - ${selectedModule.title}`}
                sx={{
                  width: "100%",
                  maxWidth: "600px",
                  [theme.breakpoints.down("sm")]: { maxWidth: "100%", padding: 1 },
                }}
              >
                <audio
                  ref={audioRef}
                  src={`https://brm-partners.britam.com${selectedModule.filePath}?v=${selectedModule.updateDate || Date.now()}`}
                  onTimeUpdate={(e) => {
                    const time = Math.floor((e.target as HTMLAudioElement).currentTime);
                    setCurrentTime(time);
                    console.log(`Listening at ${formatTime(time)}`);
                  }}
                  onLoadedMetadata={(e) => {
                    const audio = e.target as HTMLAudioElement;
                    if (selectedModule.isComplete) {
                      audio.currentTime = 0; // Start from beginning for relisten
                      setCurrentTime(0);
                    } else {
                      audio.currentTime = currentTime;
                    }
                  }}
                  onPlay={(e) => {
                    const audio = e.target as HTMLAudioElement;
                    if (selectedModule.isComplete) {
                      audio.currentTime = 0; // Ensure start from beginning on play
                      setCurrentTime(0);
                      console.log('Relisten: Starting from beginning');
                    } else {
                      const time = audio.currentTime;
                      if (initialPlaybackTime === 0) setInitialPlaybackTime(time);
                      setCurrentTime(time);
                      console.log(`Playing at ${formatTime(time)}`);
                    }
                  }}
                  onPause={(e) => {
                    const time = Math.floor((e.target as HTMLAudioElement).currentTime);
                    if (selectedModule && !selectedModule.isComplete && !isUpdating) {
                      setCurrentTime(time);
                      updateProgress(selectedModule.moduleId, time);
                      console.log(`Paused at ${formatTime(time)}`);
                    }
                  }}
                  onEnded={() => {
                    if (selectedModule && !selectedModule.isComplete) {
                      updateProgress(selectedModule.moduleId, selectedModule.duration);
                      console.log(`Ended at ${formatTime(selectedModule.duration)}`);
                    }
                  }}
                  onError={(e) => {
                    console.error("Audio error:", e);
                    setAudioError("Failed to load audio file. Please try again later.");
                  }}
                  controls
                  style={{ width: "100%", outline: "none" }}
                  preload="auto"
                />
                <Box sx={{ p: 2, textAlign: "center" }}>
                  <Button variant="contained" onClick={handleClose} sx={{ mt: 1 }}>
                    Close
                  </Button>
                  <Typography>Duration: {formatTime(selectedModule.duration)}</Typography>
                  <Typography>
                    Progress: {formatTime(currentTime)} / {formatTime(selectedModule.duration)}
                  </Typography>
                  <Typography>Status: {selectedModule.status}</Typography>
                  {selectedModule.isComplete && (
                    <Button
                      variant="contained"
                      startIcon={<FaArrowRight />}
                      onClick={handleNextModule}
                      disabled={modules.findIndex(m => m.moduleId > selectedModule.moduleId && !m.isComplete) === -1}
                      sx={{ mt: 2 }}
                    >
                      Next Module
                    </Button>
                  )}
                </Box>
              </MainCard>
            )}
          </>
        )}
      </Box>
    </MainCard>
  );
};

TrainingAudioCard.propTypes = { isLoading: PropTypes.bool };

export default TrainingAudioCard;
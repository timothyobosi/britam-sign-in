import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Button, Grid, Typography, IconButton, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { FaUndo, FaArrowRight } from 'react-icons/fa';
import { useNavigate, useLocation, useParams, useMatch } from 'react-router-dom';
import MainCard from 'ui-component/cards/MainCard';
import AudioCard from './AudioCard';
import ReactH5AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import * as authApi from 'safaricom-data/api/index';
import JWTContext from 'contexts/JWTContext';

interface TrainingAudioCardProps {
  isLoading?: boolean;
}

// Normalize time to seconds with better error handling
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
          return data.map((m) => {
            const duration = normalizeToSeconds(m.duration);
            const apiWatchTime = normalizeToSeconds(m.watchTime);
            const savedProgress = localStorage.getItem(`audioProgress_${m.moduleId}`);
            const localWatchTime = savedProgress ? normalizeToSeconds(savedProgress) : 0;

            return {
              ...m,
              duration,
              watchTime: m.isComplete
                ? duration
                : Math.min(Math.max(apiWatchTime, localWatchTime), duration),
            };
          });
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
  const audioRef = useRef<ReactH5AudioPlayer | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [initialPlaybackTime, setInitialPlaybackTime] = useState<number>(0);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isPollingDisabled, setIsPollingDisabled] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

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
      authApi.getAllTrainingModules(token, Number(agentId))
        .then((data) => {
          const normalized = data.map((m) => {
            const duration = normalizeToSeconds(m.duration);
            const apiWatchTime = normalizeToSeconds(m.watchTime);
            const savedProgress = localStorage.getItem(`audioProgress_${m.moduleId}`);
            const localWatchTime = savedProgress ? normalizeToSeconds(savedProgress) : 0;

            return {
              ...m,
              duration,
              watchTime: m.isComplete
                ? duration
                : Math.min(Math.max(apiWatchTime, localWatchTime), duration),
            };
          });

          setModules(normalized.sort((a, b) => (a.sequence || a.moduleId) - (b.sequence || b.moduleId)));
          setAudioError(null);
        })
        .catch((err) => {
          console.error('Failed to fetch modules:', err);
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
      if (cachedModule && navigator.onLine) {
        setSelectedModule(cachedModule);
        setCurrentTime(cachedModule.isComplete ? cachedModule.duration : savedSeconds);
        console.log(`Loaded cached module ${id}, currentTime: ${formatTime(currentTime)}`);
      } else {
        authApi.getTrainingById(token, id)
          .then((module) => {
            console.log('Raw module data:', module);
            const duration = normalizeToSeconds(module.duration);
            const watchTime = normalizeToSeconds(module.watchTime);
            const normalizedModule = {
              ...module,
              duration,
              watchTime: module.isComplete ? duration : Math.min(watchTime, duration),
            };

            setSelectedModule(normalizedModule);
            setCurrentTime(normalizedModule.watchTime);
            console.log(`Fetched module ${id}, currentTime: ${formatTime(currentTime)}`)
          })
          .catch((error) => {
            console.error('Error fetching module details:', error);
            setAudioError(`Failed to load module ${id}: ${error.message}`);
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
      authApi.getTrainingById(token, selectedModule.moduleId)
        .then((updatedModule) => {
          const duration = normalizeToSeconds(updatedModule.duration);
          const watchTime = normalizeToSeconds(updatedModule.watchTime);
          const cappedWatchTime = Math.min(watchTime, duration);
          // Only update if server watchTime is greater than currentTime
          if (cappedWatchTime > currentTime) {
            setSelectedModule(prev => prev ? { ...prev, watchTime: cappedWatchTime, isComplete: updatedModule.isComplete } : null);
            setModules(prev => prev.map(m => m.moduleId === updatedModule.moduleId ? { ...m, watchTime: cappedWatchTime, isComplete: updatedModule.isComplete } : m));
            console.log(`Polled module ${selectedModule.moduleId}, watchTime: ${formatTime(cappedWatchTime)}, currentTime: ${formatTime(currentTime)}`);
          } else {
            console.log(`Polled module ${selectedModule.moduleId}, no update needed, server watchTime: ${formatTime(cappedWatchTime)}, currentTime: ${formatTime(currentTime)}`);
          }
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

  // Save progress to localStorage
  useEffect(() => {
    if (moduleId && selectedModule) {
      const cappedCurrentTime = Math.min(currentTime, selectedModule.duration);
      console.log(`Saved progress for ${moduleId}: ${formatTime(cappedCurrentTime)}`);
    }
  }, [currentTime, moduleId, selectedModule]);

  // Save progress before unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (audioRef.current?.audio && selectedModule) {
        const time = Math.floor(audioRef.current.audio.currentTime);
        localStorage.setItem(`audioProgress_${moduleId}`, String(time));
        if (navigator.onLine && token && !selectedModule.isComplete) {
          authApi.updateTrainingProgress(token, selectedModule.moduleId, time).catch((err) => console.error('Failed to save progress on unload:', err));
        }
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [moduleId, selectedModule, token]);

  // Update progress on server
  const updateProgress = async (moduleId: number, watchedSeconds: number) => {
  if (token && selectedModule && !isUpdating) {
    setIsUpdating(true);
    try {
      const newWatchTime = Math.min(watchedSeconds, selectedModule.duration);
      console.log(
        `Updating progress → moduleId=${moduleId}, watchedSeconds=${formatTime(
          watchedSeconds
        )}, final newWatchTime=${formatTime(newWatchTime)}`
      );

      const response = await authApi.updateTrainingProgress(
        token,
        moduleId,
        newWatchTime
      );
      console.log("Update progress response:", response);

      const isComplete = newWatchTime >= selectedModule.duration;

      // Update selectedModule and modules only if the new watchTime is valid
      setSelectedModule((prev) =>
        prev?.moduleId === moduleId
          ? {
              ...prev,
              watchTime: newWatchTime,
              isComplete,
              status: isComplete ? "Completed" : "In Progress",
            }
          : prev
      );

      setModules((prev) =>
        prev.map((m) =>
          m.moduleId === moduleId
            ? {
                ...m,
                watchTime: newWatchTime,
                isComplete,
                status: isComplete ? "Completed" : "In Progress",
              }
            : m
        )
      );

      // Save to localStorage to persist the latest progress
      localStorage.setItem(`audioProgress_${moduleId}`, String(newWatchTime));
    } catch (error) {
      console.error("Error saving progress:", error);
      setAudioError("Failed to save progress");
    } finally {
      setIsUpdating(false);
    }
  }
};

const handleModuleSelect = (moduleId: number) => {
    const module = modules.find((m) => m.moduleId === moduleId);

    if (!module) return;

    const previousIncomplete = modules.some(
      (m) => (m.sequence || m.moduleId) < (module.sequence || module.moduleId) && !m.isComplete
    );

    if (previousIncomplete) {
      setDialogMessage("Kindly complete listening to the previous audio lessons.");
      setOpenDialog(true);
      return;
    }

    navigate(`/training/${moduleId}`);
  };

const handleClose = () => {
  if (selectedModule) {
    const watchedSeconds = audioRef.current?.audio ? Math.floor(audioRef.current.audio.currentTime) : currentTime;
    setSelectedModule(null); // Clear selected module immediately
    navigate('/training');   // Navigate back immediately

    // Trigger updateProgress in the background with the latest time
    if (navigator.onLine && token && !selectedModule.isComplete) {
      updateProgress(selectedModule.moduleId, watchedSeconds).catch((error) => {
        console.error("Failed to save progress on close:", error);
      });
    }
    // Save to localStorage before navigating
    localStorage.setItem(`audioProgress_${moduleId}`, String(watchedSeconds));
  }
};

  const handleRewind = () => {
    if (audioRef.current?.audio) {
      audioRef.current.audio.currentTime = Math.max(0, audioRef.current.audio.currentTime - 10);
    }
  };

  const handleRestart = () => {
    if (audioRef.current?.audio) {
      if (selectedModule?.isComplete && !window.confirm('Restart completed audio from the beginning?')) return;
      audioRef.current.audio.currentTime = 0;
      setCurrentTime(0);
      localStorage.setItem(`audioProgress_${moduleId}`, '0');
      audioRef.current.audio.play();
    }
  };

  const handleNextModule = () => {
    if (selectedModule && modules.length > 0) {
      const nextIndex = modules.findIndex(m => m.moduleId > selectedModule.moduleId && !m.isComplete);
      if (nextIndex !== -1) navigate(`/training/${modules[nextIndex].moduleId}`);
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '300px',
          backgroundColor: theme.palette.grey[100],
          borderRadius: theme.shape.borderRadius,
          p: 3,
        }}
      >
        <CircularProgress color="primary" size={60} thickness={4} />
        <Typography variant="h5" sx={{ mt: 2, color: theme.palette.text.primary }}>
          Loading Audio Lesson...
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, color: theme.palette.text.secondary }}>
          Please wait while we prepare your training content.
        </Typography>
      </Box>
    );
  }

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
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      minHeight: '300px',
                    }}
                  >
                    <CircularProgress color="primary" size={60} thickness={4} />
                    <Typography variant="h5" sx={{ mt: 2, color: theme.palette.text.primary }}>
                      Preparing Audio Training Lessons...
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1, color: theme.palette.text.secondary }}>
                      Please wait while we fetch your course content.
                    </Typography>
                  </Box>
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
                  ref={audioRef as React.RefObject<HTMLAudioElement>}
                  src={`https://brm-partners.britam.com${selectedModule.filePath}?v=${selectedModule.updateDate || Date.now()}`}
                  onLoadedMetadata={(e) => {
                    (e.target as HTMLAudioElement).currentTime = selectedModule.watchTime || 0;
                    console.log(`⏮️ Resumed from saved watchTime: ${formatTime(selectedModule.watchTime)}`);
                  }}
                  onTimeUpdate={(e) => {
                    const time = Math.floor((e.target as HTMLAudioElement).currentTime);
                    console.log(`Listening at ${formatTime(time)}`);
                    console.log("🎯 Selected module:", selectedModule);
                  }}
                  onPlay={(e) => {
                    const time = (e.target as HTMLAudioElement).currentTime;
                    console.log(`▶️ Playing at ${formatTime(time)}`);
                    console.log("🎯 Selected module:", selectedModule);
                  }}
                  onPause={(e) => {
  const time = Math.floor((e.target as HTMLAudioElement).currentTime);
  if (selectedModule && !selectedModule.isComplete && !isUpdating) {
    updateProgress(selectedModule.moduleId, time);
    setCurrentTime(time); // Sync currentTime with paused time
    console.log(`⏸️ Paused at ${formatTime(time)}`);
    console.log("🎯 Selected module:", selectedModule);
  }
}}
                  onEnded={() => {
                    if (selectedModule && !selectedModule.isComplete) {
                      updateProgress(selectedModule.moduleId, selectedModule.duration);
                      console.log(`🏁 Ended at saved watchTime ${formatTime(selectedModule.watchTime)}`);
                      console.log("🎯 Selected module:", selectedModule);
                    }
                  }}
                  onError={(e) => {
                    console.error("Audio error:", e);
                    setAudioError("Failed to load audio file. Please try again later.");
                    console.log("🎯 Selected module:", selectedModule);
                  }}
                  controls
                  style={{ width: "100%", outline: "none" }}
                />
                <Box sx={{ p: 2, textAlign: "center" }}>
                  <Button variant="contained" onClick={handleClose} sx={{ mt: 1 }}>
                    Close
                  </Button>
                  <Typography>Duration: {formatTime(selectedModule.duration)}</Typography>
                  <Typography>
                    Progress: {formatTime(selectedModule.watchTime)} / {formatTime(selectedModule.duration)}
                  </Typography>
                  <Typography>Status: {selectedModule.status}</Typography>
                  {selectedModule.isComplete && (
                    <Button
                      variant="contained"
                      startIcon={<FaArrowRight />}
                      onClick={handleNextModule}
                      disabled={
                        modules.findIndex(
                          (m) => m.moduleId > selectedModule.moduleId && !m.isComplete
                        ) === -1
                      }
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
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Notice</DialogTitle>
        <DialogContent>
          <Typography>{dialogMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
};

TrainingAudioCard.propTypes = { isLoading: PropTypes.bool };

export default TrainingAudioCard;
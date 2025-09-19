import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Button, Grid, Typography, IconButton, CircularProgress, Skeleton } from '@mui/material';
import { FaUndo, FaArrowRight } from 'react-icons/fa';
import { useNavigate, useLocation, useParams, useMatch } from 'react-router-dom';
import MainCard from 'ui-component/cards/MainCard';
import SkeletonTotalOrderCard from 'ui-component/cards/Skeleton/EarningCard';
import ReactH5AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import * as authApi from 'safaricom-data/api/index';
import JWTContext from 'contexts/JWTContext';

interface TrainingAudioCardProps {
  isLoading?: boolean;
}

const TrainingAudioCard: React.FC<TrainingAudioCardProps> = ({ isLoading: propLoading = false }) => {
  // Helper: get cached modules from localStorage
  const getCachedModules = () => {
    try {
      const cached = localStorage.getItem('trainingModules_cache');
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp > 24 * 60 * 60 * 1000) {
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
  const agentId = jwtContext && 'user' in jwtContext ? (jwtContext as any).user?.agentId : undefined;
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
  const [currentTime, setCurrentTime] = useState<number>(() => {
    if (moduleId) {
      const saved = localStorage.getItem(`audioProgress_${moduleId}`);
      return saved ? normalizeToSeconds(saved) : 0;
    }
    return 0;
  });
  const [initialPlaybackTime, setInitialPlaybackTime] = useState<number>(0);
  const [audioDuration, setAudioDuration] = useState<number>(0);

  // Normalize time to seconds (handles MM:SS strings or numbers as seconds)
  const normalizeToSeconds = (value: any): number => {
    if (!value) return 0;

    if (typeof value === 'number' && !isNaN(value)) {
      return Math.floor(value); // Assume number is in seconds
    }

    if (typeof value === 'string') {
      // Expect MM:SS format
      const parts = value.split(':').map(Number).filter(n => !isNaN(n));
      if (parts.length === 2) {
        const [m, s] = parts;
        return m * 60 + s;
      }
      console.warn(`Invalid time format for value: ${value}`);
    }

    return 0; // Fallback for invalid input
  };

  // Format seconds to MM:SS
  const formatTime = (seconds: number): string => {
    if (!seconds || isNaN(seconds)) return '0:00';

    const totalSeconds = Math.floor(seconds);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Fetch all modules
  useEffect(() => {
    if (!jwtContext || !jwtContext.isInitialized || !jwtContext.user) return;
    const agentId = Number(jwtContext.user.agentId);
    const token = localStorage.getItem('serviceToken');
    if (!token) {
      const cached = getCachedModules();
      if (cached.length > 0) {
        setModules(cached);
        setAudioError('Loaded cached modules due to missing token.');
      } else {
        setAudioError('No valid token found.');
      }
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    if (navigator.onLine) {
      authApi
        .getAllTrainingModules(token, agentId)
        .then((data: authApi.TrainingModule[]) => {
          const normalized = data.map((m) => ({
            ...m,
            duration: normalizeToSeconds(m.duration),
            watchTime: Math.min(normalizeToSeconds(m.watchTime), normalizeToSeconds(m.duration)),
          }));
          localStorage.setItem('trainingModules_cache', JSON.stringify({ data: normalized, timestamp: Date.now() }));
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
  }, [jwtContext]);

  // Fetch selected module details when moduleId changes
  useEffect(() => {
    console.log('useEffect triggered for moduleId:', moduleId, 'token:', token);
    const id = moduleId ? parseInt(moduleId, 10) : null;
    if (id && !isNaN(id) && token && match) {
      setIsLoading(true);
      console.log('Fetching module details for moduleId:', id);
      // Check cache first
      const cachedModules = getCachedModules();
      const cachedModule = cachedModules.find((m) => m.moduleId === id);
      if (cachedModule) {
        console.log(`Loading cached module ${id}:`, cachedModule);
        setSelectedModule(cachedModule);
        const savedProgress = localStorage.getItem(`audioProgress_${id}`);
        setCurrentTime(savedProgress ? normalizeToSeconds(savedProgress) : cachedModule.watchTime || 0);
        setInitialPlaybackTime(0);
        setAudioDuration(0);
        setAudioError(null);
        setIsLoading(false);
      } else {
        authApi
          .getTrainingById(token, id)
          .then((module: authApi.TrainingModule) => {
            const duration = normalizeToSeconds(module.duration);
            const watchTime = normalizeToSeconds(module.watchTime);
            const cappedWatchTime = Math.min(watchTime, duration);
            const normalizedModule = {
              ...module,
              duration,
              watchTime: cappedWatchTime,
            };
            console.log(
              `Selected Module ${id} - Title: ${module.title}, Raw duration: ${module.duration}, Normalized: ${duration}, Raw watchTime: ${module.watchTime}, Normalized: ${watchTime}, Capped: ${cappedWatchTime}`
            );
            setSelectedModule(normalizedModule);
            // Update cache with new module data
            const updatedCache = [...cachedModules.filter((m) => m.moduleId !== id), normalizedModule];
            localStorage.setItem('trainingModules_cache', JSON.stringify(updatedCache));
            const savedProgress = localStorage.getItem(`audioProgress_${id}`);
            setCurrentTime(savedProgress ? normalizeToSeconds(savedProgress) : cappedWatchTime || 0);
            setInitialPlaybackTime(0);
            setAudioDuration(0);
            setAudioError(null);
          })
          .catch((error: any) => {
            console.error('Error fetching module details:', error);
            setAudioError(`Failed to load module ${id}: ${error.message}`);
          })
          .finally(() => setIsLoading(false));
      }
    } else {
      setSelectedModule(null);
      setCurrentTime(0);
      setInitialPlaybackTime(0);
      setAudioDuration(0);
      setAudioError(null);
      setIsLoading(false);
    }
  }, [moduleId, token, match]);

  // Save audio progress to localStorage whenever currentTime changes
  useEffect(() => {
    if (moduleId && selectedModule) {
      const cappedCurrentTime = Math.min(currentTime, selectedModule.duration);
      localStorage.setItem(`audioProgress_${moduleId}`, String(cappedCurrentTime));
    }
  }, [currentTime, moduleId, selectedModule]);

  // Save module progress
  const updateProgress = async (moduleId: number, watchedSeconds: number) => {
    if (token && selectedModule) {
      try {
        const validWatchedSeconds = Math.max(0, Number.isFinite(watchedSeconds) ? watchedSeconds : 0);
        const sessionTime = Math.max(0, validWatchedSeconds - initialPlaybackTime);
        const normalizedWatchTime = normalizeToSeconds(selectedModule.watchTime);
        const normalizedDuration = normalizeToSeconds(selectedModule.duration);

        // Cap watch time at duration
        let newWatchTime = normalizedWatchTime + sessionTime;
        newWatchTime = Math.min(newWatchTime, normalizedDuration);

        console.log(
          'Updating progress - moduleId:',
          moduleId,
          'sessionTime:',
          sessionTime,
          'newWatchTime:',
          newWatchTime
        );

        const response = await authApi.updateTrainingProgress(token, moduleId, newWatchTime);
        console.log('Progress update response:', response);

        if (moduleId) {
          setIsLoading(true);
          const updatedModuleRaw = await authApi.getTrainingById(token, moduleId);
          const duration = normalizeToSeconds(updatedModuleRaw.duration);
          const watchTime = normalizeToSeconds(updatedModuleRaw.watchTime);
          const cappedWatchTime = Math.min(watchTime, duration);
          const updatedModule = {
            ...updatedModuleRaw,
            duration,
            watchTime: cappedWatchTime,
          };
          setSelectedModule(updatedModule);

          const updatedModulesRaw = await authApi.getAllTrainingModules(token, agentId);
          const updatedModules = updatedModulesRaw.map((m) => {
            const modDuration = normalizeToSeconds(m.duration);
            const modWatchTime = normalizeToSeconds(m.watchTime);
            return {
              ...m,
              duration: modDuration,
              watchTime: Math.min(modWatchTime, modDuration),
            };
          });
          // Update cache
          localStorage.setItem('trainingModules_cache', JSON.stringify(updatedModules));
          setModules(
            updatedModules.sort(
              (a, b) => (a.sequence || a.moduleId) - (b.sequence || b.moduleId)
            )
          );
          setIsLoading(false);
        }
      } catch (error: any) {
        console.error('Progress update failed:', error);
        setAudioError(
          'Failed to save your progress. Please try closing the module again or contact support if the issue persists.'
        );
      }
    }
  };

  const handleModuleSelect = (moduleId: number) => {
    console.log('handleModuleSelect triggered for moduleId:', moduleId, 'current modules:', modules);
    const module = modules.find((m: authApi.TrainingModule) => m.moduleId === moduleId);
    if (module) {
      const currentIndex = modules.findIndex((m: authApi.TrainingModule) => m.moduleId === moduleId);
      const nextIncompleteIndex = modules.findIndex((m: authApi.TrainingModule) => !m.isComplete);
      console.log('Current index:', currentIndex, 'Next incomplete index:', nextIncompleteIndex);
      if (currentIndex <= nextIncompleteIndex || nextIncompleteIndex === -1 || module.isComplete) {
        navigate(`/training/${moduleId}`);
      } else {
        setAudioError('Please complete the previous module before proceeding.');
      }
    } else {
      console.log('Module not found in modules list:', moduleId);
      setAudioError('Selected module not found.');
    }
  };

  const handleClose = () => {
    if (audioRef.current?.audio && selectedModule) {
      const watchedSeconds = Math.floor(audioRef.current.audio.currentTime || currentTime);
      updateProgress(selectedModule.moduleId, watchedSeconds);
    } else if (selectedModule) {
      updateProgress(selectedModule.moduleId, currentTime);
    }
    setAudioError(null);
    navigate('/training');
    setSelectedModule(null);
  };

  const handleTryAgain = () => {
    if (selectedModule) {
      updateProgress(selectedModule.moduleId, currentTime);
    }
    setAudioError(null);
    navigate('/training');
    setSelectedModule(null);
  };

  const handleRewind = () => {
    if (audioRef.current?.audio) {
      audioRef.current.audio.currentTime = Math.max(0, audioRef.current.audio.currentTime - 10);
    }
  };

  const handleRestart = () => {
    if (audioRef.current?.audio) {
      audioRef.current.audio.currentTime = 0;
      audioRef.current.audio.play();
    }
  };

  const handleNextModule = () => {
    if (selectedModule && modules.length > 0) {
      const currentIndex = modules.findIndex((m) => m.moduleId === selectedModule.moduleId);
      const nextIndex = modules.findIndex(
        (m) => m.moduleId > selectedModule.moduleId && !m.isComplete
      );
      if (nextIndex !== -1) {
        navigate(`/training/${modules[nextIndex].moduleId}`);
      } else {
        console.log('No next incomplete module available');
      }
    }
  };

  if (isLoading) return <SkeletonTotalOrderCard />;

  console.log(
    'Rendering - location:',
    location.pathname,
    'modules:',
    modules,
    'moduleId:',
    moduleId,
    'selectedModule:',
    selectedModule,
    'audioError:',
    audioError
  );

  return (
    <MainCard
      border={false}
      content={false}
      sx={{
        minHeight: '300px',
        height: 'auto',
        maxWidth: '100%',
        overflow: 'visible',
        [theme.breakpoints.down('sm')]: {
          minHeight: '200px',
          padding: 1,
        },
      }}
    >
      <Box
        sx={{
          p: 3,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.palette.grey[100],
        }}
      >
        {audioError ? (
          <Box sx={{ textAlign: 'center' }}>
            <Typography color="error" align="center">
              {audioError}
            </Typography>
            <Button variant="contained" onClick={handleTryAgain} sx={{ mt: 2 }}>
              Get back to Course Outline
            </Button>
            <Button variant="outlined" onClick={() => localStorage.clear()} sx={{ mt: 2, ml: 2 }}>
              Clear Cache (Debug)
            </Button>
          </Box>
        ) : (
          <>
            {!match ? (
              <Grid container spacing={2}>
                {modules.length > 0 ? (
                  modules.map((module) => (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={3}
                      key={`module-${module.moduleId || module.title}`}
                    >
                      {module.moduleId ? (
                        <MainCard
                          title={`Lesson ${module.moduleId} - ${module.title || 'Untitled'}`}
                          sx={{
                            cursor: 'pointer',
                            border: '1px solid',
                            borderColor: theme.palette.divider,
                            backgroundColor: '#fff',
                            transition: 'background 0.2s',
                            '&:hover': { backgroundColor: theme.palette.action.hover },
                          }}
                          onClick={() => handleModuleSelect(module.moduleId)}
                        >
                          <Typography variant="h6">{module.title || 'Untitled'}</Typography>
                          <Typography>Duration: {formatTime(module.duration)}</Typography>
                          <Typography>Watch Time: {formatTime(module.watchTime)}</Typography>
                          <Typography>Status: {module.status || 'Not Started'}</Typography>
                          {module.isComplete && (
                            <Typography color="success.main">Completed!</Typography>
                          )}
                        </MainCard>
                      ) : (
                        <Typography color="error">Invalid module data</Typography>
                      )}
                    </Grid>
                  ))
                ) : (
                  <>
                    <Box sx={{ width: '100%', mb: 2, textAlign: 'center' }}>
                      <CircularProgress color="primary" size={40} />
                      <Typography variant="h6" sx={{ mt: 1, color: theme.palette.text.secondary }}>
                        Preparing audio training lessons...
                      </Typography>
                    </Box>
                    <Grid container spacing={2}>
                      {Array.from({ length: 6 }).map((_, index) => (
                        <Grid item xs={12} sm={6} md={3} key={`skeleton-${index}`}>
                          <Box
                            sx={{
                              p: 2,
                              border: '1px solid',
                              borderColor: theme.palette.divider,
                              borderRadius: theme.shape.borderRadius,
                              backgroundColor: theme.palette.background.paper,
                              height: 150,
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between',
                            }}
                          >
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
            ) : (
              selectedModule && (
                <MainCard
                  title={`Lesson ${selectedModule.moduleId} - ${selectedModule.title}`}
                  sx={{
                    width: '100%',
                    maxWidth: '600px',
                    [theme.breakpoints.down('sm')]: {
                      maxWidth: '100%',
                      padding: 1,
                    },
                  }}
                >
                  <ReactH5AudioPlayer
                    ref={audioRef}
                    src={`https://brm-partners.britam.com${selectedModule.filePath}`}
                    listenInterval={1000}
                    onPlay={() => {
                      console.log('Playing', audioRef.current?.audio);
                      setInitialPlaybackTime(currentTime);
                    }}
                    onPause={() => {
                      console.log('Pausing - using currentTime:', currentTime);
                      if (audioRef.current?.audio && selectedModule) {
                        updateProgress(selectedModule.moduleId, Math.floor(audioRef.current.audio.currentTime));
                      }
                    }}
                    onEnded={() => {
                      if (selectedModule) {
                        const fullDuration = selectedModule.duration;
                        updateProgress(selectedModule.moduleId, fullDuration);
                      }
                    }}
                    onListen={(e) => {
                      console.log('onListen event:', e);
                      if (e.target) {
                        let time = e.target.currentTime || 0;
                        time = Math.min(time, audioDuration || selectedModule.duration);
                        setCurrentTime(Math.floor(isNaN(time) ? 0 : time));
                      }
                    }}
                    onError={(e) => {
                      console.error('Audio error:', e);
                      setAudioError('Failed to load audio file. Please try again later.');
                    }}
                    customAdditionalControls={[]}
                    customVolumeControls={[]}
                    customControlsSection={[
                      'MAIN_CONTROLS',
                      (
                        <div
                          style={{
                            display: 'flex',
                            gap: '10px',
                            padding: '10px',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                          }}
                        >
                          <IconButton onClick={handleRewind} color="primary">
                            <FaUndo />
                          </IconButton>
                          <IconButton onClick={handleRestart} color="primary">
                            <FaUndo style={{ transform: 'rotate(180deg)' }} />
                          </IconButton>
                          <Button variant="contained" onClick={handleClose} sx={{ mt: 1 }}>
                            Close
                          </Button>
                        </div>
                      ),
                    ]}
                    showJumpControls={false}
                    showSkipControls={false}
                    style={{ width: '100%' }}
                  />
                  <Box sx={{ p: 2, textAlign: 'center' }}>
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
                        disabled={modules.every((m) => m.isComplete)}
                        sx={{ mt: 2 }}
                      >
                        Next Module
                      </Button>
                    )}
                  </Box>
                </MainCard>
              )
            )}
          </>
        )}
      </Box>
    </MainCard>
  );
};

TrainingAudioCard.propTypes = {
  isLoading: PropTypes.bool,
};

export default TrainingAudioCard;
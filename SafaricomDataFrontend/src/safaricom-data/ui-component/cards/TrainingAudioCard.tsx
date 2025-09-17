import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Button, Grid, Typography, CircularProgress, IconButton } from '@mui/material';
import { FaPause, FaPlay, FaUndo, FaArrowRight } from 'react-icons/fa';
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
  const theme = useTheme();
  const jwtContext = React.useContext(JWTContext);
  const agentId = jwtContext && 'user' in jwtContext ? (jwtContext as any).user?.agentId : undefined;
  const token = localStorage.getItem('serviceToken');
  const navigate = useNavigate();
  const location = useLocation();
  const { moduleId } = useParams<{ moduleId?: string }>();
  const match = useMatch('/training/:moduleId');
  const [isLoading, setIsLoading] = useState(propLoading);
  const [modules, setModules] = useState<authApi.TrainingModule[]>([]);
  const [selectedModule, setSelectedModule] = useState<authApi.TrainingModule | null>(null);
  const [audioError, setAudioError] = useState<string | null>(null);
  const audioRef = useRef<ReactH5AudioPlayer | null>(null);
  // Persist audio progress in localStorage
  const [currentTime, setCurrentTime] = useState<number>(() => {
    if (moduleId) {
      const saved = localStorage.getItem(`audioProgress_${moduleId}`);
      return saved ? Number(saved) : 0;
    }
    return 0;
  });
  const [initialPlaybackTime, setInitialPlaybackTime] = useState<number>(0);
  const [audioDuration, setAudioDuration] = useState<number>(0);

  // Fetch all modules
  useEffect(() => {
    if (!jwtContext || !jwtContext.isInitialized || !jwtContext.user) return;
  const agentId = Number(jwtContext.user.agentId);
    const token = localStorage.getItem('serviceToken');
    if (!token) {
      setAudioError('No valid token found.');
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    authApi.getAllTrainingModules(token, agentId)
      .then((data: authApi.TrainingModule[]) => {
        const sortedModules = data.sort((a: authApi.TrainingModule, b: authApi.TrainingModule) => (a.sequence || a.moduleId) - (b.sequence || b.moduleId));
        setModules(sortedModules);
      })
      .catch((error: any) => {
        setAudioError(`Failed to load modules. Please try again later.`);
      })
      .finally(() => setIsLoading(false));
  }, [jwtContext]);

  // Fetch selected module details when moduleId changes
  useEffect(() => {
    console.log('useEffect triggered for moduleId:', moduleId, 'token:', token);
    const id = moduleId ? parseInt(moduleId, 10) : null;
    if (id && !isNaN(id) && token && match) {
      setIsLoading(true);
      console.log('Fetching module details for moduleId:', id);
      authApi.getTrainingById(token, id)
        .then((module: authApi.TrainingModule) => {
          console.log('Module details fetched:', module);
          setSelectedModule(module);
          // Restore progress from localStorage if available
          const savedProgress = localStorage.getItem(`audioProgress_${id}`);
          setCurrentTime(savedProgress ? Number(savedProgress) : (module.watchTime || 0));
          setInitialPlaybackTime(0);
          setAudioDuration(0);
          setAudioError(null);
        })
        .catch((error: any) => {
          console.error('Error fetching module details:', error);
          setAudioError(`Failed to load module ${id}. Please try again later.`);
        })
        .finally(() => setIsLoading(false));
    } else {
      setSelectedModule(null);
      setCurrentTime(0);
      setInitialPlaybackTime(0);
      setAudioDuration(0);
      setAudioError(null);
    }
  }, [moduleId, token, match]);

  // Save audio progress to localStorage whenever currentTime changes
  useEffect(() => {
    if (moduleId) {
      localStorage.setItem(`audioProgress_${moduleId}`, String(currentTime));
    }
  }, [currentTime, moduleId]);



  // Save module progress
  const updateProgress = async (moduleId: number, watchedSeconds: number) => {
    if (token && selectedModule) {
      try {
        const validWatchedSeconds = Math.max(
          0,
          Number.isFinite(watchedSeconds) ? watchedSeconds : 0
        );
        const sessionTime = Math.max(0, validWatchedSeconds - initialPlaybackTime);

        //  Cap watch time at duration (already in seconds)
        let newWatchTime = (selectedModule.watchTime) + sessionTime;
        newWatchTime = Math.min(newWatchTime, selectedModule.duration);

        console.log(
          "Updating progress - moduleId:",
          moduleId,
          "sessionTime:",
          sessionTime,
          "newWatchTime:",
          newWatchTime
        );

        const response = await authApi.updateTrainingProgress(
          token,
          moduleId,
          newWatchTime
        );
        console.log("Progress update response:", response);

        if (moduleId) {
          setIsLoading(true);
          const updatedModule = await authApi.getTrainingById(token, moduleId);
          setSelectedModule(updatedModule);
          const updatedModules = await authApi.getAllTrainingModules(token, agentId);
          setModules(
            updatedModules.sort(
              (a, b) => (a.sequence || a.moduleId) - (b.sequence || b.moduleId)
            )
          );
          setIsLoading(false);
        }
      } catch (error: any) {
        console.error("Progress update failed:", error);
        setAudioError(
          "Failed to save your progress. Please try closing the module again or contact support if the issue persists."
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
    } else {
      // Fallback to currentTime if audioRef is not ready
      if (selectedModule) {
        updateProgress(selectedModule.moduleId, currentTime);
      }
    }
    // Clear error and navigate back to the modules list page
    setAudioError(null);
    navigate('/training');
    setSelectedModule(null);
  };

  const handleTryAgain = () => {
    // Mimic handleClose behavior: update progress (if possible) and navigate back
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
      const currentIndex = modules.findIndex(m => m.moduleId === selectedModule.moduleId);
      const nextIndex = modules.findIndex(m => m.moduleId > selectedModule.moduleId && !m.isComplete);
      if (nextIndex !== -1) {
        navigate(`/training/${modules[nextIndex].moduleId}`);
      } else {
        console.log('No next incomplete module available');
      }
    }
  };

  if (isLoading) return <SkeletonTotalOrderCard />;

  console.log('Rendering - location:', location.pathname, 'modules:', modules, 'moduleId:', moduleId, 'selectedModule:', selectedModule, 'audioError:', audioError);

  // Convert seconds to decimal minutes (rounded to 2 decimal places)

  // Force watch time to look like Duration
  const formatTime = (seconds: number): string => {
    if (!seconds || isNaN(seconds)) return "0:00";

    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    // Only show hours if total time is >= 1 hour
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }

    //  Otherwise just MM:SS like your Duration field
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };


  return (
    <MainCard
      border={false}
      content={false}
      sx={{
        minHeight: '300px', // Minimum height for better visibility
        height: 'auto', // Allow dynamic height based on content
        maxWidth: '100%', // Ensure it doesn't exceed parent width
        overflow: 'visible', // Allow content to expand
        [theme.breakpoints.down('sm')]: { // Mobile adjustments
          minHeight: '200px', // Smaller minimum height for mobile
          padding: 1, // Reduce padding on mobile
        },
      }}
    >
      <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: theme.palette.grey[100] }}>
        {audioError ? (
          <Box sx={{ textAlign: 'center' }}>
            <Typography color="error" align="center">{audioError}</Typography>
            <Button variant="contained" onClick={handleTryAgain} sx={{ mt: 2 }}>
              Get back to Course Outline
            </Button>
          </Box>
        ) : (
          <>
            {!match ? (
              <Grid container spacing={2}>
                {modules.length > 0 ? (
                  modules.map((module) => (
                    <Grid item xs={12} sm={6} md={3} key={`module-${module.moduleId || module.title}`}>
                      {module.moduleId ? (
                        <MainCard
                          title={`Lesson ${module.moduleId} - ${module.title || 'Untitled'}`} // Guard against undefined moduleId
                          sx={{
                            cursor: 'pointer',
                            border: '1px solid',
                            borderColor: theme.palette.divider,
                            backgroundColor: '#fff',
                            transition: 'background 0.2s',
                            '&:hover': { backgroundColor: theme.palette.action.hover }
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
                  <Typography align="center">No modules available</Typography>
                )}
              </Grid>
            ) : (
              selectedModule && (
                <MainCard
                  title={`Lesson ${selectedModule.moduleId} - ${selectedModule.title}`}
                  sx={{
                    width: '100%', // Full width for better mobile compatibility
                    maxWidth: '600px', // Cap width on larger screens
                    [theme.breakpoints.down('sm')]: {
                      maxWidth: '100%', // Full width on mobile
                      padding: 1, // Reduce padding on mobile
                    },
                  }}
                >
                  <ReactH5AudioPlayer
                    ref={audioRef}
                    src={`https://brm-partners.britam.com${selectedModule.filePath}`} // Ensure this URL is correct
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
                        // No multiply by 60 – duration is already in seconds
                        const fullDuration = selectedModule.duration;
                        updateProgress(selectedModule.moduleId, fullDuration);
                      }
                    }}

                    onListen={(e) => {
                      console.log("onListen event:", e);
                      if (e.target) {
                        let time = e.target.currentTime || 0;

                        //  Keep within audio duration or backend duration
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
                    customControlsSection={['MAIN_CONTROLS', (
                      <div style={{ display: 'flex', gap: '10px', padding: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {/* <IconButton onClick={() => audioRef.current?.audio?.play()} color="primary"><FaPlay /></IconButton>
                        <IconButton onClick={() => audioRef.current?.audio?.pause()} color="primary"><FaPause /></IconButton> */}
                        <IconButton onClick={handleRewind} color="primary"><FaUndo /></IconButton>
                        <IconButton onClick={handleRestart} color="primary"><FaUndo style={{ transform: 'rotate(180deg)' }} /></IconButton>
                        <Button variant="contained" onClick={handleClose} sx={{ mt: 1 }}>Close</Button>
                      </div>
                    )]}
                    showJumpControls={false}
                    showSkipControls={false}
                    style={{ width: '100%' }} // Ensure player takes full width
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
                        disabled={modules.every(m => m.isComplete)}
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
  isLoading: PropTypes.bool
};

export default TrainingAudioCard;
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
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [initialPlaybackTime, setInitialPlaybackTime] = useState<number>(0);
  const [audioDuration, setAudioDuration] = useState<number>(0);

  // Fetch all modules
  useEffect(() => {
    console.log('useEffect triggered for modules - agentId:', agentId, 'token:', token);
    if (agentId && token) {
      setIsLoading(true);
      console.log('Fetching all modules...');
      authApi.getAllTrainingModules(token)
        .then((data: authApi.TrainingModule[]) => {
          console.log('Modules data received:', data);
          const sortedModules = data.sort((a: authApi.TrainingModule, b: authApi.TrainingModule) => (a.sequence || a.moduleId) - (b.sequence || b.moduleId));
          console.log('Sorted modules:', sortedModules);
          setModules(sortedModules);
        })
        .catch((error: any) => {
          console.error('Error fetching modules:', error);
          setAudioError(`Failed to load modules: ${error.message}`);
        })
        .finally(() => setIsLoading(false));
    } else {
      console.log('No valid agentId or token');
      setAudioError('No valid user or token found.');
      setIsLoading(false);
    }
  }, [agentId, token]);

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
          setCurrentTime(module.watchTime || 0);
          setInitialPlaybackTime(0);
          setAudioDuration(0);
          setAudioError(null);
        })
        .catch((error: any) => {
          console.error('Error fetching module details:', error);
          setAudioError(`Failed to load module ${id}: ${error.message}`);
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

  const updateProgress = async (moduleId: number, watchedSeconds: number) => {
    if (token && selectedModule) {
      try {
        const sessionTime = Math.max(0, watchedSeconds - initialPlaybackTime);
        let newWatchTime = (selectedModule.watchTime || 0) + sessionTime;
        newWatchTime = Math.min(newWatchTime, selectedModule.duration * 60);
        console.log('Updating progress - moduleId:', moduleId, 'sessionTime:', sessionTime, 'newWatchTime:', newWatchTime);
        const response = await authApi.updateTrainingProgress(token, moduleId, newWatchTime);
        console.log('Progress update response:', response);
        if (moduleId) {
          setIsLoading(true);
          const updatedModule = await authApi.getTrainingById(token, moduleId);
          setSelectedModule(updatedModule);
          const updatedModules = await authApi.getAllTrainingModules(token);
          setModules(updatedModules.sort((a, b) => (a.sequence || a.moduleId) - (b.sequence || b.moduleId)));
          setIsLoading(false);
        }
      } catch (error: any) {
        console.error('Progress update failed:', error);
        setAudioError(`Failed to update progress: ${error.message}`);
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
    }
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

  return (
    <MainCard
      border={false}
      content={false}
      sx={{
        height: '100%',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: theme.palette.grey[100] }}>
        {audioError ? (
          <Typography color="error" align="center">{audioError}</Typography>
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
                          <Typography>Duration: {module.duration || 0} min</Typography>
                          <Typography>Watch Time: {module.watchTime || 0} sec</Typography>
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
                <MainCard title={`Lesson ${selectedModule.moduleId} - ${selectedModule.title}`} sx={{ mb: 2 }}>
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
                        const fullDuration = selectedModule.duration * 60;
                        updateProgress(selectedModule.moduleId, fullDuration);
                      }
                    }}
                    onLoadedMetadata={(e) => setAudioDuration(e.target.duration)}
                    onListen={(e) => {
                      console.log('onListen event:', e);
                      if (e.target) {
                        let time = e.target.currentTime || 0;
                        time = Math.min(time, audioDuration || selectedModule.duration * 60);
                        setCurrentTime(Math.floor(isNaN(time) ? 0 : time));
                      }
                    }}
                    customAdditionalControls={[]}
                    customVolumeControls={[]}
                    customControlsSection={['MAIN_CONTROLS', (
                      <div style={{ display: 'flex', gap: '10px', padding: '10px' }}>
                        <IconButton onClick={() => audioRef.current?.audio?.play()} color="primary"><FaPlay /></IconButton>
                        <IconButton onClick={() => audioRef.current?.audio?.pause()} color="primary"><FaPause /></IconButton>
                        <IconButton onClick={handleRewind} color="primary"><FaUndo /></IconButton>
                        <IconButton onClick={handleRestart} color="primary"><FaUndo style={{ transform: 'rotate(180deg)' }} /></IconButton>
                        <Button variant="contained" onClick={handleClose} sx={{ mt: 1 }}>Close</Button>
                      </div>
                    )]}
                    showJumpControls={false}
                    showSkipControls={false}
                  />
                  <Typography>Duration: {selectedModule.duration} min</Typography>
                  <Typography>Progress: {Math.floor(currentTime / 60)}:{(currentTime % 60).toString().padStart(2, '0')} / {selectedModule.duration}:00</Typography>
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
import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Button, Grid, Typography, CircularProgress, IconButton } from '@mui/material';
import Collapse from '@mui/material/Collapse';
import { FaPause, FaPlay, FaUndo } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import MainCard from 'ui-component/cards/MainCard';
import SkeletonTotalOrderCard from 'ui-component/cards/Skeleton/EarningCard';
import ReactH5AudioPlayer from 'react-h5-audio-player';
import type { H5AudioPlayer } from 'react-h5-audio-player';
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
  const [isLoading, setIsLoading] = useState(propLoading);
  const [modules, setModules] = useState<authApi.TrainingModule[]>([]);
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
  const [selectedModule, setSelectedModule] = useState<authApi.TrainingModule | null>(null);
  const [audioError, setAudioError] = useState<string | null>(null);
  const audioRef = useRef<H5AudioPlayer | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);

  // Fetch all modules
  useEffect(() => {
    console.log('useEffect triggered for modules - agentId:', agentId, 'token:', token);
    if (agentId && token) {
      setIsLoading(true);
      console.log('Fetching all modules...');
      authApi.getAllTrainingModules(token)
        .then((data: authApi.TrainingModule[]) => {
          console.log('Modules data received:', data);
          const sortedModules = data.sort((a: authApi.TrainingModule, b: authApi.TrainingModule) => (a.sequence || 0) - (b.sequence || 0));
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

  // Fetch selected module details when selectedModuleId changes
  useEffect(() => {
    console.log('useEffect triggered for selectedModuleId:', selectedModuleId, 'token:', token);
    if (selectedModuleId && token) {
      setIsLoading(true);
      console.log('Fetching module details for moduleId:', selectedModuleId);
      authApi.getTrainingById(token, selectedModuleId)
        .then((module: authApi.TrainingModule) => {
          console.log('Module details fetched:', module);
          setSelectedModule(module);
          setCurrentTime(module.watchTime || 0); // Sync currentTime with fetched watchTime
        })
        .catch((error: any) => {
          console.error('Error fetching module details:', error);
          setAudioError(`Failed to load module ${selectedModuleId}: ${error.message}`);
        })
        .finally(() => setIsLoading(false));
    } else {
      setSelectedModule(null);
      setCurrentTime(0);
    }
  }, [selectedModuleId, token]);

  const updateProgress = async (moduleId: number, watchedSeconds: number) => {
    if (token) {
      try {
        console.log('Updating progress - moduleId:', moduleId, 'watchedSeconds:', watchedSeconds);
        const response = await authApi.updateTrainingProgress(token, moduleId, watchedSeconds);
        console.log('Progress update response:', response);
        // Refetch module details to update UI
        if (selectedModuleId) {
          setIsLoading(true);
          const updatedModule = await authApi.getTrainingById(token, selectedModuleId);
          setSelectedModule(updatedModule);
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
      if (currentIndex <= nextIncompleteIndex || nextIncompleteIndex === -1) {
        setSelectedModuleId(moduleId);
      } else {
        setAudioError('Please complete modules in sequence.');
      }
    } else {
      console.log('Module not found in modules list:', moduleId);
    }
  };

  const handleClose = () => {
    if (audioRef.current) {
      const watchedSeconds = Math.floor(audioRef.current?.audio.currentTime || 0);
      if (token && selectedModule) {
        updateProgress(selectedModule.moduleId, watchedSeconds);
      }
    }
    setSelectedModuleId(null);
    setSelectedModule(null);
    navigate('/training');
  };

  const handleRewind = () => {
    if (audioRef.current && audioRef.current.audio) {
      audioRef.current.audio.currentTime = Math.max(0, audioRef.current?.audio.currentTime - 10 || 0);
    }
  };

  const handleRestart = () => {
    if (audioRef.current && audioRef.current.audio) {
      audioRef.current.audio.currentTime = 0;
      audioRef.current.audio.play();
    }
  };

  if (isLoading) return <SkeletonTotalOrderCard />;

  console.log('Rendering - location:', location.pathname, 'modules:', modules, 'selectedModuleId:', selectedModuleId, 'selectedModule:', selectedModule, 'audioError:', audioError);

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
            {selectedModuleId === null ? (
              <Grid container spacing={2}>
                {modules.length > 0 ? (
                  modules.map((module) => (
                    <Grid item xs={12} sm={6} md={3} key={`module-${module.moduleId}`}>
                      <MainCard title={`Module ${module.moduleId}`}
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
                        <Typography variant="h6">{module.title}</Typography>
                        <Typography>Duration: {module.duration} min</Typography>
                        <Typography>Watch Time: {module.watchTime} sec</Typography>
                        <Typography>Status: {module.status}</Typography>
                        {module.isComplete && (
                          <Typography color="success.main">Completed!</Typography>
                        )}
                      </MainCard>
                    </Grid>
                  ))
                ) : (
                  <Typography align="center">No modules available</Typography>
                )}
              </Grid>
            ) : (
              selectedModule && (
                <Collapse in={true} timeout={500}>
                  <MainCard title={`Module ${selectedModule.moduleId} - ${selectedModule.title}`}
                    sx={{ mb: 2 }}
                  >
                    <ReactH5AudioPlayer
                      ref={audioRef}
                      src={`https://brm-partners.britam.com${selectedModule.filePath}`}
                      onPlay={() => console.log('Playing')}
                      onPause={() => {
                        if (audioRef.current && audioRef.current.audio) {
                          const watchedSeconds = Math.floor(audioRef.current.audio.currentTime);
                          if (token && selectedModule) {
                            updateProgress(selectedModule.moduleId, watchedSeconds);
                          }
                        }
                      }}
                      onEnded={() => {
                        if (token && selectedModule) {
                          const watchedSeconds = Math.floor(selectedModule.duration * 60);
                          updateProgress(selectedModule.moduleId, watchedSeconds);
                        }
                      }}
                      listenInterval={1000}
                      onListen={() => {
                        if (audioRef.current && audioRef.current.audio) {
                          setCurrentTime(audioRef.current.audio.currentTime);
                        }
                      }}
                      customAdditionalControls={[]}
                      customVolumeControls={[]}
                      showJumpControls={false}
                      showSkipControls={false}
                    />
                    <Typography>Duration: {selectedModule.duration} min</Typography>
                    <Typography>Progress: {Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60)} / {selectedModule.duration}:00</Typography>
                    <Typography>Status: {selectedModule.status}</Typography>
                    {selectedModule.isComplete ? (
                      <Typography sx={{ mt: 2 }} color="success.main">Completed!</Typography>
                    ) : null}
                    <Button
                      onClick={() => {
                        setSelectedModuleId(null);
                        setSelectedModule(null);
                      }}
                      variant="contained"
                      sx={{ mt: 2 }}
                    >
                      Close
                    </Button>
                  </MainCard>
                </Collapse>
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

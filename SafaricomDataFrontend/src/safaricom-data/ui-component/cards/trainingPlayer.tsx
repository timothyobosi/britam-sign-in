import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Button, Typography, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { FaArrowRight } from 'react-icons/fa';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import MainCard from 'ui-component/cards/MainCard';
import * as authApi from 'safaricom-data/api/index';
import JWTContext from 'contexts/JWTContext';
import { toast } from 'sonner';

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

const formatTime = (seconds: number): string => {
  if (!seconds || isNaN(seconds)) return '0:00';
  const totalSeconds = Math.floor(seconds);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const TrainingPlayer: React.FC = () => {
  const theme = useTheme();
  const jwtContext = React.useContext(JWTContext);
  const agentId = jwtContext?.user?.agentId;
  const token = localStorage.getItem('serviceToken');
  const navigate = useNavigate();
  const location = useLocation();
  const { moduleId } = useParams<{ moduleId: string }>();
  const id = parseInt(moduleId || '0', 10);
  const [isLoading, setIsLoading] = useState(true);
  const [modules, setModules] = useState<authApi.TrainingModule[]>(location.state?.modules || []);
  const [selectedModule, setSelectedModule] = useState<authApi.TrainingModule | null>(location.state?.selectedModule || null);
  const [audioError, setAudioError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [errorDialogMessage, setErrorDialogMessage] = useState<string | null>(null);
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch selected module if not provided in state
  useEffect(() => {
    if (!token || isNaN(id)) return;
    if (!selectedModule) {
      setIsLoading(true);
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
          console.log(`Fetched module ${id}, currentTime: ${formatTime(currentTime)}`);
        })
        .catch((error) => {
          console.error('Error fetching module details:', error);
          if (error?.response?.status === 401) {
            setErrorDialogMessage("Your session has expired. Please log in again.");
            setIsSessionExpired(true);
          } else {
            setAudioError(`Failed to load module ${id}: ${error.message}`);
          }
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [token, id, selectedModule]);

  // Fetch all modules if not provided in state (for next module logic)
  useEffect(() => {
    if (!token || modules.length > 0 || !jwtContext?.user) return;
    authApi.getAllTrainingModules(token, Number(agentId))
      .then((data) => {
        const normalized = data.map((m) => {
          const duration = normalizeToSeconds(m.duration);
          const apiWatchTime = normalizeToSeconds(m.watchTime);
          return {
            ...m,
            duration,
            watchTime: m.isComplete ? duration : Math.min(apiWatchTime, duration),
          };
        });
        setModules(normalized.sort((a, b) => (a.sequence || a.moduleId) - (b.sequence || b.moduleId)));
      })
      .catch((err) => {
        console.error('Failed to fetch modules for next logic:', err);
      });
  }, [token, modules.length, agentId, jwtContext]);

  // Save progress before unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (audioRef.current && selectedModule) {
        const time = Math.floor(audioRef.current.currentTime);
        if (navigator.onLine && token && !selectedModule.isComplete) {
          updateProgress(selectedModule.moduleId, time).catch((err) => console.error('Failed to save progress on unload:', err));
        }
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [selectedModule, token]);

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

        const updatedModule = {
          ...selectedModule,
          watchTime: newWatchTime,
          isComplete,
          status: isComplete ? "Completed" : "In Progress",
        };
        setSelectedModule(updatedModule);

        setModules((prev) =>
          prev.map((m) =>
            m.moduleId === moduleId ? updatedModule : m
          )
        );
      } catch (error: any) {
        console.error("Error saving progress:", error);
        if (error?.response?.status === 401) {
          setErrorDialogMessage("Your session has expired. Please log in again.");
          setIsSessionExpired(true);
        } else {
          setErrorDialogMessage("We couldn't save your progress right now. Please check your internet connection.");
        }
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleClose = async () => {
    if (selectedModule && audioRef.current) {
      // Stop the audio immediately
      audioRef.current.pause();
      const watchedSeconds = Math.floor(audioRef.current.currentTime);

      if (navigator.onLine && token && !selectedModule.isComplete) {
        setIsSaving(true);
        try {
          await updateProgress(selectedModule.moduleId, watchedSeconds);
          toast.success("Progress saved successfully!");
        } catch (error) {
          console.error("Failed to save progress on close:", error);
          toast.error("Failed to save progress. Please try again.");
        } finally {
          setIsSaving(false);
        }
      }
      // Navigate after saving (or if offline)
      navigate("/training");
    }
  };

  const handleNextModule = () => {
    if (selectedModule && modules.length > 0) {
      const currentIndex = modules.findIndex(m => m.moduleId === selectedModule.moduleId);
      const nextIndex = modules.findIndex((m, idx) => idx > currentIndex && !m.isComplete);
      if (nextIndex !== -1) {
        const nextModule = modules[nextIndex];
        navigate(`/training/${nextModule.moduleId}`, { state: { modules, selectedModule: nextModule } });
      }
    }
  };

  const handleRetryProgress = () => {
    if (selectedModule) {
      const watchedSeconds = audioRef.current ? Math.floor(audioRef.current.currentTime) : currentTime;
      updateProgress(selectedModule.moduleId, watchedSeconds);
      setErrorDialogMessage(null);
    }
  };

  const handleLoginRedirect = () => {
    localStorage.removeItem('serviceToken');
    navigate('/login');
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
            <Typography color="error" align="center" sx={{ mb: 2 }}>
              {audioError}
            </Typography>
            {audioError.includes("session expired") ? (
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/login')}
                sx={{ mt: 1 }}
              >
                Log in Again
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={() => { setAudioError(null); navigate('/training'); }}
                sx={{ mt: 1 }}
              >
                Get back to Training audio lessons
              </Button>
            )}
          </Box>
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
              src={`${import.meta.env.VITE_API_TARGET}${selectedModule.filePath}?v=${selectedModule.updateDate || Date.now()}`}
              onLoadedMetadata={(e) => {
                e.currentTarget.currentTime = selectedModule.watchTime || 0;
                setCurrentTime(selectedModule.watchTime || 0);
                console.log(`⏮️ Resumed from saved watchTime: ${formatTime(selectedModule.watchTime)}`);
              }}
              onTimeUpdate={(e) => {
                const time = Math.floor(e.currentTarget.currentTime);
                setCurrentTime(time);
                console.log(`Listening at ${formatTime(time)}`);
                console.log("🎯 Selected module:", selectedModule);
              }}
              onPlay={(e) => {
                const time = e.currentTarget.currentTime;
                console.log(`▶️ Playing at ${formatTime(time)}`);
                console.log("🎯 Selected module:", selectedModule);
              }}
              onPause={(e) => {
                const time = Math.floor(e.currentTarget.currentTime);
                if (selectedModule && !selectedModule.isComplete && !isUpdating) {
                  updateProgress(selectedModule.moduleId, time);
                  setCurrentTime(time);
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
                setErrorDialogMessage("Failed to load the audio file. Please check your connection and try again.");
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
                Progress: {formatTime(currentTime)} / {formatTime(selectedModule.duration)}
              </Typography>
              <Typography>Status: {selectedModule.status}</Typography>
              {isSaving && (
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CircularProgress size={24} sx={{ mr: 1 }} />
                  <Typography>Saving your progress...</Typography>
                </Box>
              )}
            </Box>
          </MainCard>
        )}
      </Box>
      <Dialog open={!!errorDialogMessage} onClose={() => setErrorDialogMessage(null)}>
        <DialogTitle>{isSessionExpired ? 'Session Expired' : 'Progress Save Issue'}</DialogTitle>
        <DialogContent>
          <Typography>{errorDialogMessage}</Typography>
        </DialogContent>
        <DialogActions>
          {isSessionExpired ? (
            <Button onClick={handleLoginRedirect} color="primary" variant="contained">
              Log In Again
            </Button>
          ) : (
            <>
              <Button onClick={handleRetryProgress} color="primary">
                Retry
              </Button>
              <Button onClick={() => setErrorDialogMessage(null)} color="secondary">
                Close
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </MainCard>
  );
};

export default TrainingPlayer;
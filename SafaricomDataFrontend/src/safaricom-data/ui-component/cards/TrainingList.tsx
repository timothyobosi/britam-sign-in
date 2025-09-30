import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Grid, Typography, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MainCard from 'ui-component/cards/MainCard';
import * as authApi from 'safaricom-data/api/index';
import JWTContext from 'contexts/JWTContext';

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

// Greeting helper function
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Good morning';
  if (hour >= 12 && hour < 17) return 'Good afternoon';
  return 'Good evening';
};

const TrainingList: React.FC = () => {
  const jwtContext = React.useContext(JWTContext);
  const agentId = jwtContext?.user?.agentId;
  const userName = jwtContext?.user?.name || 'User';
  const token = localStorage.getItem('serviceToken');
  const theme = useTheme();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [modules, setModules] = useState<authApi.TrainingModule[]>([]);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  useEffect(() => {
    if (!jwtContext?.isInitialized || !jwtContext.user || !token) return;
    setIsLoading(true);
    if (navigator.onLine) {
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
          setAudioError(null);
        })
        .catch((err) => {
          console.error('Failed to fetch modules:', err);
          setAudioError(`Failed to load modules: ${err.message}`);
        })
        .finally(() => setIsLoading(false));
    } else {
      setAudioError('No data available offline.');
      setIsLoading(false);
    }
  }, [jwtContext, token, agentId]);

  const handleModuleSelect = (module: authApi.TrainingModule) => {
    const previousIncomplete = modules.some(
      (m) => (m.sequence || m.moduleId) < (module.sequence || module.moduleId) && !m.isComplete
    );
    if (previousIncomplete) {
      setDialogMessage("Kindly complete listening to the previous audio lessons.");
      setOpenDialog(true);
      return;
    }
    navigate(`/training/${module.moduleId}`, { state: { modules, selectedModule: module } });
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
          Loading Audio Lessons...
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, color: theme.palette.text.secondary }}>
          Please wait while we prepare your training content.
        </Typography>
      </Box>
    );
  }

  return (
    <>
      {/* Greeting Card */}
      <MainCard
        border={false}
        sx={{
          mb: theme.spacing(1.4),
          px: theme.spacing(4), // Increased horizontal padding
          py: theme.spacing(2), // Added vertical padding
          mx: { xs: 2, sm: 3 }, // Responsive horizontal margin  //mx: { xs: 2, sm: 3 }
          backgroundColor: 'white',
          color: theme.palette.grey[700], // Adjusted for better contrast
          borderRadius: theme.shape.borderRadius
        }}
      >
        <Typography variant="h4" sx={{ mb: theme.spacing(1) }}>
          {getGreeting()}, {userName} 👋
        </Typography>
        <Typography variant="body1" sx={{ mt: theme.spacing(1) }}>
          Welcome back to your training dashboard. Continue where you left off below!
        </Typography>
      </MainCard>

      {/* Lessons */}
      <MainCard
        border={false}
        content={false}
        sx={{
          minHeight: '300px',
          height: 'auto',
          maxWidth: '100%',
          overflow: 'visible',
          [theme.breakpoints.down('sm')]: { minHeight: '200px', padding: theme.spacing(1) },
          mx: { xs: theme.spacing(2), sm: theme.spacing(3) }, // Matching greeting card margins
          borderRadius: theme.shape.borderRadius
        }}
      >
        <Box
          sx={{
            p: theme.spacing(3), // Consistent padding
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.palette.grey[100],
            borderRadius: theme.shape.borderRadius,
          }}
        >
          {audioError ? (
            <Box sx={{ textAlign: 'center', px: theme.spacing(2) }}>
              <Typography color="error" align="center" sx={{ mb: theme.spacing(2) }}>
                {audioError}
              </Typography>
              <Button
                variant="contained"
                onClick={() => { setAudioError(null); window.location.reload(); }}
                sx={{ mt: theme.spacing(1) }}
              >
                Retry
              </Button>
            </Box>
          ) : (
            <Grid container spacing={theme.spacing(2)}>
              {modules.length > 0 ? modules.map((module) => (
                <Grid item xs={12} sm={6} md={3} key={`module-${module.moduleId || module.title}`}>
                  {module.moduleId ? (
                    <MainCard
                      title={`Lesson ${module.moduleId} - ${module.title || 'Untitled'}`}
                      sx={{
                        cursor: 'pointer',
                        border: `1px solid ${theme.palette.divider}`,
                        backgroundColor: '#fff',
                        transition: 'background 0.2s',
                        '&:hover': { backgroundColor: theme.palette.action.hover },
                        p: theme.spacing(2), // Added padding inside module cards
                      }}
                      onClick={() => handleModuleSelect(module)}
                    >
                      <Typography variant="h6" sx={{ mb: theme.spacing(1) }}>{module.title || 'Untitled'}</Typography>
                      <Typography sx={{ mb: theme.spacing(0.5) }}>Duration: {formatTime(module.duration)}</Typography>
                      <Typography sx={{ mb: theme.spacing(0.5) }}>Watch Time: {formatTime(module.watchTime)}</Typography>
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
                    px: theme.spacing(2), // Added horizontal padding
                  }}
                >
                  <Typography variant="h5" sx={{ mt: theme.spacing(2), color: theme.palette.text.primary }}>
                    No Audio Lessons Available
                  </Typography>
                </Box>
              )}
            </Grid>
          )}
        </Box>
      </MainCard>

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
    </>
  );
};

export default TrainingList;
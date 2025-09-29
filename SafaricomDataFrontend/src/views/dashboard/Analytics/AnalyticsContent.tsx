import React from 'react';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import MainCard from 'ui-component/cards/MainCard';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Skeleton from '@mui/material/Skeleton';
import { useAnalyticsData } from './AnalyticsData';

const AnalyticsContent = () => {
  const theme = useTheme();
  const {
    scores,
    questions,
    selectedModule,
    selectedAnswers,
    isSubmitted,
    isLoading,
    error,
    trainingModules,
    openDialog,
    dialogMessage,
    redoModuleId,
    setSelectedModule,
    setQuestions,
    setSelectedAnswers,
    setError,
    setOpenDialog,
    setDialogMessage,
    setRedoModuleId,
    fetchQuestions,
    submitAll,
    redoModule,
  } = useAnalyticsData();

  if (error) return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography color="error">{error}</Typography>
      <Button variant="contained" onClick={() => setError(null)} sx={{ mt: 2 }}>
        Clear Error
      </Button>
    </Box>
  );
  if (isLoading) return (
    <Box sx={{ p: 3, textAlign: 'center', width: '100%' }}>
      <CircularProgress color="primary" size={60} />
      <Typography variant="h6" sx={{ mt: 2, color: theme.palette.text.secondary }}>
        Loading your Test
      </Typography>
      <Grid container spacing={3} sx={{ mt: 4 }}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Grid item xs={12} md={6} key={`skeleton-${index}`}>
            <Box
              sx={{
                p: 2,
                border: '1px solid',
                borderColor: theme.palette.divider,
                borderRadius: theme.shape.borderRadius,
                backgroundColor: theme.palette.background.paper,
                height: 200,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <Skeleton variant="text" sx={{ fontSize: '1.5rem' }} />
              <Skeleton variant="text" />
              <Skeleton variant="text" />
              <Skeleton variant="text" />
              <Skeleton variant="rectangular" width="30%" height={36} sx={{ mt: 1 }} />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const handleModuleClick = async (moduleId: number) => {
    if (selectedModule === moduleId) {
      setSelectedModule(null);
      setQuestions([]);
      setSelectedAnswers({});
      return;
    }

    const allCompleted = trainingModules.every((module) => module.isComplete);
    if (!allCompleted) {
      setError('Please complete all training modules before starting the test.');
      return;
    }

    setSelectedModule(moduleId);
    setQuestions([]);
    setSelectedAnswers((prev) => {
      const newAnswers = { ...prev };
      questions.forEach((q) => {
        if (newAnswers[q.questionid] && !isSubmitted[moduleId]) delete newAnswers[q.questionid];
      });
      return newAnswers;
    });
    await fetchQuestions(moduleId);
  };

  const handleAnswerChange = (questionId: number, optionId: number) => {
    if (isSubmitted[selectedModule!] || !selectedModule) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleClearSelection = (questionId: number) => {
    if (isSubmitted[selectedModule!] || !selectedModule) return;
    setSelectedAnswers((prev) => {
      const newAnswers = { ...prev };
      delete newAnswers[questionId];
      return newAnswers;
    });
  };

  const handleRedoModule = (moduleId: number) => {
    if (!isSubmitted[moduleId] || scores.find((s) => s.moduleId === moduleId)?.scorePercent >= 70) return;

    setRedoModuleId(moduleId);
    setDialogMessage(`Are you sure you want to retake Section ${moduleId}? Your previous answers will be cleared.`);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setDialogMessage('');
  };

  const confirmRedoModule = async () => {
    await redoModule();
    handleDialogClose();
  };

  const finalScore = scores.find((s) => s.moduleId === null) || {};
  const totalQuestions = finalScore.totalQuestions || 0;
  const correctAnswers = finalScore.correctAnswers || 0;
  const scorePercent = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <MainCard title="Test Results">
          <Typography variant="h6">Final Score: {scorePercent}%</Typography>
          <Typography>Total Questions: {totalQuestions}</Typography>
          <Typography>Correct Answers: {correctAnswers}</Typography>
          {!trainingModules.every((m) => m.isComplete) && (
            <Chip
              label="To do Begin the Test, Finish Listening to all the audio lessons"
              color="warning"
              sx={{ mt: 2 }}
            />
          )}
        </MainCard>
      </Grid>
      {selectedModule === null
        ? trainingModules
          .map((module) => {
            const moduleScore = scores.find((s) => s.moduleId === module.moduleId);
            if (!moduleScore || moduleScore.totalQuestions === 0) return null;
            return (
              <Grid item xs={12} md={6} key={module.moduleId}>
                <MainCard title={`Section ${module.moduleId}`}>
                  <Typography>Total Questions: {moduleScore?.totalQuestions || 0}</Typography>
                  <Typography>Answered: {moduleScore?.answered || 0}</Typography>
                  <Typography>Correct Answers: {moduleScore?.correctAnswers || 0}</Typography>
                  <Typography>Score Percent: {moduleScore?.scorePercent || 0}%</Typography>
                  <Button
                    onClick={() => handleModuleClick(module.moduleId)}
                    variant="contained"
                    sx={{ mt: 2 }}
                    disabled={!trainingModules.every((m) => m.isComplete)}
                  >
                    Open Questions
                  </Button>
                  {moduleScore && isSubmitted[module.moduleId] && moduleScore.scorePercent < 70 && moduleScore.answered > 0 && (
                    <Button
                      variant="contained"
                      color="error"
                      sx={{ mt: 2, ml: 2 }}
                      onClick={() => handleRedoModule(module.moduleId)}
                    >
                      Redo Section
                    </Button>
                  )}
                </MainCard>
              </Grid>
            );
          })
          .filter(Boolean)
        : questions.length > 0 && (
          <Grid item xs={12}>
            <Collapse in={true} timeout={500}>
              <MainCard title={`Section ${selectedModule}`}>
                <Typography>Total Questions: {scores.find((s) => s.moduleId === selectedModule)?.totalQuestions || 0}</Typography>
                <Typography>Answered: {scores.find((s) => s.moduleId === selectedModule)?.answered || 0}</Typography>
                <Typography>Correct Answers: {scores.find((s) => s.moduleId === selectedModule)?.correctAnswers || 0}</Typography>
                <Typography>Score Percent: {scores.find((s) => s.moduleId === selectedModule)?.scorePercent || 0}%</Typography>
                <Button onClick={() => handleModuleClick(selectedModule)} variant="contained" sx={{ mt: 2 }}>
                  Close
                </Button>
                <Box sx={{ mt: 2 }}>
                  <Grid container spacing={2}>
                    {questions.map((q) => (
                      <Grid item xs={12} key={q.questionid}>
                        <FormControl fullWidth sx={{ mb: 3 }}>
                          <FormLabel>{q.text}</FormLabel>
                          <RadioGroup
                            value={selectedAnswers[q.questionid] || ''}
                            onChange={(e) => handleAnswerChange(q.questionid, parseInt(e.target.value))}
                          >
                            {(q.options as Array<{ optionid: number; text: string }> || []).map((opt) => (
                              <FormControlLabel
                                key={opt.optionid}
                                value={opt.optionid}
                                control={<Radio />}
                                label={opt.text}
                                disabled={isSubmitted[selectedModule!]}
                              />
                            ))}
                          </RadioGroup>
                          {!isSubmitted[selectedModule] && (
                            <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 1 }}>
                              <Button onClick={() => handleClearSelection(q.questionid)} variant="text">
                                Clear Selection
                              </Button>
                            </Box>
                          )}
                        </FormControl>
                      </Grid>
                    ))}
                  </Grid>
                  {!isSubmitted[selectedModule] ? (
                    <Button
                      onClick={submitAll}
                      variant="contained"
                      sx={{ mt: 2 }}
                      disabled={questions.length !== Object.keys(selectedAnswers).length || questions.length === 0}
                    >
                      Submit All
                    </Button>
                  ) : (
                    <Typography sx={{ mt: 2 }} color="success.main">
                      Completed! Score: {scores.find((s) => s.moduleId === selectedModule)?.scorePercent || 0}%
                    </Typography>
                  )}
                </Box>
              </MainCard>
            </Collapse>
          </Grid>
        )}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Retake Section</DialogTitle>
        <DialogContent>
          <Typography>{dialogMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={confirmRedoModule} color="error" variant="contained">
            Retake
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default AnalyticsContent;
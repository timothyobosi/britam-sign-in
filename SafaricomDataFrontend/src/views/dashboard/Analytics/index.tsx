import React, { useState, useEffect } from 'react';
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
import JWTContext from 'contexts/JWTContext';
import * as authApi from 'safaricom-data/api/index';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Skeleton from '@mui/material/Skeleton';

const Analytics = () => {
    const theme = useTheme();
    const jwtContext = React.useContext(JWTContext);
    const user = jwtContext?.user || {};
    const agentId = user?.agentId;
    const token = localStorage.getItem('serviceToken');

    const [scores, setScores] = useState<any[]>(() => {
        try {
            const saved = localStorage.getItem('analytics_scores');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error('Failed to parse analytics_scores:', e);
            localStorage.removeItem('analytics_scores');
            return [];
        }
    });
    const [questions, setQuestions] = useState<any[]>([]);
    const [selectedModule, setSelectedModule] = useState<number | null>(() => {
        const saved = localStorage.getItem('analytics_selectedModule');
        return saved ? Number(saved) : null;
    });
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>(() => {
        try {
            const saved = localStorage.getItem('analytics_selectedAnswers');
            return saved ? JSON.parse(saved) : {};
        } catch (e) {
            console.error('Failed to parse analytics_selectedAnswers:', e);
            localStorage.removeItem('analytics_selectedAnswers');
            return {};
        }
    });
    const [isSubmitted, setIsSubmitted] = useState<Record<number, boolean>>(() => {
        try {
            const saved = localStorage.getItem('analytics_isSubmitted');
            return saved ? JSON.parse(saved) : {};
        } catch (e) {
            console.error('Failed to parse analytics_isSubmitted:', e);
            localStorage.removeItem('analytics_isSubmitted');
            return {};
        }
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [trainingModules, setTrainingModules] = useState<any[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [redoModuleId, setRedoModuleId] = useState<number | null>(null);

    useEffect(() => {
        try {
            localStorage.setItem('analytics_scores', JSON.stringify(scores));
        } catch (e) {
            console.error('Failed to save analytics_scores:', e);
        }
    }, [scores]);

    useEffect(() => {
        try {
            if (selectedModule !== null) {
                localStorage.setItem('analytics_selectedModule', String(selectedModule));
            } else {
                localStorage.removeItem('analytics_selectedModule');
            }
        } catch (e) {
            console.error('Failed to save analytics_selectedModule:', e);
        }
    }, [selectedModule]);

    useEffect(() => {
        try {
            localStorage.setItem('analytics_selectedAnswers', JSON.stringify(selectedAnswers));
        } catch (e) {
            console.error('Failed to save analytics_selectedAnswers:', e);
        }
    }, [selectedAnswers]);

    useEffect(() => {
        try {
            localStorage.setItem('analytics_isSubmitted', JSON.stringify(isSubmitted));
        } catch (e) {
            console.error('Failed to save analytics_isSubmitted:', e);
        }
    }, [isSubmitted]);

    useEffect(() => {
        if (agentId && token) {
            setIsLoading(true);
            const fetchData = async () => {
                try {
                    const modulesData = await authApi.getAllTrainingModules(token, Number(agentId));
                    setTrainingModules(modulesData);

                    // Fetch each module score and tag with moduleId
                    const scorePromises = modulesData.map(async (module) => {
                        const rawScore = await authApi.getQuizScore(token, Number(agentId), module.moduleId);
                        return { moduleId: module.moduleId, ...rawScore };
                    });

                    const scoreData = await Promise.all(scorePromises);
                    console.log('Fetched section scores:', scoreData);

                    setScores(scoreData); // now has moduleId attached

                    const submittedState = scoreData.reduce(
                        (acc, score) => ({
                            ...acc,
                            [score.moduleId]: score.answered === score.totalQuestions && score.answered > 0,
                        }),
                        {}
                    );
                    setIsSubmitted(submittedState);

                    // Store final score separately
                    const finalScoreResp = await authApi.getFinalScore(token);
                    setScores((prev) => [...prev, { moduleId: null, ...finalScoreResp }]);

                    // Reload questions if a section was open before refresh
                    if (selectedModule !== null) {
                        const data = await authApi.getQuizQuestions(token, selectedModule);
                        setQuestions(data);
                    }
                } catch (err: any) {
                    console.error('Failed to fetch data:', err);
                    setError('Failed to fetch data: ' + err.message);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchData();
        } else {
            setError('No valid user or token found.');
            setIsLoading(false);
        }
    }, [agentId, token]);

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
        setIsLoading(true);
        try {
            if (!token) throw new Error('No valid token');
            const data = await authApi.getQuizQuestions(token, moduleId);
            setQuestions(data);
        } catch (err: any) {
            console.error(`Failed to fetch questions for module ${moduleId}:`, err);
            setError('Failed to fetch questions: ' + err.message);
        } finally {
            setIsLoading(false);
        }
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

    const handleSubmitAll = async () => {
        if (!selectedModule || isSubmitted[selectedModule]) return;
        const totalQuestions = questions.length;
        const answeredCount = Object.keys(selectedAnswers).length;
        if (answeredCount !== totalQuestions) {
            setError('Please answer all questions before submitting.');
            return;
        }

        setIsLoading(true);
        try {
            const answers = questions.map((q) => ({
                questionId: q.questionid,
                selectedAnswer: selectedAnswers[q.questionid],
            }));
            if (!token) throw new Error('No valid token');
            await authApi.submitQuizAnswers(token, Number(agentId), selectedModule, answers);
            const updatedScore = await authApi.getQuizScore(token, Number(agentId), selectedModule);
            console.log(`Updated scores for module ${selectedModule}:`, updatedScore);
            const finalScore = await authApi.getFinalScore(token);

            setScores((prev) => {
                const otherModules = prev.filter(
                    (s) => s.moduleId !== selectedModule && s.moduleId !== null
                );

                return [
                    ...otherModules,
                    { moduleId: selectedModule, ...updatedScore },
                    { moduleId: null, ...finalScore }
                ];
            });

            setIsSubmitted((prev) => ({ ...prev, [selectedModule]: true }));
        } catch (err: any) {
            console.error('Failed to submit answers:', err);
            setError('Failed to submit answers: ' + err.message);
        } finally {
            setIsLoading(false);
        }
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
        if (redoModuleId === null) return;

        // Reset state
        setSelectedAnswers({});
        setIsSubmitted((prev) => ({ ...prev, [redoModuleId]: false }));

        // Reload fresh questions for that section
        try {
            if (!token) throw new Error('No valid token');
            const data = await authApi.getQuizQuestions(token, redoModuleId);
            setQuestions(data);
            setSelectedModule(redoModuleId); // Immediately open section
        } catch (err: any) {
            console.error(`Failed to reload questions for module ${redoModuleId}:`, err);
            setError('Failed to reload questions: ' + err.message);
        }

        // Close dialog
        setOpenDialog(false);
        setDialogMessage('');
        setRedoModuleId(null);
    };

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
                        // Only render sections with totalQuestions > 0
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
                    .filter(Boolean) // Remove null entries
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
                                            onClick={handleSubmitAll}
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

export default Analytics;
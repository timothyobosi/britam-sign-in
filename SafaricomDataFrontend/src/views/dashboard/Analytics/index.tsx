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
import MainCard from 'ui-component/cards/MainCard';
import JWTContext from 'contexts/JWTContext';
import * as authApi from 'safaricom-data/api/index';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';

const Analytics = () => {
    const theme = useTheme();
    const { user } = React.useContext(JWTContext);
    const agentId = user?.agentId;
    const token = localStorage.getItem('serviceToken');

    // State with persistence from localStorage
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

    // Persist state to localStorage whenever it changes
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

    // Fetch scores on mount or auth change
    useEffect(() => {
        if (agentId && token) {
            setIsLoading(true);
            const fetchScores = async () => {
                try {
                    const scorePromises = [1, 2, 3, 4].map((moduleId) => authApi.getQuizScore(token, agentId, moduleId));
                    const scoreData = await Promise.all(scorePromises);
                    console.log('Fetched scores:', scoreData);
                    setScores(scoreData);
                    try {
                        localStorage.setItem('analytics_scores', JSON.stringify(scoreData));
                    } catch (e) {
                        console.error('Failed to save analytics_scores:', e);
                    }
                    const submittedState = scoreData.reduce(
                        (acc, score, index) => ({
                            ...acc,
                            [index + 1]: score.answered === score.totalQuestions,
                        }),
                        {}
                    );
                    setIsSubmitted(submittedState);
                    try {
                        localStorage.setItem('analytics_isSubmitted', JSON.stringify(submittedState));
                    } catch (e) {
                        console.error('Failed to save analytics_isSubmitted:', e);
                    }
                } catch (err: any) {
                    console.error('Failed to fetch scores:', err);
                    setError('Failed to fetch scores: ' + err.message);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchScores();
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

        setSelectedModule(moduleId);
        setQuestions([]); // Reset questions to avoid stale data
        setSelectedAnswers({}); // Reset answers
        setIsLoading(true);
        try {
            if (!token) throw new Error('No valid token');
            console.log(`Fetching questions for module ${moduleId}`);
            const data = await authApi.getQuizQuestions(token, moduleId);
            console.log(`Fetched questions for module ${moduleId}:`, data);
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
                selectedAnswer: selectedAnswers[q.questionid]
            }));
            if (!token) throw new Error('No valid token');
            console.log(`Submitting answers for module ${selectedModule}:`, answers);
            await authApi.submitQuizAnswers(token, Number(agentId), selectedModule, answers);
            const updatedScores = await authApi.getQuizScore(token, Number(agentId), selectedModule);
            console.log(`Updated scores for module ${selectedModule}:`, updatedScores);
            setScores((prev) =>
                prev.map((score, index) => (index + 1 === selectedModule ? updatedScores : score))
            );
            try {
                localStorage.setItem('analytics_scores', JSON.stringify(scores));
            } catch (e) {
                console.error('Failed to save analytics_scores:', e);
            }
            setIsSubmitted((prev) => ({ ...prev, [selectedModule]: true }));
            try {
                localStorage.setItem('analytics_isSubmitted', JSON.stringify({ ...isSubmitted, [selectedModule]: true }));
            } catch (e) {
                console.error('Failed to save analytics_isSubmitted:', e);
            }
        } catch (err: any) {
            console.error('Failed to submit answers:', err);
            setError('Failed to submit answers: ' + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (error) return (
        <Box sx={{ textAlign: 'center' }}>
            <Typography color="error">{error}</Typography>
            <Button variant="contained" onClick={() => setError(null)} sx={{ mt: 2 }}>
                Clear Error
            </Button>
        </Box>
    );
    if (isLoading) return <CircularProgress />;

    return (
        <Grid container spacing={3}>
            {selectedModule === null
                ? // Show all modules
                [1, 2, 3, 4].map((moduleId) => (
                    <Grid item xs={12} md={6} key={moduleId}>
                        <MainCard title={`Module ${moduleId}`}>
                            <Typography>Total Questions: {scores[moduleId - 1]?.totalQuestions || 0}</Typography>
                            <Typography>Answered: {scores[moduleId - 1]?.answered || 0}</Typography>
                            <Typography>Correct Answers: {scores[moduleId - 1]?.correctAnswers || 0}</Typography>
                            <Typography>Score Percent: {scores[moduleId - 1]?.scorePercent || 0}%</Typography>
                            <Button
                                onClick={() => handleModuleClick(moduleId)}
                                variant="contained"
                                sx={{ mt: 2 }}
                            >
                                Open Questions
                            </Button>
                        </MainCard>
                    </Grid>
                ))
                : // Show only selected module expanded
                <Grid item xs={12}>
                    <Collapse in={true} timeout={500}>
                        <MainCard title={`Module ${selectedModule}`}>
                            <Typography>
                                Total Questions: {scores[selectedModule - 1]?.totalQuestions || 0}
                            </Typography>
                            <Typography>Answered: {scores[selectedModule - 1]?.answered || 0}</Typography>
                            <Typography>
                                Correct Answers: {scores[selectedModule - 1]?.correctAnswers || 0}
                            </Typography>
                            <Typography>
                                Score Percent: {scores[selectedModule - 1]?.scorePercent || 0}%
                            </Typography>
                            <Button
                                onClick={() => handleModuleClick(selectedModule)}
                                variant="contained"
                                sx={{ mt: 2 }}
                            >
                                Close
                            </Button>

                            <Box sx={{ mt: 2 }}>
                                <Grid container spacing={2}>
                                    {questions.length > 0 ? (
                                        questions.map((q) => (
                                            <Grid item xs={12} key={q.questionid}>
                                                <FormControl fullWidth sx={{ mb: 3 }}>
                                                    <FormLabel>{q.text}</FormLabel>
                                                    <RadioGroup
                                                        value={selectedAnswers[q.questionid] || ''}
                                                        onChange={(e) =>
                                                            handleAnswerChange(q.questionid, parseInt(e.target.value))
                                                        }
                                                    >
                                                        {(q.options as Array<{ optionid: number; text: string }> || []).map((opt) => (
                                                            <FormControlLabel
                                                                key={opt.optionid}
                                                                value={opt.optionid}
                                                                control={<Radio />}
                                                                label={opt.text}
                                                                disabled={isSubmitted[selectedModule]}
                                                            />
                                                        ))}
                                                    </RadioGroup>
                                                    {!isSubmitted[selectedModule] && (
                                                        <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 1 }}>
                                                            <Button
                                                                onClick={() => handleClearSelection(q.questionid)}
                                                                variant="text"
                                                            >
                                                                Clear Selection
                                                            </Button>
                                                        </Box>
                                                    )}
                                                </FormControl>
                                            </Grid>
                                        ))
                                    ) : (
                                        <Typography>No questions available for this module.</Typography>
                                    )}
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
                                        Completed! Score: {scores[selectedModule - 1]?.scorePercent}%
                                    </Typography>
                                )}
                            </Box>
                        </MainCard>
                    </Collapse>
                </Grid>}
        </Grid>
    );
};

export default Analytics;
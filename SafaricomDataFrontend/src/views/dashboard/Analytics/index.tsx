
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
    const [scores, setScores] = useState<any[]>([]);
    const [questions, setQuestions] = useState<any[]>([]);
    const [selectedModule, setSelectedModule] = useState<number | null>(null);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
    const [isSubmitted, setIsSubmitted] = useState<Record<number, boolean>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (agentId && token) {
            setIsLoading(true);
            const fetchScores = async () => {
                try {
                    const scorePromises = [1, 2, 3, 4].map((moduleId) => authApi.getQuizScore(token, agentId, moduleId));
                    const scoreData = await Promise.all(scorePromises);
                    setScores(scoreData);
                    const submittedState = scoreData.reduce(
                        (acc, score, index) => ({
                            ...acc,
                            [index + 1]: score.answered === score.totalQuestions,
                        }),
                        {}
                    );
                    setIsSubmitted(submittedState);
                } catch (err: any) {
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
        setIsLoading(true);
        try {
            const data = await authApi.getQuizQuestions(token, moduleId);
            setQuestions(data);
        } catch (err: any) {
            setError('Failed to fetch questions: ' + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAnswerChange = (questionId: number, optionId: number) => {
        if (isSubmitted[selectedModule!]) return;
        setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    };

    const handleClearSelection = (questionId: number) => {
        if (isSubmitted[selectedModule!]) return;
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
            // Submit all answers for the selected module
            const answers = questions.map((q) => ({
                questionId: q.questionid,
                selectedAnswer: selectedAnswers[q.questionid]
            }));
            await authApi.submitQuizAnswers(token, agentId, selectedModule, answers);
            const updatedScores = await authApi.getQuizScore(token, agentId, selectedModule);
            setScores((prev) =>
                prev.map((score, index) => (index + 1 === selectedModule ? updatedScores : score))
            );
            setIsSubmitted((prev) => ({ ...prev, [selectedModule]: true }));
        } catch (err: any) {
            setError('Failed to submit answers: ' + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (error) return <Typography color="error">{error}</Typography>;
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
                                    {questions.map((q) => (
                                        <Grid item xs={12} key={q.questionid}>
                                            <FormControl fullWidth sx={{ mb: 3 }}>
                                                <FormLabel>{q.text}</FormLabel>
                                                <RadioGroup
                                                    value={selectedAnswers[q.questionid] || ''}
                                                    onChange={(e) =>
                                                        handleAnswerChange(q.questionid, parseInt(e.target.value))
                                                    }
                                                    disabled={isSubmitted[selectedModule]}
                                                >
                                                    {q.options.map((opt) => (
                                                        <FormControlLabel
                                                            key={opt.optionid}
                                                            value={opt.optionid}
                                                            control={<Radio />}
                                                            label={opt.text}
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
                                    ))}
                                </Grid>

                                {!isSubmitted[selectedModule] ? (
                                    <Button
                                        onClick={handleSubmitAll}
                                        variant="contained"
                                        sx={{ mt: 2 }}
                                        disabled={questions.length !== Object.keys(selectedAnswers).length}
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

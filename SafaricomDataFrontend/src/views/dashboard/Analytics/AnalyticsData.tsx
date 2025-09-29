import React, { createContext, useState, useEffect, ReactNode } from 'react';
import * as authApi from 'safaricom-data/api/index';
import JWTContext from 'contexts/JWTContext';

interface AnalyticsDataContextType {
  scores: any[];
  setScores: React.Dispatch<React.SetStateAction<any[]>>;
  questions: any[];
  setQuestions: React.Dispatch<React.SetStateAction<any[]>>;
  selectedModule: number | null;
  setSelectedModule: React.Dispatch<React.SetStateAction<number | null>>;
  selectedAnswers: Record<number, number>;
  setSelectedAnswers: React.Dispatch<React.SetStateAction<Record<number, number>>>;
  isSubmitted: Record<number, boolean>;
  setIsSubmitted: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  trainingModules: any[];
  setTrainingModules: React.Dispatch<React.SetStateAction<any[]>>;
  openDialog: boolean;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  dialogMessage: string;
  setDialogMessage: React.Dispatch<React.SetStateAction<string>>;
  redoModuleId: number | null;
  setRedoModuleId: React.Dispatch<React.SetStateAction<number | null>>;
  fetchData: () => Promise<void>;
  fetchQuestions: (moduleId: number) => Promise<void>;
  submitAll: () => Promise<void>;
  redoModule: () => Promise<void>;
}

export const AnalyticsDataContext = createContext<AnalyticsDataContextType | undefined>(undefined);

interface AnalyticsDataProviderProps {
  children: ReactNode;
}

export const AnalyticsDataProvider: React.FC<AnalyticsDataProviderProps> = ({ children }) => {
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

  const fetchData = async () => {
    if (agentId && token) {
      setIsLoading(true);
      try {
        const modulesData = await authApi.getAllTrainingModules(token, Number(agentId));
        setTrainingModules(modulesData);

        const scorePromises = modulesData.map(async (module) => {
          const rawScore = await authApi.getQuizScore(token, Number(agentId), module.moduleId);
          return { moduleId: module.moduleId, ...rawScore };
        });

        const scoreData = await Promise.all(scorePromises);
        console.log('Fetched section scores:', scoreData);

        setScores(scoreData);

        const submittedState = scoreData.reduce(
          (acc, score) => ({
            ...acc,
            [score.moduleId]: score.answered === score.totalQuestions && score.answered > 0,
          }),
          {}
        );
        setIsSubmitted(submittedState);

        const finalScoreResp = await authApi.getFinalScore(token);
        setScores((prev) => [...prev, { moduleId: null, ...finalScoreResp }]);

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
    } else {
      setError('No valid user or token found.');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [agentId, token, selectedModule]);

  const fetchQuestions = async (moduleId: number) => {
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

  const submitAll = async () => {
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

  const redoModule = async () => {
    if (redoModuleId === null) return;

    setSelectedAnswers({});
    setIsSubmitted((prev) => ({ ...prev, [redoModuleId]: false }));

    try {
      if (!token) throw new Error('No valid token');
      const data = await authApi.getQuizQuestions(token, redoModuleId);
      setQuestions(data);
      setSelectedModule(redoModuleId);
    } catch (err: any) {
      console.error(`Failed to reload questions for module ${redoModuleId}:`, err);
      setError('Failed to reload questions: ' + err.message);
    }

    setOpenDialog(false);
    setDialogMessage('');
    setRedoModuleId(null);
  };

  const value = {
    scores,
    setScores,
    questions,
    setQuestions,
    selectedModule,
    setSelectedModule,
    selectedAnswers,
    setSelectedAnswers,
    isSubmitted,
    setIsSubmitted,
    isLoading,
    setIsLoading,
    error,
    setError,
    trainingModules,
    setTrainingModules,
    openDialog,
    setOpenDialog,
    dialogMessage,
    setDialogMessage,
    redoModuleId,
    setRedoModuleId,
    fetchData,
    fetchQuestions,
    submitAll,
    redoModule,
  };

  return <AnalyticsDataContext.Provider value={value}>{children}</AnalyticsDataContext.Provider>;
};

export const useAnalyticsData = () => {
  const context = React.useContext(AnalyticsDataContext);
  if (context === undefined) {
    throw new Error('useAnalyticsData must be used within an AnalyticsDataProvider');
  }
  return context;
};
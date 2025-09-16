// -------------------- QUIZ API FUNCTIONS --------------------
const QUIZ_BASE_URL = `${import.meta.env.VITE_API_TARGET}/api/Quiz`;

export async function getQuizQuestions(token: string, moduleId: number): Promise<QuizQuestion[]> {
  const res = await fetch(`${QUIZ_BASE_URL}/questions/${moduleId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Accept': '*/*',
    },
  });
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  const data = await res.json();
  return data;
}

export async function getQuizScore(token: string, agentId: number, moduleId: number): Promise<QuizScoreResponse> {
  const res = await fetch(`${QUIZ_BASE_URL}/score/${agentId}/${moduleId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Accept': '*/*',
    },
  });
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return res.json();
}

export interface SubmitQuizAnswer {
  questionId: number;
  selectedAnswer: number;
}

export async function submitQuizAnswers(
  token: string,
  agentId: number,
  moduleId: number,
  answers: SubmitQuizAnswer[]
): Promise<{ status: string }> {
  for (const { questionId, selectedAnswer } of answers) {
    const res = await fetch(`${QUIZ_BASE_URL}/submit-answer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        agentId,
        questionId,
        selectedOptionId: selectedAnswer,
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HTTP error! status: ${res.status} - ${text}`);
    }
  }
  return { status: 'Success' };
}
// TypeScript: declare ImportMeta.env for Vite
// Training API types and functions
export interface TrainingModule {
  moduleId: number;
  title: string;
  duration: number;
  filePath: string;
  watchTime: number;
  isComplete: boolean;
  status: string;
  sequence?: number;
  dateCreated?: string;
  updateDate?: string;
}


const BASE_URL = `${import.meta.env.VITE_API_TARGET}${import.meta.env.VITE_API_BASE_URL}`;
const TRAINING_BASEURL = `${import.meta.env.VITE_API_TARGET}${import.meta.env.VITE_TRAINING_BASE_URL}`;

export async function getAllTrainingModules(token: string, agentId?: number): Promise<TrainingModule[]> {
  const res = await fetch(`${TRAINING_BASEURL}/all-modules`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  const data = await res.json();
  console.log('Raw API data:', data); // Debug raw response
  return data.map((module: any) => {
    // Find the latest progress for the current agent (agentId) if provided
    const agentProgress = agentId ? module.trainingProgresses.find((progress: any) => progress.agentid === agentId) : module.trainingProgresses[0];
    const progress = agentProgress || {}; // Fallback to empty object if no progress
    return {
      moduleId: module.moduleid, // Match the lowercase 'moduleid' from API
      title: module.title,
      duration: module.duration,
      filePath: module.filepath, // Match the lowercase 'filepath' from API
      watchTime: progress.watchtime || 0,
      isComplete: !!progress.iscomplete, // Convert 1/0 to boolean
      status: progress.status || 'Not Started',
      sequence: module.sequence,
      dateCreated: module.datecreated,
      updateDate: module.updatedate
    };
  });
}

export async function getTrainingById(token: string, id: number): Promise<TrainingModule> {
  const res = await fetch(`${TRAINING_BASEURL}/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  const data = await res.json();
  return {
    moduleId: data.moduleId,
    title: data.title,
    duration: data.duration,
    filePath: data.filePath,
    watchTime: data.watchTime || 0,
    isComplete: data.isComplete || false,
    status: data.status || 'Not Started',
    sequence: data.sequence,
    dateCreated: data.dateCreated,
    updateDate: data.updateDate
  };
}

export async function updateTrainingProgress(token: string, moduleId: number, watchedSeconds: number) {
  const res = await fetch(`${TRAINING_BASEURL}/progress`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ moduleId, watchedSeconds }),
  });
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return res.json();
}

// const BASE_URL and TRAINING_BASEURL are already declared above. Remove duplicates.

// -------------------- AUTH TYPES --------------------
export interface LoginResponse {
  status: string;
  message: string;
  token: string | null;
  agentId: number;
  name: string | null;
  role?: string | null;
}

// -------------------- QUIZ TYPES --------------------
export interface QuizScoreResponse {
  totalQuestions: number;
  answered: number;
  correctAnswers: number;
  scorePercent: number;
}

export interface QuizQuestion {
  questionid: number;
  text: string;
  options: { optionid: number; text: string }[];
}

export interface QuizQuestionsResponse {
  [key: number]: QuizQuestion[];
}

export interface SubmitAnswerResponse {
  correct: boolean;
  attemptNumber: number;
  correctOptionId: number;
}

// -------------------- TRAINING TYPES --------------------
export interface TrainingModule {
  moduleId: number;
  title: string;
  duration: number;
  filePath: string;
  watchTime: number;
  isComplete: boolean;
  status: string;
  sequence?: number;
  dateCreated?: string;
  updateDate?: string;
}

export interface TrainingModulesResponse {
  [key: number]: TrainingModule[];
}

// -------------------- AUTH APIs --------------------
export async function login(email: string, password: string): Promise<LoginResponse> {
  try {
    const res = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      return {
        status: data.status || 'Failed',
        message: data.message || `Login failed: ${res.status}`,
        token: null,
        agentId: 0,
        name: null,
        role: null
      };
    }
    return {
      status: data.status || 'Success',
      message: data.message || 'Login successful',
      token: data.token,
      agentId: data.agentId,
      name: data.name,
      role: data.role || null
    };
  } catch (err) {
    return {
      status: 'Failed',
      message: (err as Error).message,
      token: null,
      agentId: 0,
      name: null,
      role: null
    };
  }
}

export async function resetPassword(email: string) {
  const res = await fetch(`${BASE_URL}/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  return res.json();
}

export async function completeResetPassword(token: string, password: string, email: string) {
  const res = await fetch(`${BASE_URL}/complete-reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, newPassword: password, email }),
  });
  return res.json();
}

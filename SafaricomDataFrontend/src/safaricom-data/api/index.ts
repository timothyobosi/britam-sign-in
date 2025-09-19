import { QuizQuestion, QuizScoreResponse, SubmitQuizAnswer, TrainingModule, LoginResponse } from './types';

export const QUIZ_BASE_URL = `${import.meta.env.VITE_API_TARGET}/api/Quiz`;

export async function getFinalScore(token: string): Promise<any> {
    const res = await fetch(`${QUIZ_BASE_URL}/final-score`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': '*/*',
            'Cache-Control': 'no-cache',
        },
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return res.json();
}

export async function getCertificate(token: string): Promise<Blob> {
    const res = await fetch(`${QUIZ_BASE_URL}/get-certificate`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': '*/*',
            'Cache-Control': 'no-cache',
        },
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return res.blob();
}

export async function getQuizQuestions(token: string, moduleId: number): Promise<QuizQuestion[]> {
    const res = await fetch(`${QUIZ_BASE_URL}/questions/${moduleId}?ts=${Date.now()}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Accept': '*/*',
            'Cache-Control': 'no-cache',
        },
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    return data;
}

export async function getQuizScore(token: string, agentId: number, moduleId: number): Promise<QuizScoreResponse> {
    const res = await fetch(`${QUIZ_BASE_URL}/score/${agentId}/${moduleId}?ts=${Date.now()}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Accept': '*/*',
            'Cache-Control': 'no-cache',
        },
    });
    if (!res.ok) {
        const errorText = await res.text();
        console.error(`Score fetch failed for module ${moduleId}: ${res.status} - ${errorText}`);
        throw new Error(`HTTP error! status: ${res.status} - ${errorText}`);
    }
    return res.json();
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

const BASE_URL = `${import.meta.env.VITE_API_TARGET}${import.meta.env.VITE_API_BASE_URL}`;
const TRAINING_BASEURL = `${import.meta.env.VITE_API_TARGET}${import.meta.env.VITE_TRAINING_BASE_URL}`;

export async function getAllTrainingModules(token: string, agentId?: number): Promise<TrainingModule[]> {
    const res = await fetch(`${TRAINING_BASEURL}/all-modules?ts=${Date.now()}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Cache-Control': 'no-cache',
        },
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    console.log('Raw API data:', data);
    return data.map((module: any) => {
        // Prioritize completed progress or highest watchtime
        const agentProgress = agentId
            ? module.trainingProgresses?.reduce((latest: any, progress: any) => {
                // Prefer completed progress; if tied, take highest watchtime
                if (!latest) return progress;
                if (progress.iscomplete && !latest.iscomplete) return progress;
                if (!progress.iscomplete && latest.iscomplete) return latest;
                return progress.watchtime > latest.watchtime ? progress : latest;
              }, null)
            : module.trainingProgresses[0];
        const progress = agentProgress || {};
        return {
            moduleId: module.moduleid,
            title: module.title,
            duration: module.duration,
            filePath: module.filepath,
            watchTime: progress.watchtime || 0,
            isComplete: !!progress.iscomplete,
            status: progress.status || 'Not Started',
            sequence: module.sequence,
            dateCreated: module.datecreated,
            updateDate: module.updatedate,
        };
    });
}

export async function getTrainingById(token: string, id: number): Promise<TrainingModule> {
    const res = await fetch(`${TRAINING_BASEURL}/${id}?ts=${Date.now()}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Cache-Control': 'no-cache',
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
        updateDate: data.updateDate,
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
    const res = await fetch(`${import.meta.env.VITE_API_TARGET}/api/Agents/complete-reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password, email }),
    });
    if (!res.ok) {
        const text = await res.text();
        console.error('API Error:', res.status, text);
        return { success: false, message: `HTTP error! status: ${res.status}`, agentId: null };
    }
    return res.json();
}
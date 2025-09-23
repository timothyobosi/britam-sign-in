import * as authApi from 'safaricom-data/api/index';


function normalizeModule(data: any) {
  const normalizeToSeconds = (value: any): number => {
    if (!value && value !== 0) return 0;
    if (typeof value === 'number' && !isNaN(value)) return Math.floor(value);
    if (typeof value === 'string') {
      const parts = value.split(':').map(Number).filter(n => !isNaN(n));
      if (parts.length === 2) {
        const [m, s] = parts;
        return m * 60 + s;
      }
    }
    return 0;
  };

  const duration = normalizeToSeconds(data.duration);
  const watchTime = normalizeToSeconds(data.watchtime ?? data.watchTime);

  return {
    moduleId: data.moduleid ?? data.moduleId,
    title: data.title,
    duration,
    filePath: data.filepath ?? data.filePath,
    watchTime: Math.min(watchTime, duration),
    isComplete: !!(data.iscomplete ?? data.isComplete),
    status: data.status || 'Not Started',
    sequence: data.sequence,
    dateCreated: data.datecreated ?? data.dateCreated,
    updateDate: data.updatedate ?? data.updateDate,
  };
}

// 🔹 Fetch all training modules
export async function fetchModules(token: string, agentId?: number) {
  const data = await authApi.getAllTrainingModules(token, agentId);
  return data.map(normalizeModule);
}

// 🔹 Fetch one module by ID
export async function fetchModuleById(token: string, moduleId: number) {
  const data = await authApi.getTrainingById(token, moduleId);
  console.log('Fetched module data:', data.moduleid, data.title);
  return normalizeModule(data);
}

// 🔹 Save progress
export async function saveProgress(token: string, moduleId: number, watchTime: number) {
  return await authApi.updateTrainingProgress(token, moduleId, watchTime);
}
import * as authApi from 'safaricom-data/api/index';





export async function fetchModules(token: string, agentId?: number) {
  return await authApi.getAllTrainingModules(token, agentId);
}

export async function fetchModuleById(token: string, moduleId: number) {
  return await authApi.getTrainingById(token, moduleId);
}

export async function saveProgress(token: string, moduleId: number, watchTime: number) {
  return await authApi.updateTrainingProgress(token, moduleId, watchTime);
}

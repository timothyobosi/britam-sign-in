import { saveProgress } from "safaricom-data/services/audioService";


export function queueProgressUpdate(moduleId: number, watchTime: number) {
  const pending = JSON.parse(localStorage.getItem("pendingProgress") || "[]");
  pending.push({ moduleId, watchTime, timestamp: Date.now() });
  localStorage.setItem("pendingProgress", JSON.stringify(pending));
}

export async function flushProgressQueue(token: string) {
  const pending = JSON.parse(localStorage.getItem("pendingProgress") || "[]");
  if (!pending.length) return;

  const successful: any[] = [];
  for (const item of pending) {
    try {
      await saveProgress(token, item.moduleId, item.watchTime);
      successful.push(item);
    } catch (e) {
      console.error("Retry failed:", e);
    }
  }
  localStorage.setItem(
    "pendingProgress",
    JSON.stringify(pending.filter((i: any) => !successful.includes(i)))
  );
}

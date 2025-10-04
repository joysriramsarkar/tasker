import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (num: number) => num.toString().padStart(2, '0');

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

export function parseDuration(durationStr: string): number {
  const parts = durationStr.split(':').map(Number);
  let seconds = 0;
  if (parts.length === 3) {
    seconds += parts[0] * 3600; // hours
    seconds += parts[1] * 60;   // minutes
    seconds += parts[2];        // seconds
  } else if (parts.length === 2) {
    seconds += parts[0] * 60;   // minutes
    seconds += parts[1];        // seconds
  } else if (parts.length === 1) {
    seconds += parts[0];        // seconds
  }
  return isNaN(seconds) ? 0 : seconds;
}

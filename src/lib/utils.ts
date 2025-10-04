import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDuration(totalSeconds: number): string {
  if (isNaN(totalSeconds) || totalSeconds < 0) {
    totalSeconds = 0;
  }
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  const pad = (num: number) => num.toString().padStart(2, '0');

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

const bengaliDigitsMap: { [key: string]: string } = {
  "0": "০", "1": "১", "2": "২", "3": "৩", "4": "৪", "5": "৫", "6": "৬", "7": "৭", "8": "৮", "9": "৯"
};
const englishDigitsMap: { [key: string]: string } = {
  "০": "0", "১": "1", "২": "2", "৩": "3", "৪": "4", "৫": "5", "৬": "6", "৭": "7", "৮": "8", "৯": "9"
};

const toBengaliNumber = (n: number | string) => {
  return n.toString().split('').map(digit => bengaliDigitsMap[digit] || digit).join('');
};

const toEnglishNumber = (bnStr: string) => {
  return bnStr.split('').map(digit => englishDigitsMap[digit] || digit).join('');
}

export function formatDurationBengali(totalSeconds: number): string {
  if (isNaN(totalSeconds) || totalSeconds < 0) {
    totalSeconds = 0;
  }
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  const pad = (num: number) => toBengaliNumber(num).padStart(2, '০');

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}


export function parseDuration(durationStr: string): number {
  if (!durationStr) return 0;
  
  // Convert Bengali numerals to English
  const englishStr = toEnglishNumber(durationStr);

  // Case 1: HH:MM:SS format
  if (englishStr.includes(':')) {
    const parts = englishStr.split(':').map(Number);
    let seconds = 0;
    if (parts.length === 3) {
      seconds += (parts[0] || 0) * 3600; // hours
      seconds += (parts[1] || 0) * 60;   // minutes
      seconds += (parts[2] || 0);        // seconds
    } else if (parts.length === 2) {
      seconds += (parts[0] || 0) * 60;   // minutes
      seconds += (parts[1] || 0);        // seconds
    } else if (parts.length === 1) {
      seconds += (parts[0] || 0);        // seconds
    }
    return isNaN(seconds) ? 0 : seconds;
  }

  // Case 2: Natural language format (e.g., "1 hour 30 minutes")
  let totalSeconds = 0;
  const hourMatches = englishStr.match(/(\d+)\s*(h|hour|ঘন্টা)/);
  const minMatches = englishStr.match(/(\d+)\s*(m|min|মিনিট)/);
  const secMatches = englishStr.match(/(\d+)\s*(s|sec|সেকেন্ড)/);

  if (hourMatches) totalSeconds += parseInt(hourMatches[1]) * 3600;
  if (minMatches) totalSeconds += parseInt(minMatches[1]) * 60;
  if (secMatches) totalSeconds += parseInt(secMatches[1]);

  // If no units, assume minutes for single number, seconds for others.
  if (totalSeconds === 0 && /^\d+$/.test(englishStr)) {
     const num = parseInt(englishStr);
     // Heuristic: if it's a large number, it might be seconds. If small, minutes.
     // Let's assume numbers > 60 are seconds, otherwise minutes.
     // Or more simply, let's just assume minutes if no unit is specified.
     return num * 60;
  }
  
  return totalSeconds;
}

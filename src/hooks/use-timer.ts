"use client";

import { useState, useEffect, useRef, useCallback } from 'react';

type TimerStatus = 'stopped' | 'running' | 'paused';

export function useTimer(initialSeconds = 0) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [status, setStatus] = useState<TimerStatus>('stopped');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const start = useCallback(() => {
    if (status !== 'running') {
      setStatus('running');
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
  }, [status]);

  const pause = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setStatus('paused');
    }
  }, []);

  const resume = useCallback(() => {
    if (status === 'paused') {
      start();
    }
  }, [status, start]);

  const reset = useCallback((newInitialSeconds = 0) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setSeconds(newInitialSeconds);
    setStatus('stopped');
  }, []);

  useEffect(() => {
     setSeconds(initialSeconds);
  }, [initialSeconds]);


  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return { seconds, setSeconds, status, start, pause, resume, reset };
}

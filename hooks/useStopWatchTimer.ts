import { useRef, useState } from "react";

export default function useStopWatchTimer() {
  const [timer, setTimer] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = () => {
    if (running) return;
    setRunning(true);
    intervalRef.current = setInterval(() => {
      setTimer((t) => t + 0.1);
    }, 100);
  };

  const stopTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRunning(false);
  };

  const resetTimer = () => {
    stopTimer();
    setTimer(0);
  };

  return { timer, running, startTimer, stopTimer, resetTimer };
}

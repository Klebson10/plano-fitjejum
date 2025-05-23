import React, { createContext, useState, useContext, useEffect } from 'react';

interface FastingPlan {
  id: string;
  name: string;
  fastHours: number;
  eatHours: number;
  description: string;
}

interface FastingSession {
  startTime: number | null;
  endTime: number | null;
  pausedAt: number | null;
  totalPausedTime: number;
  status: 'idle' | 'fasting' | 'paused' | 'completed';
  plan: FastingPlan;
}

interface FastingHistory {
  date: string;
  startTime: number;
  endTime: number;
  duration: number;
  planId: string;
  completed: boolean;
}

interface FastingContextType {
  fastingPlans: FastingPlan[];
  currentPlan: FastingPlan | null;
  setCurrentPlan: (plan: FastingPlan) => void;
  session: FastingSession;
  startFasting: () => void;
  pauseFasting: () => void;
  resumeFasting: () => void;
  stopFasting: (completed?: boolean) => void;
  fastingHistory: FastingHistory[];
  getElapsedTime: () => number;
  getRemainingTime: () => number;
  getProgress: () => number;
}

const defaultFastingPlans: FastingPlan[] = [
  { id: '16-8', name: '16:8', fastHours: 16, eatHours: 8, description: 'Clássico e mais popular' },
  { id: '18-6', name: '18:6', fastHours: 18, eatHours: 6, description: 'Intermédio, ótimos resultados' },
  { id: '20-4', name: '20:4', fastHours: 20, eatHours: 4, description: 'Desafiador, resultados rápidos' },
  { id: '14-10', name: '14:10', fastHours: 14, eatHours: 10, description: 'Para iniciantes' },
  { id: '24-0', name: '24 horas', fastHours: 24, eatHours: 0, description: 'Jejum prolongado' },
];

const defaultSession: FastingSession = {
  startTime: null,
  endTime: null,
  pausedAt: null,
  totalPausedTime: 0,
  status: 'idle',
  plan: defaultFastingPlans[0],
};

const FastingContext = createContext<FastingContextType>({
  fastingPlans: defaultFastingPlans,
  currentPlan: null,
  setCurrentPlan: () => {},
  session: defaultSession,
  startFasting: () => {},
  pauseFasting: () => {},
  resumeFasting: () => {},
  stopFasting: () => {},
  fastingHistory: [],
  getElapsedTime: () => 0,
  getRemainingTime: () => 0,
  getProgress: () => 0,
});

export const useFasting = () => useContext(FastingContext);

export const FastingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fastingPlans] = useState<FastingPlan[]>(defaultFastingPlans);
  
  const [currentPlan, setCurrentPlan] = useState<FastingPlan | null>(() => {
    const savedPlan = localStorage.getItem('currentPlan');
    return savedPlan ? JSON.parse(savedPlan) : defaultFastingPlans[0];
  });

  const [session, setSession] = useState<FastingSession>(() => {
    const savedSession = localStorage.getItem('fastingSession');
    return savedSession ? JSON.parse(savedSession) : { ...defaultSession, plan: currentPlan };
  });

  const [fastingHistory, setFastingHistory] = useState<FastingHistory[]>(() => {
    const savedHistory = localStorage.getItem('fastingHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  // Save session to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('fastingSession', JSON.stringify(session));
  }, [session]);

  // Save current plan to localStorage whenever it changes
  useEffect(() => {
    if (currentPlan) {
      localStorage.setItem('currentPlan', JSON.stringify(currentPlan));
    }
  }, [currentPlan]);

  // Save fasting history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('fastingHistory', JSON.stringify(fastingHistory));
  }, [fastingHistory]);

  const startFasting = () => {
    if (!currentPlan) return;
    
    const now = Date.now();
    const plannedEndTime = now + (currentPlan.fastHours * 60 * 60 * 1000);
    
    setSession({
      startTime: now,
      endTime: plannedEndTime,
      pausedAt: null,
      totalPausedTime: 0,
      status: 'fasting',
      plan: currentPlan,
    });
  };

  const pauseFasting = () => {
    if (session.status !== 'fasting') return;
    
    setSession({
      ...session,
      pausedAt: Date.now(),
      status: 'paused',
    });
  };

  const resumeFasting = () => {
    if (session.status !== 'paused' || !session.pausedAt) return;
    
    const pauseDuration = Date.now() - session.pausedAt;
    const newTotalPausedTime = session.totalPausedTime + pauseDuration;
    
    // Adjust the end time to account for the pause
    const newEndTime = session.endTime ? (session.endTime + pauseDuration) : null;
    
    setSession({
      ...session,
      pausedAt: null,
      endTime: newEndTime,
      totalPausedTime: newTotalPausedTime,
      status: 'fasting',
    });
  };

  const stopFasting = (completed = false) => {
    if (session.status === 'idle') return;
    
    // Add to history if there was an active session
    if (session.startTime && session.plan) {
      const now = Date.now();
      const duration = now - session.startTime - session.totalPausedTime;
      
      // Only add to history if the session lasted at least 1 minute
      if (duration > 60000) {
        const today = new Date().toISOString().split('T')[0];
        
        setFastingHistory([
          ...fastingHistory,
          {
            date: today,
            startTime: session.startTime,
            endTime: now,
            duration,
            planId: session.plan.id,
            completed,
          },
        ]);
      }
    }
    
    // Reset session
    setSession({
      ...defaultSession,
      plan: currentPlan || defaultFastingPlans[0],
    });
  };

  const getElapsedTime = (): number => {
    if (!session.startTime) return 0;
    
    if (session.status === 'paused' && session.pausedAt) {
      return session.pausedAt - session.startTime - session.totalPausedTime;
    }
    
    if (session.status === 'completed' && session.endTime) {
      return session.endTime - session.startTime - session.totalPausedTime;
    }
    
    return Date.now() - session.startTime - session.totalPausedTime;
  };

  const getRemainingTime = (): number => {
    if (!session.startTime || !session.endTime) return 0;
    
    const elapsed = getElapsedTime();
    const total = session.endTime - session.startTime;
    const remaining = total - elapsed;
    
    return Math.max(0, remaining);
  };

  const getProgress = (): number => {
    if (!session.startTime || !session.endTime || session.status === 'idle') return 0;
    
    const elapsed = getElapsedTime();
    const total = session.endTime - session.startTime;
    
    return Math.min(100, (elapsed / total) * 100);
  };

  return (
    <FastingContext.Provider
      value={{
        fastingPlans,
        currentPlan,
        setCurrentPlan,
        session,
        startFasting,
        pauseFasting,
        resumeFasting,
        stopFasting,
        fastingHistory,
        getElapsedTime,
        getRemainingTime,
        getProgress,
      }}
    >
      {children}
    </FastingContext.Provider>
  );
};
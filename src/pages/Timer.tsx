import React, { useState, useEffect } from 'react';
import { useFasting } from '../context/FastingContext';
import { Play, Pause, Timer as TimerIcon, StopCircle, RefreshCw, Clock, Flame, Trophy, Target, Calendar } from 'lucide-react';

const Timer: React.FC = () => {
  const { 
    fastingPlans, 
    currentPlan, 
    setCurrentPlan,
    session,
    startFasting,
    pauseFasting,
    resumeFasting,
    stopFasting,
    getElapsedTime,
    getRemainingTime,
    getProgress,
    fastingHistory
  } = useFasting();

  const [elapsed, setElapsed] = useState(getElapsedTime());
  const [remaining, setRemaining] = useState(getRemainingTime());
  const [progress, setProgress] = useState(getProgress());

  useEffect(() => {
    const interval = setInterval(() => {
      if (session.status === 'fasting') {
        const newElapsed = getElapsedTime();
        const newRemaining = getRemainingTime();
        const newProgress = getProgress();
        
        setElapsed(newElapsed);
        setRemaining(newRemaining);
        setProgress(newProgress);
        
        if (newRemaining <= 0) {
          stopFasting(true);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [session, getElapsedTime, getRemainingTime, getProgress, stopFasting]);

  const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getEndTime = (): string => {
    if (!session.endTime) return '--:--';
    
    const endDate = new Date(session.endTime);
    const hours = endDate.getHours();
    const minutes = endDate.getMinutes();
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  // Calculate stats
  const completedFasts = fastingHistory.filter(fast => fast.completed).length;
  const successRate = fastingHistory.length > 0 
    ? Math.round((completedFasts / fastingHistory.length) * 100) 
    : 0;

  // Get current streak
  const getCurrentStreak = (): number => {
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    
    const sortedHistory = [...fastingHistory]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    if (sortedHistory.length === 0) return 0;
    
    const hasTodayRecord = sortedHistory.some(record => record.date === today);
    let currentDate = new Date();
    if (!hasTodayRecord) {
      currentDate.setDate(currentDate.getDate() - 1);
    }
    
    while (true) {
      const dateString = currentDate.toISOString().split('T')[0];
      const hasRecord = sortedHistory.some(record => record.date === dateString && record.completed);
      
      if (!hasRecord) break;
      
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    }
    
    return streak;
  };
  
  const currentStreak = getCurrentStreak();
  
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-center mb-6">Jejum Intermitente</h1>
      
      {/* Timer Circle */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="relative mx-auto w-72 h-72">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#f3f4f6"
              strokeWidth="10"
            />
            
            {session.status !== 'idle' && (
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#10b981"
                strokeWidth="10"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-in-out"
              />
            )}
          </svg>
          
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-full">
            {session.status === 'idle' ? (
              <div className="flex flex-col items-center">
                <TimerIcon size={40} className="text-green-500 mb-3" />
                <span className="text-xl font-semibold text-gray-700">Pronto para começar</span>
              </div>
            ) : (
              <>
                <div className="text-4xl font-bold text-gray-800 mb-2 font-mono">
                  {formatTime(elapsed)}
                </div>
                <div className={`text-lg font-medium mb-1 ${
                  session.status === 'fasting' ? 'text-green-500' : 
                  session.status === 'paused' ? 'text-yellow-500' : 'text-blue-500'
                }`}>
                  {session.status === 'fasting' ? 'Jejuando' : 
                   session.status === 'paused' ? 'Pausado' : 'Completo'}
                </div>
                {session.status === 'fasting' && (
                  <div className="text-sm text-gray-500">
                    Termina às {getEndTime()}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 mb-6">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <Clock className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <div className="text-sm text-gray-500">Jejuando</div>
            <div className="font-mono font-bold">{formatTime(elapsed)}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <Flame className="w-6 h-6 text-orange-500 mx-auto mb-2" />
            <div className="text-sm text-gray-500">Kcal</div>
            <div className="font-mono font-bold text-orange-500">
              {Math.round(elapsed / (1000 * 60 * 60) * 50)}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <Target className="w-6 h-6 text-purple-500 mx-auto mb-2" />
            <div className="text-sm text-gray-500">Meta</div>
            <div className="font-mono font-bold text-purple-500">
              {currentPlan?.fastHours}h
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          {session.status === 'idle' && (
            <button
              onClick={startFasting}
              className="flex items-center justify-center px-8 py-4 bg-green-500 rounded-lg text-white hover:bg-green-600 transition-all duration-300 transform hover:scale-105 min-w-40 shadow-lg"
            >
              <Play size={24} className="mr-2" />
              Iniciar Jejum
            </button>
          )}
          
          {session.status === 'fasting' && (
            <>
              <button
                onClick={pauseFasting}
                className="flex items-center justify-center px-8 py-4 bg-yellow-500 rounded-lg text-white hover:bg-yellow-600 transition-all duration-300 transform hover:scale-105 min-w-40 shadow-lg"
              >
                <Pause size={24} className="mr-2" />
                Pausar
              </button>
              
              <button
                onClick={() => stopFasting()}
                className="flex items-center justify-center px-8 py-4 bg-red-500 rounded-lg text-white hover:bg-red-600 transition-all duration-300 transform hover:scale-105 min-w-40 shadow-lg"
              >
                <StopCircle size={24} className="mr-2" />
                Parar
              </button>
            </>
          )}
          
          {session.status === 'paused' && (
            <>
              <button
                onClick={resumeFasting}
                className="flex items-center justify-center px-8 py-4 bg-green-500 rounded-lg text-white hover:bg-green-600 transition-all duration-300 transform hover:scale-105 min-w-40 shadow-lg"
              >
                <Play size={24} className="mr-2" />
                Retomar
              </button>
              
              <button
                onClick={() => stopFasting()}
                className="flex items-center justify-center px-8 py-4 bg-red-500 rounded-lg text-white hover:bg-red-600 transition-all duration-300 transform hover:scale-105 min-w-40 shadow-lg"
              >
                <RefreshCw size={24} className="mr-2" />
                Reiniciar
              </button>
            </>
          )}
          
          {session.status === 'completed' && (
            <button
              onClick={() => stopFasting()}
              className="flex items-center justify-center px-8 py-4 bg-green-500 rounded-lg text-white hover:bg-green-600 transition-all duration-300 transform hover:scale-105 min-w-40 shadow-lg"
            >
              <RefreshCw size={24} className="mr-2" />
              Novo Jejum
            </button>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-md text-center">
          <Calendar className="w-6 h-6 text-green-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-green-600">{currentStreak}</div>
          <div className="text-xs text-gray-500">Dias consecutivos</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-md text-center">
          <Trophy className="w-6 h-6 text-blue-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-blue-600">{completedFasts}</div>
          <div className="text-xs text-gray-500">Jejuns completos</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-md text-center">
          <Target className="w-6 h-6 text-purple-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-purple-600">{successRate}%</div>
          <div className="text-xs text-gray-500">Taxa de sucesso</div>
        </div>
      </div>
      
      {/* Fasting Plans */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-lg font-medium mb-4">Planos de Jejum</h2>
        
        <div className="grid gap-3">
          {fastingPlans.map((plan) => (
            <button
              key={plan.id}
              onClick={() => session.status === 'idle' && setCurrentPlan(plan)}
              className={`p-4 border-2 rounded-lg transition-all ${
                currentPlan?.id === plan.id
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200'
              } ${session.status !== 'idle' ? 'opacity-50 cursor-not-allowed' : 'hover:border-green-200'}`}
              disabled={session.status !== 'idle'}
            >
              <div className="flex justify-between items-center">
                <div className="text-left">
                  <span className="font-bold text-lg block">{plan.name}</span>
                  <p className="text-gray-600 text-sm">{plan.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-green-600">{plan.fastHours}h jejum</div>
                  <div className="text-xs text-gray-500">{plan.eatHours}h alimentação</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-medium mb-4">Dicas para o Jejum</h2>
        
        <ul className="space-y-3">
          <li className="flex items-start">
            <div className="bg-green-100 p-1 rounded-full mr-3 mt-0.5">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
            <p className="text-gray-700">Mantenha-se hidratado durante o jejum</p>
          </li>
          <li className="flex items-start">
            <div className="bg-green-100 p-1 rounded-full mr-3 mt-0.5">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
            <p className="text-gray-700">Chás e café sem açúcar são permitidos</p>
          </li>
          <li className="flex items-start">
            <div className="bg-green-100 p-1 rounded-full mr-3 mt-0.5">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
            <p className="text-gray-700">Escute seu corpo e pare se sentir mal-estar</p>
          </li>
          <li className="flex items-start">
            <div className="bg-green-100 p-1 rounded-full mr-3 mt-0.5">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
            <p className="text-gray-700">Quebre o jejum com alimentos leves e nutritivos</p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Timer;
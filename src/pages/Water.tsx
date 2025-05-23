import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { Droplets, Plus, BarChart3 } from 'lucide-react';

const WaterAmounts = [
  { value: 200, label: '200ml' },
  { value: 300, label: '300ml' },
  { value: 500, label: '500ml' },
  { value: 1000, label: '1L' },
];

const Water: React.FC = () => {
  const { 
    waterIntake, 
    addWaterIntake, 
    getTodayWaterIntake, 
    dailyWaterGoal 
  } = useUser();
  
  const [amount, setAmount] = useState(200);
  const todayIntake = getTodayWaterIntake();
  const percentage = Math.min(100, Math.round((todayIntake / dailyWaterGoal) * 100));
  
  // Get the last 7 days of water intake
  const getLast7DaysData = () => {
    const result = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      const record = waterIntake.find(item => item.date === dateString);
      const amount = record ? record.amount : 0;
      
      // Format date to display as "Dom", "Seg", etc.
      const dayName = date.toLocaleDateString('pt-BR', { weekday: 'short' }).slice(0, 3);
      
      result.push({
        day: dayName,
        date: dateString,
        amount,
      });
    }
    
    return result;
  };
  
  const weekData = getLast7DaysData();
  const maxWeekAmount = Math.max(...weekData.map(day => day.amount), dailyWaterGoal);
  
  const handleAddWater = () => {
    addWaterIntake(amount);
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-center mb-6">Controle de Hidratação</h1>
      
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Hoje</h2>
          <div className="text-sm text-gray-500">
            Meta: {(dailyWaterGoal / 1000).toFixed(1)}L
          </div>
        </div>
        
        <div className="relative h-64 flex items-center justify-center mb-6">
          <div className="w-40 h-40 relative">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#60a5fa" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
              
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#f3f4f6"
                strokeWidth="10"
              />
              
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="url(#waterGradient)"
                strokeWidth="10"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - percentage / 100)}`}
                transform="rotate(-90 50 50)"
                strokeLinecap="round"
              />
              
              {/* Water drop in center */}
              <path
                d="M50,30 C60,50 70,60 50,75 C30,60 40,50 50,30"
                fill="url(#waterGradient)"
              />
            </svg>
            
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white font-bold">
              <div className="text-2xl">{percentage}%</div>
              <div className="text-sm">{(todayIntake / 1000).toFixed(1)}L</div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <div className="font-medium">Adicionar água:</div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-6">
          {WaterAmounts.map(item => (
            <button
              key={item.value}
              className={`p-3 border-2 rounded-lg transition-all ${
                amount === item.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-200'
              }`}
              onClick={() => setAmount(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>
        
        <button
          onClick={handleAddWater}
          className="flex items-center justify-center w-full px-6 py-3 bg-blue-500 rounded-lg text-white hover:bg-blue-600 transition"
        >
          <Plus size={20} className="mr-2" />
          Registrar
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Relatório Semanal</h2>
          <BarChart3 size={20} className="text-gray-500" />
        </div>
        
        <div className="h-52 flex items-end justify-between">
          {weekData.map((day, index) => {
            const height = maxWeekAmount > 0 ? (day.amount / maxWeekAmount) * 100 : 0;
            return (
              <div key={index} className="flex flex-col items-center w-1/8">
                <div 
                  className={`w-8 rounded-t-md ${
                    day.date === new Date().toISOString().split('T')[0]
                      ? 'bg-blue-500'
                      : 'bg-blue-200'
                  }`}
                  style={{ height: `${height}%` }}
                ></div>
                <div className="mt-2 text-xs text-gray-500">{day.day}</div>
                <div className="text-xs font-medium">
                  {day.amount > 0 ? `${(day.amount / 1000).toFixed(1)}L` : '-'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="mt-6 bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-medium mb-4">Dicas de Hidratação</h2>
        
        <ul className="space-y-3">
          <li className="flex items-start">
            <div className="bg-blue-100 p-1 rounded-full mr-3 mt-0.5">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            </div>
            <p className="text-gray-700">Beba 2 copos de água assim que acordar</p>
          </li>
          <li className="flex items-start">
            <div className="bg-blue-100 p-1 rounded-full mr-3 mt-0.5">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            </div>
            <p className="text-gray-700">Durante o jejum, beba mais água para ajudar a controlar a fome</p>
          </li>
          <li className="flex items-start">
            <div className="bg-blue-100 p-1 rounded-full mr-3 mt-0.5">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            </div>
            <p className="text-gray-700">Adicione limão ou pepino na água para dar sabor</p>
          </li>
          <li className="flex items-start">
            <div className="bg-blue-100 p-1 rounded-full mr-3 mt-0.5">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            </div>
            <p className="text-gray-700">Estabeleça horários fixos para beber água durante o dia</p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Water;
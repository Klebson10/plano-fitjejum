import React from 'react';
import { useUser } from '../context/UserContext';
import { useFasting } from '../context/FastingContext';
import { LineChart, BarChart3, Scale, Trophy } from 'lucide-react';

const Progress: React.FC = () => {
  const { userData, weightHistory } = useUser();
  const { fastingHistory } = useFasting();
  
  // Calculate BMI
  const calculateBMI = (weight: number, heightCm: number): number => {
    if (!weight || !heightCm) return 0;
    const heightM = heightCm / 100;
    return weight / (heightM * heightM);
  };
  
  const currentBMI = calculateBMI(userData.weight, userData.height);
  
  // Format BMI category
  const getBMICategory = (bmi: number): { category: string; color: string } => {
    if (bmi < 18.5) return { category: 'Abaixo do peso', color: 'text-blue-500' };
    if (bmi < 25) return { category: 'Peso normal', color: 'text-green-500' };
    if (bmi < 30) return { category: 'Sobrepeso', color: 'text-yellow-500' };
    if (bmi < 35) return { category: 'Obesidade Grau I', color: 'text-orange-500' };
    if (bmi < 40) return { category: 'Obesidade Grau II', color: 'text-red-500' };
    return { category: 'Obesidade Grau III', color: 'text-red-700' };
  };
  
  const bmiCategory = getBMICategory(currentBMI);
  
  // Get the last 7 records of weight history
  const last7WeightRecords = [...weightHistory]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-7);
  
  // Get fasting stats
  const completedFastings = fastingHistory.filter(fast => fast.completed).length;
  const totalFastings = fastingHistory.length;
  const completionRate = totalFastings > 0 
    ? Math.round((completedFastings / totalFastings) * 100) 
    : 0;
  
  // Calculate total fasting time
  const totalFastingMinutes = fastingHistory.reduce((total, fast) => {
    return total + (fast.duration / (1000 * 60));
  }, 0);
  
  // Format to hours and minutes
  const totalHours = Math.floor(totalFastingMinutes / 60);
  const totalMinutes = Math.round(totalFastingMinutes % 60);
  
  // Get streaks
  const getCurrentStreak = (): number => {
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    
    // Sort history by date, most recent first
    const sortedHistory = [...fastingHistory]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    if (sortedHistory.length === 0) return 0;
    
    // Check if there's a record for today
    const hasTodayRecord = sortedHistory.some(record => record.date === today);
    
    // Start from today or yesterday based on if there's a record for today
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
      <h1 className="text-2xl font-bold text-center mb-6">Seu Progresso</h1>
      
      <div className="grid gap-6">
        {/* Weight and BMI Stats */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Peso e IMC</h2>
            <Scale size={20} className="text-gray-500" />
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-gray-500 text-sm mb-1">Peso Atual</div>
              <div className="text-2xl font-bold">{userData.weight} kg</div>
              {userData.targetWeight > 0 && (
                <div className="text-xs text-gray-500 mt-1">
                  Meta: {userData.targetWeight} kg
                </div>
              )}
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-gray-500 text-sm mb-1">IMC</div>
              <div className="text-2xl font-bold">{currentBMI.toFixed(1)}</div>
              <div className={`text-xs ${bmiCategory.color} mt-1`}>
                {bmiCategory.category}
              </div>
            </div>
          </div>
          
          {last7WeightRecords.length > 0 && (
            <>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Histórico de Peso</h3>
                <LineChart size={16} className="text-gray-500" />
              </div>
              
              <div className="relative h-48">
                <div className="absolute inset-0 flex items-end">
                  {last7WeightRecords.map((record, index) => {
                    const minWeight = Math.min(...last7WeightRecords.map(r => r.weight));
                    const maxWeight = Math.max(...last7WeightRecords.map(r => r.weight));
                    const range = maxWeight - minWeight || 1;
                    const normalized = ((record.weight - minWeight) / range) * 80 + 10; // 10% to 90% height
                    
                    return (
                      <div 
                        key={index} 
                        className="flex-1 flex flex-col items-center"
                      >
                        <div className="w-full flex justify-center mb-1">
                          <div className="text-xs font-medium">{record.weight} kg</div>
                        </div>
                        <div 
                          className="w-3/4 bg-green-500 rounded-t"
                          style={{ height: `${normalized}%` }}
                        ></div>
                        <div className="w-full text-center mt-2">
                          <div className="text-xs text-gray-500">
                            {new Date(record.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Fasting Stats */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Estatísticas de Jejum</h2>
            <BarChart3 size={20} className="text-gray-500" />
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-gray-500 text-sm mb-1">Jejuns Completos</div>
              <div className="text-2xl font-bold">{completedFastings}/{totalFastings}</div>
              <div className="text-xs text-gray-500 mt-1">
                Taxa de conclusão: {completionRate}%
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-gray-500 text-sm mb-1">Tempo Total</div>
              <div className="text-2xl font-bold">{totalHours}h {totalMinutes}m</div>
              <div className="text-xs text-gray-500 mt-1">
                Em todos os jejuns
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-gray-500 text-sm mb-1">Sequência Atual</div>
              <div className="text-2xl font-bold">{currentStreak} dias</div>
              <div className="text-xs text-gray-500 mt-1">
                {currentStreak > 0 ? 'Continue assim!' : 'Comece hoje!'}
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-gray-500 text-sm mb-1">Nível</div>
              <div className="text-2xl font-bold">
                {totalFastings < 3 ? 'Iniciante' : 
                 totalFastings < 10 ? 'Intermediário' : 
                 totalFastings < 20 ? 'Avançado' : 'Mestre'}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {totalFastings < 3 ? '0/3 jejuns' : 
                 totalFastings < 10 ? `${totalFastings}/10 jejuns` : 
                 totalFastings < 20 ? `${totalFastings}/20 jejuns` : `${totalFastings} jejuns`}
              </div>
            </div>
          </div>
        </div>
        
        {/* Achievements */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Conquistas</h2>
            <Trophy size={20} className="text-gray-500" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className={`bg-gray-50 rounded-lg p-4 ${totalFastings >= 1 ? 'border-2 border-yellow-400' : 'opacity-50'}`}>
              <div className="flex items-center mb-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                  totalFastings >= 1 ? 'bg-yellow-400 text-white' : 'bg-gray-200 text-gray-400'
                }`}>
                  <Trophy size={16} />
                </div>
                <div className="font-medium">Primeiro Jejum</div>
              </div>
              <div className="text-xs text-gray-500">
                Complete seu primeiro jejum
              </div>
            </div>
            
            <div className={`bg-gray-50 rounded-lg p-4 ${currentStreak >= 3 ? 'border-2 border-yellow-400' : 'opacity-50'}`}>
              <div className="flex items-center mb-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                  currentStreak >= 3 ? 'bg-yellow-400 text-white' : 'bg-gray-200 text-gray-400'
                }`}>
                  <Trophy size={16} />
                </div>
                <div className="font-medium">Sequência de 3 dias</div>
              </div>
              <div className="text-xs text-gray-500">
                Complete 3 dias seguidos de jejum
              </div>
            </div>
            
            <div className={`bg-gray-50 rounded-lg p-4 ${completedFastings >= 5 ? 'border-2 border-yellow-400' : 'opacity-50'}`}>
              <div className="flex items-center mb-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                  completedFastings >= 5 ? 'bg-yellow-400 text-white' : 'bg-gray-200 text-gray-400'
                }`}>
                  <Trophy size={16} />
                </div>
                <div className="font-medium">5 Jejuns Completos</div>
              </div>
              <div className="text-xs text-gray-500">
                Complete 5 jejuns integralmente
              </div>
            </div>
            
            <div className={`bg-gray-50 rounded-lg p-4 ${
              weightHistory.length > 0 && 
              userData.weight < weightHistory[0].weight ? 'border-2 border-yellow-400' : 'opacity-50'
            }`}>
              <div className="flex items-center mb-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                  weightHistory.length > 0 && 
                  userData.weight < weightHistory[0].weight ? 'bg-yellow-400 text-white' : 'bg-gray-200 text-gray-400'
                }`}>
                  <Trophy size={16} />
                </div>
                <div className="font-medium">Primeira Perda</div>
              </div>
              <div className="text-xs text-gray-500">
                Perca seu primeiro quilo
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;
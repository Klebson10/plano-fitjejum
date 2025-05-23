import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useFasting } from '../context/FastingContext';
import { User, Weight, Target, Calendar, LogOut } from 'lucide-react';

const Profile: React.FC = () => {
  const { userData, updateUserData, addWeightRecord } = useUser();
  const { fastingHistory } = useFasting();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: userData.name,
    age: userData.age,
    height: userData.height,
    weight: userData.weight,
    targetWeight: userData.targetWeight,
  });
  
  const [newWeight, setNewWeight] = useState(userData.weight.toString());
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSave = () => {
    updateUserData({
      name: formData.name,
      age: parseInt(formData.age.toString(), 10),
      height: parseInt(formData.height.toString(), 10),
      weight: parseFloat(formData.weight.toString()),
      targetWeight: parseFloat(formData.targetWeight.toString()),
    });
    
    setIsEditing(false);
  };
  
  const handleAddWeight = () => {
    const weight = parseFloat(newWeight);
    if (!isNaN(weight) && weight > 0) {
      addWeightRecord(weight);
      setNewWeight('');
    }
  };
  
  const handleLogout = () => {
    if (confirm('Tem certeza que deseja sair? Todos os dados serão perdidos.')) {
      localStorage.clear();
      window.location.reload();
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-center mb-6">Seu Perfil</h1>
      
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mr-4">
              <User size={32} className="text-green-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{userData.name}</h2>
              <p className="text-gray-500">
                {userData.gender === 'male' ? 'Masculino' : userData.gender === 'female' ? 'Feminino' : 'Outro'}, {userData.age} anos
              </p>
            </div>
          </div>
          
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200 transition"
            >
              Editar
            </button>
          )}
        </div>
        
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">Nome</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">Idade</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">Altura (cm)</label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">Peso Atual (kg)</label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                step="0.1"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">Peso Desejado (kg)</label>
              <input
                type="number"
                name="targetWeight"
                value={formData.targetWeight}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                step="0.1"
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200 transition"
              >
                Cancelar
              </button>
              
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-500 rounded-lg text-white hover:bg-green-600 transition"
              >
                Salvar
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <Weight className="text-gray-400 mr-3" size={20} />
              <div>
                <div className="text-sm text-gray-500">Peso Atual</div>
                <div className="font-medium">{userData.weight} kg</div>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <Target className="text-gray-400 mr-3" size={20} />
              <div>
                <div className="text-sm text-gray-500">Peso Desejado</div>
                <div className="font-medium">{userData.targetWeight} kg</div>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <Calendar className="text-gray-400 mr-3" size={20} />
              <div>
                <div className="text-sm text-gray-500">Altura</div>
                <div className="font-medium">{userData.height} cm</div>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <User className="text-gray-400 mr-3" size={20} />
              <div>
                <div className="text-sm text-gray-500">Nível de Atividade</div>
                <div className="font-medium">
                  {userData.activityLevel === 'sedentary' ? 'Sedentário' : 
                   userData.activityLevel === 'light' ? 'Leve' : 
                   userData.activityLevel === 'moderate' ? 'Moderado' : 
                   userData.activityLevel === 'intense' ? 'Intenso' : '-'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-lg font-medium mb-4">Registrar Peso Atual</h2>
        
        <div className="flex items-center">
          <input
            type="number"
            value={newWeight}
            onChange={(e) => setNewWeight(e.target.value)}
            placeholder="Seu peso atual (kg)"
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            step="0.1"
          />
          
          <button
            onClick={handleAddWeight}
            className="ml-3 px-4 py-3 bg-green-500 rounded-lg text-white hover:bg-green-600 transition whitespace-nowrap"
          >
            Registrar
          </button>
        </div>
        
        <p className="text-sm text-gray-500 mt-2">
          Registre seu peso regularmente para acompanhar seu progresso
        </p>
      </div>
      
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-lg font-medium mb-4">Resumo da Jornada</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">Total de Jejuns</div>
            <div className="text-2xl font-bold">{fastingHistory.length}</div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">Dias na Jornada</div>
            <div className="text-2xl font-bold">
              {userData.name ? Math.ceil((Date.now() - new Date().setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24)) + 1 : 0}
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-md p-6">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center w-full p-3 border border-red-300 rounded-lg text-red-500 hover:bg-red-50 transition"
        >
          <LogOut size={18} className="mr-2" />
          Sair / Limpar Dados
        </button>
        
        <p className="text-xs text-gray-500 text-center mt-2">
          Isso apagará todos os seus dados e reiniciará o aplicativo
        </p>
      </div>
    </div>
  );
};

export default Profile;
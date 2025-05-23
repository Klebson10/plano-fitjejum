import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useFasting } from '../context/FastingContext';

interface QuizProps {
  onComplete: () => void;
}

const Quiz: React.FC<QuizProps> = ({ onComplete }) => {
  const { updateUserData } = useUser();
  const { fastingPlans, setCurrentPlan } = useFasting();
  
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    age: '',
    height: '',
    weight: '',
    targetWeight: '',
    activityLevel: '',
    goal: '',
  });

  const steps = [
    { title: 'Nome', field: 'name', type: 'text', placeholder: 'Seu nome' },
    { 
      title: 'Sexo', 
      field: 'gender', 
      type: 'options', 
      options: [
        { value: 'male', label: 'Masculino' },
        { value: 'female', label: 'Feminino' },
        { value: 'other', label: 'Outro' },
      ]
    },
    { title: 'Idade', field: 'age', type: 'number', placeholder: 'Sua idade', unit: 'anos' },
    { title: 'Altura', field: 'height', type: 'number', placeholder: 'Sua altura', unit: 'cm' },
    { title: 'Peso Atual', field: 'weight', type: 'number', placeholder: 'Seu peso', unit: 'kg' },
    { title: 'Peso Desejado', field: 'targetWeight', type: 'number', placeholder: 'Seu peso ideal', unit: 'kg' },
    { 
      title: 'Nível de Atividade', 
      field: 'activityLevel', 
      type: 'options', 
      options: [
        { value: 'sedentary', label: 'Sedentário' },
        { value: 'light', label: 'Leve' },
        { value: 'moderate', label: 'Moderado' },
        { value: 'intense', label: 'Intenso' },
      ]
    },
    { 
      title: 'Objetivo', 
      field: 'goal', 
      type: 'options', 
      options: [
        { value: 'weightloss', label: 'Emagrecer' },
        { value: 'maintenance', label: 'Manter peso' },
        { value: 'health', label: 'Saúde' },
        { value: 'energy', label: 'Energia' },
      ]
    },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOptionSelect = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (step < steps.length - 1) {
      setStep(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(prev => prev + 1);
    } else {
      completeQuiz();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(prev => prev - 1);
    }
  };

  const completeQuiz = () => {
    // Transform form data to proper types
    const userData = {
      name: formData.name,
      gender: formData.gender,
      age: parseInt(formData.age, 10) || 0,
      height: parseInt(formData.height, 10) || 0,
      weight: parseFloat(formData.weight) || 0,
      targetWeight: parseFloat(formData.targetWeight) || 0,
      activityLevel: formData.activityLevel,
      goal: formData.goal,
    };

    // Update user context
    updateUserData(userData);
    
    // Set recommended fasting plan based on user data
    let recommendedPlan;
    
    if (userData.goal === 'weightloss' && userData.activityLevel === 'moderate') {
      // For weight loss with moderate activity, recommend 18:6
      recommendedPlan = fastingPlans.find(p => p.id === '18-6');
    } else if (userData.goal === 'weightloss' && userData.activityLevel === 'intense') {
      // For weight loss with intense activity, recommend 16:8
      recommendedPlan = fastingPlans.find(p => p.id === '16-8');
    } else if (userData.goal === 'maintenance') {
      // For maintenance, recommend 14:10
      recommendedPlan = fastingPlans.find(p => p.id === '14-10');
    } else if (userData.goal === 'health' || userData.goal === 'energy') {
      // For health or energy, recommend 16:8
      recommendedPlan = fastingPlans.find(p => p.id === '16-8');
    } else {
      // Default is 16:8
      recommendedPlan = fastingPlans.find(p => p.id === '16-8');
    }
    
    if (recommendedPlan) {
      setCurrentPlan(recommendedPlan);
    }
    
    // Notify parent that quiz is completed
    onComplete();
  };

  const currentStep = steps[step];

  return (
    <div className="container max-w-md mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Personalize sua jornada</h1>
        <p className="text-gray-600">
          Passo {step + 1} de {steps.length}
        </p>
        
        <div className="w-full bg-gray-200 h-2 rounded-full mt-4">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">{currentStep.title}</h2>
        
        {currentStep.type === 'text' && (
          <div className="mb-4">
            <input
              type="text"
              name={currentStep.field}
              value={formData[currentStep.field as keyof typeof formData]}
              onChange={handleInputChange}
              placeholder={currentStep.placeholder}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              autoFocus
            />
          </div>
        )}

        {currentStep.type === 'number' && (
          <div className="mb-4 relative">
            <input
              type="number"
              name={currentStep.field}
              value={formData[currentStep.field as keyof typeof formData]}
              onChange={handleInputChange}
              placeholder={currentStep.placeholder}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              autoFocus
            />
            {currentStep.unit && (
              <span className="absolute right-3 top-3 text-gray-500">
                {currentStep.unit}
              </span>
            )}
          </div>
        )}

        {currentStep.type === 'options' && (
          <div className="grid gap-3">
            {currentStep.options.map((option) => (
              <button
                key={option.value}
                className={`p-4 border-2 rounded-lg transition-all text-left ${
                  formData[currentStep.field as keyof typeof formData] === option.value
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-green-200'
                }`}
                onClick={() => handleOptionSelect(currentStep.field, option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}

        <div className="flex justify-between mt-6">
          {step > 0 ? (
            <button
              className="px-6 py-3 bg-gray-200 rounded-lg text-gray-700 hover:bg-gray-300 transition"
              onClick={handleBack}
            >
              Voltar
            </button>
          ) : (
            <div></div> // Empty div to maintain flex justify-between
          )}

          {((currentStep.type === 'text' || currentStep.type === 'number') && formData[currentStep.field as keyof typeof formData]) || 
           (currentStep.type === 'options' && step === steps.length - 1 && formData[currentStep.field as keyof typeof formData]) ? (
            <button
              className="px-6 py-3 bg-green-500 rounded-lg text-white hover:bg-green-600 transition"
              onClick={handleNext}
            >
              {step < steps.length - 1 ? 'Próximo' : 'Concluir'}
            </button>
          ) : (
            (currentStep.type === 'text' || currentStep.type === 'number') && (
              <button
                className="px-6 py-3 bg-gray-300 rounded-lg text-gray-500 cursor-not-allowed"
                disabled
              >
                {step < steps.length - 1 ? 'Próximo' : 'Concluir'}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
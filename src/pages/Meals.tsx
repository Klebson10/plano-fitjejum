import React from 'react';
import { useFasting } from '../context/FastingContext';
import { UtensilsCrossed, Clock, Flame } from 'lucide-react';

interface Recipe {
  id: string;
  title: string;
  prepTime: number;
  calories: number;
  imageUrl: string;
  ingredients: string[];
  preparation: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

const recipes: Recipe[] = [
  {
    id: '1',
    title: 'Omelete Turbo com Espinafre e Queijo',
    prepTime: 10,
    calories: 210,
    imageUrl: 'https://images.pexels.com/photos/6294248/pexels-photo-6294248.jpeg',
    ingredients: ['2 ovos', '1 punhado de espinafre', '2 colheres de queijo branco', 'Sal e pimenta'],
    preparation: 'Bata os ovos, jogue o espinafre refogado e o queijo. Frite tudo em fogo médio até dourar.',
    mealType: 'breakfast'
  },
  {
    id: '2',
    title: 'Detox Verde Monstro',
    prepTime: 5,
    calories: 80,
    imageUrl: 'https://images.pexels.com/photos/616833/pexels-photo-616833.jpeg',
    ingredients: ['1 pepino', '1 maçã verde', '1 folha de couve', 'Suco de limão, água, gelo'],
    preparation: 'Bata tudo no liquidificador e tome sem coar.',
    mealType: 'breakfast'
  },
  {
    id: '3',
    title: 'Bowl Pós-Jejum de Abacate e Ovo',
    prepTime: 15,
    calories: 300,
    imageUrl: 'https://images.pexels.com/photos/1095550/pexels-photo-1095550.jpeg',
    ingredients: ['1/2 abacate', '2 ovos cozidos', 'Mix de folhas verdes', 'Azeite, sal, limão'],
    preparation: 'Monte o bowl com as folhas, adicione o abacate fatiado e os ovos cortados ao meio. Tempere com azeite, sal e limão.',
    mealType: 'lunch'
  },
  {
    id: '4',
    title: 'Sardinha + Mix Low Carb',
    prepTime: 12,
    calories: 280,
    imageUrl: 'https://images.pexels.com/photos/8471739/pexels-photo-8471739.jpeg',
    ingredients: ['Sardinha (em água)', 'Tomate, cenoura, chia'],
    preparation: 'Misture a sardinha desfiada com os vegetais picados e polvilhe chia. Tempere com azeite e limão.',
    mealType: 'lunch'
  },
  {
    id: '5',
    title: 'Shake de Proteína com Frutas Vermelhas',
    prepTime: 3,
    calories: 190,
    imageUrl: 'https://images.pexels.com/photos/434295/pexels-photo-434295.jpeg',
    ingredients: ['200ml de leite vegetal', '1 colher de soro de leite', 'Frutas vermelhas'],
    preparation: 'Bata tudo no liquidificador até ficar homogêneo.',
    mealType: 'snack'
  },
  {
    id: '6',
    title: 'Sopa Detox de Abóbora e Gengibre',
    prepTime: 20,
    calories: 150,
    imageUrl: 'https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg',
    ingredients: ['Abóbora, gengibre, cebola, sal'],
    preparation: 'Cozinhe os ingredientes, bata no liquidificador e sirva quente com um fio de azeite.',
    mealType: 'dinner'
  }
];

const Meals: React.FC = () => {
  const { session } = useFasting();
  const [activeTab, setActiveTab] = React.useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  
  const filteredRecipes = recipes.filter(recipe => recipe.mealType === activeTab);
  
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-center mb-6">Refeições Recomendadas</h1>
      
      {session.status === 'fasting' && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Você está em jejum! Estas receitas são para quando quebrar o jejum.
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden">
        <div className="flex border-b">
          <button 
            className={`flex-1 py-3 text-center font-medium ${activeTab === 'breakfast' ? 'text-green-500 border-b-2 border-green-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('breakfast')}
          >
            Café da Manhã
          </button>
          <button 
            className={`flex-1 py-3 text-center font-medium ${activeTab === 'lunch' ? 'text-green-500 border-b-2 border-green-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('lunch')}
          >
            Almoço
          </button>
          <button 
            className={`flex-1 py-3 text-center font-medium ${activeTab === 'dinner' ? 'text-green-500 border-b-2 border-green-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('dinner')}
          >
            Jantar
          </button>
          <button 
            className={`flex-1 py-3 text-center font-medium ${activeTab === 'snack' ? 'text-green-500 border-b-2 border-green-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('snack')}
          >
            Lanches
          </button>
        </div>
      </div>
      
      <div className="grid gap-6">
        {filteredRecipes.map((recipe) => (
          <div key={recipe.id} className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/3 h-48 md:h-auto relative">
                <img 
                  className="w-full h-full object-cover" 
                  src={recipe.imageUrl} 
                  alt={recipe.title} 
                />
              </div>
              <div className="p-6 md:w-2/3">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-800">{recipe.title}</h3>
                  <div className="flex items-center text-gray-500 space-x-4">
                    <div className="flex items-center">
                      <Clock size={16} className="mr-1" />
                      <span className="text-sm">{recipe.prepTime} min</span>
                    </div>
                    <div className="flex items-center">
                      <Flame size={16} className="mr-1" />
                      <span className="text-sm">{recipe.calories} kcal</span>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-medium text-gray-700 mb-1">Ingredientes:</h4>
                  <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                    {recipe.ingredients.map((ingredient, idx) => (
                      <li key={idx}>{ingredient}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-1">Modo de Preparo:</h4>
                  <p className="text-sm text-gray-600">{recipe.preparation}</p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredRecipes.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <UtensilsCrossed size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">Nenhuma receita disponível</h3>
            <p className="text-gray-500">Não há receitas disponíveis para esta categoria no momento.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Meals;
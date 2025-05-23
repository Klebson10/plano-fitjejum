import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Timer, UtensilsCrossed, Droplets, LineChart, User } from 'lucide-react';

const BottomNav: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  const navItems = [
    { name: 'Jejum', path: '/timer', icon: <Timer size={24} /> },
    { name: 'Refeições', path: '/meals', icon: <UtensilsCrossed size={24} /> },
    { name: 'Água', path: '/water', icon: <Droplets size={24} /> },
    { name: 'Progresso', path: '/progress', icon: <LineChart size={24} /> },
    { name: 'Perfil', path: '/profile', icon: <User size={24} /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] p-3 flex justify-around items-center">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`flex flex-col items-center justify-center ${
            path === item.path ? 'text-green-500' : 'text-gray-700'
          }`}
        >
          {React.cloneElement(item.icon, { 
            className: path === item.path ? 'text-green-500' : 'text-gray-700' 
          })}
          <span className="text-xs mt-1">{item.name}</span>
        </Link>
      ))}
    </nav>
  );
};

export default BottomNav;
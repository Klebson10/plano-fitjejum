import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 bg-white shadow-md z-50 p-3 flex justify-center items-center">
      <img 
        src="https://cakto-quiz-br01.b-cdn.net/uploads/d9f2c80b-4b2f-4efd-936e-8c9e4b506b14.png" 
        alt="FastingTracker Logo" 
        className="h-10" 
      />
    </header>
  );
};

export default Header;
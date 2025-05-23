import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Quiz from './pages/Quiz';
import Timer from './pages/Timer';
import Meals from './pages/Meals';
import Water from './pages/Water';
import Progress from './pages/Progress';
import Profile from './pages/Profile';
import { UserProvider } from './context/UserContext';
import { FastingProvider } from './context/FastingContext';

function App() {
  const [quizCompleted, setQuizCompleted] = useState(
    localStorage.getItem('quizCompleted') === 'true'
  );

  const handleQuizComplete = () => {
    localStorage.setItem('quizCompleted', 'true');
    setQuizCompleted(true);
  };

  return (
    <UserProvider>
      <FastingProvider>
        <div className="min-h-screen bg-white flex flex-col">
          <Header />
          
          <main className="flex-1 pb-16">
            <Routes>
              {!quizCompleted && (
                <>
                  <Route path="/quiz" element={<Quiz onComplete={handleQuizComplete} />} />
                  <Route path="*" element={<Navigate to="/quiz" replace />} />
                </>
              )}
              
              {quizCompleted && (
                <>
                  <Route path="/timer" element={<Timer />} />
                  <Route path="/meals" element={<Meals />} />
                  <Route path="/water" element={<Water />} />
                  <Route path="/progress" element={<Progress />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="*" element={<Navigate to="/timer" replace />} />
                </>
              )}
            </Routes>
          </main>
          
          {quizCompleted && <BottomNav />}
        </div>
      </FastingProvider>
    </UserProvider>
  );
}

export default App;
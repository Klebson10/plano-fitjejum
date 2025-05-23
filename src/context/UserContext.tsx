import React, { createContext, useState, useContext, useEffect } from 'react';

interface UserData {
  name: string;
  gender: string;
  age: number;
  height: number;
  weight: number;
  targetWeight: number;
  activityLevel: string;
  goal: string;
}

interface UserContextType {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  weightHistory: { date: string; weight: number }[];
  addWeightRecord: (weight: number) => void;
  waterIntake: { date: string; amount: number }[];
  addWaterIntake: (amount: number) => void;
  getTodayWaterIntake: () => number;
  dailyWaterGoal: number;
}

const defaultUserData: UserData = {
  name: '',
  gender: '',
  age: 0,
  height: 0,
  weight: 0,
  targetWeight: 0,
  activityLevel: '',
  goal: '',
};

const UserContext = createContext<UserContextType>({
  userData: defaultUserData,
  updateUserData: () => {},
  weightHistory: [],
  addWeightRecord: () => {},
  waterIntake: [],
  addWaterIntake: () => {},
  getTodayWaterIntake: () => 0,
  dailyWaterGoal: 2500, // Default 2.5L
});

export const useUser = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<UserData>(() => {
    const savedData = localStorage.getItem('userData');
    return savedData ? JSON.parse(savedData) : defaultUserData;
  });

  const [weightHistory, setWeightHistory] = useState<{ date: string; weight: number }[]>(() => {
    const savedData = localStorage.getItem('weightHistory');
    return savedData ? JSON.parse(savedData) : [];
  });

  const [waterIntake, setWaterIntake] = useState<{ date: string; amount: number }[]>(() => {
    const savedData = localStorage.getItem('waterIntake');
    return savedData ? JSON.parse(savedData) : [];
  });

  // Calculate daily water goal based on weight
  const dailyWaterGoal = userData.weight ? Math.round(userData.weight * 33) : 2500; // 33ml per kg or default 2.5L

  useEffect(() => {
    localStorage.setItem('userData', JSON.stringify(userData));
  }, [userData]);

  useEffect(() => {
    localStorage.setItem('weightHistory', JSON.stringify(weightHistory));
  }, [weightHistory]);

  useEffect(() => {
    localStorage.setItem('waterIntake', JSON.stringify(waterIntake));
  }, [waterIntake]);

  const updateUserData = (data: Partial<UserData>) => {
    setUserData((prev) => ({ ...prev, ...data }));
  };

  const addWeightRecord = (weight: number) => {
    const today = new Date().toISOString().split('T')[0];
    
    // Update today's record if exists, otherwise add new
    const existingIndex = weightHistory.findIndex(record => record.date === today);
    
    if (existingIndex >= 0) {
      const newHistory = [...weightHistory];
      newHistory[existingIndex] = { date: today, weight };
      setWeightHistory(newHistory);
    } else {
      setWeightHistory([...weightHistory, { date: today, weight }]);
    }
    
    // Also update current weight in user data
    updateUserData({ weight });
  };

  const addWaterIntake = (amount: number) => {
    const today = new Date().toISOString().split('T')[0];
    
    // Update today's record if exists, otherwise add new
    const existingIndex = waterIntake.findIndex(record => record.date === today);
    
    if (existingIndex >= 0) {
      const newIntake = [...waterIntake];
      newIntake[existingIndex] = { 
        date: today, 
        amount: newIntake[existingIndex].amount + amount 
      };
      setWaterIntake(newIntake);
    } else {
      setWaterIntake([...waterIntake, { date: today, amount }]);
    }
  };

  const getTodayWaterIntake = (): number => {
    const today = new Date().toISOString().split('T')[0];
    const todayRecord = waterIntake.find(record => record.date === today);
    return todayRecord ? todayRecord.amount : 0;
  };

  return (
    <UserContext.Provider 
      value={{ 
        userData, 
        updateUserData, 
        weightHistory,
        addWeightRecord,
        waterIntake,
        addWaterIntake,
        getTodayWaterIntake,
        dailyWaterGoal
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
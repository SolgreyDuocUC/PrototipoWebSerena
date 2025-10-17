import { useState, useEffect } from 'react';
import { Toaster } from './components/ui/sonner';
import { Splash } from './components/Splash';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Dashboard } from './components/Dashboard';
import { Storage, User } from './utils/storage';

type Screen = 'splash' | 'login' | 'register' | 'dashboard';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Verificar si hay usuario autenticado
    const user = Storage.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setCurrentScreen('dashboard');
    }
  }, []);

  const handleSplashComplete = () => {
    const user = Storage.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setCurrentScreen('dashboard');
    } else {
      setCurrentScreen('login');
    }
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentScreen('dashboard');
  };

  const handleRegister = (user: User) => {
    setCurrentUser(user);
    setCurrentScreen('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentScreen('login');
  };

  return (
    <>
      {currentScreen === 'splash' && (
        <Splash onComplete={handleSplashComplete} />
      )}
      {currentScreen === 'login' && (
        <Login 
          onLogin={handleLogin} 
          onNavigateToRegister={() => setCurrentScreen('register')}
        />
      )}
      {currentScreen === 'register' && (
        <Register 
          onRegister={handleRegister}
          onNavigateToLogin={() => setCurrentScreen('login')}
        />
      )}
      {currentScreen === 'dashboard' && currentUser && (
        <Dashboard user={currentUser} onLogout={handleLogout} />
      )}
      <Toaster position="top-center" />
    </>
  );
}

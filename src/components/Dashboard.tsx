import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookHeart, Calendar, MessageCircle, Settings } from 'lucide-react';
import { DiaryScreen } from './DiaryScreen';
import { CalendarScreen } from './CalendarScreen';
import { ChatScreen } from './ChatScreen';
import { SettingsScreen } from './SettingsScreen';
import { Storage, User } from '../utils/storage';
import { SerenaAI } from '../utils/serena-ai';

type Screen = 'diary' | 'calendar' | 'chat' | 'settings';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export function Dashboard({ user, onLogout }: DashboardProps) {
  const [currentScreen, setCurrentScreen] = useState<Screen>('calendar');
  const [motivationalQuote, setMotivationalQuote] = useState('');

  useEffect(() => {
    // Obtener la entrada emocional más reciente para generar una frase personalizada
    const entries = Storage.getUserEmotions(user.id);
    if (entries.length > 0) {
      const latestEntry = entries[0];
      const phrase = SerenaAI.getPersonalizedPhrase(latestEntry.emotion);
      setMotivationalQuote(phrase);
    } else {
      setMotivationalQuote(SerenaAI.getMotivationalQuote());
    }
  }, [user]);

  const navItems = [
    { id: 'diary' as Screen, icon: BookHeart, label: 'Diario' },
    { id: 'calendar' as Screen, icon: Calendar, label: 'Calendario' },
    { id: 'chat' as Screen, icon: MessageCircle, label: 'Serena' },
    { id: 'settings' as Screen, icon: Settings, label: 'Config' },
  ];

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-card border-b border-border p-4 shadow-sm"
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl mb-1">Hola, {user.name.split(' ')[0]} 👋</h2>
          <p className="text-sm text-muted-foreground">{motivationalQuote}</p>
        </div>
      </motion.header>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {currentScreen === 'diary' && <DiaryScreen user={user} />}
            {currentScreen === 'calendar' && <CalendarScreen user={user} />}
            {currentScreen === 'chat' && <ChatScreen user={user} />}
            {currentScreen === 'settings' && <SettingsScreen user={user} onLogout={onLogout} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <motion.nav
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-card border-t border-border safe-area-bottom"
      >
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex justify-around items-center">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentScreen === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentScreen(item.id)}
                  className="flex flex-col items-center gap-1 p-2 relative"
                >
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className={`relative ${
                      isActive ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                  </motion.div>
                  <span className={`text-xs ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </motion.nav>
    </div>
  );
}

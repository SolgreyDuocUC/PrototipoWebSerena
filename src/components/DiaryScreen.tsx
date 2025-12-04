import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Smile, Frown, Meh, Heart, Cloud, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import { Storage, EmotionEntry, User } from '../utils/storage';
import { toast } from 'sonner';
import { SerenaAI } from '../utils/serena-ai';

interface DiaryScreenProps {
  user: User;
}

const emotions = [
  { emoji: '😊', label: 'Feliz', icon: Smile, color: 'text-success' },
  { emoji: '😢', label: 'Triste', icon: Frown, color: 'text-primary' },
  { emoji: '😐', label: 'Neutral', icon: Meh, color: 'text-muted-foreground' },
  { emoji: '❤️', label: 'Enamorado', icon: Heart, color: 'text-accent' },
  { emoji: '😰', label: 'Ansioso', icon: Cloud, color: 'text-secondary' },
  { emoji: '😠', label: 'Enojado', icon: Zap, color: 'text-destructive' },
];

export function DiaryScreen({ user }: DiaryScreenProps) {
  const [entries, setEntries] = useState<EmotionEntry[]>([]);
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    loadEntries();
  }, [user]);

  const loadEntries = () => {
    const userEntries = Storage.getUserEmotions(user.id);
    setEntries(userEntries);
  };

  const handleSaveEntry = () => {
    if (!selectedEmotion) {
      toast.error('Selecciona cómo te sientes');
      return;
    }

    const newEntry: EmotionEntry = {
      id: Date.now().toString(),
      userId: user.id,
      date: new Date().toISOString(),
      emotion: selectedEmotion,
      emoji: selectedEmoji,
      description: description.trim(),
    };

    Storage.addEmotion(newEntry);
    
    // Respuesta de Serena
    const response = SerenaAI.respondToEmotion(selectedEmotion);
    toast.success(response.message);

    setShowNewEntry(false);
    setSelectedEmotion('');
    setSelectedEmoji('');
    setDescription('');
    loadEntries();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hoy';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ayer';
    } else {
      return date.toLocaleDateString('es-ES', { 
        day: 'numeric', 
        month: 'long',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  return (
    <div className="h-full flex flex-col p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-2xl">Mi Diario Emocional</h3>
          <p className="text-sm text-muted-foreground">Registra cómo te sientes</p>
        </div>
        {!showNewEntry && (
          <Button
            onClick={() => setShowNewEntry(true)}
            className="bg-primary hover:bg-primary/90 gap-2"
          >
            <Plus className="w-5 h-5" />
            Nueva entrada
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {showNewEntry ? (
            <motion.div
              key="new-entry"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="p-6 mb-6">
                <h4 className="mb-4">¿Cómo te sientes hoy?</h4>
                
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {emotions.map((emotion) => {
                    const Icon = emotion.icon;
                    return (
                      <motion.button
                        key={emotion.label}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setSelectedEmotion(emotion.label);
                          setSelectedEmoji(emotion.emoji);
                        }}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          selectedEmotion === emotion.label
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="text-3xl mb-2">{emotion.emoji}</div>
                        <div className={`text-sm ${emotion.color}`}>{emotion.label}</div>
                      </motion.button>
                    );
                  })}
                </div>

                <div className="mb-4">
                  <label className="block mb-2 text-sm">
                    Describe tu día (opcional)
                  </label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="¿Qué pasó hoy? ¿Qué te hizo sentir así?"
                    rows={4}
                    className="resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleSaveEntry}
                    className="flex-1 bg-primary hover:bg-primary/90"
                  >
                    Guardar entrada
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowNewEntry(false);
                      setSelectedEmotion('');
                      setSelectedEmoji('');
                      setDescription('');
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="entries-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {entries.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📝</div>
                  <h4 className="mb-2">Sin entradas aún</h4>
                  <p className="text-muted-foreground mb-4">
                    Comienza a registrar tus emociones
                  </p>
                  <Button
                    onClick={() => setShowNewEntry(true)}
                    variant="outline"
                  >
                    Crear primera entrada
                  </Button>
                </div>
              ) : (
                entries.map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className="text-4xl">{entry.emoji}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-primary">{entry.emotion}</span>
                            <span className="text-sm text-muted-foreground">
                              {formatDate(entry.date)}
                            </span>
                          </div>
                          {entry.description && (
                            <p className="text-sm text-foreground/80">
                              {entry.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

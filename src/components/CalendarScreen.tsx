import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Plus, X, Smile, Frown, Meh, Heart, Cloud, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Storage, EmotionEntry, User } from '../utils/storage';
import { SerenaAI } from '../utils/serena-ai';
import { toast } from 'sonner';

interface CalendarScreenProps {
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

export function CalendarScreen({ user }: CalendarScreenProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [entries, setEntries] = useState<EmotionEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showEntryDialog, setShowEntryDialog] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const [description, setDescription] = useState('');
  const [personalizedPhrase, setPersonalizedPhrase] = useState('');

  useEffect(() => {
    loadEntries();
  }, [user]);

  const loadEntries = () => {
    const userEntries = Storage.getUserEmotions(user.id);
    setEntries(userEntries);
    
    // Obtener la entrada más reciente para mostrar una frase personalizada
    if (userEntries.length > 0) {
      const latestEntry = userEntries[0];
      const phrase = SerenaAI.getPersonalizedPhrase(latestEntry.emotion);
      setPersonalizedPhrase(phrase);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const getEntryForDate = (date: Date) => {
    return entries.find(entry => {
      const entryDate = new Date(entry.date);
      return (
        entryDate.getDate() === date.getDate() &&
        entryDate.getMonth() === date.getMonth() &&
        entryDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    const entry = getEntryForDate(date);
    
    if (entry) {
      // Si ya existe una entrada, solo mostrarla
      setSelectedEmotion(entry.emotion);
      setSelectedEmoji(entry.emoji);
      setDescription(entry.description);
    } else {
      // Si no existe, abrir el diálogo para crear una
      setSelectedEmotion('');
      setSelectedEmoji('');
      setDescription('');
      setShowEntryDialog(true);
    }
  };

  const handleSaveEntry = () => {
    if (!selectedEmotion || !selectedDate) {
      toast.error('Selecciona cómo te sientes');
      return;
    }

    // Verificar si ya existe una entrada para esta fecha
    const existingEntry = getEntryForDate(selectedDate);
    
    if (existingEntry) {
      toast.error('Ya existe una entrada para este día');
      return;
    }

    const newEntry: EmotionEntry = {
      id: Date.now().toString(),
      userId: user.id,
      date: selectedDate.toISOString(),
      emotion: selectedEmotion,
      emoji: selectedEmoji,
      description: description.trim(),
    };

    Storage.addEmotion(newEntry);
    
    // Generar frase personalizada
    const phrase = SerenaAI.getPersonalizedPhrase(selectedEmotion);
    setPersonalizedPhrase(phrase);
    
    // Respuesta de Serena
    const response = SerenaAI.respondToEmotion(selectedEmotion);
    toast.success(response.message);

    setShowEntryDialog(false);
    setSelectedEmotion('');
    setSelectedEmoji('');
    setDescription('');
    loadEntries();
  };

  const handleCloseDialog = () => {
    setShowEntryDialog(false);
    setSelectedDate(null);
    setSelectedEmotion('');
    setSelectedEmoji('');
    setDescription('');
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

  const selectedEntry = selectedDate ? getEntryForDate(selectedDate) : null;

  return (
    <div className="h-full overflow-y-auto p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h3 className="text-2xl mb-1">Calendario Emocional</h3>
          <p className="text-sm text-muted-foreground">
            Visualiza y registra tus emociones cada día
          </p>
          {personalizedPhrase && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 p-3 bg-primary/10 rounded-lg border border-primary/20"
            >
              <p className="text-sm text-primary">{personalizedPhrase}</p>
            </motion.div>
          )}
        </div>

      <Card className="p-6 mb-4">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateMonth('prev')}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h4 className="capitalize">{monthName}</h4>
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateMonth('next')}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
            <div key={day} className="text-center text-sm text-muted-foreground p-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: startingDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const entry = getEntryForDate(date);
            const isToday = date.toDateString() === new Date().toDateString();
            const isSelected = selectedDate?.toDateString() === date.toDateString();
            const isFutureDate = date > new Date();

            return (
              <motion.button
                key={day}
                whileHover={{ scale: isFutureDate ? 1 : 1.05 }}
                whileTap={{ scale: isFutureDate ? 1 : 0.95 }}
                onClick={() => !isFutureDate && handleDateClick(date)}
                disabled={isFutureDate}
                className={`aspect-square p-2 rounded-lg border-2 transition-all relative ${
                  isFutureDate
                    ? 'border-border/30 text-muted-foreground/30 cursor-not-allowed'
                    : isSelected
                    ? 'border-primary bg-primary/10'
                    : isToday
                    ? 'border-accent bg-accent/5'
                    : 'border-border hover:border-primary/50'
                } ${!entry && !isFutureDate ? 'hover:bg-secondary/20' : ''}`}
              >
                <div className="text-sm">{day}</div>
                {entry ? (
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-2xl">
                    {entry.emoji}
                  </div>
                ) : !isFutureDate ? (
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-50 transition-opacity">
                    <Plus className="w-3 h-3 text-muted-foreground" />
                  </div>
                ) : null}
              </motion.button>
            );
          })}
        </div>
      </Card>

        {selectedEntry && !showEntryDialog && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="text-5xl">{selectedEntry.emoji}</div>
                  <div>
                    <h4 className="mb-1">{selectedEntry.emotion}</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedDate?.toLocaleDateString('es-ES', { 
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long'
                      })}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedDate(null)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              {selectedEntry.description && (
                <p className="text-foreground/80">{selectedEntry.description}</p>
              )}
            </Card>
          </motion.div>
        )}

        {/* Dialog para crear nueva entrada */}
        <Dialog open={showEntryDialog} onOpenChange={setShowEntryDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {selectedDate?.toLocaleDateString('es-ES', { 
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long'
                })}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <h4 className="mb-4">¿Cómo te sentiste este día?</h4>
                
                <div className="grid grid-cols-3 gap-3 mb-4">
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
              </div>

              <div>
                <label className="block mb-2 text-sm">
                  Describe tu día (opcional)
                </label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="¿Qué pasó? ¿Qué te hizo sentir así?"
                  rows={4}
                  className="resize-none"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleSaveEntry}
                  className="flex-1 bg-primary hover:bg-primary/90"
                  disabled={!selectedEmotion}
                >
                  Guardar entrada
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCloseDialog}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

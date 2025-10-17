import { motion } from 'motion/react';
import { User, Mail, LogOut, Trash2, Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Storage } from '../utils/storage';
import { toast } from 'sonner@2.0.3';
import { useState } from 'react';

interface SettingsScreenProps {
  user: User;
  onLogout: () => void;
}

export function SettingsScreen({ user, onLogout }: SettingsScreenProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>(Storage.getTheme());

  const handleLogout = () => {
    Storage.clearCurrentUser();
    toast.success('Sesión cerrada correctamente');
    onLogout();
  };

  const handleClearChatHistory = () => {
    Storage.clearChatHistory();
    toast.success('Historial de chat borrado');
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    Storage.setTheme(newTheme);
    document.documentElement.classList.toggle('dark');
    toast.success(`Tema ${newTheme === 'dark' ? 'oscuro' : 'claro'} activado`);
  };

  return (
    <div className="h-full overflow-y-auto p-4 max-w-4xl mx-auto">
      <div className="mb-6">
        <h3 className="text-2xl mb-1">Configuración</h3>
        <p className="text-sm text-muted-foreground">Administra tu cuenta y preferencias</p>
      </div>

      <div className="space-y-4">
        {/* Perfil */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6">
            <h4 className="mb-4">Información de perfil</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Nombre</p>
                  <p>{user.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Correo</p>
                  <p>{user.email}</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Apariencia */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6">
            <h4 className="mb-4">Apariencia</h4>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {theme === 'light' ? (
                  <Sun className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <Moon className="w-5 h-5 text-muted-foreground" />
                )}
                <div>
                  <p>Tema de la aplicación</p>
                  <p className="text-sm text-muted-foreground">
                    {theme === 'light' ? 'Modo claro' : 'Modo oscuro'}
                  </p>
                </div>
              </div>
              <Button variant="outline" onClick={toggleTheme}>
                Cambiar
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Datos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <h4 className="mb-4">Gestión de datos</h4>
            <Button
              variant="outline"
              onClick={handleClearChatHistory}
              className="w-full justify-start gap-3"
            >
              <Trash2 className="w-5 h-5" />
              Borrar historial de chat
            </Button>
          </Card>
        </motion.div>

        {/* Sesión */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6">
            <h4 className="mb-4">Sesión</h4>
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="w-full justify-start gap-3"
            >
              <LogOut className="w-5 h-5" />
              Cerrar sesión
            </Button>
          </Card>
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6 bg-primary/5">
            <p className="text-sm text-muted-foreground text-center">
              Serena v1.0 • Aplicación de bienestar emocional
            </p>
            <p className="text-xs text-muted-foreground text-center mt-2">
              Desarrollada con 💜 para tu bienestar
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

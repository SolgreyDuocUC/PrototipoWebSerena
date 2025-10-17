import { useState } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Lock, CheckCircle, XCircle, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Validator, ValidationResult } from '../utils/validation';
import { Storage } from '../utils/storage';
import { toast } from 'sonner@2.0.3';

// Componente de icono de Google
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

interface RegisterProps {
  onRegister: (user: any) => void;
  onNavigateToLogin: () => void;
}

export function Register({ onRegister, onNavigateToLogin }: RegisterProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nameValidation, setNameValidation] = useState<ValidationResult>({ isValid: true });
  const [emailValidation, setEmailValidation] = useState<ValidationResult>({ isValid: true });
  const [passwordValidation, setPasswordValidation] = useState<ValidationResult>({ isValid: true });
  const [confirmValidation, setConfirmValidation] = useState<ValidationResult>({ isValid: true });
  const [isLoading, setIsLoading] = useState(false);

  const validateName = (value: string) => {
    const result = Validator.validateName(value);
    setNameValidation(result);
    return result.isValid;
  };

  const validateEmail = (value: string) => {
    const result = Validator.validateEmail(value);
    if (result.isValid && Storage.userExists(value)) {
      const errorResult = { isValid: false, error: 'Este correo ya está registrado' };
      setEmailValidation(errorResult);
      return false;
    }
    setEmailValidation(result);
    return result.isValid;
  };

  const validatePassword = (value: string) => {
    const result = Validator.validatePassword(value);
    setPasswordValidation(result);
    return result.isValid;
  };

  const validateConfirmPassword = (value: string) => {
    const result = Validator.validatePasswordMatch(password, value);
    setConfirmValidation(result);
    return result.isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const isNameValid = validateName(name);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmValid = validateConfirmPassword(confirmPassword);

    if (!isNameValid || !isEmailValid || !isPasswordValid || !isConfirmValid) {
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        createdAt: new Date().toISOString(),
      };

      Storage.addUser(newUser);
      Storage.setCurrentUser(newUser);
      toast.success('¡Cuenta creada exitosamente! 🎉');
      onRegister(newUser);
      setIsLoading(false);
    }, 800);
  };

  const handleGoogleRegister = () => {
    setIsLoading(true);
    
    // Simular registro con Google
    setTimeout(() => {
      const googleUser = {
        id: `google-${Date.now()}`,
        name: 'Usuario de Google',
        email: 'usuario@gmail.com',
        createdAt: new Date().toISOString(),
        authProvider: 'google' as const,
        photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
      };
      
      // Verificar si el usuario ya existe
      const existingUser = Storage.getUsers().find(u => u.email === googleUser.email);
      
      if (!existingUser) {
        Storage.addUser(googleUser);
      }
      
      const userToRegister = existingUser || googleUser;
      Storage.setCurrentUser(userToRegister);
      
      if (existingUser) {
        toast.success('¡Bienvenido de nuevo! 🌸');
      } else {
        toast.success('¡Cuenta creada exitosamente! 🎉');
      }
      
      onRegister(userToRegister);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-primary/5 via-secondary/10 to-accent/5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-card rounded-2xl shadow-xl p-8 border border-border">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-4"
            >
              <Sparkles className="w-8 h-8 text-accent" />
            </motion.div>
            <h2 className="text-3xl mb-2">Crear cuenta</h2>
            <p className="text-muted-foreground">Únete a Serena hoy</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (nameValidation.error) validateName(e.target.value);
                  }}
                  onBlur={() => validateName(name)}
                  className={`pl-10 pr-10 ${
                    nameValidation.isValid === false ? 'border-destructive' : 
                    name && nameValidation.isValid ? 'border-success' : ''
                  }`}
                  placeholder="Tu nombre"
                />
                {name && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {nameValidation.isValid ? (
                      <CheckCircle className="w-5 h-5 text-success" />
                    ) : (
                      <XCircle className="w-5 h-5 text-destructive" />
                    )}
                  </div>
                )}
              </div>
              {nameValidation.error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-destructive"
                >
                  {nameValidation.error}
                </motion.p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailValidation.error) validateEmail(e.target.value);
                  }}
                  onBlur={() => validateEmail(email)}
                  className={`pl-10 pr-10 ${
                    emailValidation.isValid === false ? 'border-destructive' : 
                    email && emailValidation.isValid ? 'border-success' : ''
                  }`}
                  placeholder="tu@email.com"
                />
                {email && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {emailValidation.isValid ? (
                      <CheckCircle className="w-5 h-5 text-success" />
                    ) : (
                      <XCircle className="w-5 h-5 text-destructive" />
                    )}
                  </div>
                )}
              </div>
              {emailValidation.error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-destructive"
                >
                  {emailValidation.error}
                </motion.p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordValidation.error) validatePassword(e.target.value);
                  }}
                  onBlur={() => validatePassword(password)}
                  className={`pl-10 pr-10 ${
                    passwordValidation.isValid === false ? 'border-destructive' : 
                    password && passwordValidation.isValid ? 'border-success' : ''
                  }`}
                  placeholder="Mínimo 6 caracteres"
                />
                {password && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {passwordValidation.isValid ? (
                      <CheckCircle className="w-5 h-5 text-success" />
                    ) : (
                      <XCircle className="w-5 h-5 text-destructive" />
                    )}
                  </div>
                )}
              </div>
              {passwordValidation.error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-destructive"
                >
                  {passwordValidation.error}
                </motion.p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (confirmValidation.error) validateConfirmPassword(e.target.value);
                  }}
                  onBlur={() => validateConfirmPassword(confirmPassword)}
                  className={`pl-10 pr-10 ${
                    confirmValidation.isValid === false ? 'border-destructive' : 
                    confirmPassword && confirmValidation.isValid ? 'border-success' : ''
                  }`}
                  placeholder="Repite tu contraseña"
                />
                {confirmPassword && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {confirmValidation.isValid ? (
                      <CheckCircle className="w-5 h-5 text-success" />
                    ) : (
                      <XCircle className="w-5 h-5 text-destructive" />
                    )}
                  </div>
                )}
              </div>
              {confirmValidation.error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-destructive"
                >
                  {confirmValidation.error}
                </motion.p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-accent hover:bg-accent/90"
              disabled={isLoading}
            >
              {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
            </Button>
          </form>

          <div className="mt-6 space-y-4">
            <div className="relative">
              <Separator className="my-4" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-card px-2 text-xs text-muted-foreground">
                  O regístrate con
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleRegister}
              disabled={isLoading}
              className="w-full gap-2"
            >
              <GoogleIcon />
              Continuar con Google
            </Button>

            <div className="text-center border-t border-border pt-4">
              <p className="text-sm text-muted-foreground mb-2">
                ¿Ya tienes cuenta?
              </p>
              <Button
                variant="outline"
                onClick={onNavigateToLogin}
                className="w-full"
              >
                Iniciar sesión
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

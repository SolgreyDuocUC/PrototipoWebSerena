/**
 * Módulo centralizado de validación
 * Desacoplado de la interfaz para mantener código limpio y reutilizable
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export class Validator {
  // Validación de email
  static validateEmail(email: string): ValidationResult {
    if (!email) {
      return { isValid: false, error: 'El correo es obligatorio' };
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, error: 'Formato de correo inválido' };
    }
    
    return { isValid: true };
  }

  // Validación de contraseña
  static validatePassword(password: string): ValidationResult {
    if (!password) {
      return { isValid: false, error: 'La contraseña es obligatoria' };
    }
    
    if (password.length < 6) {
      return { isValid: false, error: 'Mínimo 6 caracteres' };
    }
    
    return { isValid: true };
  }

  // Validación de confirmación de contraseña
  static validatePasswordMatch(password: string, confirmPassword: string): ValidationResult {
    if (password !== confirmPassword) {
      return { isValid: false, error: 'Las contraseñas no coinciden' };
    }
    
    return { isValid: true };
  }

  // Validación de nombre
  static validateName(name: string): ValidationResult {
    if (!name) {
      return { isValid: false, error: 'El nombre es obligatorio' };
    }
    
    if (name.length < 2) {
      return { isValid: false, error: 'Mínimo 2 caracteres' };
    }
    
    return { isValid: true };
  }

  // Validación de campo requerido
  static validateRequired(value: string, fieldName: string = 'Campo'): ValidationResult {
    if (!value || value.trim().length === 0) {
      return { isValid: false, error: `${fieldName} es obligatorio` };
    }
    
    return { isValid: true };
  }
}

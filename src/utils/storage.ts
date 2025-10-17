/**
 * Módulo de persistencia local
 * Maneja el almacenamiento de datos en localStorage
 */

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  authProvider?: 'email' | 'google';
  photoURL?: string;
}

export interface EmotionEntry {
  id: string;
  userId: string;
  date: string;
  emotion: string;
  description: string;
  emoji: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'serena';
  message: string;
  timestamp: string;
}

export class Storage {
  // Usuario autenticado
  static setCurrentUser(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  static getCurrentUser(): User | null {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  static clearCurrentUser(): void {
    localStorage.removeItem('currentUser');
  }

  // Usuarios registrados
  static getUsers(): User[] {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  }

  static addUser(user: User): void {
    const users = this.getUsers();
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
  }

  static userExists(email: string): boolean {
    const users = this.getUsers();
    return users.some(u => u.email.toLowerCase() === email.toLowerCase());
  }

  static findUser(email: string, password: string): User | null {
    const users = this.getUsers();
    // En producción, la contraseña debería estar hasheada
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    return user || null;
  }

  // Entradas emocionales
  static getEmotions(): EmotionEntry[] {
    const emotions = localStorage.getItem('emotions');
    return emotions ? JSON.parse(emotions) : [];
  }

  static addEmotion(emotion: EmotionEntry): void {
    const emotions = this.getEmotions();
    emotions.unshift(emotion);
    localStorage.setItem('emotions', JSON.stringify(emotions));
  }

  static getUserEmotions(userId: string): EmotionEntry[] {
    return this.getEmotions().filter(e => e.userId === userId);
  }

  // Historial de chat
  static getChatHistory(): ChatMessage[] {
    const chat = localStorage.getItem('chatHistory');
    return chat ? JSON.parse(chat) : [];
  }

  static addChatMessage(message: ChatMessage): void {
    const history = this.getChatHistory();
    history.push(message);
    localStorage.setItem('chatHistory', JSON.stringify(history));
  }

  static clearChatHistory(): void {
    localStorage.setItem('chatHistory', JSON.stringify([]));
  }

  // Preferencias
  static getTheme(): 'light' | 'dark' {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
  }

  static setTheme(theme: 'light' | 'dark'): void {
    localStorage.setItem('theme', theme);
  }
}

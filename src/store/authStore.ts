import { create } from 'zustand';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
}

// Helper to load users from localStorage
function getStoredUsers(): Array<{ name: string; email: string; password: string }> {
  const raw = localStorage.getItem('registered_users');
  return raw ? JSON.parse(raw) : [];
}

// Helper to save users to localStorage
function saveUsers(users: Array<{ name: string; email: string; password: string }>) {
  localStorage.setItem('registered_users', JSON.stringify(users));
}

export const useAuthStore = create<AuthState>((set) => {
  // Restore session on app load
  const savedUser = localStorage.getItem('current_user');
  const initialUser: User | null = savedUser ? JSON.parse(savedUser) : null;

  return {
    user: initialUser,
    isAuthenticated: !!initialUser,

    login: (email: string, password: string) => {
      const users = getStoredUsers();
      const found = users.find(u => u.email === email && u.password === password);

      if (found) {
        const user: User = {
          id: Date.now().toString(),
          name: found.name,
          email: found.email,
        };
        localStorage.setItem('current_user', JSON.stringify(user));
        set({ user, isAuthenticated: true });
        return true;
      }
      return false;
    },

    register: (name: string, email: string, password: string) => {
      const users = getStoredUsers();
      const exists = users.find(u => u.email === email);

      if (exists) return false;

      users.push({ name, email, password });
      saveUsers(users);

      const user: User = {
        id: Date.now().toString(),
        name,
        email,
      };
      localStorage.setItem('current_user', JSON.stringify(user));
      set({ user, isAuthenticated: true });
      return true;
    },

    logout: () => {
      localStorage.removeItem('current_user');
      set({ user: null, isAuthenticated: false });
    },
  };
});

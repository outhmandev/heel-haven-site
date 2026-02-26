import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { API_BASE_URL } from '@/lib/api';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  phone?: string;
  address?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_KEY = 'shoestore_users';
const CURRENT_USER_KEY = 'shoestore_current_user';

const defaultUsers: (User & { password: string })[] = [
  { id: 'admin-1', email: 'admin@shoestore.com', password: 'admin123', name: 'Admin', role: 'admin' },
];

function getUsers(): (User & { password: string })[] {
  const stored = localStorage.getItem(USERS_KEY);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
  return defaultUsers;
}

function saveUsers(users: (User & { password: string })[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem(CURRENT_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(CURRENT_USER_KEY);
  }, [user]);



  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const resp = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!resp.ok) return false;
      const userData = await resp.json();
      setUser(userData);
      return true;
    } catch {
      return false;
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      const newUser = { id: crypto.randomUUID(), email, password, name };
      const resp = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
      if (!resp.ok) return false;

      const { password: _, ...userData } = { ...newUser, role: 'user' as const };
      setUser(userData);
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => setUser(null);

  const updateProfile = (data: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    const users = getUsers();
    const idx = users.findIndex(u => u.id === user.id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...data };
      saveUsers(users);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

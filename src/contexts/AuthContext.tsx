import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
  login: (email: string, password: string) => boolean;
  register: (email: string, password: string, name: string) => boolean;
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

  const login = (email: string, password: string): boolean => {
    const users = getUsers();
    const found = users.find(u => u.email === email && u.password === password);
    if (found) {
      const { password: _, ...userData } = found;
      setUser(userData);
      return true;
    }
    return false;
  };

  const register = (email: string, password: string, name: string): boolean => {
    const users = getUsers();
    if (users.find(u => u.email === email)) return false;
    const newUser = { id: crypto.randomUUID(), email, password, name, role: 'user' as const };
    users.push(newUser);
    saveUsers(users);
    const { password: _, ...userData } = newUser;
    setUser(userData);
    return true;
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

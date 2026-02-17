import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { login, register, user } = useAuth();
  const navigate = useNavigate();

  if (user) { navigate('/profile'); return null; }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      const ok = login(email, password);
      if (ok) { toast.success('Welcome back!'); navigate('/'); }
      else toast.error('Invalid credentials');
    } else {
      if (!name) { toast.error('Please enter your name'); return; }
      const ok = register(email, password, name);
      if (ok) { toast.success('Account created!'); navigate('/'); }
      else toast.error('Email already exists');
    }
  };

  return (
    <div className="container py-16 max-w-sm mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
        <p className="text-muted-foreground text-sm">
          {isLogin ? 'Sign in to your account' : 'Join ShoeStore today'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" value={name} onChange={e => setName(e.target.value)} required />
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <Button type="submit" className="w-full">{isLogin ? 'Sign In' : 'Create Account'}</Button>
      </form>

      <div className="text-center">
        <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-muted-foreground hover:text-foreground underline">
          {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
        </button>
      </div>



    </div>
  );
}

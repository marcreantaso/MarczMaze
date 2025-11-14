
import React, { useState } from 'react';
import { KeyIcon, AtSymbolIcon, UserPlusIcon } from './icons/Icons';
import { User, PlayerStats } from '../types';

interface LoginProps {
  onLogin: (email: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
  };

  const toggleMode = () => {
    setMode(mode === 'signIn' ? 'signUp' : 'signIn');
    resetForm();
  };

  const db = {
    getUsers: (): Record<string, User> => {
      const users = localStorage.getItem('marcz_maze_users');
      return users ? JSON.parse(users) : {};
    },
    saveUser: (user: User) => {
      const users = db.getUsers();
      users[user.email] = user;
      localStorage.setItem('marcz_maze_users', JSON.stringify(users));
    },
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (mode === 'signUp') {
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }

      const users = db.getUsers();
      if (users[email]) {
        setError('An account with this email already exists.');
        return;
      }

      const initialStats: PlayerStats = {
        level: 1,
        totalPoints: 0,
        marczBalance: 0,
        fastestTime: null,
      };

      const newUser: User = { email, password, stats: initialStats };
      db.saveUser(newUser);
      onLogin(email);
    } else { // signIn mode
      const users = db.getUsers();
      const user = users[email];
      if (!user || user.password !== password) {
        setError('Invalid email or password.');
        return;
      }
      onLogin(email);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4 bg-grid-cyan-500/[0.05]">
      <div className="w-full max-w-md bg-slate-800/50 backdrop-blur-sm rounded-lg border border-cyan-500/20 shadow-2xl shadow-cyan-500/10 p-8">
        <div className="text-center mb-8">
          <h1 className="font-orbitron text-4xl font-bold text-glow-cyan">MARCZ MAZE</h1>
          <p className="text-cyan-200 mt-2">{mode === 'signIn' ? 'Enter the Cyber-Ruin. Claim your fortune.' : 'Create your Runner profile.'}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-cyan-300 mb-2">Email Address</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><AtSymbolIcon className="h-5 w-5 text-cyan-400" /></div>
              <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-md border-0 bg-slate-700/50 py-2.5 pl-10 text-white shadow-sm ring-1 ring-inset ring-cyan-500/30 focus:ring-2 focus:ring-inset focus:ring-fuchsia-500 sm:text-sm sm:leading-6 transition-all"
                placeholder="runner@protocol.io"
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-cyan-300 mb-2">Password</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><KeyIcon className="h-5 w-5 text-cyan-400" /></div>
              <input id="password" name="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-md border-0 bg-slate-700/50 py-2.5 pl-10 text-white shadow-sm ring-1 ring-inset ring-cyan-500/30 focus:ring-2 focus:ring-inset focus:ring-fuchsia-500 sm:text-sm sm:leading-6 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          {mode === 'signUp' && (
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-cyan-300 mb-2">Confirm Password</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><KeyIcon className="h-5 w-5 text-cyan-400" /></div>
                <input id="confirm-password" name="confirm-password" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full rounded-md border-0 bg-slate-700/50 py-2.5 pl-10 text-white shadow-sm ring-1 ring-inset ring-cyan-500/30 focus:ring-2 focus:ring-inset focus:ring-fuchsia-500 sm:text-sm sm:leading-6 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>
          )}

          {error && <p className="text-sm text-red-400 text-center">{error}</p>}

          <div>
            <button type="submit" className="flex w-full justify-center rounded-md bg-cyan-600 px-3 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 transition-all transform hover:scale-105 neon-glow-cyan">
              {mode === 'signIn' ? <><KeyIcon className="h-5 w-5 mr-2" /> Sign In</> : <><UserPlusIcon className="h-5 w-5 mr-2" /> Create Account</>}
            </button>
          </div>
        </form>
        <p className="mt-8 text-center text-sm text-slate-400">
          {mode === 'signIn' ? "Don't have an account?" : "Already have an account?"}{' '}
          <button onClick={toggleMode} className="font-semibold text-cyan-400 hover:text-cyan-300">
            {mode === 'signIn' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;

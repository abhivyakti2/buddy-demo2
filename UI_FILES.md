# UI Files — Complete Replication Guide

## Installation

This project uses a React + TypeScript + Vite setup. Install the following dependencies in your React project:

```bash
npm install react-router-dom framer-motion lucide-react @reduxjs/toolkit react-redux @supabase/supabase-js
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### tailwind.config.js

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

### postcss.config.js

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

## File Structure

```
src/
├── index.css
├── main.tsx
├── App.tsx
├── styles/
│   └── magical.css
├── components/
│   ├── auth/
│   │   ├── AuthProvider.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── Login.tsx
│   │   └── Signup.tsx
│   ├── HomePage.tsx
│   ├── PreferencesForm.tsx
│   ├── RoomSelection.tsx
│   ├── CreateRoomForm.tsx
│   ├── RoomPage.tsx
│   └── VotingPage.tsx
├── store/
│   ├── store.ts
│   ├── hooks.ts
│   ├── authSlice.ts
│   ├── preferencesSlice.ts
│   ├── roomsSlice.ts
│   ├── votesSlice.ts
│   ├── recommendationsSlice.ts
│   └── socketSlice.ts
├── lib/
│   ├── repositories.ts
│   ├── tempStorage.ts
│   ├── supabase.ts
│   └── socket.ts
└── types/
    └── database.ts
```

---

## Files

### `src/index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### `src/styles/magical.css`

```css
.magical-bg {
  background: linear-gradient(135deg, #cd5c5c 0%, #000080 50%, #cd5c5c 100%);

  background-attachment: fixed;
  position: relative;
  overflow-x: hidden;
}

.stars, .twinkling {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  display: block;
  pointer-events: none;
  z-index: -1;
}

.stars {
  background-image:
    radial-gradient(2px 2px at 20px 30px, rgba(255, 182, 193, 0.8), transparent),
    radial-gradient(2px 2px at 40px 70px, rgba(255, 110, 199, 0.6), transparent),
    radial-gradient(1px 1px at 90px 40px, rgba(192, 132, 252, 0.7), transparent),
    radial-gradient(1px 1px at 130px 80px, rgba(255, 255, 154, 0.5), transparent),
    radial-gradient(2px 2px at 160px 30px, rgba(255, 182, 193, 0.6), transparent);
  background-repeat: repeat;
  background-size: 200px 100px;
  animation: sparkle 20s linear infinite;
}

.twinkling {
  background: transparent url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="1" fill="rgba(255,110,199,0.8)"/><circle cx="80" cy="80" r="1" fill="rgba(192,132,252,0.6)"/><circle cx="40" cy="60" r="1" fill="rgba(255,255,154,0.7)"/></svg>') repeat top center;
  animation: move-twink-back 200s linear infinite;
}

@keyframes sparkle {
  from { transform: translateX(0px); }
  to { transform: translateX(-200px); }
}

@keyframes move-twink-back {
  from { background-position: 0 0; }
  to { background-position: -10000px 5000px; }
}

.glass-card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(255, 182, 193, 0.2);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.3),
    0 0 40px rgba(255, 182, 193, 0.1),
    inset 0 1px 0 rgba(255, 182, 193, 0.15);
  position: relative;
  overflow: hidden;
}

.glass-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 182, 193, 0.1), transparent);
  animation: shimmer 3s infinite;
  pointer-events: none;
}

@keyframes shimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}

.magical-text {
  background: linear-gradient(45deg, #ffff9a, #ff6ec7, #c084fc, #fbbf24);
  background-size: 400% 400%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: magical-gradient 8s ease infinite;
  filter: drop-shadow(0 0 8px rgba(255, 110, 199, 0.4)) drop-shadow(0 0 12px rgba(192, 132, 252, 0.3));
}

@keyframes magical-gradient {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.magical-button {
  background: linear-gradient(45deg, #ff6ec7, #c084fc, #60a5fa);
  background-size: 400% 400%;
  border: none;
  border-radius: 16px;
  padding: 12px 24px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow:
    0 4px 15px rgba(255, 110, 199, 0.3),
    0 0 20px rgba(192, 132, 252, 0.2);
  animation: magical-gradient 3s ease infinite;
  white-space: nowrap;
}

.magical-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s;
}

.magical-button:hover::before {
  left: 100%;
}

.magical-button:hover {
  transform: translateY(-2px);
  box-shadow:
    0 8px 25px rgba(255, 110, 199, 0.4),
    0 0 30px rgba(192, 132, 252, 0.3);
}

.magical-button-secondary {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 12px 24px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}

.magical-button-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 255, 255, 0.1);
}

.magical-button-danger {
  background: linear-gradient(45deg, #ff6b6b, #ee5a6f);
  border: none;
  border-radius: 16px;
  padding: 12px 24px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}

.magical-button-large {
  background: linear-gradient(45deg, #ff6ec7, #c084fc, #60a5fa);
  background-size: 400% 400%;
  border: none;
  border-radius: 20px;
  padding: 16px 32px;
  color: white;
  font-weight: 700;
  font-size: 1.2rem;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow:
    0 8px 30px rgba(255, 110, 199, 0.4),
    0 0 40px rgba(192, 132, 252, 0.3);
  animation: magical-gradient 3s ease infinite;
}

.magical-icon-button {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.magical-icon-button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.2);
}

.magical-input {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 16px 20px;
  width: 100%;
  color: white;
  font-size: 16px;
  transition: all 0.3s ease;
  outline: none;
}

.magical-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.magical-input:focus {
  border-color: #ff6ec7;
  box-shadow:
    0 0 0 3px rgba(255, 110, 199, 0.3),
    0 0 20px rgba(255, 110, 199, 0.2);
  background: rgba(255, 255, 255, 0.15);
}

.input-group {
  position: relative;
}

.magical-room-button {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 32px 24px;
  color: white;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.4s ease;
  text-align: center;
}

.magical-room-button:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 110, 199, 0.5);
  transform: translateY(-8px);
  box-shadow:
    0 20px 40px rgba(255, 110, 199, 0.2),
    0 0 60px rgba(192, 132, 252, 0.1);
}

.sparkle-icon {
  display: inline-flex;
  padding: 16px;
  background: linear-gradient(45deg, #ff6ec7, #c084fc);
  border-radius: 50%;
  margin-bottom: 16px;
  color: white;
  box-shadow: 0 8px 20px rgba(255, 110, 199, 0.3);
}

.floating-hearts {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.heart-1, .heart-2, .heart-3 {
  position: absolute;
  color: rgba(255, 182, 193, 0.6);
}

.heart-1 {
  top: 20%;
  left: 10%;
  animation: float 3s infinite;
}

.heart-2 {
  top: 60%;
  right: 15%;
  animation: float 3s infinite 1s;
}

.heart-3 {
  top: 40%;
  right: 80%;
  animation: float 3s infinite 0.5s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(10deg); }
}

.progress-step {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  position: relative;
  transition: all 0.3s ease;
}

.progress-step.active {
  background: linear-gradient(45deg, #ff6ec7, #c084fc);
  border-color: transparent;
  box-shadow: 0 0 20px rgba(255, 110, 199, 0.5);
}

.step-sparkle {
  position: absolute;
  top: -8px;
  right: -8px;
  color: #fbbf24;
  animation: sparkle-pulse 1.5s infinite;
}

@keyframes sparkle-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.3); opacity: 0.7; }
}

.progress-bar {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
  margin-top: 16px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #ff6ec7, #c084fc, #60a5fa);
  border-radius: 2px;
  transition: width 0.5s ease;
}

.option-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 24px;
  text-align: center;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.option-card:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(255, 110, 199, 0.2);
}

.option-card.selected {
  background: rgba(255, 110, 199, 0.2);
  border-color: #ff6ec7;
  box-shadow:
    0 0 0 3px rgba(255, 110, 199, 0.3),
    0 8px 25px rgba(255, 110, 199, 0.3);
}

.option-card.selected::before {
  content: '✨';
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 20px;
  animation: sparkle-pulse 1s infinite;
}

.magical-header {
  background: linear-gradient(135deg, rgba(255, 110, 199, 0.15), rgba(192, 132, 252, 0.15), rgba(15, 15, 35, 0.8));
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 182, 193, 0.2);
  padding: 16px 0;
}

.participant-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 16px;
  transition: all 0.3s ease;
  position: relative;
}

.participant-card.online {
  border-color: rgba(34, 197, 94, 0.3);
}

.participant-card.offline {
  opacity: 0.6;
}

.participant-avatar {
  position: relative;
  width: 48px;
  height: 48px;
  background: linear-gradient(45deg, #ff6ec7, #c084fc);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.online-indicator {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  background: #22c55e;
  border: 2px solid white;
  border-radius: 50%;
}

.vote-button {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 16px 24px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  font-size: 18px;
  font-weight: 600;
}

.vote-button.voted {
  background: linear-gradient(45deg, #ff6ec7, #ec4899);
  border-color: transparent;
  box-shadow: 0 0 30px rgba(255, 110, 199, 0.5);
  animation: heartbeat 1.5s infinite;
}

@keyframes heartbeat {
  0%, 50%, 100% { transform: scale(1); }
  25%, 75% { transform: scale(1.05); }
}

.parameter-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.parameter-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, #ff6ec7, #c084fc, #60a5fa);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.parameter-card:hover::before {
  opacity: 1;
}

.parameter-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(45deg, #ff6ec7, #c084fc);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.parameter-score {
  display: flex;
  align-items: center;
  gap: 12px;
}

.score-bar {
  flex: 1;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.score-fill {
  height: 100%;
  background: linear-gradient(90deg, #ff6ec7, #c084fc, #60a5fa);
  border-radius: 4px;
  transition: width 1s ease;
}

.score-text {
  color: white;
  font-weight: 600;
  font-size: 14px;
  min-width: 40px;
  text-align: right;
}

.voting-active-indicator {
  padding: 32px;
  text-align: center;
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(45deg, #ff6ec7, #c084fc);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(45deg, #ec4899, #a855f7);
}

@media (max-width: 768px) {
  .glass-card {
    margin: 16px;
    padding: 24px 20px;
  }

  .magical-room-button {
    padding: 24px 20px;
  }

  .parameter-card {
    padding: 16px;
  }

  .magical-header {
    padding: 12px 0;
  }

  .magical-button, .magical-button-secondary, .magical-button-danger {
    font-size: 14px;
    padding: 8px 12px;
  }

  .magical-header .container > div:last-child {
    justify-content: flex-start;
    overflow-x: auto;
    padding-bottom: 4px;
  }
}

@keyframes rainbow-spin {
  0% { border-top-color: #ff6ec7; transform: rotate(0deg); }
  25% { border-top-color: #c084fc; }
  50% { border-top-color: #60a5fa; }
  75% { border-top-color: #34d399; }
  100% { border-top-color: #ff6ec7; transform: rotate(360deg); }
}

.rainbow-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: rainbow-spin 1.5s linear infinite;
}
```

### `src/main.tsx`

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

### `src/App.tsx`

```tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import AuthProvider from './components/auth/AuthProvider';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import PreferencesForm from './components/PreferencesForm';
import RoomSelection from './components/RoomSelection';
import CreateRoomForm from './components/CreateRoomForm';
import RoomPage from './components/RoomPage';
import VotingPage from './components/VotingPage';
import './styles/magical.css';

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen magical-bg">
            <div className="stars"></div>
            <div className="twinkling"></div>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/preferences"
                element={
                  <ProtectedRoute>
                    <PreferencesForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/room-selection"
                element={
                  <ProtectedRoute>
                    <RoomSelection />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-room"
                element={
                  <ProtectedRoute>
                    <CreateRoomForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/room/:id"
                element={
                  <ProtectedRoute>
                    <RoomPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/room/:id/voting"
                element={
                  <ProtectedRoute>
                    <VotingPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </Provider>
  );
}

export default App;
```

### `src/components/auth/AuthProvider.tsx`

```tsx
import { useEffect, useState } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { setUser, setSession, setLoading } from '../../store/authSlice';
import { motion } from 'framer-motion';
import { authRepository } from '../../lib/repositories';

type AuthProviderProps = {
  children: React.ReactNode;
};

function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useAppDispatch();
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {

















    authRepository.getSession().then(({ data: { session } }) => {


      dispatch(setSession(session));
      dispatch(setUser(session?.user ?? null));
      dispatch(setLoading(false));
      setInitializing(false);
    });




















    const {
      data: { subscription },
    } = authRepository.onAuthStateChange((_event: any, session: any) => {

      dispatch(setSession(session));
      dispatch(setUser(session?.user ?? null));
      dispatch(setLoading(false));
    });

    return () => subscription.unsubscribe();
  }, [dispatch]);

  if (initializing) {
    return (
      <div className="min-h-screen magical-bg flex items-center justify-center">
        <div className="stars"></div>
        <div className="twinkling"></div>
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="text-6xl"
        >
          ✨
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}

export default AuthProvider;
```

### `src/components/auth/ProtectedRoute.tsx`

```tsx
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';

type ProtectedRouteProps = {
  children: React.ReactNode;
};

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAppSelector((state) => state.auth);

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
```

### `src/components/auth/Login.tsx`

```tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Star, Loader2 } from 'lucide-react';
import { useAppDispatch } from '../../store/hooks';
import { setUser, setError as setAuthError } from '../../store/authSlice';
import { authRepository } from '../../lib/repositories';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {


















      const { data, error: signInError } = await authRepository.signIn(email, password);




      if (signInError) throw signInError;

      if (data.user) {









        dispatch(setUser(data.user as any));
        navigate('/room-selection');
      }
    } catch (err: any) {



      setError(err.message || 'Failed to login');
      dispatch(setAuthError(err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="glass-card w-full max-w-md p-8 text-center relative"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold magical-text mb-2">
            VoteSpace
          </h1>
          <p className="text-lg text-white/80">
            Where dreams meet decisions
          </p>
        </motion.div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm"
            >
              {error}
            </motion.div>
          )}

          <div className="space-y-4">
            <div className="input-group">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="magical-input"
                required
                disabled={loading}
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="magical-input"
                required
                disabled={loading}
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: loading ? 1 : 1.05 }}
            whileTap={{ scale: loading ? 1 : 0.95 }}
            type="submit"
            disabled={loading}
            className="magical-button w-full py-3 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  <Heart size={20} />
                  Enter the Magic
                  <Star size={20} />
                </>
              )}
            </span>
          </motion.button>
        </form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-white/60"
        >
          <p className="text-sm">
            New to magic?{' '}
            <Link to="/signup" className="text-pink-300 hover:text-pink-200 font-semibold">
              Create an account
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
```

### `src/components/auth/Signup.tsx`

```tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, CheckCircle } from 'lucide-react';
import { useAppDispatch } from '../../store/hooks';
import { setUser } from '../../store/authSlice';
import { authRepository } from '../../lib/repositories';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {




















      const { data, error: signUpError } = await authRepository.signUp(email, password);




      if (signUpError) throw signUpError;

      if (data.user) {









        dispatch(setUser(data.user as any));
        setSuccess(true);
        setTimeout(() => {
          navigate('/preferences');
        }, 2000);
      }
    } catch (err: any) {



      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="glass-card w-full max-w-md p-8 text-center relative"
      >
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-4 -right-4 text-pink-300"
        >
          <Sparkles size={32} />
        </motion.div>

        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold magical-text mb-2">
            Join VoteSpace
          </h1>
          <p className="text-lg text-white/80">
            Start your magical journey
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="py-12"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-green-400 mb-4 flex justify-center"
              >
                <CheckCircle size={64} />
              </motion.div>
              <h2 className="text-2xl font-bold magical-text mb-2">
                Account Created!
              </h2>
              <p className="text-white/80">
                Redirecting to preferences...
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSignup} className="space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm"
                >
                  {error}
                </motion.div>
              )}

              <div className="space-y-4">
                <div className="input-group">
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="magical-input"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="input-group">
                  <input
                    type="password"
                    placeholder="Password (min 6 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="magical-input"
                    required
                    disabled={loading}
                    minLength={6}
                  />
                </div>

                <div className="input-group">
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="magical-input"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: loading ? 1 : 1.05 }}
                whileTap={{ scale: loading ? 1 : 0.95 }}
                type="submit"
                disabled={loading}
                className="magical-button w-full py-3 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} />
                      Create Magic Account
                    </>
                  )}
                </span>
              </motion.button>
            </form>
          )}
        </AnimatePresence>

        {!success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-white/60"
          >
            <p className="text-sm">
              Already have an account?{' '}
              <Link to="/" className="text-pink-300 hover:text-pink-200 font-semibold">
                Login here
              </Link>
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Signup;
```

### `src/components/HomePage.tsx`

```tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Star } from 'lucide-react';

const HomePage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleSignin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && email && password) {
      navigate('/preferences');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="glass-card w-full max-w-md p-8 text-center relative"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] , rotate: 0}}
          transition={{ duration: 2, repeat: Infinity }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold magical-text mb-2">
            ✨ Buddies day out ✨
          </h1>
          <p className="text-base text-white/80">
            End the ‘idk where to go’ texts forever✨
          </p>
        </motion.div>

        <form onSubmit={handleSignin} className="space-y-6">
          <div className="space-y-4">
            <div className="input-group">
              <input
                type="text"
                placeholder="👤 Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="magical-input"
                required
              />
            </div>

            <div className="input-group">
              <input
                type="email"
                placeholder="✉️ Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="magical-input"
                required
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                placeholder="🔒 Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="magical-input"
                required
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="magical-button w-full py-3 font-semibold text-lg"
          >
            <span className="flex items-center justify-center gap-2">
              <Heart size={20} />
              Enter the Magic
              <Star size={20} />
            </span>
          </motion.button>
        </form>

        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="mt-8 text-white/60"
        >
          <p className="text-sm">Can’t decide where to go? Let your friends vote it out✨</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HomePage;
```

### `src/components/PreferencesForm.tsx`

```tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setUserPreferences } from '../store/preferencesSlice';
import { preferencesRepository } from '../lib/repositories';

const PreferencesForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();







  const { user } = useAppSelector((state) => state.auth);















  const [currentStep, setCurrentStep] = useState(1);














  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');





















  const [formData, setFormData] = useState({
    activities: [] as string[],
    customActivity: '',
    foodCategories: [] as string[],
    foodRestrictions: '',
    transport: [] as string[],
    homeAddress: '',
  });

  const totalSteps = 3;


  const activityOptions = [
    { value: 'restaurants', label: 'Dining', emoji: '🍽️' },
    { value: 'entertainment', label: 'Entertainment', emoji: '🎬' },
    { value: 'outdoor', label: 'Outdoor', emoji: '🌳' },
    { value: 'culture', label: 'Culture', emoji: '🎨' },
    { value: 'shopping', label: 'Shopping', emoji: '🛍️' },
    { value: 'nightlife', label: 'Nightlife', emoji: '🌙' },
    { value: 'sports', label: 'Sports', emoji: '⚽' },
    { value: 'wellness', label: 'Wellness', emoji: '🧘' },
  ];

  const foodOptions = [
    { value: 'italian', label: 'Italian', emoji: '🍝' },
    { value: 'chinese', label: 'Chinese', emoji: '🥡' },
    { value: 'indian', label: 'Indian', emoji: '🍛' },
    { value: 'mexican', label: 'Mexican', emoji: '🌮' },
    { value: 'japanese', label: 'Japanese', emoji: '🍱' },
    { value: 'american', label: 'American', emoji: '🍔' },
    { value: 'mediterranean', label: 'Mediterranean', emoji: '🥙' },
    { value: 'thai', label: 'Thai', emoji: '🍜' },
    { value: 'vegetarian', label: 'Vegetarian', emoji: '🥗' },
    { value: 'vegan', label: 'Vegan', emoji: '🌱' },
  ];

  const transportOptions = [
    { value: 'metro', label: 'Metro', emoji: '🚇' },
    { value: 'bus', label: 'Bus', emoji: '🚌' },
    { value: 'auto', label: 'Auto', emoji: '🛺' },
    { value: 'taxi', label: 'Taxi', emoji: '🚕' },
    { value: 'bike', label: 'Bike', emoji: '🚲' },
    { value: 'walk', label: 'Walk', emoji: '🚶' },
    { value: 'car', label: 'Car', emoji: '🚗' },
  ];

  const steps = [
    {
      title: 'Activities of Interest',
      description: 'What do you enjoy doing?',
    },
    {
      title: 'Food Preferences',
      description: 'What cuisines do you like?',
    },
    {
      title: 'Transport & Location',
      description: 'How do you prefer to travel?',
    },
  ];







  const handleActivityToggle = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      activities: prev.activities.includes(value)
        ? prev.activities.filter((a) => a !== value)
        : [...prev.activities, value],
    }));
  };






  const handleFoodToggle = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      foodCategories: prev.foodCategories.includes(value)
        ? prev.foodCategories.filter((f) => f !== value)
        : [...prev.foodCategories, value],
    }));
  };






  const handleTransportToggle = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      transport: prev.transport.includes(value)
        ? prev.transport.filter((t) => t !== value)
        : [...prev.transport, value],
    }));
  };







  const isStepComplete = () => {
    switch (currentStep) {
      case 1:
        return formData.activities.length > 0;
      case 2:
        return formData.foodCategories.length > 0;
      case 3:
        return formData.transport.length > 0;
      default:
        return false;
    }
  };







  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };






  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };




  const handleSubmit = async () => {
    if (!user) return;


    setLoading(true);
    setError('');

    try {

      const allActivities = formData.customActivity.trim()
        ? [...formData.activities, formData.customActivity.trim()]
        : formData.activities;

      const preferences = {
        user_id: user.id,
        activities: allActivities,
        food_preferences: {
          categories: formData.foodCategories,
          restrictions: formData.foodRestrictions,
        },
        transport_preferences: formData.transport,
        home_address: formData.homeAddress,
      };





















      const { error: upsertError } = await preferencesRepository.save(user.id, preferences);


      if (upsertError) throw upsertError;


























      dispatch(setUserPreferences(preferences));





















      navigate('/room-selection');

    } catch (err: any) {


      setError(err.message || 'Failed to save preferences');
    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card w-full max-w-2xl p-8"
      >
        {}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <motion.div
                key={index}
                className={`progress-step ${index + 1 <= currentStep ? 'active' : ''}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                {index + 1 <= currentStep && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="step-sparkle"
                  >
                    <Sparkles size={16} />
                  </motion.div>
                )}
                <span>{index + 1}</span>
              </motion.div>
            ))}
          </div>
          <div className="progress-bar">
            <motion.div
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm mb-6"
          >
            {error}
          </motion.div>
        )}

        {}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-3xl font-bold magical-text text-center mb-2">
              {steps[currentStep - 1].title}
            </h2>
            <p className="text-white/70 text-center mb-12">
              {steps[currentStep - 1].description}
            </p>

            {}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {activityOptions.map((option) => (
                    <motion.button
                      key={option.value}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleActivityToggle(option.value)}
                      className={`option-card ${
                        formData.activities.includes(option.value) ? 'selected' : ''
                      }`}
                    >
                      <span className="text-2xl mb-2 block">{option.emoji}</span>
                      <span className="font-semibold text-sm">{option.label}</span>
                    </motion.button>
                  ))}
                </div>

                {}
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="Add custom activity"
                    value={formData.customActivity}
                    onChange={(e) =>
                      setFormData({ ...formData, customActivity: e.target.value })
                    }
                    className="magical-input"
                  />
                </div>
              </div>
            )}

            {}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {foodOptions.map((option) => (
                    <motion.button
                      key={option.value}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleFoodToggle(option.value)}
                      className={`option-card ${
                        formData.foodCategories.includes(option.value) ? 'selected' : ''
                      }`}
                    >
                      <span className="text-2xl mb-2 block">{option.emoji}</span>
                      <span className="font-semibold text-sm">{option.label}</span>
                    </motion.button>
                  ))}
                </div>

                {}
                <div className="input-group">
                  <textarea
                    placeholder="Dietary restrictions or preferences (e.g., gluten-free, no nuts)"
                    value={formData.foodRestrictions}
                    onChange={(e) =>
                      setFormData({ ...formData, foodRestrictions: e.target.value })
                    }
                    className="magical-input min-h-24 resize-none"
                  />
                </div>
              </div>
            )}

            {}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {transportOptions.map((option) => (
                    <motion.button
                      key={option.value}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleTransportToggle(option.value)}
                      className={`option-card ${
                        formData.transport.includes(option.value) ? 'selected' : ''
                      }`}
                    >
                      <span className="text-2xl mb-2 block">{option.emoji}</span>
                      <span className="font-semibold text-sm">{option.label}</span>
                    </motion.button>
                  ))}
                </div>

                {}
                <div className="input-group">
                  <textarea
                    placeholder="Home address (helps us recommend nearby places)"
                    value={formData.homeAddress}
                    onChange={(e) =>
                      setFormData({ ...formData, homeAddress: e.target.value })
                    }
                    className="magical-input min-h-24 resize-none"
                  />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {}
        <div className="flex justify-between items-center mt-8">
          {}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrevious}
            disabled={currentStep === 1 || loading}
            className="magical-button-secondary disabled:opacity-50"
          >
            <ChevronLeft size={20} />
            Previous
          </motion.button>

          {}
          <span className="text-white/60">
            {currentStep}/{totalSteps}
          </span>

          {}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            disabled={!isStepComplete() || loading}
            className="magical-button disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Saving...
              </>
            ) : currentStep === totalSteps ? (
              'Complete'
            ) : (
              <>
                Next
                <ChevronRight size={20} />
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default PreferencesForm;
```

### `src/components/RoomSelection.tsx`

```tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Users, Sparkles, Heart, Star, Loader2, LogOut } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setCurrentRoom, setSessionPreferences } from '../store/roomsSlice';
import { logout } from '../store/authSlice';
import { authRepository, roomsRepository, participantsRepository, sessionPreferencesRepository } from '../lib/repositories';

const RoomSelection = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();







  const { user } = useAppSelector((state) => state.auth);







  const userPreferences = useAppSelector((state) => state.preferences.userPreferences);

















  const [roomCode, setRoomCode] = useState('');














  const [showJoinForm, setShowJoinForm] = useState(false);














  const [loading, setLoading] = useState(false);














  const [error, setError] = useState('');







  const handleCreateRoom = () => {
    navigate('/create-room');
  };




  const handleJoinRoom = async () => {
    if (!roomCode.trim() || !user) return;


    setLoading(true);
    setError('');

    try {


















      const { data: room, error: roomError } = await roomsRepository.getByCode(roomCode.trim().toUpperCase());



      if (roomError) throw roomError;




      if (!room) {
        setError('Room not found. Please check the room code.');
        setLoading(false);
        return;
      }














      const { error: participantError } = await participantsRepository.add(room.id, user.id);



      if (participantError) throw participantError;


      const sessionPrefs = {
        room_id: room.id,
        user_id: user.id,
        budget: '',
        distance_km: null,
        location: userPreferences?.home_address || '',
        outdoor_indoor: 'both',
        activities: (userPreferences?.activities as string[]) || [],
        food_preferences: userPreferences?.food_preferences || { categories: [], restrictions: '' },
      };













      const { error: prefsError } = await sessionPreferencesRepository.save(room.id, user.id, sessionPrefs);



      if (prefsError) throw prefsError;





























      dispatch(setCurrentRoom(room));
      dispatch(setSessionPreferences(sessionPrefs));



















      navigate(`/room/${room.id}`);
    } catch (err: any) {


      setError(err.message || 'Failed to join room');
    } finally {

      setLoading(false);
    }
  };




  const handleLogout = async () => {

















    await authRepository.signOut();
















    dispatch(logout());


    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleLogout}
        className="absolute top-4 right-4 magical-button-secondary px-4 py-2 flex items-center gap-2"
      >
        <LogOut size={18} />
        Logout
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="glass-card w-full max-w-lg p-8 text-center"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold magical-text mb-4">
            Choose Your Adventure
          </h1>
          <p className="text-white/80">Create magic or join the sparkles</p>
        </motion.div>

        {}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm mb-6"
          >
            {error}
          </motion.div>
        )}

        <div className="space-y-6">
          {}
          <motion.button
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreateRoom}
            className="magical-room-button w-full p-6 group"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="sparkle-icon"
            >
              <Plus size={32} />
            </motion.div>
            <div className="mt-4">
              <h3 className="text-xl font-bold mb-2">Create New Room</h3>
              <p className="text-sm text-white/70">Start a magical voting experience</p>
            </div>
            <motion.div
              initial={{ scale: 0 }}
              whileHover={{ scale: 1 }}
              className="floating-hearts"
            >
              <Heart className="heart-1" size={16} />
              <Star className="heart-2" size={16} />
              <Sparkles className="heart-3" size={16} />
            </motion.div>
          </motion.button>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {}
            <motion.button
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowJoinForm(!showJoinForm)}
              className="magical-room-button w-full p-6 group"
            >
              <motion.div
                animate={{ bounce: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="sparkle-icon"
              >
                <Users size={32} />
              </motion.div>
              <div className="mt-4">
                <h3 className="text-xl font-bold mb-2">Join Existing Room</h3>
                <p className="text-sm text-white/70">Enter a room code to join the magic</p>
              </div>
            </motion.button>

            {}
            {showJoinForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 space-y-4"
              >
                {}
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="Enter Room Code"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    className="magical-input text-center text-lg font-mono"
                    maxLength={8}
                    disabled={loading}
                  />
                </div>
                {}
                <motion.button
                  whileHover={{ scale: loading ? 1 : 1.05 }}
                  whileTap={{ scale: loading ? 1 : 0.95 }}
                  onClick={handleJoinRoom}
                  disabled={!roomCode.trim() || loading}
                  className="magical-button w-full py-3 disabled:opacity-50"
                >
                  <span className="flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Joining...
                      </>
                    ) : (
                      <>
                        <Sparkles size={20} />
                        Join the Magic
                        <Heart size={20} />
                      </>
                    )}
                  </span>
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </div>

        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="mt-8 text-white/60"
        >
          <p className="text-sm">Where friends become magic makers</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RoomSelection;
```

### `src/components/CreateRoomForm.tsx`

```tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setCurrentRoom, setSessionPreferences } from '../store/roomsSlice';
import { setUserPreferences } from '../store/preferencesSlice';
import { roomsRepository, participantsRepository, sessionPreferencesRepository, preferencesRepository } from '../lib/repositories';

const CreateRoomForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();







  const { user } = useAppSelector((state) => state.auth);







  const userPreferences = useAppSelector((state) => state.preferences.userPreferences);















  const [currentStep, setCurrentStep] = useState(1);














  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


































  const [formData, setFormData] = useState({
    occasion: '',
    mood: [] as string[],
    startTime: '',
    endTime: '',
    duration: '',
    budget: '',
    distance: '',
    location: '',
    outdoorIndoor: '',
    activities: [] as string[],
    customActivity: '',
    foodCategories: [] as string[],
    foodRestrictions: '',
  });

  const totalSteps = 4;


  const moodOptions = [
    { value: 'casual', label: 'Casual', emoji: '😊' },
    { value: 'celebratory', label: 'Celebratory', emoji: '🎉' },
    { value: 'romantic', label: 'Romantic', emoji: '💕' },
    { value: 'adventurous', label: 'Adventurous', emoji: '🌟' },
    { value: 'relaxed', label: 'Relaxed', emoji: '🧘' },
    { value: 'energetic', label: 'Energetic', emoji: '⚡' },
    { value: 'formal', label: 'Formal', emoji: '👔' },
    { value: 'cozy', label: 'Cozy', emoji: '🕯️' },
  ];

  const budgetOptions = [
    { value: 'budget', label: 'Budget-friendly', emoji: '💰' },
    { value: 'moderate', label: 'Moderate', emoji: '💳' },
    { value: 'premium', label: 'Premium', emoji: '💎' },
    { value: 'luxury', label: 'Luxury', emoji: '👑' },
  ];

  const outdoorIndoorOptions = [
    { value: 'outdoor', label: 'Outdoor', emoji: '🌳' },
    { value: 'indoor', label: 'Indoor', emoji: '🏠' },
    { value: 'both', label: 'Both', emoji: '🌈' },
  ];

  const activityOptions = [
    { value: 'restaurants', label: 'Dining', emoji: '🍽️' },
    { value: 'entertainment', label: 'Entertainment', emoji: '🎬' },
    { value: 'outdoor', label: 'Outdoor', emoji: '🌳' },
    { value: 'culture', label: 'Culture', emoji: '🎨' },
    { value: 'shopping', label: 'Shopping', emoji: '🛍️' },
    { value: 'nightlife', label: 'Nightlife', emoji: '🌙' },
    { value: 'sports', label: 'Sports', emoji: '⚽' },
    { value: 'wellness', label: 'Wellness', emoji: '🧘' },
  ];

  const foodOptions = [
    { value: 'italian', label: 'Italian', emoji: '🍝' },
    { value: 'chinese', label: 'Chinese', emoji: '🥡' },
    { value: 'indian', label: 'Indian', emoji: '🍛' },
    { value: 'mexican', label: 'Mexican', emoji: '🌮' },
    { value: 'japanese', label: 'Japanese', emoji: '🍱' },
    { value: 'american', label: 'American', emoji: '🍔' },
    { value: 'mediterranean', label: 'Mediterranean', emoji: '🥙' },
    { value: 'thai', label: 'Thai', emoji: '🍜' },
  ];







  useEffect(() => {
    const loadPreferences = async () => {
      if (!user) return;


      if (userPreferences) {










        setFormData((prev) => ({
          ...prev,
          activities: (userPreferences.activities as string[]) || [],
          foodCategories: ((userPreferences.food_preferences as any)?.categories as string[]) || [],
          foodRestrictions: ((userPreferences.food_preferences as any)?.restrictions as string) || '',
          location: userPreferences.home_address || '',
        }));
        setLoading(false);
        return;
      }

      try {



















        const { data, error } = await preferencesRepository.get(user.id);




        if (error) throw error;

        if (data) {













          dispatch(setUserPreferences(data));



          setFormData((prev) => ({
            ...prev,
            activities: (data.activities as string[]) || [],
            foodCategories: ((data.food_preferences as any)?.categories as string[]) || [],
            foodRestrictions: ((data.food_preferences as any)?.restrictions as string) || '',
            location: data.home_address || '',
          }));
        }
      } catch (err) {



        console.error('Error loading preferences:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, [user, dispatch, userPreferences]);









  const handleMoodToggle = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      mood: prev.mood.includes(value)
        ? prev.mood.filter((m) => m !== value)
        : [...prev.mood, value],
    }));
  };


  const handleActivityToggle = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      activities: prev.activities.includes(value)
        ? prev.activities.filter((a) => a !== value)
        : [...prev.activities, value],
    }));
  };


  const handleFoodToggle = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      foodCategories: prev.foodCategories.includes(value)
        ? prev.foodCategories.filter((f) => f !== value)
        : [...prev.foodCategories, value],
    }));
  };







  const isStepComplete = () => {
    switch (currentStep) {
      case 1:
        return formData.occasion.trim() !== '' && formData.mood.length > 0;
      case 2:
        return (
          formData.budget !== '' &&
          formData.outdoorIndoor !== '' &&
          formData.distance !== ''
        );
      case 3:
        return formData.activities.length > 0;
      case 4:
        return formData.foodCategories.length > 0;
      default:
        return false;
    }
  };


  const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  };







  const handleNext = () => {
    if (currentStep < totalSteps) {

      setCurrentStep(currentStep + 1);
    } else {

      handleSubmit();
    }
  };






  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };




  const handleSubmit = async () => {
    if (!user) return;

    setLoading(true);
    setError('');

    try {
      const roomCode = generateRoomCode();


      const roomData = {
        room_code: roomCode,
        creator_id: user.id,
        occasion: formData.occasion,
        mood_atmosphere: formData.mood,
        start_time: formData.startTime || null,
        end_time: formData.endTime || null,
        duration_minutes: formData.duration ? parseInt(formData.duration) : null,
        is_active: false,
      };



















      const { data: room, error: roomError } = await roomsRepository.create(roomData);




      if (roomError) throw roomError;












      const { error: participantError } = await participantsRepository.add(room.id, user.id);



      if (participantError) throw participantError;


      const allActivities = formData.customActivity.trim()
        ? [...formData.activities, formData.customActivity.trim()]
        : formData.activities;

      const sessionPrefs = {
        room_id: room.id,
        user_id: user.id,
        budget: formData.budget,
        distance_km: parseInt(formData.distance) || null,
        location: formData.location,
        outdoor_indoor: formData.outdoorIndoor,
        activities: allActivities,
        food_preferences: {
          categories: formData.foodCategories,
          restrictions: formData.foodRestrictions,
        },
      };














      const { error: prefsError } = await sessionPreferencesRepository.save(room.id, user.id, sessionPrefs);



      if (prefsError) throw prefsError;






























      dispatch(setCurrentRoom(room));
      dispatch(setSessionPreferences(sessionPrefs));





















      navigate(`/room/${room.id}`);
    } catch (err: any) {


      setError(err.message || 'Failed to create room');
    } finally {
      setLoading(false);
    }
  };


  if (loading && currentStep === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={48} className="animate-spin text-pink-300" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card w-full max-w-3xl p-8"
      >
        {}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <motion.div
                key={index}
                className={`progress-step ${index + 1 <= currentStep ? 'active' : ''}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                {index + 1 <= currentStep && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="step-sparkle"
                  >
                    <Sparkles size={16} />
                  </motion.div>
                )}
                <span>{index + 1}</span>
              </motion.div>
            ))}
          </div>
          <div className="progress-bar">
            <motion.div
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm mb-6"
          >
            {error}
          </motion.div>
        )}

        {}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            {}
            {currentStep === 1 && (
              <div>
                <h2 className="text-3xl font-bold magical-text text-center mb-2">
                  Outing Details
                </h2>
                <p className="text-white/70 text-center mb-8">
                  Tell us about this magical gathering
                </p>

                <div className="space-y-6">
                  {}
                  <div className="input-group">
                    <input
                      type="text"
                      placeholder="Occasion (e.g., Birthday, Date Night, Team Outing)"
                      value={formData.occasion}
                      onChange={(e) =>
                        setFormData({ ...formData, occasion: e.target.value })
                      }
                      className="magical-input"
                    />
                  </div>

                  {}
                  <div>
                    <label className="block text-white/80 mb-3">Mood & Atmosphere</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {moodOptions.map((option) => (
                        <motion.button
                          key={option.value}
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleMoodToggle(option.value)}
                          className={`option-card ${
                            formData.mood.includes(option.value) ? 'selected' : ''
                          }`}
                        >
                          <span className="text-2xl mb-1 block">{option.emoji}</span>
                          <span className="font-semibold text-sm">{option.label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="input-group">
                      <label className="block text-white/60 text-sm mb-2">Start Time</label>
                      <input
                        type="datetime-local"
                        value={formData.startTime}
                        onChange={(e) =>
                          setFormData({ ...formData, startTime: e.target.value })
                        }
                        className="magical-input"
                      />
                    </div>

                    <div className="input-group">
                      <label className="block text-white/60 text-sm mb-2">End Time</label>
                      <input
                        type="datetime-local"
                        value={formData.endTime}
                        onChange={(e) =>
                          setFormData({ ...formData, endTime: e.target.value })
                        }
                        className="magical-input"
                      />
                    </div>

                    <div className="input-group">
                      <label className="block text-white/60 text-sm mb-2">
                        Duration (minutes)
                      </label>
                      <input
                        type="number"
                        placeholder="120"
                        value={formData.duration}
                        onChange={(e) =>
                          setFormData({ ...formData, duration: e.target.value })
                        }
                        className="magical-input"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {}
            {currentStep === 2 && (
              <div>
                <h2 className="text-3xl font-bold magical-text text-center mb-2">
                  Budget & Location
                </h2>
                <p className="text-white/70 text-center mb-8">
                  Set your preferences for this outing
                </p>

                <div className="space-y-6">
                  {}
                  <div>
                    <label className="block text-white/80 mb-3">Budget</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {budgetOptions.map((option) => (
                        <motion.button
                          key={option.value}
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setFormData({ ...formData, budget: option.value })}
                          className={`option-card ${
                            formData.budget === option.value ? 'selected' : ''
                          }`}
                        >
                          <span className="text-2xl mb-1 block">{option.emoji}</span>
                          <span className="font-semibold text-sm">{option.label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {}
                  <div>
                    <label className="block text-white/80 mb-3">Outdoor vs Indoor</label>
                    <div className="grid grid-cols-3 gap-4">
                      {outdoorIndoorOptions.map((option) => (
                        <motion.button
                          key={option.value}
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() =>
                            setFormData({ ...formData, outdoorIndoor: option.value })
                          }
                          className={`option-card ${
                            formData.outdoorIndoor === option.value ? 'selected' : ''
                          }`}
                        >
                          <span className="text-2xl mb-1 block">{option.emoji}</span>
                          <span className="font-semibold text-sm">{option.label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {}
                  <div className="input-group">
                    <label className="block text-white/60 text-sm mb-2">
                      Maximum Distance (km)
                    </label>
                    <input
                      type="number"
                      placeholder="10"
                      value={formData.distance}
                      onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                      className="magical-input"
                    />
                  </div>

                  {}
                  <div className="input-group">
                    <label className="block text-white/60 text-sm mb-2">
                      Location (leave blank to use home address)
                    </label>
                    <textarea
                      placeholder={userPreferences?.home_address || 'Enter location'}
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="magical-input min-h-20 resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {}
            {currentStep === 3 && (
              <div>
                <h2 className="text-3xl font-bold magical-text text-center mb-2">
                  Activities
                </h2>
                <p className="text-white/70 text-center mb-8">
                  Customize activities for this outing
                </p>

                <div className="space-y-6">
                  {}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {activityOptions.map((option) => (
                      <motion.button
                        key={option.value}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleActivityToggle(option.value)}
                        className={`option-card ${
                          formData.activities.includes(option.value) ? 'selected' : ''
                        }`}
                      >
                        <span className="text-2xl mb-2 block">{option.emoji}</span>
                        <span className="font-semibold text-sm">{option.label}</span>
                      </motion.button>
                    ))}
                  </div>

                  {}
                  <div className="input-group">
                    <input
                      type="text"
                      placeholder="Add custom activity"
                      value={formData.customActivity}
                      onChange={(e) =>
                        setFormData({ ...formData, customActivity: e.target.value })
                      }
                      className="magical-input"
                    />
                  </div>
                </div>
              </div>
            )}

            {}
            {currentStep === 4 && (
              <div>
                <h2 className="text-3xl font-bold magical-text text-center mb-2">
                  Food Preferences
                </h2>
                <p className="text-white/70 text-center mb-8">
                  Customize food preferences for this outing
                </p>

                <div className="space-y-6">
                  {}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {foodOptions.map((option) => (
                      <motion.button
                        key={option.value}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleFoodToggle(option.value)}
                        className={`option-card ${
                          formData.foodCategories.includes(option.value) ? 'selected' : ''
                        }`}
                      >
                        <span className="text-2xl mb-2 block">{option.emoji}</span>
                        <span className="font-semibold text-sm">{option.label}</span>
                      </motion.button>
                    ))}
                  </div>

                  {}
                  <div className="input-group">
                    <textarea
                      placeholder="Dietary restrictions for this outing"
                      value={formData.foodRestrictions}
                      onChange={(e) =>
                        setFormData({ ...formData, foodRestrictions: e.target.value })
                      }
                      className="magical-input min-h-24 resize-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {}
        <div className="flex justify-between items-center mt-8">
          {}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrevious}
            disabled={currentStep === 1 || loading}
            className="magical-button-secondary disabled:opacity-50"
          >
            <ChevronLeft size={20} />
            Previous
          </motion.button>

          {}
          <span className="text-white/60">
            {currentStep}/{totalSteps}
          </span>

          {}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            disabled={!isStepComplete() || loading}
            className="magical-button disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Creating...
              </>
            ) : currentStep === totalSteps ? (
              'Create Room'
            ) : (
              <>
                Next
                <ChevronRight size={20} />
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateRoomForm;
```

### `src/components/RoomPage.tsx`

```tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Copy,
  Users,
  Play,
  Square,
  Eye,
  Crown,
  Heart
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateRoomStatus, setParticipants } from '../store/roomsSlice';
import { socketEvents } from '../lib/socket';
import { participantsRepository, roomsRepository } from '../lib/repositories';

const RoomPage = () => {
  const { id: roomId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();


  const [showParticipants, setShowParticipants] = useState(true);


  const currentRoom = useAppSelector((state) => state.rooms.currentRoom);
  const participants = useAppSelector((state) => state.rooms.participants);
  const { user } = useAppSelector((state) => state.auth);

  const isVoting = currentRoom?.is_active || false;
  const isHost = currentRoom?.creator_id === user?.id;



  useEffect(() => {
    if (!roomId) return;

    const loadParticipants = async () => {
      try {

















        const { data } = await participantsRepository.get(roomId);

        if (data && data.length > 0) {


          const enrichedParticipants = data.map((p: any, index: number) => ({
            ...p,
            user_email: p.user_id === user?.id
              ? user.email
              : ['stella@example.com', 'aurora@example.com', 'iris@example.com'][index % 3]
          }));





          dispatch(setParticipants(enrichedParticipants));
        }
      } catch (error) {



        console.error('Error loading participants:', error);
      }
    };

    loadParticipants();










  }, [roomId, dispatch, user]);

  const copyRoomId = () => {
    navigator.clipboard.writeText(currentRoom?.room_code || roomId || '');
  };

  const startVoting = async () => {
    if (!roomId || !isHost) return;



    dispatch(updateRoomStatus(true));


















    await roomsRepository.update(roomId, { is_active: true });


    socketEvents.startVoting(roomId);

    navigate(`/room/${roomId}/voting`);
  };

  const endVoting = async () => {
    if (!roomId || !isHost) return;


    dispatch(updateRoomStatus(false));


















    await roomsRepository.update(roomId, { is_active: false });


    socketEvents.endVoting(roomId);
  };

  return (
    <div className="min-h-screen p-4">
      {}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="magical-header mb-8 px-4"
      >
        <div className="container mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="text-3xl"
            >
              ✨
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold magical-text">
                Magic Room
              </h1>
              <div className="flex items-center gap-2">
                <span className="text-white/80">ID: {roomId}</span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={copyRoomId}
                  className="magical-icon-button"
                >
                  <Copy size={16} />
                </motion.button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 lg:gap-4 w-full lg:w-auto">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowParticipants(!showParticipants)}
              className="magical-button-secondary flex items-center gap-2 text-sm lg:text-base px-3 py-2 lg:px-4 lg:py-3"
            >
              <Users size={20} />
              <span className="hidden sm:inline">Participants</span> ({participants.length})
            </motion.button>

            {!isVoting ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startVoting}
                className="magical-button flex items-center gap-2 text-sm lg:text-base px-3 py-2 lg:px-4 lg:py-3"
              >
                <Play size={20} />
                <span className="hidden sm:inline">Start</span> Vote
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={endVoting}
                className="magical-button-danger flex items-center gap-2 text-sm lg:text-base px-3 py-2 lg:px-4 lg:py-3"
              >
                <Square size={20} />
                <span className="hidden sm:inline">End</span> Vote
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="magical-button-secondary flex items-center gap-2 text-sm lg:text-base px-3 py-2 lg:px-4 lg:py-3"
            >
              <Eye size={20} />
              Results
            </motion.button>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-8 text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="mb-6"
              >
                <h2 className="text-3xl font-bold magical-text mb-4">
                  Welcome to the Magic Circle! 🔮
                </h2>
                <p className="text-xl text-white/80">
                  {isVoting
                    ? "Voting is now active! ✨"
                    : "Waiting for the magic to begin..."
                  }
                </p>
              </motion.div>

              {!isVoting ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <p className="text-white/70">
                    Share the room ID with your friends to join the magic! 💫
                  </p>
                  <div className="flex items-center justify-center gap-4 text-2xl">
                    <motion.span
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      ⭐
                    </motion.span>
                    <span className="font-mono text-3xl magical-text">{roomId}</span>
                    <motion.span
                      animate={{ rotate: [360, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      ✨
                    </motion.span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="voting-active-indicator"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-6xl mb-4"
                  >
                    🗳️
                  </motion.div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(`/room/${roomId}/voting`)}
                    className="magical-button-large"
                  >
                    Go to Voting ✨
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          </div>

          {}
          <AnimatePresence>
            {showParticipants && (
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ delay: 0.3 }}
                className="glass-card p-6"
              >
                <div className="flex items-center gap-2 mb-6">
                  <Users className="text-pink-300" size={24} />
                  <h3 className="text-xl font-bold magical-text">
                    Magic Makers
                  </h3>
                </div>

                <div className="space-y-3">
                  {participants.map((participant, index) => {
                    const isCreator = participant.user_id === currentRoom?.creator_id;
                    const displayName = participant.user_email?.split('@')[0] || `User ${index + 1}`;
                    const avatarEmojis = ['🌙', '⭐', '🌺', '🦋', '🌸', '💫', '✨', '🌟'];
                    const avatar = avatarEmojis[index % avatarEmojis.length];

                    return (
                      <motion.div
                        key={participant.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`participant-card ${participant.is_online ? 'online' : 'offline'}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="participant-avatar">
                            <span className="text-2xl">{avatar}</span>
                            {participant.is_online && (
                              <div className="online-indicator"></div>
                            )}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-white">
                                {displayName}
                              </span>
                              {isCreator && (
                                <Crown className="text-yellow-400" size={16} />
                              )}
                            </div>
                            <span className="text-xs text-white/60">
                              {participant.is_online ? 'Online' : 'Away'}
                            </span>
                          </div>

                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              delay: index * 0.5
                            }}
                          >
                            <Heart className="text-pink-300" size={16} />
                          </motion.div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="mt-6 text-center"
                >
                  <p className="text-sm text-white/60">
                    ✨ More magic makers can join anytime! ✨
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default RoomPage;
```

### `src/components/VotingPage.tsx`

```tsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  ThumbsUp,
  Eye,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setRecommendations } from '../store/recommendationsSlice';
import { addVote, removeVote, setVotesForRecommendation } from '../store/votesSlice';
import { socketEvents } from '../lib/socket';
import { recommendationsRepository, votesRepository } from '../lib/repositories';

const VotingPage = () => {
  const { id: roomId } = useParams();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);


  const [currentRecommendationIndex, setCurrentRecommendationIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);


  const recommendations = useAppSelector((state) => state.recommendations.recommendations);
  const votes = useAppSelector((state) => state.votes.votesByRecommendation);


  useEffect(() => {
    if (!roomId) return;

    const loadData = async () => {
      try {
















        const { data: recs } = await recommendationsRepository.getByRoom(roomId);
        if (recs && recs.length > 0) {

          dispatch(setRecommendations(recs as any));
        }

















        const { data: votesData } = await votesRepository.getByRoom(roomId);
        if (votesData) {


          Object.entries(votesData).forEach(([recId, votesList]) => {
            dispatch(setVotesForRecommendation({ recommendationId: recId, votes: votesList as any }));
          });
        }
      } catch (error) {


        console.error('Error loading recommendations:', error);
      }
    };

    loadData();
  }, [dispatch, roomId]);

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white/70">Loading recommendations...</p>
      </div>
    );
  }

  const currentRec = recommendations[currentRecommendationIndex];


  const userVote = votes[currentRec.id]?.find((vote: any) => vote.user_id === user?.id);
  const hasVoted = !!userVote;


  const totalVotes = votes[currentRec.id]?.length || 0;


  const handleVote = async (recommendationId: string) => {
    if (!user || !roomId) return;

    if (hasVoted) {


      dispatch(removeVote({ recommendationId, userId: user.id }));


















      await votesRepository.remove(roomId, recommendationId, user.id);


      socketEvents.castVote(roomId, recommendationId, user.id, 'removed');
    } else {


      const vote = {
        id: `vote_${Date.now()}`,
        room_id: roomId,
        recommendation_id: recommendationId,
        user_id: user.id,
        vote_type: 'yes',
        created_at: new Date().toISOString(),
      };
      dispatch(addVote(vote as any));


















      await votesRepository.cast(vote);


      socketEvents.castVote(roomId, recommendationId, user.id, 'yes');
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      (prev + 1) % currentRec.images.length
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? currentRec.images.length - 1 : prev - 1
    );
  };

  const nextRecommendation = () => {
    setCurrentRecommendationIndex((prev) =>
      (prev + 1) % recommendations.length
    );
    setCurrentImageIndex(0);
  };

  const prevRecommendation = () => {
    setCurrentRecommendationIndex((prev) =>
      prev === 0 ? recommendations.length - 1 : prev - 1
    );
    setCurrentImageIndex(0);
  };

  return (
    <div className="min-h-screen p-4">
      {}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="magical-header mb-6"
      >
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              🗳️
            </motion.div>
            <div>
              <h1 className="text-xl font-bold magical-text">Voting Magic</h1>
              <span className="text-white/80">Room: {roomId}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-white/70">
              {currentRecommendationIndex + 1} of {recommendations.length}
            </span>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={prevRecommendation}
                className="magical-icon-button"
              >
                <ChevronLeft size={20} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={nextRecommendation}
                className="magical-icon-button"
              >
                <ChevronRight size={20} />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto max-w-4xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentRecommendationIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className="glass-card overflow-hidden"
          >
            {}
            <div className="relative h-64 md:h-80 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImageIndex}
                  src={currentRec.images[currentImageIndex]}
                  alt={currentRec.name}
                  initial={{ opacity: 0, x: 300 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -300 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>

              {}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 magical-icon-button"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 magical-icon-button"
              >
                <ChevronRight size={24} />
              </button>

              {}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {currentRec.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImageIndex
                        ? 'bg-white scale-125'
                        : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>

              {}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute top-4 right-4 text-2xl"
              >
                ✨
              </motion.div>
            </div>

            {}
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-3xl font-bold magical-text"
                >
                  {currentRec.name}
                </motion.h2>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleVote(currentRec.id)}
                  className={`vote-button ${hasVoted ? 'voted' : ''}`}
                >
                  <motion.div
                    animate={hasVoted ? {
                      scale: [1, 1.3, 1],
                      rotate: [0, 360, 0]
                    } : {}}
                    transition={{ duration: 0.6 }}
                  >
                    <Heart
                      size={32}
                      fill={hasVoted ? "currentColor" : "none"}
                    />
                  </motion.div>
                  <span className="ml-2 font-semibold">
                    {hasVoted ? 'Loved!' : 'Vote'}
                  </span>
                </motion.button>
              </div>

              {}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(currentRec.parameters).map(([key, param], index) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="parameter-card"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="parameter-icon">
                        <param.icon size={20} />
                      </div>
                      <h4 className="font-semibold magical-text capitalize">
                        {key}
                      </h4>
                    </div>

                    <div className="space-y-2">
                      <p className="text-white font-medium">{param.value}</p>

                      <div className="parameter-score">
                        <div className="score-bar">
                          <motion.div
                            className="score-fill"
                            initial={{ width: 0 }}
                            animate={{ width: `${param.score * 10}%` }}
                            transition={{ delay: index * 0.1 + 0.5, duration: 1 }}
                          />
                        </div>
                        <span className="score-text">{param.score}/10</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-8 flex items-center justify-between"
              >
                <div className="flex items-center gap-4 text-white/70">
                  <div className="flex items-center gap-2">
                    <ThumbsUp size={16} />
                    <span>{totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye size={16} />
                    <span>Live</span>
                  </div>
                </div>

                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-white/60 text-sm"
                >
                  Swipe or use arrows to see more options ✨
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default VotingPage;
```

### `src/store/store.ts`

```ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import preferencesReducer from './preferencesSlice';
import roomsReducer from './roomsSlice';
import votesReducer from './votesSlice';
import recommendationsReducer from './recommendationsSlice';
import socketReducer from './socketSlice';

export const store = configureStore({



  reducer: {
    auth: authReducer,
    preferences: preferencesReducer,
    rooms: roomsReducer,
    votes: votesReducer,
    recommendations: recommendationsReducer,
    socket: socketReducer,
  },




  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({



      serializableCheck: {
        ignoredActions: ['auth/setSession', 'auth/setUser'],
        ignoredPaths: ['auth.session', 'auth.user'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
```

### `src/store/hooks.ts`

```ts
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

### `src/store/authSlice.ts`

```ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  session: null,
  loading: true,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {





















    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },















    setSession: (state, action: PayloadAction<any>) => {
      state.session = action.payload;
    },


















    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },


















    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },






















    logout: (state) => {
      state.user = null;
      state.session = null;
      state.error = null;
    },
  },
});

export const { setUser, setSession, setLoading, setError, logout } = authSlice.actions;

export default authSlice.reducer;
```

### `src/store/preferencesSlice.ts`

```ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserPreferences {
  id?: string;
  user_id?: string;
  activities: string[];
  food_preferences: {
    categories: string[];
    restrictions: string;
  };
  transport_preferences: string[];
  home_address: string;
}

interface PreferencesState {
  userPreferences: UserPreferences | null;
  loading: boolean;
  error: string | null;
}

const initialState: PreferencesState = {
  userPreferences: null,
  loading: false,
  error: null,
};

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {




















    setUserPreferences: (state, action: PayloadAction<UserPreferences>) => {
      state.userPreferences = action.payload;
      state.loading = false;
      state.error = null;
    },



















    updateActivities: (state, action: PayloadAction<string[]>) => {
      if (state.userPreferences) {
        state.userPreferences.activities = action.payload;
      }
    },




















    updateFoodPreferences: (state, action: PayloadAction<{ categories: string[]; restrictions: string }>) => {
      if (state.userPreferences) {
        state.userPreferences.food_preferences = action.payload;
      }
    },














    updateTransport: (state, action: PayloadAction<string[]>) => {
      if (state.userPreferences) {
        state.userPreferences.transport_preferences = action.payload;
      }
    },














    updateHomeAddress: (state, action: PayloadAction<string>) => {
      if (state.userPreferences) {
        state.userPreferences.home_address = action.payload;
      }
    },




    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },




    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setUserPreferences,
  updateActivities,
  updateFoodPreferences,
  updateTransport,
  updateHomeAddress,
  setLoading,
  setError,
} = preferencesSlice.actions;

export default preferencesSlice.reducer;
```

### `src/store/roomsSlice.ts`

```ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Room {
  id: string;
  room_code: string;
  creator_id: string;
  occasion: string;
  mood_atmosphere: string[];
  start_time: string | null;
  end_time: string | null;
  duration_minutes: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Participant {
  id: string;
  room_id: string;
  user_id: string;
  is_online: boolean;
  joined_at: string;
  last_seen: string;
  user_email?: string;
}

export interface SessionPreferences {
  id?: string;
  room_id: string;
  user_id: string;
  budget: string;
  distance_km: number | null;
  location: string;
  outdoor_indoor: string;
  activities: string[];
  food_preferences: {
    categories: string[];
    restrictions: string;
  };
}

interface RoomsState {
  currentRoom: Room | null;
  participants: Participant[];
  sessionPreferences: SessionPreferences | null;
  websocketStatus: 'connected' | 'disconnected' | 'connecting';
  loading: boolean;
  error: string | null;
}

const initialState: RoomsState = {
  currentRoom: null,
  participants: [],
  sessionPreferences: null,
  websocketStatus: 'disconnected',
  loading: false,
  error: null,
};

const roomsSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {






















    setCurrentRoom: (state, action: PayloadAction<Room>) => {
      state.currentRoom = action.payload;
      state.loading = false;
      state.error = null;
    },
























    updateRoomStatus: (state, action: PayloadAction<boolean>) => {
      if (state.currentRoom) {
        state.currentRoom.is_active = action.payload;
      }
    },



















    setParticipants: (state, action: PayloadAction<Participant[]>) => {
      state.participants = action.payload;
    },
























    addParticipant: (state, action: PayloadAction<Participant>) => {
      const exists = state.participants.find(p => p.user_id === action.payload.user_id);
      if (!exists) {
        state.participants.push(action.payload);
      }
    },





















    updateParticipantStatus: (state, action: PayloadAction<{ user_id: string; is_online: boolean }>) => {
      const participant = state.participants.find(p => p.user_id === action.payload.user_id);
      if (participant) {
        participant.is_online = action.payload.is_online;
        participant.last_seen = new Date().toISOString();
      }
    },




















    setSessionPreferences: (state, action: PayloadAction<SessionPreferences>) => {
      state.sessionPreferences = action.payload;
    },



















    setWebsocketStatus: (state, action: PayloadAction<'connected' | 'disconnected' | 'connecting'>) => {
      state.websocketStatus = action.payload;
    },


















    clearRoom: (state) => {
      state.currentRoom = null;
      state.participants = [];
      state.sessionPreferences = null;
      state.websocketStatus = 'disconnected';
    },




    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },




    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setCurrentRoom,
  updateRoomStatus,
  setParticipants,
  addParticipant,
  updateParticipantStatus,
  setSessionPreferences,
  setWebsocketStatus,
  clearRoom,
  setLoading,
  setError,
} = roomsSlice.actions;

export default roomsSlice.reducer;
```

### `src/store/votesSlice.ts`

```ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Vote {
  id: string;
  room_id: string;
  recommendation_id: string;
  user_id: string;
  vote_type: 'yes' | 'no' | 'maybe';
  created_at: string;
}

interface VotesState {


  votesByRecommendation: Record<string, Vote[]>;
  loading: boolean;
  error: string | null;
}

const initialState: VotesState = {
  votesByRecommendation: {},
  loading: false,
  error: null,
};

const votesSlice = createSlice({
  name: 'votes',
  initialState,
  reducers: {



















    setVotesForRecommendation: (
      state,
      action: PayloadAction<{ recommendationId: string; votes: Vote[] }>
    ) => {
      state.votesByRecommendation[action.payload.recommendationId] = action.payload.votes;
      state.loading = false;
      state.error = null;
    },
































    addVote: (state, action: PayloadAction<Vote>) => {
      const { recommendation_id, user_id } = action.payload;


      if (!state.votesByRecommendation[recommendation_id]) {
        state.votesByRecommendation[recommendation_id] = [];
      }


      const existingVoteIndex = state.votesByRecommendation[recommendation_id].findIndex(
        (v) => v.user_id === user_id
      );

      if (existingVoteIndex >= 0) {

        state.votesByRecommendation[recommendation_id][existingVoteIndex] = action.payload;
      } else {

        state.votesByRecommendation[recommendation_id].push(action.payload);
      }

      state.error = null;
    },
























    removeVote: (
      state,
      action: PayloadAction<{ recommendationId: string; userId: string }>
    ) => {
      const { recommendationId, userId } = action.payload;

      if (state.votesByRecommendation[recommendationId]) {
        state.votesByRecommendation[recommendationId] = state.votesByRecommendation[
          recommendationId
        ].filter((v) => v.user_id !== userId);
      }

      state.error = null;
    },

























    setAllVotes: (state, action: PayloadAction<Record<string, Vote[]>>) => {
      state.votesByRecommendation = action.payload;
      state.loading = false;
      state.error = null;
    },

















    clearVotes: (state) => {
      state.votesByRecommendation = {};
      state.loading = false;
      state.error = null;
    },




    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },




    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setVotesForRecommendation,
  addVote,
  removeVote,
  setAllVotes,
  clearVotes,
  setLoading,
  setError,
} = votesSlice.actions;

export default votesSlice.reducer;
```

### `src/store/recommendationsSlice.ts`

```ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Recommendation {
  id: string;
  room_id: string;
  name: string;
  description: string;
  category: string;
  price_level: string;
  location: string;
  distance_km: number | null;
  rating: number | null;
  images: string[];
  parameters: Record<string, any>;
  created_at: string;
}

export interface SavedRecommendation {
  id: string;
  user_id: string;
  recommendation_id: string;
  saved_at: string;
}

interface RecommendationsState {
  recommendations: Recommendation[];
  savedRecommendations: SavedRecommendation[];
  loading: boolean;
  error: string | null;
}

const initialState: RecommendationsState = {
  recommendations: [],
  savedRecommendations: [],
  loading: false,
  error: null,
};

const recommendationsSlice = createSlice({
  name: 'recommendations',
  initialState,
  reducers: {






















    setRecommendations: (state, action: PayloadAction<Recommendation[]>) => {
      state.recommendations = action.payload;
      state.loading = false;
      state.error = null;
    },





















    addRecommendation: (state, action: PayloadAction<Recommendation>) => {
      state.recommendations.push(action.payload);
    },


















    removeRecommendation: (state, action: PayloadAction<string>) => {
      state.recommendations = state.recommendations.filter(
        (r) => r.id !== action.payload
      );
    },





















    setSavedRecommendations: (state, action: PayloadAction<SavedRecommendation[]>) => {
      state.savedRecommendations = action.payload;
    },

























    addSavedRecommendation: (state, action: PayloadAction<SavedRecommendation>) => {
      const exists = state.savedRecommendations.find(
        (sr) => sr.recommendation_id === action.payload.recommendation_id
      );

      if (!exists) {
        state.savedRecommendations.push(action.payload);
      }
    },



















    removeSavedRecommendation: (state, action: PayloadAction<string>) => {
      state.savedRecommendations = state.savedRecommendations.filter(
        (sr) => sr.recommendation_id !== action.payload
      );
    },

















    clearRecommendations: (state) => {
      state.recommendations = [];
      state.loading = false;
      state.error = null;
    },




    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },




    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setRecommendations,
  addRecommendation,
  removeRecommendation,
  setSavedRecommendations,
  addSavedRecommendation,
  removeSavedRecommendation,
  clearRecommendations,
  setLoading,
  setError,
} = recommendationsSlice.actions;

export default recommendationsSlice.reducer;
```

### `src/store/socketSlice.ts`

```ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SocketState {
  status: 'connected' | 'disconnected' | 'connecting' | 'reconnecting';
  error: string | null;
  lastHeartbeat: number | null;
}

const initialState: SocketState = {
  status: 'disconnected',
  error: null,
  lastHeartbeat: null,
};

const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {


















    socketConnecting: (state) => {
      state.status = 'connecting';
      state.error = null;
    },

























    socketConnected: (state) => {
      state.status = 'connected';
      state.error = null;
      state.lastHeartbeat = Date.now();
    },

























    socketDisconnected: (state) => {
      state.status = 'disconnected';
      state.lastHeartbeat = null;
    },



















    socketReconnecting: (state) => {
      state.status = 'reconnecting';
    },

























    socketError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.status = 'disconnected';
    },





























    socketHeartbeat: (state) => {
      state.lastHeartbeat = Date.now();
    },
  },
});

export const {
  socketConnecting,
  socketConnected,
  socketDisconnected,
  socketReconnecting,
  socketError,
  socketHeartbeat,
} = socketSlice.actions;

export default socketSlice.reducer;
```

### `src/lib/repositories.ts`

```ts
import {
  tempAuth,
  tempPreferences,
  tempRooms,
  tempParticipants,
  tempSessionPreferences,
  tempRecommendations,
  tempVotes,
} from './tempStorage';

export const authRepository = {

  signUp: async (email: string, password: string) => {
    return tempAuth.signUp(email, password);
  },


  signIn: async (email: string, password: string) => {
    return tempAuth.signIn(email, password);
  },


  signOut: async () => {
    return tempAuth.signOut();
  },


  getSession: async () => {
    return tempAuth.getSession();
  },


  onAuthStateChange: (callback: any) => {
    return tempAuth.onAuthStateChange(callback);
  },
};

export const preferencesRepository = {


  save: async (userId: string, preferences: any) => {
    return tempPreferences.save(userId, preferences);
  },



  get: async (userId: string) => {
    return tempPreferences.get(userId);
  },
};

export const roomsRepository = {


  create: async (roomData: any) => {
    return tempRooms.create(roomData);
  },



  getByCode: async (code: string) => {
    return tempRooms.getByCode(code);
  },



  update: async (roomId: string, updates: any) => {
    return tempRooms.update(roomId, updates);
  },



  getById: async (roomId: string) => {

    throw new Error('Not implemented');
  },
};

export const participantsRepository = {


  add: async (roomId: string, userId: string) => {
    return tempParticipants.add(roomId, userId);
  },



  get: async (roomId: string) => {
    return tempParticipants.get(roomId);
  },






  updateStatus: async (roomId: string, userId: string, isOnline: boolean) => {

    throw new Error('Not implemented');
  },
};

export const sessionPreferencesRepository = {


  save: async (roomId: string, userId: string, preferences: any) => {
    return tempSessionPreferences.save(roomId, userId, preferences);
  },







  get: async (roomId: string, userId: string) => {
    return tempSessionPreferences.get(roomId, userId);
  },
};

export const recommendationsRepository = {



  getByRoom: async (roomId: string) => {
    return tempRecommendations.getByRoom(roomId);
  },



  create: async (recommendation: any) => {
    throw new Error('Not implemented - create recommendations via backend/AI service');
  },
};

export const votesRepository = {


  cast: async (vote: any) => {
    return tempVotes.cast(vote);
  },






  remove: async (roomId: string, recommendationId: string, userId: string) => {
    return tempVotes.remove(roomId, recommendationId, userId);
  },



  getByRoom: async (roomId: string) => {
    return tempVotes.getByRoom(roomId);
  },
};
```

### `src/lib/tempStorage.ts`

```ts
export interface TempUser {
  id: string;
  email: string;
  created_at: string;
}

export interface TempSession {
  user: TempUser;
  access_token: string;
}

export const tempAuth = {




















  signUp: async (email: string, password: string) => {


    const users = JSON.parse(localStorage.getItem('temp_users') || '[]');


    const existing = users.find((u: any) => u.email === email);

    if (existing) {

      throw new Error('User already exists');
    }




    const newUser: TempUser = {
      id: `user_${Date.now()}`,
      email,
      created_at: new Date().toISOString(),
    };



    users.push({ ...newUser, password });
    localStorage.setItem('temp_users', JSON.stringify(users));



    return { data: { user: newUser }, error: null };
  },





















  signIn: async (email: string, password: string) => {

    const users = JSON.parse(localStorage.getItem('temp_users') || '[]');




    const user = users.find((u: any) => u.email === email && u.password === password);

    if (!user) {

      throw new Error('Invalid email or password');
    }






    const session: TempSession = {
      user: {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
      },
      access_token: `token_${Date.now()}`,
    };





    localStorage.setItem('temp_session', JSON.stringify(session));

    return { data: { user: session.user, session }, error: null };
  },

















  getSession: async () => {

    const session = localStorage.getItem('temp_session');

    if (!session) {

      return { data: { session: null }, error: null };
    }



    return { data: { session: JSON.parse(session) }, error: null };
  },















  signOut: async () => {


    localStorage.removeItem('temp_session');
    return { error: null };
  },




















  onAuthStateChange: (callback: (event: string, session: TempSession | null) => void) => {

    const session = localStorage.getItem('temp_session');



    callback('SIGNED_IN', session ? JSON.parse(session) : null);



    return {
      data: {
        subscription: {
          unsubscribe: () => {


          },
        },
      },
    };
  },
};

export const tempPreferences = {













  save: async (userId: string, preferences: any) => {


    const key = `preferences_${userId}`;



    localStorage.setItem(key, JSON.stringify(preferences));

    return { error: null };
  },














  get: async (userId: string) => {
    const key = `preferences_${userId}`;
    const data = localStorage.getItem(key);



    return { data: data ? JSON.parse(data) : null, error: null };
  },
};

export const tempRooms = {
















  create: async (roomData: any) => {

    const rooms = JSON.parse(localStorage.getItem('temp_rooms') || '[]');



    const newRoom = {
      id: `room_${Date.now()}`,
      ...roomData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };


    rooms.push(newRoom);


    localStorage.setItem('temp_rooms', JSON.stringify(rooms));

    return { data: newRoom, error: null };
  },
















  getByCode: async (code: string) => {
    const rooms = JSON.parse(localStorage.getItem('temp_rooms') || '[]');



    const room = rooms.find((r: any) => r.room_code === code);

    return { data: room || null, error: null };
  },


















  update: async (roomId: string, updates: any) => {
    const rooms = JSON.parse(localStorage.getItem('temp_rooms') || '[]');
    const index = rooms.findIndex((r: any) => r.id === roomId);

    if (index >= 0) {

      rooms[index] = {
        ...rooms[index],
        ...updates,
        updated_at: new Date().toISOString()
      };
      localStorage.setItem('temp_rooms', JSON.stringify(rooms));
    }

    return { error: null };
  },
};

export const tempParticipants = {















  add: async (roomId: string, userId: string) => {

    const key = `participants_${roomId}`;
    const participants = JSON.parse(localStorage.getItem(key) || '[]');


    const existing = participants.find((p: any) => p.user_id === userId);
    if (existing) {
      return { error: null };
    }


    participants.push({
      id: `participant_${Date.now()}`,
      room_id: roomId,
      user_id: userId,
      is_online: true,
      joined_at: new Date().toISOString(),
      last_seen: new Date().toISOString(),
    });

    localStorage.setItem(key, JSON.stringify(participants));
    return { error: null };
  },
















  get: async (roomId: string) => {
    const key = `participants_${roomId}`;
    const data = localStorage.getItem(key);
    return { data: data ? JSON.parse(data) : [], error: null };
  },
};

export const tempSessionPreferences = {










  save: async (roomId: string, userId: string, preferences: any) => {

    const key = `session_prefs_${roomId}_${userId}`;
    localStorage.setItem(key, JSON.stringify(preferences));
    return { error: null };
  },










  get: async (roomId: string, userId: string) => {
    const key = `session_prefs_${roomId}_${userId}`;
    const data = localStorage.getItem(key);
    return { data: data ? JSON.parse(data) : null, error: null };
  },
};

export const tempRecommendations = {




















  getByRoom: async (roomId: string) => {







    const mockRecommendations = [
      {
        id: '1',
        room_id: roomId,
        name: "Sparkle Bistro",
        description: "A cozy magical dining experience",
        category: "restaurant",
        price_level: "$$",
        location: "Downtown",
        distance_km: 2.5,
        rating: 4.8,
        images: [
          "https:
          "https:
          "https:
        ],
        parameters: {
          price: { value: "$$", score: 8, icon: "DollarSign" },
          location: { value: "Downtown", score: 9, icon: "MapPin" },
          ambience: { value: "Cozy & Magical", score: 10, icon: "Sparkles" },
          reviews: { value: "4.8/5", score: 9, icon: "Star" },
          capacity: { value: "20-40 people", score: 8, icon: "Users" },
          timing: { value: "Open until 11 PM", score: 7, icon: "Clock" }
        },
        created_at: new Date().toISOString(),
      },
      {
        id: '2',
        room_id: roomId,
        name: "Moonlight Lounge",
        description: "Elegant evening entertainment venue",
        category: "lounge",
        price_level: "$$$",
        location: "Uptown",
        distance_km: 5.0,
        rating: 4.6,
        images: [
          "https:
          "https:
          "https:
        ],
        parameters: {
          price: { value: "$$$", score: 6, icon: "DollarSign" },
          location: { value: "Uptown", score: 7, icon: "MapPin" },
          ambience: { value: "Elegant & Dreamy", score: 9, icon: "Sparkles" },
          reviews: { value: "4.6/5", score: 8, icon: "Star" },
          capacity: { value: "30-60 people", score: 9, icon: "Users" },
          timing: { value: "Open until midnight", score: 9, icon: "Clock" }
        },
        created_at: new Date().toISOString(),
      }
    ];

    return { data: mockRecommendations, error: null };
  },
};

export const tempVotes = {


















  cast: async (vote: any) => {
    const key = `votes_${vote.room_id}`;
    const votes = JSON.parse(localStorage.getItem(key) || '{}');


    if (!votes[vote.recommendation_id]) {
      votes[vote.recommendation_id] = [];
    }


    const existingIndex = votes[vote.recommendation_id].findIndex(
      (v: any) => v.user_id === vote.user_id
    );

    if (existingIndex >= 0) {

      votes[vote.recommendation_id][existingIndex] = vote;
    } else {

      votes[vote.recommendation_id].push(vote);
    }

    localStorage.setItem(key, JSON.stringify(votes));
    return { error: null };
  },















  remove: async (roomId: string, recommendationId: string, userId: string) => {
    const key = `votes_${roomId}`;
    const votes = JSON.parse(localStorage.getItem(key) || '{}');

    if (votes[recommendationId]) {

      votes[recommendationId] = votes[recommendationId].filter(
        (v: any) => v.user_id !== userId
      );
    }

    localStorage.setItem(key, JSON.stringify(votes));
    return { error: null };
  },
















  getByRoom: async (roomId: string) => {
    const key = `votes_${roomId}`;
    const data = localStorage.getItem(key);
    return { data: data ? JSON.parse(data) : {}, error: null };
  },
};
```

### `src/lib/supabase.ts`

```ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https:
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

export const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL &&
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
```

### `src/lib/socket.ts`

```ts
import type { AppDispatch } from '../store/store';
import {
  socketConnecting,
  socketConnected,
  socketDisconnected,
  socketReconnecting,
  socketError,
} from '../store/socketSlice';
import {
  addParticipant,
  updateParticipantStatus,
  updateRoomStatus,
} from '../store/roomsSlice';
import { addVote } from '../store/votesSlice';
import { addRecommendation } from '../store/recommendationsSlice';

let socketInstance: any = null;
let reconnectTimeout: NodeJS.Timeout | null = null;
const RECONNECT_DELAY = 3000;

export const socketService = {

  connect: (dispatch: AppDispatch, roomId: string) => {
    dispatch(socketConnecting());





    setTimeout(() => {
      dispatch(socketConnected());
      socketService.subscribeToRoom(dispatch, roomId);
    }, 500);
  },


  disconnect: (dispatch: AppDispatch) => {
    dispatch(socketDisconnected());

    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout);
      reconnectTimeout = null;
    }






  },


  subscribeToRoom: (dispatch: AppDispatch, roomId: string) => {






















  },


  unsubscribeFromRoom: (roomId: string) => {


  },


  emitEvent: (event: string, data: any) => {


    console.log('[Socket] Emit event (simulated):', event, data);
  },


  handleReconnect: (dispatch: AppDispatch, roomId: string) => {
    dispatch(socketReconnecting());

    reconnectTimeout = setTimeout(() => {
      socketService.connect(dispatch, roomId);
    }, RECONNECT_DELAY);
  },
};

export const socketEvents = {

  castVote: (roomId: string, recommendationId: string, userId: string, voteType: string) => {

    socketService.emitEvent('cast-vote', { roomId, recommendationId, userId, voteType });
  },

  startVoting: (roomId: string) => {

    socketService.emitEvent('start-voting', { roomId });
  },

  endVoting: (roomId: string) => {

    socketService.emitEvent('end-voting', { roomId });
  },

  updateParticipantStatus: (roomId: string, userId: string, isOnline: boolean) => {

    socketService.emitEvent('participant-status', { roomId, userId, isOnline });
  },
};
```

### `src/types/database.ts`

```ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      user_preferences: {
        Row: {
          id: string
          user_id: string
          activities: Json
          food_preferences: Json
          transport_preferences: Json
          home_address: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          activities?: Json
          food_preferences?: Json
          transport_preferences?: Json
          home_address?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          activities?: Json
          food_preferences?: Json
          transport_preferences?: Json
          home_address?: string
          created_at?: string
          updated_at?: string
        }
      }
      rooms: {
        Row: {
          id: string
          room_code: string
          creator_id: string
          occasion: string
          mood_atmosphere: Json
          start_time: string | null
          end_time: string | null
          duration_minutes: number | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          room_code: string
          creator_id: string
          occasion?: string
          mood_atmosphere?: Json
          start_time?: string | null
          end_time?: string | null
          duration_minutes?: number | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          room_code?: string
          creator_id?: string
          occasion?: string
          mood_atmosphere?: Json
          start_time?: string | null
          end_time?: string | null
          duration_minutes?: number | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      room_participants: {
        Row: {
          id: string
          room_id: string
          user_id: string
          is_online: boolean
          joined_at: string
          last_seen: string
        }
        Insert: {
          id?: string
          room_id: string
          user_id: string
          is_online?: boolean
          joined_at?: string
          last_seen?: string
        }
        Update: {
          id?: string
          room_id?: string
          user_id?: string
          is_online?: boolean
          joined_at?: string
          last_seen?: string
        }
      }
      session_preferences: {
        Row: {
          id: string
          room_id: string
          user_id: string
          budget: string
          distance_km: number | null
          location: string
          outdoor_indoor: string
          activities: Json
          food_preferences: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          room_id: string
          user_id: string
          budget?: string
          distance_km?: number | null
          location?: string
          outdoor_indoor?: string
          activities?: Json
          food_preferences?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          room_id?: string
          user_id?: string
          budget?: string
          distance_km?: number | null
          location?: string
          outdoor_indoor?: string
          activities?: Json
          food_preferences?: Json
          created_at?: string
          updated_at?: string
        }
      }
      recommendations: {
        Row: {
          id: string
          room_id: string
          name: string
          description: string
          category: string
          price_level: string
          location: string
          distance_km: number | null
          rating: number | null
          images: Json
          parameters: Json
          created_at: string
        }
        Insert: {
          id?: string
          room_id: string
          name: string
          description?: string
          category?: string
          price_level?: string
          location?: string
          distance_km?: number | null
          rating?: number | null
          images?: Json
          parameters?: Json
          created_at?: string
        }
        Update: {
          id?: string
          room_id?: string
          name?: string
          description?: string
          category?: string
          price_level?: string
          location?: string
          distance_km?: number | null
          rating?: number | null
          images?: Json
          parameters?: Json
          created_at?: string
        }
      }
      votes: {
        Row: {
          id: string
          room_id: string
          recommendation_id: string
          user_id: string
          vote_type: string
          created_at: string
        }
        Insert: {
          id?: string
          room_id: string
          recommendation_id: string
          user_id: string
          vote_type?: string
          created_at?: string
        }
        Update: {
          id?: string
          room_id?: string
          recommendation_id?: string
          user_id?: string
          vote_type?: string
          created_at?: string
        }
      }
      saved_recommendations: {
        Row: {
          id: string
          user_id: string
          recommendation_id: string
          saved_at: string
        }
        Insert: {
          id?: string
          user_id: string
          recommendation_id: string
          saved_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          recommendation_id?: string
          saved_at?: string
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
```

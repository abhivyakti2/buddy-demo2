import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAppDispatch } from '../../store/hooks';
import { setUser, setSession, setLoading } from '../../store/authSlice';
import { motion } from 'framer-motion';

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      dispatch(setSession(session));
      dispatch(setUser(session?.user ?? null));
      dispatch(setLoading(false));
      setInitializing(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
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
};

export default AuthProvider;

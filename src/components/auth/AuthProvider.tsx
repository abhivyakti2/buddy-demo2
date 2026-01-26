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
    // TODO: Replace temp repository with Supabase auth.getSession()
    authRepository.getSession().then(({ data: { session } }) => {
      dispatch(setSession(session));
      dispatch(setUser(session?.user ?? null));
      dispatch(setLoading(false));
      setInitializing(false);
    });

    // TODO: Replace temp repository with Supabase auth.onAuthStateChange()
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

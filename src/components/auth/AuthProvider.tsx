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
    // =============================================================================
    // TEMPORARY STORAGE: Loading existing user session on app startup
    // =============================================================================
    // WHAT THIS DOES:
    // Checks if there's an existing authentication session saved in storage
    // (from a previous login). If found, automatically logs the user back in.
    //
    // WHY CHECK BEFORE REDUX:
    // We need to check the backend/storage FIRST to see if a valid session exists.
    // Only after verifying the session do we populate Redux with user data.
    //
    // DATA FLOW:
    // 1. App loads → Check temporary storage (or real auth service) for existing session
    // 2. If session exists and is valid → Dispatch to Redux (user auto-logged in)
    // 3. If no session → User remains logged out, sees login page
    // =============================================================================
    // TODO: Replace this with real DB / Supabase / API call
    authRepository.getSession().then(({ data: { session } }) => {
      // Dispatch session and user to Redux
      // This auto-logs in the user if they had a previous session
      dispatch(setSession(session));
      dispatch(setUser(session?.user ?? null));
      dispatch(setLoading(false));
      setInitializing(false);
    });

    // =============================================================================
    // TEMPORARY STORAGE: Listening for authentication changes
    // =============================================================================
    // WHAT THIS DOES:
    // Sets up a listener that watches for authentication events (login, logout,
    // session expiry, token refresh). When auth state changes, updates Redux.
    //
    // WHY LISTEN TO BACKEND:
    // Authentication state can change for many reasons:
    // - User logs in/out in another tab
    // - Session token expires
    // - Token gets refreshed
    // We need to keep Redux in sync with the backend auth state at all times.
    //
    // DATA FLOW:
    // 1. Auth state changes in backend → Listener fires with new session data
    // 2. Dispatch to Redux → UI updates (login screen appears/disappears)
    // =============================================================================
    // TODO: Replace this with real DB / Supabase / API call
    const {
      data: { subscription },
    } = authRepository.onAuthStateChange((_event: any, session: any) => {
      // Update Redux whenever auth state changes in the backend
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

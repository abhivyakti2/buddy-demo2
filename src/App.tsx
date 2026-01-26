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

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import PreferencesForm from './components/PreferencesForm';
import RoomSelection from './components/RoomSelection';
import RoomPage from './components/RoomPage';
import VotingPage from './components/VotingPage';
import './styles/magical.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen magical-bg">
        <div className="stars"></div>
        <div className="twinkling"></div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/preferences" element={<PreferencesForm />} />
          <Route path="/room-selection" element={<RoomSelection />} />
          <Route path="/room/:id" element={<RoomPage />} />
          <Route path="/room/:id/voting" element={<VotingPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
// Definit le routage et lance le bootstrap auth au montage.

import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthPage } from './pages/AuthPage.js';
import { GamePage } from './pages/GamePage.js';
import { RequireAuth } from './components/RequireAuth.js';
import { useAuthBootstrap } from './hooks/useAuth.js';

export function App() {
  useAuthBootstrap();
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/play" replace />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route
        path="/play"
        element={
          <RequireAuth>
            <GamePage />
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/play" replace />} />
    </Routes>
  );
}

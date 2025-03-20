import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { Settings } from './pages/Settings';
import { Explorer } from './pages/Explorer';
import { Help } from './pages/Help';
import { AuthGuard } from './components/AuthGuard';
import { ImageBook } from './pages/ImageBook';

function App() {
  const isExplorerEnabled = React.useMemo(() => {
    return localStorage.getItem('explorerEnabled') === 'true';
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <AuthGuard>
              <Home />
            </AuthGuard>
          }
        />
        {isExplorerEnabled && (
          <Route
            path="/explorer"
            element={
              <AuthGuard>
                <Explorer />
              </AuthGuard>
            }
          />
        )}
        <Route
          path="/settings"
          element={
            <AuthGuard>
              <Settings />
            </AuthGuard>
          }
        />
        <Route
          path="/help"
          element={
            <AuthGuard>
              <Help />
            </AuthGuard>
          }
        />
        <Route
          path="/image-book"
          element={
            <AuthGuard>
              <ImageBook />
            </AuthGuard>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );

}
export default App;

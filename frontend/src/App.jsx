import { useState, useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import RootLayout from './layout/RootLayout';
import Intro from './pages/Intro';
import Dashboard from './pages/Dashboard';
import Map from './pages/Map';
import Settings from './pages/Settings'

function AppRoutes() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);

  return (
    <Routes>
      {isLoading ? (
        <>
          <Route path="/start" element={<Intro />} />
          <Route path="*" element={<Navigate to="/start" replace />} />
        </>
      ) : (
        <>
          <Route path="/" element={<RootLayout />} >
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="map" element={<Map />} />
            <Route path="settings" element={<Settings />} />
            <Route path="map" element={<Map />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </>
      )}
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;

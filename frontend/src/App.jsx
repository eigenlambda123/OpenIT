import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import RootLayout from './layout/RootLayout';
import Dashboard from './pages/Dashboard';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />} >
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
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

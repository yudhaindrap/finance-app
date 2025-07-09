import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/dashboard';
import PrivateRoute from './components/PrivateRoute';
import './index.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 transition-all duration-300">
      <BrowserRouter>
        <Toaster position="top-center" reverseOrder={false} />
        <Routes>
          <Route path="/" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import LandingPage from './pages/LandingPage';
import FarmerLogin from './pages/FarmerLogin';
import AdminLogin from './pages/AdminLogin';
import FarmerDashboard from './pages/FarmerDashboard/FarmerDashboard';
import Register from './pages/Register';
import './App.css';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Set LandingPage as the default route */}
                    <Route path="/" element={<LandingPage />} />
                    
                    {/* Auth Routes */}
                    <Route path="/farmer/login" element={<FarmerLogin />} />
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/register" element={<Register />} />
                    
                    {/* Dashboard Routes */}
                    <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
                    
                    {/* Catch all route - redirect to landing page */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import '../styles/AuthPages.css';

const FarmerLogin = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const success = await login(formData.email, formData.password);
            if (success) {
                navigate('/farmer/dashboard');
            } else {
                alert('Login failed. Please check your credentials.');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('An error occurred during login.');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="auth-title">Farmer Login</h2>
                <form onSubmit={handleSubmit} className="auth-form">

                    {/* EMAIL FIELD (fixed UI) */}
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <div className="input-with-icon">
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="Enter your email"
                            />
                            <span className="input-icon">📧</span>
                        </div>
                    </div>

                    {/* PASSWORD FIELD */}
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="input-with-icon">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="Enter your password"
                            />
                            <span 
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? '🙈' : '👁️'}
                            </span>
                        </div>
                    </div>

                    <button type="submit" className="auth-button">Login</button>
                </form>

                <div className="auth-links">
                    <Link to="/register">Don't have an account? Register</Link>
                    <Link to="/admin">Admin Login</Link>
                    <Link to="/">Back to Home</Link>
                </div>
            </div>
        </div>
    );
};

export default FarmerLogin;

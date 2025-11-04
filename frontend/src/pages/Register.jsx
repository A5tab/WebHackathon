import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/AuthPages.css';

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        farmLocation: '',
        mainCrops: ''
    });
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Implement actual registration logic
        console.log('Registration attempt:', formData);
        // Redirect to farmer dashboard after successful registration
        navigate('/farmer/dashboard');
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="auth-container">
            <div className="auth-card registration">
                <h2 className="auth-title">Register as a Farmer</h2>
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="fullName">Full Name</label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="farmLocation">Farm Location</label>
                        <input
                            type="text"
                            id="farmLocation"
                            name="farmLocation"
                            value={formData.farmLocation}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="mainCrops">Main Crops (comma separated)</label>
                        <input
                            type="text"
                            id="mainCrops"
                            name="mainCrops"
                            value={formData.mainCrops}
                            onChange={handleChange}
                            placeholder="e.g., Wheat, Cotton, Rice"
                            required
                        />
                    </div>
                    <button type="submit" className="auth-button">Register</button>
                </form>
                <div className="auth-links">
                    <Link to="/farmer/login">Already have an account? Login</Link>
                    <Link to="/">Back to Home</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
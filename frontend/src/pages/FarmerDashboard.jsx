import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Dashboard.css';

const FarmerDashboard = () => {
    const [marketData] = useState([
        { crop: 'Wheat', price: '1500/40kg', trend: 'up' },
        { crop: 'Cotton', price: '8000/40kg', trend: 'down' },
        { crop: 'Rice', price: '2500/40kg', trend: 'stable' }
    ]);

    const [weatherData] = useState({
        temperature: '28°C',
        condition: 'Sunny',
        humidity: '65%',
        rainfall: '0mm'
    });

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="logo">🌱 SAMT</div>
                <nav className="nav-menu">
                    <Link to="/farmer/profile">Profile</Link>
                    <Link to="/farmer/settings">Settings</Link>
                    <Link to="/">Logout</Link>
                </nav>
            </header>

            <div className="dashboard-content">
                <section className="weather-section">
                    <h2>Today's Weather</h2>
                    <div className="weather-card">
                        <div className="weather-info">
                            <p className="temperature">{weatherData.temperature}</p>
                            <p className="condition">{weatherData.condition}</p>
                        </div>
                        <div className="weather-details">
                            <p>Humidity: {weatherData.humidity}</p>
                            <p>Rainfall: {weatherData.rainfall}</p>
                        </div>
                    </div>
                </section>

                <section className="market-rates-section">
                    <h2>Current Market Rates</h2>
                    <div className="market-table">
                        <div className="table-header">
                            <span>Crop</span>
                            <span>Price</span>
                            <span>Trend</span>
                        </div>
                        {marketData.map((item, index) => (
                            <div key={index} className="table-row">
                                <span>{item.crop}</span>
                                <span>{item.price}</span>
                                <span className={`trend-${item.trend}`}>
                                    {item.trend === 'up' ? '↑' : item.trend === 'down' ? '↓' : '→'}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="quick-actions">
                    <h2>Quick Actions</h2>
                    <div className="action-buttons">
                        <button className="action-btn">View Full Market Report</button>
                        <button className="action-btn">Check Weather Forecast</button>
                        <button className="action-btn">Access Community Forum</button>
                    </div>
                </section>
            </div>

            <footer className="dashboard-footer">
                <p>© 2025 Smart Agriculture Market Tracker. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default FarmerDashboard;
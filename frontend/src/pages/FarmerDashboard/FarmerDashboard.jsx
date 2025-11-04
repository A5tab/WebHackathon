import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PriceTrendChart from '../../components/charts/PriceTrendChart';
import './FarmerDashboard.css';

// --- MOCK DATA ---
const MOCK_DATA = [
    { item: 'Wheat', price: '$6.52', trend: [0.5, 0.6, 0.8, 0.7, 0.6, 0.8, 0.8], change: '+0.8%' },
    { item: 'Corn', price: '$4.88', trend: [0.3, 0.4, 0.4, 0.2, 0.1, -0.2, -0.3], change: '-0.3%' },
    { item: 'Soybeans', price: '$12.05', trend: [0.1, 0.5, 0.8, 1.0, 1.1, 1.2, 1.2], change: '+1.2%' },
    { item: 'Milk (per gallon)', price: '$3.70', trend: [0.2, 0.1, 0.0, -0.1, -0.1, -0.1, -0.1], change: '-0.1%' },
    { item: 'Eggs (per dozen)', price: '$2.15', trend: [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.5], change: '+0.5%' },
    { item: 'Potatoes (per lb)', price: '$0.85', trend: [0.1, 0.2, 0.2, 0.1, 0.2, 0.2, 0.2], change: '+0.2%' },
    { item: 'Cattle (live, per cwt)', price: '$180.20', trend: [0.0, -0.1, -0.3, -0.5, -0.6, -0.7, -0.7], change: '-0.7%' },
];

const FarmerDashboard = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [selectedLocation, setSelectedLocation] = useState('Anytown, USA');

    return (
        <div className="dashboard-wrapper">
            {/* 1. Sidebar Navigation */}
            <aside className="sidebar">
                <div className="sidebar-header">FarmInsights</div>
                <nav className="sidebar-nav">
                    <Link to="/farmer/dashboard" className="nav-item active">
                        <i className="fas fa-th-large"></i> Dashboard
                    </Link>
                    <Link to="/farmer/posts" className="nav-item">
                        <i className="fas fa-comment"></i> My Posts
                    </Link>
                    <Link to="/farmer/compare" className="nav-item">
                        <i className="fas fa-balance-scale"></i> Compare Prices
                    </Link>
                    <Link to="/farmer/weather" className="nav-item">
                        <i className="fas fa-cloud-sun"></i> Weather Map
                    </Link>
                </nav>
                <button onClick={logout} className="logout-btn">
                    Logout
                </button>
            </aside>

            {/* 2. Main Content Area */}
            <div className="main-content">
                {/* 2.1 Top Search Bar/Header */}
                <header className="main-header">
                    <div className="header-left">
                        <h2>Dashboard</h2>
                        <div className="search-box">
                            <i className="fas fa-search"></i>
                            <input type="text" placeholder="Search Items..." />
                        </div>
                    </div>
                    <div className="header-right">
                        <select 
                            value={selectedLocation} 
                            onChange={(e) => setSelectedLocation(e.target.value)}
                            className="location-select"
                        >
                            <option>Anytown, USA</option>
                            <option>Karachi, PK</option>
                            <option>Lahore, PK</option>
                        </select>
                        <button className="btn-compare">Compare Prices</button>
                    </div>
                </header>

                {/* 2.2 Main Dashboard Grid */}
                <div className="dashboard-grid">
                    {/* A. Market Prices Table (Main Content) */}
                    <div className="prices-table-container">
                        <h3>Current Market Prices</h3>
                        <table className="prices-table">
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Price</th>
                                    <th>7-Day Trend</th>
                                    <th>Trend %</th>
                                </tr>
                            </thead>
                            <tbody>
                                {MOCK_DATA.map((data, index) => (
                                    <tr key={index}>
                                        <td>{data.item}</td>
                                        <td>{data.price}</td>
                                        <td>
                                            <PriceTrendChart 
                                                data={data.trend} 
                                                lineColor={data.change.startsWith('+') ? '#4CAF50' : '#F44336'} 
                                            />
                                        </td>
                                        <td className={data.change.startsWith('+') ? 'positive' : 'negative'}>
                                            {data.change}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* B. Weather & Advice Sidebar */}
                    <div className="weather-advice-sidebar">
                        {/* Local Weather Card */}
                        <div className="weather-card card">
                            <label htmlFor="weather-location">Local Weather</label>
                            <select 
                                id="weather-location" 
                                className="location-select-side" 
                                value={selectedLocation}
                            >
                                <option>Anytown, USA</option>
                            </select>
                            
                            <div className="temp-main">25°C</div>
                            <p className="humidity">Humidity: 65%</p>
                            <p className="description">
                                Mild breeze. Chance of rain 30% later afternoon.
                            </p>
                        </div>
                        
                        {/* Smart Advice Card */}
                        <div className="advice-card card">
                            <h3>Smart Advice</h3>
                            <p>
                                Timely irrigation can increase crop yield by up to 20%. Ensure soil 
                                moisture is optimal before flowering stages.
                            </p>
                        </div>
                    </div>
                </div>

                {/* 2.3 Featured Trends & Insights Section */}
                <div className="trends-section">
                    <h3>Featured Trends & Insights</h3>
                    <div className="insight-cards">
                        {/* Insight Card 1 */}
                        <div className="insight-card card">
                            <i className="fas fa-dollar-sign icon-bg-blue"></i>
                            <h4>Global Grain Prices Surge</h4>
                            <p>Rising demand and geopolitical factors are driving grain prices upwards. Consider holding stock.</p>
                        </div>
                        {/* Insight Card 2 */}
                        <div className="insight-card card">
                            <i className="fas fa-leaf icon-bg-green"></i>
                            <h4>Sustainable Farming Innovations</h4>
                            <p>New technologies in hydroponics and organic pest control are gaining traction. Explore adoption.</p>
                        </div>
                        {/* Insight Card 3 */}
                        <div className="insight-card card">
                            <i className="fas fa-cow icon-bg-purple"></i>
                            <h4>Livestock Health & Nutrition</h4>
                            <p>Advances in feed formulations are improving animal welfare and productivity. Review your current practices.</p>
                        </div>
                        {/* Insight Card 4 */}
                        <div className="insight-card card">
                            <i className="fas fa-tint icon-bg-red"></i>
                            <h4>Water Conservation Techniques</h4>
                            <p>Drought-resistant crops and drip irrigation systems offer significant water savings. Plan for resource scarcity.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FarmerDashboard;
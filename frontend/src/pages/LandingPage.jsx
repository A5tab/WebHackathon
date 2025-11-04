import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/LandingPage.css';

// Mock Icons for the Feature Cards
const Icons = {
    Rates: '🌱',
    Weather: '☁️',
    Community: '🧑‍🤝‍🧑',
};

// --- Component Definition ---
const LandingPage = () => {
    return (
        <div className="landing-page-container">
            {/* 1. Header */}
            <header className="header">
                <div className="logo">🌱 SAMT</div>
                <nav className="nav-links">
                    <Link to="/farmer/login" className="nav-link">Farmer Login</Link>
                    <Link to="/admin/login" className="nav-link">Admin Login</Link>
                </nav>
            </header>

            {/* 2. Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Transparent market <br /> rates & weather insights <br /> for farmers in Pakistan
                    </h1>
                    <p className="hero-subtitle">
                        Daily prices, weather updates, and community advice — all in one place.
                    </p>
                    <div className="hero-actions">
                        {/* Directs to the main market view, even if not logged in (Guest View) */}
                        <Link to="/farmer/dashboard" className="btn btn-primary">
                            View Market Rates
                        </Link>
                        {/* Directs to the registration/forum page */}
                        <Link to="/register" className="btn btn-secondary">
                            Join Forum
                        </Link>
                    </div>
                </div>
                <div className="hero-image-container">
                    <div 
                        className="farmer-illustration" 
                        style={{ 
                            width: '100%', 
                            maxWidth: '350px', 
                            height: '300px', 
                            backgroundColor: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '8px'
                        }}
                    >
                        <span style={{ fontSize: '24px' }}>🌾</span>
                    </div>
                </div>
            </section>

            {/* 3. Key Features Section */}
            <section className="features-section">
                <h2 className="section-title">Key Features to Empower Your Farming</h2>
                <div className="feature-cards">
                    {/* Card 1: Market Rates */}
                    <div className="card">
                        <span className="card-icon">{Icons.Rates}</span>
                        <h3 className="card-title">Real-time Market Rates</h3>
                        <p className="card-description">
                            Get daily updated prices for crops in various regions to make informed selling decisions.
                        </p>
                    </div>
                    
                    {/* Card 2: Weather Insights */}
                    <div className="card">
                        <span className="card-icon">{Icons.Weather}</span>
                        <h3 className="card-title">Precise Weather Insights</h3>
                        <p className="card-description">
                            Access localized weather forecasts and alerts to plan sowing and harvesting activities effectively.
                        </p>
                    </div>
                    
                    {/* Card 3: Community Forum */}
                    <div className="card">
                        <span className="card-icon">{Icons.Community}</span>
                        <h3 className="card-title">Vibrant Community Forum</h3>
                        <p className="card-description">
                            Connect with other farmers, share knowledge, and seek practical advice on farming practices.
                        </p>
                    </div>
                </div>
            </section>

            {/* 4. How it Works Section */}
            <section className="how-it-works-section">
                <h2 className="section-title">How Smart Agriculture Market Tracker Works</h2>
                <div className="steps-container">
                    <div className="step">
                        <div className="step-number">1</div>
                        <h4 className="step-title">Register & Personalize</h4>
                        <p>Sign up with your farm details and customize alerts for your specific crops and region.</p>
                    </div>
                    <div className="step">
                        <div className="step-number">2</div>
                        <h4 className="step-title">Access Data</h4>
                        <p>Instantly view real-time market prices, detailed weather forecasts, and community discussions.</p>
                    </div>
                    <div className="step">
                        <div className="step-number">3</div>
                        <h4 className="step-title">Make Informed Choices</h4>
                        <p>Use insights to optimize your farming, increase yields, and maximize profits.</p>
                    </div>
                </div>
            </section>

            {/* 5. Footer (Simple) */}
            <footer className="footer">
                <p>Made with 💚 at Hackathon</p>
            </footer>
        </div>
    );
};

export default LandingPage;
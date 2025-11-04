import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Mock login function - replace with real API call later
    const login = async (username, password) => {
        try {
            // Mock successful login
            const mockUser = {
                id: '1',
                username,
                role: username.includes('admin') ? 'admin' : 'farmer'
            };
            setUser(mockUser);
            return true;
        } catch (error) {
            console.error('Login failed:', error);
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        window.location.href = '/'; // Redirect to landing page after logout
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
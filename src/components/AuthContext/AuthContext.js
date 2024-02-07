import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    // Функція для отримання даних користувача
    const fetchUserDetails = async () => {
        const token = localStorage.getItem('authToken');
        if (token) {
            try {
                // Запит до API для отримання даних про користувача
                const response = await fetch('http://95.217.181.158/api/user', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                if (data && data.data) {
                    setUser(data.data); // Зберігаємо інформацію про користувача
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error('Не вдалося отримати дані користувача', error);
            }
        }
    };

    useEffect(() => {
        fetchUserDetails();
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};
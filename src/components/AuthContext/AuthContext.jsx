import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const fetchUserDetails = async () => {
            const token = localStorage.getItem('authToken');
            if (token) {
                try {
                    const response = await fetch('http://95.217.181.158/api/user', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    const data = await response.json();
                    if (data && data.data) {
                        setUser(data.data);
                        setIsAuthenticated(true);
                    }
                } catch (error) {
                    console.error('Failed to fetch user details', error);
                }
            }
        };

        fetchUserDetails();
    }, []);

    const isAdmin = user && user.role === 'Admin';
    const isUser = user && user.role === 'customer';

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, user, isAdmin, isUser }}>
            {children}
        </AuthContext.Provider>
    );
};

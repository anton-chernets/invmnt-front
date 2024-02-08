import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    // Helper function to check if the user has an Admin role
    const isAdmin = () => {
        console.log(user.name)
        return user && user.role.includes("Admin");
    };

    // Function to fetch user details
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
                    setUser(data.data); // Store user information
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error('Failed to fetch user details', error);
            }
        }
    };

    useEffect(() => {
        fetchUserDetails();
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, user, setUser, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};

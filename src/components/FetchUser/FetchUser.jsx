import { useState, useEffect } from 'react';

const useFetchUser = (token) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!token) {
                setError('No authentication token found');
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const response = await fetch('https://apinvmnt.site/api/user', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }

                const result = await response.json();
                setUser(result.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [token]);

    return { user, loading, error };
};

export default useFetchUser;

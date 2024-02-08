import React, { useState, useEffect } from 'react';
import './Ticker.css';

const Ticker = () => {
    const [rates, setRates] = useState([]);

    useEffect(() => {
        // Replace with your currency rates API endpoint
        const apiURL = 'https://api.exchangeratesapi.io/latest?base=UAH';

        const fetchRates = async () => {
            try {
                const response = await fetch(apiURL);
                const data = await response.json();
                setRates(Object.entries(data.rates));
            } catch (error) {
                console.error('Error fetching currency rates:', error);
            }
        };

        fetchRates();
    }, []);

    return (
        <div className="ticker">
            <div className="ticker-content">
                {rates.map(([currency, rate]) => (
                    <div key={currency} className="ticker-item">
                        {currency}: {rate.toFixed(2)}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Ticker;
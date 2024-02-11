import React, { useState, useEffect } from 'react';
import './Ticker.css';

const Ticker = () => {
    const [rates, setRates] = useState([]);

    useEffect(() => {
        // Replace 'YOUR_APP_ID' with the actual App ID you received from Open Exchange Rates
        const apiURL = 'https://openexchangerates.org/api/latest.json?app_id=3d26a24c79e14a37b66a2fd3215abdba';

        const fetchRates = async () => {
            try {
                const response = await fetch(apiURL);
                const data = await response.json();
                // Assuming you want to display rates based on USD as base
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

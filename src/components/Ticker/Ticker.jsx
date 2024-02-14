import React, { useState, useEffect } from 'react';

const Ticker = () => {
    const [rates, setRates] = useState([]);

    useEffect(() => {
        const apiURL = 'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json';

        const fetchRates = async () => {
            try {
                const response = await fetch(apiURL);
                const data = await response.json();
                setRates(data);
            } catch (error) {
                console.error('Error fetching currency rates:', error);
            }
        };

        fetchRates();
    }, []);

    return (
        <div className="ticker">
            <div className="ticker-content">

                    {rates.concat(rates).map((rate, index) => ( // Удваиваем массив rates
                        <div key={index} className="ticker-item">
                            <img src={`${process.env.PUBLIC_URL}/img-ticker/${rate.cc}.png`} alt={rate.txt}/>
                            {rate.txt} (1 UAH = {rate.rate.toFixed(2)} {rate.cc})
                        </div>
                    ))}


            </div>
        </div>
    );
};

export default Ticker;

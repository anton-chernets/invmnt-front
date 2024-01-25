import React from 'react';
import NewsFeed from '../../components/NewsFeed/NewsFeed';
import './HomePage.css';

const HomePage = () => {
    return (
        <div className="home-page">
            <h1>Добро пожаловать на главную страницу!</h1>
            <NewsFeed />
        </div>
    );
};

export default HomePage;
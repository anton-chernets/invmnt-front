import NewsFeed from '../../components/NewsFeed/NewsFeed';
import './HomePage.css';
import ScrollToTopButton from "../../components/ScrollToTopButton/ScrollToTopButton";
import React from "react";

const HomePage = () => {
    return (


        <div className="home-page">
            <div className="scroll-to-top">
                <ScrollToTopButton/>
            </div>
            <NewsFeed/>
        </div>
    );
};

export default HomePage;
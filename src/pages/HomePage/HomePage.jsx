import NewsFeed from '../../components/NewsFeed/NewsFeed';
import './HomePage.css';
import ScrollToTopButton from "../../components/ScrollToTopButton/ScrollToTopButton";
import React from "react";
import Sidebar from "../../components/Sidebar/Sidebar";

const HomePage = () => {
    return (
        <div className="home-page">
            <div className="scroll-to-top">
                <ScrollToTopButton/>
            </div>
            <NewsFeed/>
            <Sidebar/>
        </div>
    );
};

export default HomePage;
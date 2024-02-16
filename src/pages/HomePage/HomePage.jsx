import React from "react";
import './HomePage.css';
import NewsFeed from '../../components/NewsFeed/NewsFeed';
import ScrollToTopButton from "../../components/ScrollToTopButton/ScrollToTopButton";
import Sidebar from "../../components/Sidebar/Sidebar";

const HomePage = () => {
    return (
        <div className="site-wrapper"> {/* Start site-wrapper here */}
            <div className="background-image-container"></div> {/* Background image container */}
            <div className="home-page"> {/* Start home-page content */}
                <div className="scroll-to-top">
                    <ScrollToTopButton/>
                </div>
                <NewsFeed/>
                <Sidebar/>
            </div> {/* End home-page content */}
        </div>
    );
};

export default HomePage;

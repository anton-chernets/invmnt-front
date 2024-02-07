import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './NewsFeed.css';
import Sidebar from "../Sidebar/Sidebar";
import defaultImage from '../../img/image_2024-02-07_10-47-09.png';



const NewsFeed = () => {

    const [news, setNews] = useState([]);

    useEffect(() => {
        const url = 'http://95.217.181.158/api/articles';


        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data?.data && Array.isArray(data.data)) {
                    setNews(data.data);
                } else {
                    console.error('Field "data" is missing from the response');
                }
            })
            .catch(error => console.error('Error:', error));
    }, []);
    return (
        <div className="news-container">

            <div className="news-items">
                {news.map((item) => {
                    const imageUrl = item.images && item.images.length > 0 ? item.images[0] : defaultImage;
                    return (
                        <div className="news-item" key={item.id}>
                            <Link to={`/news/${item.id}`} style={{textDecoration: 'none'}}>
                                <h2>{item.title}</h2>
                                <img src={imageUrl} alt={item.title || 'Default'} className="news-image"/>
                                <p>{item.description}</p>
                            </Link>
                        </div>
                    );
                })}
            </div>
            <Sidebar/>
        </div>
    );
};

export default NewsFeed;

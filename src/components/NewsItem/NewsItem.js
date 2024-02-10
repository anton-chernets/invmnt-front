import React, { useState, useRef } from 'react';
import './NewsItem.css';
import defaultImage from '../../img/image_2024-02-07_10-47-09.png';
import { Link } from 'react-router-dom';

export const NewsItem = ({ id, title, description, imageUrl }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    // You need to add this state to manage the maxHeight
    const [maxHeight, setMaxHeight] = useState("0px");
    const contentRef = useRef(null);

    const toggleExpand = () => {
        setIsExpanded(prev => !prev); // Toggle the expanded state
        // Update the maxHeight depending on the expanded state
        setMaxHeight(
            isExpanded ? "0px" : `${contentRef.current.scrollHeight}px`
        );
    };

    const renderedDescription = isExpanded ? description : description.substring(0, 100) + '...';

    return (
        <div className="news-item">
            <Link to={`/news/${id}`} style={{ textDecoration: 'none' }}>
                <h2>{title}</h2>
            </Link>
            <img src={imageUrl || defaultImage} alt={title || 'Default'} className="news-image" />
            <div
                ref={contentRef}
                style={{ maxHeight: `${maxHeight}` }} // Use the maxHeight state here
                className="content"
            >
                <p>{renderedDescription}</p>
            </div>
            {description.length > 100 && (
                <button onClick={toggleExpand} className="toggle-content-btn">
                    {isExpanded ? 'Згорнути' : 'Розгорнути'}
                </button>
            )}
        </div>
    );
};

export default NewsItem;

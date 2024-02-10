import React, { useState, useRef, useEffect } from 'react';
import './NewsItem.css';
import defaultImage from '../../img/image_2024-02-07_10-47-09.png';

// Встановлення максимальної висоти для прев'ю
const MAX_PREVIEW_HEIGHT = '100px';

export const NewsItem = ({ id, title, description, imageUrl }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const contentRef = useRef(null);

    useEffect(() => {
        // Початково встановлюємо максимальну висоту, щоб показати частину тексту
        contentRef.current.style.maxHeight = isExpanded ? `${contentRef.current.scrollHeight}px` : MAX_PREVIEW_HEIGHT;
    }, [isExpanded]);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="news-item">
            <h2>{title}</h2>
            <img src={imageUrl || defaultImage} alt={title || 'Default'} className="news-image" />
            <div ref={contentRef} className="content">
                <p>{description}</p>
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

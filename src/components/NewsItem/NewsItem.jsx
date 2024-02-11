import React, { useState, useRef, useEffect } from 'react';
import './NewsItem.css';
import defaultImage from '../../img/image_2024-02-07_10-47-09.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import {Link} from "react-router-dom";

const NewsItem = ({ id, title, description, imageUrl }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const contentRef = useRef(null);

    useEffect(() => {
        if (isExpanded) {
            contentRef.current.style.maxHeight = `${contentRef.current.scrollHeight}px`;
        } else {
            contentRef.current.style.maxHeight = '55px'; // Set to '0px' to hide content
        }
    }, [isExpanded]);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className={`news-item ${isExpanded ? 'expanded' : ''}`}>
            <Link to={`/news/${id}`} style={{ textDecoration: 'none' }}>
                <h2>{title}</h2>
                <img src={imageUrl || defaultImage} alt={title || 'Default'} className="news-image" />
            </Link>
            <div ref={contentRef} className="content">
                <p>{description}</p>
            </div>
            <button onClick={toggleExpand} className="toggle-content-btn">
                {isExpanded ? (
                    <>
                        Згорнути <FontAwesomeIcon icon={faAngleUp} />
                    </>
                ) : (
                    <>
                        Розгорнути <FontAwesomeIcon icon={faAngleDown} />
                    </>
                )}
            </button>
        </div>
    );
};

export default NewsItem;
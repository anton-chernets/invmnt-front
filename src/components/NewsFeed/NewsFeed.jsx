import React, { useState, useEffect } from 'react';
import defaultImage from '../../img/image_2024-02-07_10-47-09.png';
import NewsItem from "../NewsItem/NewsItem";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';



const NewsFeed = () => {
    const [news, setNews] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [newsPerPage] = useState(10);
    const [paginationInfo, setPaginationInfo] = useState({
        current_page: 1,
        last_page: 1,
        total: 1,
        per_page: 10
    });

    useEffect(() => {
        const fetchNews = async () => {
            const url = `https://apinvmnt.site/api/articles?page=${currentPage}&limit=${newsPerPage}`;
            try {
                const response = await fetch(url);
                const data = await response.json();
                setNews(data?.data || []);
                setPaginationInfo(data?.meta || {});
            } catch (error) {
                console.error('Error fetching news:', error);
            }
        };

        fetchNews();
    }, [currentPage, newsPerPage]);

    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({
          top: 0,
          behavior: 'smooth' // Забезпечує плавну прокрутку
        });
    };


    const Pagination = ({ currentPage, onPageClick, total, last_page }) => {
        if (last_page <= 1) return null;
    
        
        const delta = 2; 
        const range = [];
        for (let i = Math.max(2, currentPage - delta); i <= Math.min(last_page - 1, currentPage + delta); i++) {
            range.push(i);
        }
    
        if (currentPage - delta > 2) {
            range.unshift("...");
        }
        if (currentPage + delta < last_page)
            {
            range.push("...");
            }
        range.unshift(1);
            if (last_page !== 1) range.push(last_page);
            
            return (
            <div className="pagination">
                <button onClick={() => onPageClick(1)} disabled={currentPage === 1}>
                    <FontAwesomeIcon icon={faAngleLeft} /> У Початок
                </button>
                <button onClick={() => onPageClick(currentPage - 1)} disabled={currentPage === 1}>
                    <FontAwesomeIcon icon={faAngleLeft} /> 
                </button>
                {range.map((number, index) =>
                    number === "..." ? (
                <span key={index} className="pagination-ellipsis">…</span>
                ) : (
                    <button
                        key={number}
                        onClick={() => onPageClick(number)}
                        className={currentPage === number ? 'active' : ''}
                        >
                        {number}
                    </button>
                )
            )}
                    <button onClick={() => onPageClick(currentPage + 1)} disabled={currentPage === last_page}>
                        <FontAwesomeIcon icon={faAngleRight} />
                    </button>
                    <button onClick={() => onPageClick(last_page)} disabled={currentPage === last_page}>
                        У Кінець <FontAwesomeIcon icon={faAngleRight} />
                    </button>
                </div>
                );
            };
            

    return (
        <div className="news-container">
            <div className="news-items">
                {news.map((item) => (
                    <NewsItem
                        key={item.id}
                        id={item.id}
                        alias={item.alias}
                        title={item.title}
                        description={item.description}
                        imageUrl={item.images && item.images.length > 0 ? item.images[0] : defaultImage}
                    />
                ))}
            </div>
            <Pagination 
                currentPage={paginationInfo.current_page} 
                onPageClick={handlePageClick}
                total={paginationInfo.total}
                last_page={paginationInfo.last_page}
            />
        </div>
    );
};

export default NewsFeed;
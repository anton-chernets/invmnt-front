import React, { useState, useEffect } from 'react';
import defaultImage from '../../img/image_2024-02-07_10-47-09.png';
import NewsItem from "../NewsItem/NewsItem";


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
    };

    const Pagination = ({ currentPage, onPageClick, last_page }) => {
        if (last_page <= 1) return null;
    
        const pageNumbers = [];
        for (let i = 1; i <= last_page; i++) {
            pageNumbers.push(i);
        }
        return (
            <div className="pagination">
                {pageNumbers.map(number => ( 
                    <button
                        key={number} 
                        onClick={() => onPageClick(number)} 
                        disabled={currentPage === number} 
                        className={currentPage === number ? 'active' : ''}
                    >
                        {number} 
                        
                    </button>
                ))}
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
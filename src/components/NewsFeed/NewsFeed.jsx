import React, { useState, useEffect } from 'react';
import defaultImage from '../../img/image_2024-02-07_10-47-09.png';
import NewsItem from "../NewsItem/NewsItem";


const NewsFeed = () => {
    const [news, setNews] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [newsPerPage] = useState(10);

    useEffect(() => {
        const fetchNews = async () => {
            const url = `https://apinvmnt.site/api/articles?page=${currentPage}&limit=${newsPerPage}`;
            try {
                const response = await fetch(url);
                const data = await response.json();
                setNews(data?.data || []);
            } catch (error) {
                console.error('Error fetching news:', error);
            }
        };

        fetchNews();
    }, [currentPage, newsPerPage]);

    const handlePageClick = (event, pageNumber) => {
        event.preventDefault();
        setCurrentPage(pageNumber);
    };

    const Pagination = ({ currentPage, handlePageClick }) => {
        // Припустимо, що маємо 100 новин загалом, це число може бути динамічним
        const pageCount = Math.ceil(100 / newsPerPage);
        return (
            <div className="pagination">
                {Array.from({ length: pageCount }, (_, i) => i + 1).map(pageNumber => (
                    <button
                        key={pageNumber}
                        onClick={(e) => handlePageClick(e, pageNumber)}
                        disabled={currentPage === pageNumber}
                    >
                        {pageNumber}
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
                <Pagination currentPage={currentPage} handlePageClick={handlePageClick} />
            </div>
            
        </div>
    );
};

export default NewsFeed;


// import React, { useState, useEffect } from 'react';
// import defaultImage from '../../img/image_2024-02-07_10-47-09.png';
// import NewsItem from "../NewsItem/NewsItem";

// const NewsFeed = () => {
//     const [news, setNews] = useState([]);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [newsPerPage, setNewsPerPage] = useState(10);
//     const [totalNews, setTotalNews] = useState(0);

//     useEffect(() => {
//         const fetchNews = async () => {
//             const url = `https://apinvmnt.site/api/articles?page=${currentPage}&limit=${newsPerPage}`;
//             try {
//                 const response = await fetch(url);
//                 const data = await response.json();
//                 setNews(data?.data?.articles || []);
//                 setTotalNews(data?.data?.total || 0);
//             } catch (error) {
//                 console.error('Error fetching news:', error);
//             }
//         };

//         fetchNews();
//     }, [currentPage, newsPerPage]);

//     const handlePageClick = (pageNumber) => {
//         setCurrentPage(pageNumber);
//     };

//     const Pagination = ({ total, perPage, currentPage, onPageClick }) => {
//         const pageCount = Math.ceil(total / perPage);
//         return (
//             <div className="pagination">
//                 {Array.from({ length: pageCount }, (_, index) => index + 1).map(pageNumber => (
//                     <button
//                         key={pageNumber}
//                         onClick={() => onPageClick(pageNumber)}
//                         className={currentPage === pageNumber ? 'active' : ''}
//                     >
//                         {pageNumber}
//                     </button>
//                 ))}
//             </div>
//         );
//     };

//     return (
//         <div className="news-container">
//             <div className="news-items">
//                 {news.map((item) => (
//                     <NewsItem
//                         key={item.id}
//                         id={item.id}
//                         alias={item.alias}
//                         title={item.title}
//                         description={item.description}
//                         imageUrl={item.images && item.images.length > 0 ? item.images[0] : defaultImage}
//                     />
//                 ))}
//             </div>
//             <Pagination 
//                 total={totalNews} 
//                 perPage={newsPerPage} 
//                 currentPage={currentPage} 
//                 onPageClick={handlePageClick} 
//             />
//         </div>
//     );
// };

// export default NewsFeed;

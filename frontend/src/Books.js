import React, { useState, useEffect } from "react";
import { GrChapterPrevious, GrChapterNext } from "react-icons/gr";
import axios from 'axios';
import './Books.css';

const Books = () => {
    const [books, setBooks] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sortBy, setSortBy] = useState('title');
    const [sortOrder, setSortOrder] = useState('asc');
    const [totalPages, setTotalPages] = useState(1);
    const [totalBooks, setTotalBooks] = useState(0);
    const [error,setError] = useState(null);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios.get('https://book-management-lemon.vercel.app/books',{
                    params: {
                        page,
                        page_size: pageSize,
                        sort_by:sortBy,
                        sort_order: sortOrder
                    }
                });
    
                if(response && response.data){
                    setBooks(response.data.books);
                    setTotalPages(response.data.totalPages);
                    setTotalBooks(response.data.totalBooks);
                }
            } catch (err) {
                setError(err.message || 'Error fetching books');
                console.error('Error fetching books:',err);
            }
        };

        fetchBooks();
    },[page, pageSize, sortBy, sortOrder]);

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handleSortChange = (event) => {
        const [newSortBy, newSortOrder] = event.target.value.split(',');
        setSortBy(newSortBy);
        setSortOrder(newSortOrder);
        setPage(1);
    };

    const handlePageSizeChange = (event) => {
        setPageSize(parseInt(event.target.value));
        setPage(1);
    }

    const renderPageNumbers = () => {
        const pageNumbers = [];
        
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(
              <button
                key={i}
                onClick={() => handlePageChange(i)}
                className={i === page ? 'active' : ''}
              >
                {i}
              </button>
            );
          }

        return pageNumbers;
    }

    if(error){
        return <div className="books-container">Error: {error}</div>;
    }

    return (
        <div className="books-container">
            <h1>Books</h1>
            <div className="controls">
            <div>
                <strong>Sort By:</strong>
                    <select onChange={handleSortChange}>
                        <option value="title,asc">Title (A-Z)</option>
                        <option value="title,desc">Title (Z-A)</option>
                        <option value="author,asc">Author (A-Z)</option>
                        <option value="author,desc">Author (Z-A)</option>
                        <option value="publication_year,asc">Publication Year (Asc)</option>
                        <option value="publication_year,desc">Publication Year (Desc)</option>
                        <option value="genre,asc">Genre (A-Z)</option>
                        <option value="genre,desc">Genre (Z-A)</option>
                    </select>
                
            </div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Publication Year</th>
                        <th>Genre</th>
                    </tr>
                </thead>
                <tbody>
                    {books.map(book => (
                        <tr key={book.id}>
                            <td>{book.title}</td>
                            <td>{book.author}</td>
                            <td>{book.publication_year}</td>
                            <td>{book.genre}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="pagination-info">
                <button onClick={() => handlePageChange(page-1)} disabled={page === 1}>
                <GrChapterPrevious />
                </button>
                {renderPageNumbers()}
                <button onClick={() => handlePageChange(page+1)} disabled={page === totalPages}>
                <GrChapterNext />
                </button>
            </div>

            <div className="controls">
                <strong>Page Size:</strong>
                    <select value={pageSize} onChange={handlePageSizeChange}>
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>
                
            </div>

            <div className="total-books">Total Books: <strong>{totalBooks}</strong></div>
        </div>
    );
};

export default Books;
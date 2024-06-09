const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.get('/books',async(req,res) => {
    try {
        const DEFAULT_PAGE = 1;
        const DEFAULT_PAGE_SIZE = 10;
        const DEFAULT_SORT_BY = 'title';
        const DEFAULT_SORT_ORDER = 'asc';

        const page = parseInt(req.query.page) || DEFAULT_PAGE;
        const pageSize = parseInt(req.query.page_size) || DEFAULT_PAGE_SIZE;
        const sortBy = req.query.sort_by || DEFAULT_SORT_BY;
        const sortOrder = req.query.sort_order || DEFAULT_SORT_ORDER;

        if(page<1){
            return res.status(400).json({error:"Invalid page parameter"});
        }
        if(pageSize<1 || pageSize>50){
            return res.status(400).json({error:"Inavlid pageSize parameter"})
        }
        if(!['title','author','publication_year','genre'].includes(sortBy)){
            return res.status(400).json({ error: "Invalid sort_by parameter." });
        }
        if (!['asc', 'desc'].includes(sortOrder)) {
            return res.status(400).json({ error: "Invalid sort_order parameter." });
        }

        const response = await axios.get('https://freetestapi.com/api/v1/books');
        let books = response.data;

        const validateSortFields = ['title', 'author', 'publication_year', 'genre'];

        if(!validateSortFields.includes(sortBy)){
            return res.status(400).json({error:'Invalid sort by parameter'});
        }

        books = books.sort((a,b) => {
            if(sortOrder === 'asc'){
                return a[sortBy] > b[sortBy] ? 1 : -1;
            }
            else{
                return a[sortBy] < b[sortBy] ? 1 : -1;
            }
        });

        const totalBooks = books.length;
        const totalPages = Math.ceil(totalBooks / pageSize);
        const paginatedBooks = books.slice((page-1)*pageSize,page*pageSize);

        res.json({
            books:paginatedBooks,
            totalBooks,
            totalPages,
            currentPage: page,
            pageSize: pageSize
        });
    } catch (error) {
        res.status(500).json({error:'Server error'});
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
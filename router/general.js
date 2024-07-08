const express = require('express');
const axios = require('axios');
const books = require("./booksdb.js");
const general_routes = express.Router();

// Route to get list of books using async-await with Axios
general_routes.get('/books', async (req, res) => {
  try {
    res.json(Object.values(books));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books' });
  }
});

// Route to get book details by ISBN
general_routes.get('/books/:isbn', async (req, res) => {
  const { isbn } = req.params;
  try {
    const book = Object.values(books).find(book => book.isbn === isbn);
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching book details' });
  }
});

// Route to get book details by Author
general_routes.get('/books/author/:author', async (req, res) => {
  const { author } = req.params;
  try {
    const booksByAuthor = Object.values(books).filter(book => book.author.toLowerCase() === author.toLowerCase());
    if (booksByAuthor.length > 0) {
      res.json(booksByAuthor);
    } else {
      res.status(404).json({ message: 'Books by author not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books by author' });
  }
});

// Route to get book details by Title
general_routes.get('/books/title/:title', async (req, res) => {
  const { title } = req.params;
  try {
    const bookByTitle = Object.values(books).find(book => book.title.toLowerCase() === title.toLowerCase());
    if (bookByTitle) {
      res.json(bookByTitle);
    } else {
      res.status(404).json({ message: 'Book by title not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching book by title' });
  }
});

module.exports = {
  general: general_routes
};

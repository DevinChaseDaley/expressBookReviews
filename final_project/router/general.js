const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (username === null || password === null) {
        return res.status(400).json({ message: `Username or password is null.` })
    }
    if (users[username]) {
        return res.status(409).json({ message: `Username ${username} already in use.` });
    }
    users[username] = { username, password };
    return res.status(201).json({ message: `User successfully registered.` });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {
        const response = await axios.get(books);
        return res.send(response.data);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch books." });
      }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book != null) {
        return res.status(200).send(book);
    }
    else {
        return res.status(404).json({ message: `Book with ISBN ${isbn} could not be found.` })
    }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const filteredBooks = Object.fromEntries(
        Object.entries(books).filter(([isbn, book]) => book.author === author)
    );
    if (Object.keys(filteredBooks).length > 0) {
        return res.status(200).send(filteredBooks);
    }
    else {
        return res.status(404).json({ message: `No books by the author ${author} were found.` });
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const filteredBooks = Object.fromEntries(
        Object.entries(books).filter(([isbn, book]) => book.title === title)
    );
    if (Object.keys(filteredBooks).length > 0) {
        return res.status(200).send(filteredBooks);
    }
    else {
        return res.status(404).json({ message: `No books with the title ${title} were found.` });
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book != null) {
        if (Object.keys(book.reviews).length > 0) {
            return res.status(200).send(book.reviews);
        }
        else {
            return res.status(204).json({ message: `Book with ISBN ${isbn} does not have any reviews.` });
        }
    }
    else {
        return res.status(404).json({ message: `Book with ISBN ${isbn} could not be found.` });
    }
});

module.exports.general = public_users;

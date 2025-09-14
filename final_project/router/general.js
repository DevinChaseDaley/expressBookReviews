const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    //Write your code here
    return res.status(300).json({ message: "Yet to be implemented" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    return res.send(books);
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
        return res.status(404).json({ message: `No books by the author ${author} were found.`});
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
        return res.status(404).json({ message: `No books with the title ${title} were found.`});
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
            return res.status(200).json({ message: `Book with ISBN ${isbn} does not have any reviews.` });
        }
    }
    else {
        return res.status(404).json({ message: `Book with ISBN ${isbn} could not be found.` });
    }
});

module.exports.general = public_users;

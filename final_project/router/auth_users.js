const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const JWT_SECRET = "myJWTSecret";
let users = [];

const isValid = (username) => { //returns boolean
    const user = users[username];
    if (user != null) {
        return true;
    }
    return false;
}

const authenticatedUser = (username, password) => { //returns boolean
    if (username == null || password == null) {
        return false;
    }
    const user = users[username];
    if (!user || user.password !== password) {
        return false;
    }
    return true;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (authenticatedUser(username, password)) {
        const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
        req.session.token = token;
        req.session.user = username;
        console.log(req.session.token);
        console.log(req.session.user);
        return res.status(200).json({ message: "Login successful." });
    }
    else {
        return res.status(401).json({ message: "Invalid credentials." });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const incomingReview = req.query;
    console.log(incomingReview);
    if (incomingReview != null) {
        const isbn = req.params.isbn;
        let book = books[isbn];
        let reviews = book.reviews;
        let review = reviews[req.session.user];
        review = incomingReview;
        reviews[req.session.user] = review;
        console.log(review);
        console.log(reviews);
        return res.status(200).json({ message: "Review submitted." });
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let book = books[isbn];
    let reviews = book.reviews;
    delete reviews[req.session.user];
    return res.status(200).json({ message: "Review deleted." });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.JWT_SECRET = JWT_SECRET;
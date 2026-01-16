const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const secretKey = "I'mHamedNAJANDAFullstackJSDeveloperAfterThisCourseOn20260115"
let users = [{ username: "najand", password: "123" }, { username: "hamed", password: "123" }];

const isValid = (username) =>
    users.filter(user => user.username == username).length > 0


const authenticatedUser = (username, password) => users.filter(user => user.username == username && user.password == password).length > 0

//only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body

    if (authenticatedUser(username, password)) {
        const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' })
        req.session.authorization = { token, username }
        res.status(300).json({ token, message: `${username} logged in!` })
    } else
        res.status(401).json({ "message": 'The username/password is invalid!' })
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const username = req.username
    const { isbn } = req.params
    const { review } = req.body

    if (books[isbn]) {
        books[isbn].reviews[username] = review
        return res.json({ book: books[isbn], "message": "The review has been added/modified!" })
    } else
        return res.json({ "message": `There is no book related to this ISBN ${isbn}` })

});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const username = req.username
    const { isbn } = req.params

    if (!books[isbn])
        return res.json({ "message": `There is no book related to this ISBN ${isbn}` })

    if (!books[isbn].reviews[username])
        return res.json({ "message": `There is no review related to this user ${username}` })

    delete books[isbn].reviews[username]

    return res.status(200).json({ book: books[isbn], "message": "the review was successfully deleted!" })
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

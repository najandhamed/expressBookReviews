const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const getBooks = () => new Promise((res, rej) => res(books))

public_users.post("/register", (req, res) => {
    const { username, password } = req.body

    if (!username || !password)
        return res.json({ "message": "The username/password is not provided!" })

    const newUser = { username, password }

    if (!isValid(newUser)) {
        users.push(newUser)
        return res.json({ "message": "The user successfully registered!" })
    }

    return res.json({ "message": `${username} is exist!` })
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {
        const allBooks = await getBooks()
        const stringifyBooks = JSON.stringify(allBooks, null, 4)
        res.send(stringifyBooks)
    } catch (error) {
        res.status(500).send({ "message": "Error on retrieving books" })
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const { isbn } = req.params
    res.send(books[isbn])
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const { author } = req.params
    const findBook = Object.values(books).find(book => book.author.toLowerCase().includes(author.toLowerCase()))
    if (findBook)
        res.send(JSON.stringify(findBook, null, 4))
    else
        res.json({ "message": `No books found with ${author}!` })
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const { title } = req.params
    const findBook = Object.values(books).find(book => book.title.toLowerCase().includes(title.toLowerCase()))
    if (findBook)
        res.send(JSON.stringify(findBook, null, 4))
    else
        res.json({ "message": `No books found with ${title}!` })
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const { isbn } = req.params
    const book = books[isbn]
    if (book)
        res.send(JSON.stringify(book.reviews, null, 4))
    else
        res.json({ "message": `No books found with ${isbn}!` })
});

module.exports.general = public_users;

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
public_users.get('/isbn/:isbn', async function (req, res) {
    const { isbn } = req.params

    try {
        const allBooks = await getBooks()
        res.send(allBooks[isbn])
    } catch (error) {
        res.status(500).send({ "message": "Error on retrieving books" })
    }
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    const { author } = req.params

    try {
        const allBooks = await getBooks()

        const books = Object.values(allBooks).filter(book => book.author.toLowerCase().includes(author.toLowerCase()))

        if (books.length > 0) {
            res.status(200).send({ books, "message": "Successful" });
        } else {
            res.status(404).json({ message: "No books found for this author" });
        }
    } catch (error) {
        res.status(500).send({ "message": "Error on retrieving books" })
    }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    const { title } = req.params

    try {
        const allBooks = await getBooks()

        const books = Object.values(allBooks).filter(book => book.title.toLowerCase().includes(title.toLowerCase()))

        if (books.length > 0) {
            res.status(200).send({ books, "message": "Successful" });
        } else {
            res.status(404).json({ message: "No books found for this title" });
        }
    } catch (error) {
        res.status(500).send({ "message": "Error on retrieving books" })
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const { isbn } = req.params
    const book = books[isbn]
    if (book)
        res.status(200).send({ "review": book.reviews, "message": "Successful" })
    else
        res.json({ "message": `No books found with ${isbn}!` })
});

module.exports.general = public_users;

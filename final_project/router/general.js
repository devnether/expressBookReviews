const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({
        username: username,
        password: password,
      });
      return res
        .status(200)
        .json({ message: "User successfully registered. Now you can login" });
    } else return res.status(404).json({ message: "User already exist!" });
  }
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  return res.status(200).send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn; // Toma el parámetro de la ruta
  const bookArray = Object.values(books);

  if (!isbn) {
    return res.status(404).json({ message: "Please provide an ISBN" });
  }

  if (!Array.isArray(bookArray)) {
    return res
      .status(500)
      .json({ message: "Books data is not properly loaded" });
  }

  return res.status(200).send(JSON.stringify(bookArray[isbn - 1]));
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  const bookArray = Object.values(books);
  let booksByAuthor = [];

  if (!author) {
    return res.status(404).json({ message: "Please provide an Author" });
  }

  if (!Array.isArray(bookArray)) {
    return res
      .status(500)
      .json({ message: "Books data is not properly loaded" });
  }

  for (let i = 0; i < bookArray.length; i++) {
    if (bookArray[i].author === author) {
      booksByAuthor.push(bookArray[i]);
    }
  }

  if (booksByAuthor.length > 0) {
    return res.status(200).send(JSON.stringify(booksByAuthor));
  } else res.status(404).json({ message: "Books from that author were not found" });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  const bookArray = Object.values(books);
  let booksByTitle = [];

  if (!title) {
    console.log(title);
    return res.status(404).json({ message: "Please provide a title" });
  }

  if (!Array.isArray(bookArray)) {
    return res
      .status(500)
      .json({ message: "Books data is not properly loaded" });
  }

  for (let i = 0; i < bookArray.length; i++) {
    if (bookArray[i].title === title) {
      booksByTitle.push(bookArray[i]);
    }
  }

  if (booksByTitle.length > 0) {
    return res.status(200).send(JSON.stringify(booksByTitle));
  } else res.status(404).json({ message: "Books from that title were not found" });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const bookArray = Object.values(books);
  if (!isbn) {
    return res.status(404).json({ message: "Please provide an ISBN" });
  }

  if (!Array.isArray(bookArray)) {
    return res
      .status(500)
      .json({ message: "Books data is not properly loaded" });
  }
  console.log(bookArray[isbn - 1].reviews);
  return res.status(200).send(JSON.stringify(bookArray[isbn - 1].reviews));
});

module.exports.general = public_users;

const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  {
    username: "luis",
    password: "123",
  },
];

const isValid = (username) => {
  //The username is valid if the user exist
  let valid = false;

  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  if (userswithsamename.length > 0) {
    valid = true;
  }
  return valid;
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  let match = false;

  if (username.length > 0 && password.length > 0) {
    if (isValid(username)) {
      let authuser = users.filter((user) => {
        return user.username == username && user.password == password;
      });
      if (authuser.length > 0) {
        match = true;
      }
    }
  }
  return match;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  // Check if username or password is missing
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  // Authenticate user
  if (authenticatedUser(username, password)) {
    // Generate JWT access token
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );
    // Store access token and username in session
    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).send("User successfully logged in");
  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;

  // Verifica si el libro con el ISBN existe
  if (!books[isbn]) {
    return res
      .status(404)
      .json({ message: `Book with ISBN ${isbn} not found.` });
  }

  // Verifica si el campo 'review' está presente en el cuerpo de la solicitud
  if (!review) {
    return res
      .status(400)
      .json({ message: "Please provide a review in the request body." });
  }

  // Asegúrate de que las reseñas existan como un array
  if (!Array.isArray(books[isbn].reviews)) {
    books[isbn].reviews = [];
  }

  // Agrega la reseña al array de reseñas del libro
  books[isbn].reviews.push(review);

  return res.status(200).json({
    message: `Review added to the book with ISBN ${isbn}.`,
    reviews: books[isbn].reviews,
  });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  // Verifica si el libro con el ISBN existe
  if (!books[isbn]) {
    return res
      .status(404)
      .json({ message: `Book with ISBN ${isbn} not found.` });
  }

  // Elimina el libro
  delete books[isbn];

  return res.status(200).json({ message: `Book with ISBN ${isbn} deleted.` });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

// define the book model
let book = require('../models/books');

/* GET books List page. READ */
router.get('/', (req, res, next) => {
  // find all books in the books collection
  book.find( (err, books) => {
    if (err) {
      return console.error(err);
    }
    else {
      res.render('books/index', {
        title: 'Books',
        books: books
      });
    }
  });

});

//  GET the Book Details page in order to add a new Book
router.get('/add', (req, res, next) => {

  res.render('books/details', {
    title: 'Add Books Page',
    books: {} // Insert an empty object 
  });

});

// POST process the Book Details page and create a new Book - CREATE
router.post('/add', (req, res, next) => {

  console.log("logging add function", req.body);
  // Extract the book details from the request body
  const { title, description, price, author, genre } = req.body;

  // Create a new book object excluding the _id property
  const newBook = {
    Title: title,
    Description: description,
    Price: price,
    Author: author,
    Genre: genre
  };

  console.log("logging var newBook", JSON.stringify(newBook, null, 2)); // Format log
  // Use the create method of the book model to add a new book to the database
  book.create(newBook)
    .then(() => {
      // Redirect the user back to the BookList page
      res.redirect('/books');
    })
    .catch(err => {
      // Handle any errors that occur during the insertion process
      console.error(err);
      next(err);
    });
});

// GET the Book Details page in order to edit an existing Book
router.get('/:id', (req, res, next) => {

  console.log("logging req.params.id", req.params.id);

  const id = new mongoose.Types.ObjectId(req.params.id);

  book.findById(id, (err, foundBook) => {

    console.log("logging foundBook", foundBook);

    if (err) {
      console.error(err);
      next(err);
    } else {
      res.render('books/details', {
        title: 'Book Details',
        books: foundBook
      });
    }
  });
});

// POST - process the information passed from the details form and update the document
router.post('/:id', (req, res, next) => {

    const id = new mongoose.Types.ObjectId(req.params.id);

    const { title, description, price, author, genre } = req.body;

    // Create a new book object excluding the _id property
    const updateBook = {
      Title: title,
      Description: description,
      Price: price,
      Author: author,
      Genre: genre
    };
  
    
    // Use the create method of the book model to add a new book to the database
    book.findByIdAndUpdate(id, updateBook)
      .then(() => {
        // Redirect the user back to the BookList page
        res.redirect('/books');
      })
      .catch(err => {
        // Handle any errors that occur during the insertion process
        console.error(err);
        next(err);
      });
});

// GET - process the delete by user id
router.get('/delete/:id', (req, res, next) => {

    const id = new mongoose.Types.ObjectId(req.params.id);
    
    // Use the create method of the book model to add a new book to the database
    book.findByIdAndDelete(id)
      .then(() => {
        // Redirect the user back to the BookList page
        res.redirect('/books');
      })
      .catch(err => {
        // Handle any errors that occur during the insertion process
        console.error(err);
        next(err);
      });
});


module.exports = router;

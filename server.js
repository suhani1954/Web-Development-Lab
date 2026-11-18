
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Sample book collection
let books = [
    {
        id: 1,
        title: "The Alchemist",
        author: "Paulo Coelho",
        year: 1988
    },
    {
        id: 2,
        title: "Atomic Habits",
        author: "James Clear",
        year: 2018
    }
];

// Welcome route
app.get("/", (req, res) => {
    res.send("Welcome to the Book Collection REST API!");
});

// READ: Get all books
app.get("/api/books", (req, res) => {
    res.status(200).json(books);
});

// READ: Get a book by ID
app.get("/api/books/:id", (req, res) => {
    const id = Number(req.params.id);

    const book = books.find(b => b.id === id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    res.status(200).json(book);
});

// CREATE: Add a new book
app.post("/api/books", (req, res) => {
    const { title, author, year } = req.body;

    if (
        typeof title !== "string" ||
        !title.trim() ||
        typeof author !== "string" ||
        !author.trim() ||
        !Number.isInteger(year) ||
        year <= 0
    ) {
        return res.status(400).json({
            message: "Valid title, author and year are required"
        });
    }

    const newBook = {
        id: books.length
            ? Math.max(...books.map(b => b.id)) + 1
            : 1,
        title: title.trim(),
        author: author.trim(),
        year
    };

    books.push(newBook);

    res.status(201).json({
        message: "Book added successfully",
        book: newBook
    });
});

// UPDATE: Update a book
app.put("/api/books/:id", (req, res) => {
    const id = Number(req.params.id);

    const book = books.find(b => b.id === id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    const { title, author, year } = req.body;

    if (
        typeof title !== "string" ||
        !title.trim() ||
        typeof author !== "string" ||
        !author.trim() ||
        !Number.isInteger(year) ||
        year <= 0
    ) {
        return res.status(400).json({
            message: "Valid title, author and year are required"
        });
    }

    book.title = title.trim();
    book.author = author.trim();
    book.year = year;

    res.status(200).json({
        message: "Book updated successfully",
        book
    });
});

// DELETE: Delete a book
app.delete("/api/books/:id", (req, res) => {
    const id = Number(req.params.id);

    const index = books.findIndex(b => b.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    const deletedBook = books.splice(index, 1)[0];

    res.status(200).json({
        message: "Book deleted successfully",
        book: deletedBook
    });
});

// Handle invalid routes
app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

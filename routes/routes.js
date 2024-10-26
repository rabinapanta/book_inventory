const express = require('express');
const mysql = require('mysql2/promise'); // Using promise-based mysql2
const fs = require('fs');
const json2csv = require('json2csv').parse;

const router = express.Router();

// Function to connect to MySQL database
async function connectToDatabase() {
    return await mysql.createConnection({
        host: 'localhost',
        user: 'newuser', // MySQL username
        password: '1395', // MySQL password
        database: 'BookInventoryDB'
    });
}

/**
 * @route GET /books
 * @desc Get all books or filter books based on query parameters
 * @access Public
 */
router.get('/books', async (req, res) => {
    const { title, author, genre, publicationDate } = req.query;
    let query = 'SELECT * FROM Inventory';
    let conditions = [];
    let params = [];

    // Add filters to the query if provided
    if (title) {
        conditions.push('Title LIKE ?');
        params.push(`%${title}%`);
    }
    if (author) {
        conditions.push('Author LIKE ?');
        params.push(`%${author}%`);
    }
    if (genre) {
        conditions.push('Genre LIKE ?');
        params.push(`%${genre}%`);
    }
    if (publicationDate) {
        conditions.push('PublicationDate = ?');
        params.push(publicationDate);
    }

    if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
    }

    try {
        const connection = await connectToDatabase();
        const [results] = await connection.execute(query, params);
        await connection.end();
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @route POST /books
 * @desc Add a new book
 * @access Public
 */
router.post('/books', async (req, res) => {
    const { Title, Author, Genre, PublicationDate, ISBN } = req.body;

    // Validate input data
    if (!Title || !Author || !Genre || !PublicationDate || !ISBN) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const connection = await connectToDatabase();

        // Check if the book with the same ISBN already exists
        const [existingBook] = await connection.execute('SELECT * FROM Inventory WHERE ISBN = ?', [ISBN]);
        if (existingBook.length > 0) {
            await connection.end();
            return res.status(400).json({ error: 'Book already added.' }); // Return error if ISBN exists
        }

        // Insert the new book into the database
        await connection.execute(
            'INSERT INTO Inventory (Title, Author, Genre, PublicationDate, ISBN) VALUES (?, ?, ?, ?, ?)',
            [Title, Author, Genre, PublicationDate, ISBN]
        );
        await connection.end();
        res.status(201).json({ message: 'Book added successfully.' }); // Success message
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


/**
 * @route GET /export/csv
 * @desc Export book inventory data in CSV format
 * @access Public
 */
router.get('/export/csv', async (req, res) => {
    try {
        const connection = await connectToDatabase();
        const [results] = await connection.execute('SELECT * FROM Inventory');
        const csv = json2csv(results);
        
        fs.writeFile('inventory.csv', csv, (err) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.download('inventory.csv', 'inventory.csv', (err) => {
                if (err) {
                    console.error(err);
                }
                fs.unlinkSync('inventory.csv'); // Optionally delete the file after download
            });
        });
        await connection.end();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @route GET /export/json
 * @desc Export book inventory data in JSON format
 * @access Public
 */
router.get('/export/json', async (req, res) => {
    try {
        const connection = await connectToDatabase();
        const [results] = await connection.execute('SELECT * FROM Inventory');
        await connection.end();
        res.json(results); // Send the JSON response directly
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Error handling for unsupported routes
router.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

module.exports = router;

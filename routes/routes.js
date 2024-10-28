const express = require('express');
const mysql = require('mysql2/promise'); // Using promise-based mysql2
const fs = require('fs');
const json2csv = require('json2csv').parse;

const router = express.Router();

// Create MySQL connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'newuser', // MySQL username
    password: '1395', // MySQL password
    database: 'BookInventoryDB',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Function to connect to MySQL database
async function connectToDatabase() {
    try {
        return await pool.getConnection(); // Return the connection for use
    } catch (error) {
        console.error('Database connection error:', error);
        throw error; // Throw error to handle it at a higher level
    }
}

// Test database connection route
router.get('/test-connection', async (req, res) => {
    try {
        const connection = await connectToDatabase();
        const [results] = await connection.execute('SELECT 1');
        connection.release();
        res.status(200).json({ message: 'Database connection successful', results });
    } catch (err) {
        console.log('Database connection error:', err);
        res.status(500).json({ error: 'Database connection failed', details: err.message });
    }
});

/**
 * @route GET /books
 * @desc Get all books or filter books based on query parameters
 * @access Public
 */
router.get('/books', async (req, res) => {
    const { Title, Author, Genre, PublicationDate } = req.query;
    let query = 'SELECT * FROM Inventory WHERE 1=1'; // Base query
    let params = [];

    // Add filters based on query parameters
    if (Title) {
        query += ' AND Title LIKE ?';
        params.push(`%${Title.trim()}%`); 
    }
    if (Author) {
        query += ' AND Author LIKE ?';
        params.push(`%${Author.trim()}%`); 
    }
    if (Genre) {
        query += ' AND Genre LIKE ?';
        params.push(`%${Genre.trim()}%`); 
    }
    if (PublicationDate) {
        query += ' AND PublicationDate = ?';
        params.push(PublicationDate.trim()); 
    }

    console.log('Constructed query:', query);
    console.log('Query parameters:', params);

    try {
        const connection = await connectToDatabase();
        const [results] = await connection.execute(query, params);
        connection.release(); // Release the connection back to the pool
        res.json(results);
    } catch (err) {
        console.error('Error fetching books:', err);
        res.status(500).json({ error: 'An error occurred while fetching books.' });
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
            connection.release();
            return res.status(409).json({ error: 'Book with this ISBN already exists' });
        }

        // Insert the new book
        const [result] = await connection.execute(
            'INSERT INTO Inventory (Title, Author, Genre, PublicationDate, ISBN) VALUES (?, ?, ?, ?, ?)',
            [Title, Author, Genre, PublicationDate, ISBN]
        );

        connection.release();

        if (result.affectedRows === 1) {
            res.status(201).json({ message: 'Book added successfully' });
        } else {const express = require('express');
            const mysql = require('mysql2/promise'); // Using promise-based mysql2
            const fs = require('fs');
            const json2csv = require('json2csv').parse;
            
            const router = express.Router();
            
            // Create MySQL connection pool
            const pool = mysql.createPool({
                host: 'localhost',
                user: 'newuser', // MySQL username
                password: '1395', // MySQL password
                database: 'BookInventoryDB',
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0
            });
            
            // Function to connect to MySQL database
            async function connectToDatabase() {
                try {
                    return await pool.getConnection(); // Return the connection for use
                } catch (error) {
                    console.error('Database connection error:', error);
                    throw error; // Throw error to handle it at a higher level
                }
            }
            
            // Test database connection route
            router.get('/test-connection', async (req, res) => {
                try {
                    const connection = await connectToDatabase();
                    const [results] = await connection.execute('SELECT 1');
                    connection.release();
                    res.status(200).json({ message: 'Database connection successful', results });
                } catch (err) {
                    console.log('Database connection error:', err);
                    res.status(500).json({ error: 'Database connection failed', details: err.message });
                }
            });
            
            /**
             * @route GET /books
             * @desc Get all books or filter books based on query parameters
             * @access Public
             */
            router.get('/books', async (req, res) => {
                const { Title, Author, Genre, PublicationDate } = req.query;
                let query = 'SELECT * FROM Inventory WHERE 1=1'; // Base query
                let params = [];
            
                // Add filters based on query parameters
                if (Title) {
                    query += ' AND Title LIKE ?';
                    params.push(`%${Title.trim()}%`); 
                }
                if (Author) {
                    query += ' AND Author LIKE ?';
                    params.push(`%${Author.trim()}%`); 
                }
                if (Genre) {
                    query += ' AND Genre LIKE ?';
                    params.push(`%${Genre.trim()}%`); 
                }
                if (PublicationDate) {
                    query += ' AND PublicationDate = ?';
                    params.push(PublicationDate.trim()); 
                }
            
                console.log('Constructed query:', query);
                console.log('Query parameters:', params);
            
                try {
                    const connection = await connectToDatabase();
                    const [results] = await connection.execute(query, params);
                    connection.release(); // Release the connection back to the pool
                    res.json(results);
                } catch (err) {
                    console.error('Error fetching books:', err);
                    res.status(500).json({ error: 'An error occurred while fetching books.' });
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
                        connection.release();
                        return res.status(409).json({ error: 'Book with this ISBN already exists' });
                    }
            
                    // Insert the new book
                    const [result] = await connection.execute(
                        'INSERT INTO Inventory (Title, Author, Genre, PublicationDate, ISBN) VALUES (?, ?, ?, ?, ?)',
                        [Title, Author, Genre, PublicationDate, ISBN]
                    );
            
                    connection.release();
            
                    if (result.affectedRows === 1) {
                        res.status(201).json({ message: 'Book added successfully' });
                    } else {
                        res.status(500).json({ error: 'Failed to add book' });
                    }
                } catch (err) {
                    console.error('Database error:', err.message);
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
                            connection.release();
                            return res.status(500).json({ error: err.message });
                        }
                        res.download('inventory.csv', 'inventory.csv', (err) => {
                            if (err) {
                                console.error(err);
                            }
                            fs.unlinkSync('inventory.csv'); // Optionally delete the file after download
                        });
                    });
                    connection.release();
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
                    connection.release();
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
            
            res.status(500).json({ error: 'Failed to add book' });
        }
    } catch (err) {
        console.error('Database error:', err.message);
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
                connection.release();
                return res.status(500).json({ error: err.message });
            }
            res.download('inventory.csv', 'inventory.csv', (err) => {
                if (err) {
                    console.error(err);
                }
                fs.unlinkSync('inventory.csv'); // Optionally delete the file after download
            });
        });
        connection.release();
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
        connection.release();
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

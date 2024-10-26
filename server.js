const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const routes = require('./routes/routes'); // Import the routes

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Use the routes from routes.js, prefixed with '/api'
app.use('/api', routes); // Prefixing with '/api' for cleaner API structure

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

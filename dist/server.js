const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = 3000;

// Serve static files from the current directory (dist)
app.use(express.static(__dirname));

// Default route for index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route for menuChat.html (Chat page)
app.get('/menuChat', (req, res) => {
    res.sendFile(path.join(__dirname, 'menuChat.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

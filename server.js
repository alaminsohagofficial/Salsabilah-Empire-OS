const express = require('express');
const cors = require('cors');
require('dotenv').config();

const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Base Health Check Route
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        empire: "Salsabilah Amin Empires Ltd.",
        system: "Salsabilah Empire POS Engine",
        location: "SR Electronics Park, Hatboalia",
        status: "Operational & Secured"
    });
});

// Central API Routes
app.use('/api', apiRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('[Global Error]:', err.stack);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`👑 Salsabilah Empire POS Server is running on port ${PORT}`);
});

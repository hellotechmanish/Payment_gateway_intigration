require('dotenv').config();
const express = require('express');
const app = express();
const homeRoutes = require('./routes/homeRoutes');
const paymentRoutes = require('./routes/paymentRoutes');


const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set EJS as view engine
app.set('view engine', 'ejs');
app.set('views', './src/views');

// Routes
app.use('/', homeRoutes);
// Use Payment Routes
app.use('/payment', paymentRoutes);

// Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

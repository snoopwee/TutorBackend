const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');

dotenv.config();

const app = express();

app.use(cors()); // Allow CORS for all origins (for development, refine in production)
app.use(express.json());

app.use('/api/auth', authRoutes); // Mount auth routes

const PORT = process.env.PORT || 3000; // Change to use the port from .env or default to 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

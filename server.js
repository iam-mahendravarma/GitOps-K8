const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static UI
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
const mongodbUri = process.env.MONGODB_URI || 'mongodb+srv://assets:India%40123@node-js.oxpae8x.mongodb.net/data-entry';
mongoose
  .connect(mongodbUri, { autoIndex: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
  });

// Routes
const credentialsRouter = require('./src/routes/credentials');
const authRouter = require('./src/routes/auth');
app.use('/api/credentials', credentialsRouter);
app.use('/api/auth', authRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});



require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true, timestamp: new Date().toISOString() }));

app.use('/api/auth', require('./routes/auth.routes'));

app.use('/api/categories', require('./routes/category.routes'));
app.use('/api/questions', require('./routes/question.routes'));

const answerRoutes = require('./routes/answer.routes');

app.use('/api/answers', answerRoutes);

module.exports = app;
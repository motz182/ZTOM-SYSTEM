const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiting configuration
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // limite de 100 requisições por janela
    message: 'Muitas requisições deste IP, tente novamente mais tarde.',
    standardHeaders: true,
    legacyHeaders: false,
});

const strictApiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 20, // limite de 20 requisições por janela para operações pesadas
    message: 'Muitas requisições deste IP, tente novamente mais tarde.',
    standardHeaders: true,
    legacyHeaders: false,
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Database connection (optional - works without MongoDB for demo)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ztom-erp';
if (process.env.MONGODB_URI) {
    mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('MongoDB conectado com sucesso'))
    .catch((err) => console.log('MongoDB não disponível, usando dados em memória:', err.message));
}

// Routes
const aluminumRoutes = require('./routes/aluminum');
app.use('/api/aluminum', apiLimiter, aluminumRoutes);

// Rate limiter for static pages
const pageLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minuto
    max: 30, // limite de 30 requisições por minuto
    message: 'Muitas requisições, tente novamente mais tarde.',
    standardHeaders: true,
    legacyHeaders: false,
});

// Serve landing page
app.get('/', pageLimiter, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Serve ERP dashboard
app.get('/erp', pageLimiter, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/erp.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Servidor ZTOM ERP rodando na porta ${PORT}`);
    console.log(`Landing Page: http://localhost:${PORT}`);
    console.log(`ERP Dashboard: http://localhost:${PORT}/erp`);
});

module.exports = app;

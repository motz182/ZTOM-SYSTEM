const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

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
app.use('/api/aluminum', aluminumRoutes);

// Serve landing page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Serve ERP dashboard
app.get('/erp', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/erp.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Servidor ZTOM ERP rodando na porta ${PORT}`);
    console.log(`Landing Page: http://localhost:${PORT}`);
    console.log(`ERP Dashboard: http://localhost:${PORT}/erp`);
});

module.exports = app;

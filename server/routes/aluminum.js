const express = require('express');
const router = express.Router();
const aluminumController = require('../controllers/aluminumController');

// Rotas do ERP
router.post('/projects', aluminumController.createProject);
router.get('/projects', aluminumController.getAllProjects);
router.get('/projects/:id', aluminumController.getProjectById);
router.post('/calculate', aluminumController.calculateOptimization);

module.exports = router;

const AluminumProject = require('../models/AluminumProject');
const { optimizeCutting, calculateCosts } = require('../utils/cuttingOptimizer');

// Constants
const DEFAULT_BAR_LENGTH = 6.0; // Comprimento padrão da barra de alumínio em metros

// Armazenamento em memória para quando o MongoDB não estiver disponível
let inMemoryProjects = [];
let nextId = 1;

/**
 * Cria um novo projeto de esquadrias de alumínio
 */
exports.createProject = async (req, res) => {
    try {
        const { clientName, projectName, profiles } = req.body;
        
        if (!clientName || !projectName || !profiles || profiles.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Dados incompletos. Forneça clientName, projectName e profiles.',
            });
        }
        
        // Calcula custos e medidas
        const { totalArea, totalLength, estimatedCost, cuts } = calculateCosts(profiles);
        
        // Otimiza o plano de corte
        const cuttingPlan = optimizeCutting(cuts);
        
        const projectData = {
            clientName,
            projectName,
            profiles,
            totalArea,
            totalLength,
            estimatedCost,
            cuttingPlan,
            status: 'pendente',
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        
        // Tenta salvar no MongoDB, senão usa memória
        let project;
        try {
            const mongoose = require('mongoose');
            if (mongoose.connection.readyState === 1) {
                project = new AluminumProject(projectData);
                await project.save();
            } else {
                throw new Error('MongoDB não disponível');
            }
        } catch (dbError) {
            // Usa armazenamento em memória
            project = {
                _id: nextId++,
                ...projectData,
            };
            inMemoryProjects.push(project);
        }
        
        res.status(201).json({
            success: true,
            message: 'Projeto criado com sucesso',
            data: project,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao criar projeto',
            error: error.message,
        });
    }
};

/**
 * Lista todos os projetos
 */
exports.getAllProjects = async (req, res) => {
    try {
        let projects;
        
        try {
            const mongoose = require('mongoose');
            if (mongoose.connection.readyState === 1) {
                projects = await AluminumProject.find().sort({ createdAt: -1 });
            } else {
                throw new Error('MongoDB não disponível');
            }
        } catch (dbError) {
            projects = inMemoryProjects;
        }
        
        res.status(200).json({
            success: true,
            count: projects.length,
            data: projects,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar projetos',
            error: error.message,
        });
    }
};

/**
 * Busca um projeto específico por ID
 */
exports.getProjectById = async (req, res) => {
    try {
        const { id } = req.params;
        let project;
        
        try {
            const mongoose = require('mongoose');
            if (mongoose.connection.readyState === 1) {
                project = await AluminumProject.findById(id);
            } else {
                throw new Error('MongoDB não disponível');
            }
        } catch (dbError) {
            project = inMemoryProjects.find(p => p._id == id);
        }
        
        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Projeto não encontrado',
            });
        }
        
        res.status(200).json({
            success: true,
            data: project,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar projeto',
            error: error.message,
        });
    }
};

/**
 * Calcula otimização de corte sem salvar
 */
exports.calculateOptimization = (req, res) => {
    try {
        const { profiles, barLength } = req.body;
        
        if (!profiles || profiles.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Forneça uma lista de perfis para calcular',
            });
        }
        
        const { totalArea, totalLength, estimatedCost, cuts } = calculateCosts(profiles);
        const cuttingPlan = optimizeCutting(cuts, barLength || DEFAULT_BAR_LENGTH);
        
        // Calcula estatísticas
        const totalBars = cuttingPlan.length;
        const totalWaste = cuttingPlan.reduce((sum, bar) => sum + bar.waste, 0);
        const wastePercentage = (totalWaste / (totalBars * (barLength || DEFAULT_BAR_LENGTH))) * 100;
        
        res.status(200).json({
            success: true,
            data: {
                totalArea,
                totalLength,
                estimatedCost,
                cuttingPlan,
                statistics: {
                    totalBars,
                    totalWaste: parseFloat(totalWaste.toFixed(2)),
                    wastePercentage: parseFloat(wastePercentage.toFixed(2)),
                },
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao calcular otimização',
            error: error.message,
        });
    }
};

const mongoose = require('mongoose');

const AluminumProjectSchema = new mongoose.Schema({
    clientName: {
        type: String,
        required: true,
    },
    projectName: {
        type: String,
        required: true,
    },
    profiles: [{
        profileType: String, // Tipo de perfil (ex: janela, porta, esquadria)
        length: Number, // Comprimento em metros
        quantity: Number, // Quantidade de peças
        color: String, // Cor do alumínio
        width: Number, // Largura em metros (opcional)
        height: Number, // Altura em metros (opcional)
    }],
    totalArea: Number, // Área total em m²
    totalLength: Number, // Comprimento total em metros lineares
    estimatedCost: Number, // Custo estimado
    cuttingPlan: [{
        barLength: Number, // Comprimento da barra (geralmente 6m)
        cuts: [Number], // Lista de cortes nesta barra
        waste: Number, // Desperdício
    }],
    status: {
        type: String,
        enum: ['pendente', 'em_producao', 'concluido', 'cancelado'],
        default: 'pendente',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.models.AluminumProject || mongoose.model('AluminumProject', AluminumProjectSchema);

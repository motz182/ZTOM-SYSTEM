/**
 * Otimizador de corte de alumínio
 * Usa o algoritmo de First Fit Decreasing (FFD) para minimizar desperdício
 */

/**
 * Calcula o plano de corte otimizado para barras de alumínio
 * @param {Array} cuts - Array de comprimentos a serem cortados (em metros)
 * @param {Number} barLength - Comprimento padrão da barra (geralmente 6m)
 * @returns {Array} - Plano de corte com distribuição das peças
 */
function optimizeCutting(cuts, barLength = 6.0) {
    // Ordena os cortes em ordem decrescente
    const sortedCuts = [...cuts].sort((a, b) => b - a);
    const bars = [];
    
    sortedCuts.forEach(cut => {
        // Tenta encaixar o corte em uma barra existente
        let placed = false;
        
        for (let bar of bars) {
            const usedLength = bar.cuts.reduce((sum, c) => sum + c, 0);
            const available = barLength - usedLength;
            
            if (available >= cut) {
                bar.cuts.push(cut);
                bar.waste = barLength - bar.cuts.reduce((sum, c) => sum + c, 0);
                placed = true;
                break;
            }
        }
        
        // Se não coube em nenhuma barra, cria uma nova
        if (!placed) {
            bars.push({
                barLength: barLength,
                cuts: [cut],
                waste: barLength - cut,
            });
        }
    });
    
    return bars;
}

/**
 * Calcula o custo estimado baseado em área e tipo de perfil
 * @param {Array} profiles - Lista de perfis
 * @returns {Object} - Resumo de custos e medidas
 */
function calculateCosts(profiles) {
    const COST_PER_M2 = 150.0; // Custo médio por m² (pode ser configurado)
    const COST_PER_METER = 50.0; // Custo médio por metro linear
    
    let totalArea = 0;
    let totalLength = 0;
    const cuts = [];
    
    profiles.forEach(profile => {
        const length = profile.length || 0;
        const width = profile.width || 0;
        const height = profile.height || 0;
        const quantity = profile.quantity || 1;
        
        // Calcula área se tiver dimensões
        if (width && height) {
            totalArea += width * height * quantity;
        }
        
        // Adiciona comprimento
        totalLength += length * quantity;
        
        // Adiciona cortes para otimização
        for (let i = 0; i < quantity; i++) {
            cuts.push(length);
        }
    });
    
    // Calcula custo estimado
    const costByArea = totalArea * COST_PER_M2;
    const costByLength = totalLength * COST_PER_METER;
    const estimatedCost = Math.max(costByArea, costByLength);
    
    return {
        totalArea: parseFloat(totalArea.toFixed(2)),
        totalLength: parseFloat(totalLength.toFixed(2)),
        estimatedCost: parseFloat(estimatedCost.toFixed(2)),
        cuts,
    };
}

module.exports = {
    optimizeCutting,
    calculateCosts,
};

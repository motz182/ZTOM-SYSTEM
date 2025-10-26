// ERP Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const calculatorForm = document.getElementById('calculatorForm');
    const addProfileBtn = document.getElementById('addProfile');
    const profilesContainer = document.getElementById('profilesContainer');
    const resultsSection = document.getElementById('resultsSection');
    const resultsContent = document.getElementById('resultsContent');
    const projectsList = document.getElementById('projectsList');

    // Add new profile
    addProfileBtn.addEventListener('click', function() {
        const profileItem = document.createElement('div');
        profileItem.className = 'profile-item';
        profileItem.innerHTML = `
            <div class="form-row">
                <div class="form-group">
                    <label>Tipo de Perfil:</label>
                    <select class="profileType">
                        <option value="janela">Janela</option>
                        <option value="porta">Porta</option>
                        <option value="esquadria">Esquadria</option>
                        <option value="veneziana">Veneziana</option>
                        <option value="box">Box</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Comprimento (m):</label>
                    <input type="number" step="0.01" class="profileLength" required>
                </div>
                <div class="form-group">
                    <label>Quantidade:</label>
                    <input type="number" class="profileQuantity" value="1" min="1" required>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Largura (m) - Opcional:</label>
                    <input type="number" step="0.01" class="profileWidth">
                </div>
                <div class="form-group">
                    <label>Altura (m) - Opcional:</label>
                    <input type="number" step="0.01" class="profileHeight">
                </div>
                <div class="form-group">
                    <label>Cor:</label>
                    <select class="profileColor">
                        <option value="branco">Branco</option>
                        <option value="preto">Preto</option>
                        <option value="bronze">Bronze</option>
                        <option value="anodizado">Anodizado</option>
                    </select>
                </div>
            </div>
            <button type="button" class="btn btn-secondary remove-profile" style="margin-top: 1rem;">Remover</button>
        `;
        
        // Add remove functionality
        const removeBtn = profileItem.querySelector('.remove-profile');
        removeBtn.addEventListener('click', function() {
            profileItem.remove();
        });
        
        profilesContainer.appendChild(profileItem);
    });

    // Handle form submission
    calculatorForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const clientName = document.getElementById('clientName').value;
        const projectName = document.getElementById('projectName').value;
        
        // Collect all profiles
        const profileItems = document.querySelectorAll('.profile-item');
        const profiles = [];
        
        profileItems.forEach(item => {
            const profileType = item.querySelector('.profileType').value;
            const length = parseFloat(item.querySelector('.profileLength').value);
            const quantity = parseInt(item.querySelector('.profileQuantity').value);
            const width = parseFloat(item.querySelector('.profileWidth').value) || 0;
            const height = parseFloat(item.querySelector('.profileHeight').value) || 0;
            const color = item.querySelector('.profileColor').value;
            
            profiles.push({
                profileType,
                length,
                quantity,
                width,
                height,
                color
            });
        });
        
        try {
            const response = await fetch('/api/aluminum/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    clientName,
                    projectName,
                    profiles
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                displayResults(result.data);
                loadProjects();
                
                // Show success message
                alert('Projeto criado com sucesso!');
                
                // Reset form
                calculatorForm.reset();
            } else {
                alert('Erro ao criar projeto: ' + result.message);
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao processar solicitação');
        }
    });

    // Display calculation results
    function displayResults(data) {
        const { totalArea, totalLength, estimatedCost, cuttingPlan } = data;
        
        let html = `
            <div class="results-grid">
                <div class="result-item">
                    <div class="result-label">Área Total</div>
                    <div class="result-value">${totalArea} m²</div>
                </div>
                <div class="result-item">
                    <div class="result-label">Metragem Total</div>
                    <div class="result-value">${totalLength} m</div>
                </div>
                <div class="result-item">
                    <div class="result-label">Custo Estimado</div>
                    <div class="result-value">R$ ${estimatedCost.toFixed(2)}</div>
                </div>
                <div class="result-item">
                    <div class="result-label">Barras Necessárias</div>
                    <div class="result-value">${cuttingPlan.length}</div>
                </div>
            </div>
            
            <div class="cutting-plan">
                <h4>Plano de Corte Otimizado</h4>
        `;
        
        let totalWaste = 0;
        cuttingPlan.forEach((bar, index) => {
            totalWaste += bar.waste;
            html += `
                <div class="bar-item">
                    <div class="bar-header">Barra ${index + 1} (${bar.barLength}m)</div>
                    <div class="cuts-list">
                        ${bar.cuts.map(cut => `<span class="cut-badge">${cut}m</span>`).join('')}
                    </div>
                    <div class="waste-info">Desperdício: ${bar.waste.toFixed(2)}m</div>
                </div>
            `;
        });
        
        const wastePercentage = ((totalWaste / (cuttingPlan.length * 6)) * 100).toFixed(2);
        html += `
                <div style="margin-top: 1rem; text-align: center; font-weight: bold;">
                    Desperdício Total: ${totalWaste.toFixed(2)}m (${wastePercentage}%)
                </div>
            </div>
        `;
        
        resultsContent.innerHTML = html;
        resultsSection.style.display = 'block';
        
        // Scroll to results
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }

    // Load recent projects
    async function loadProjects() {
        try {
            const response = await fetch('/api/aluminum/projects');
            const result = await response.json();
            
            if (result.success && result.data.length > 0) {
                let html = '';
                result.data.slice(0, 5).forEach(project => {
                    html += `
                        <div class="project-item">
                            <div class="project-header">
                                <div class="project-name">${project.projectName}</div>
                                <span class="project-status status-${project.status}">${project.status}</span>
                            </div>
                            <div class="project-info">
                                Cliente: ${project.clientName} | 
                                Área: ${project.totalArea}m² | 
                                Custo: R$ ${project.estimatedCost.toFixed(2)}
                            </div>
                        </div>
                    `;
                });
                projectsList.innerHTML = html;
            } else {
                projectsList.innerHTML = '<div class="empty-message">Nenhum projeto cadastrado ainda</div>';
            }
        } catch (error) {
            console.error('Erro ao carregar projetos:', error);
            projectsList.innerHTML = '<div class="empty-message">Erro ao carregar projetos</div>';
        }
    }

    // Load projects on page load
    loadProjects();
});

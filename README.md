# ZTOM SYSTEM

## ERP para Cálculo e Corte de Esquadrias de Alumínio

Sistema completo de gestão (ERP) especializado em esquadrias de alumínio, com calculadora de custos, otimizador de corte e landing page pública.

## 🚀 Funcionalidades

### Landing Page Pública
- Página institucional com informações sobre o sistema
- Design moderno e responsivo
- Seções: Recursos, Sobre, Contato
- Acesso direto ao ERP

### ERP Dashboard
- **Calculadora de Esquadrias**: Calcule automaticamente área, metragem e custos
- **Otimização de Corte**: Algoritmo inteligente que minimiza desperdício de material
- **Gestão de Projetos**: Organize e acompanhe todos os projetos
- **Plano de Corte Visual**: Visualização clara de como cortar as barras
- **Múltiplos Perfis**: Suporte para janelas, portas, esquadrias, venezianas e box
- **Estimativa de Custos**: Cálculo automático baseado em área e metragem

## 📋 Tecnologias

- **Backend**: Node.js + Express
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Database**: MongoDB (opcional - funciona com dados em memória)
- **Algoritmo**: First Fit Decreasing (FFD) para otimização de corte

## 🔧 Instalação

### Pré-requisitos
- Node.js (versão 14 ou superior)
- npm ou yarn

### Passos

1. Clone o repositório:
```bash
git clone https://github.com/motz182/ZTOM-SYSTEM.git
cd ZTOM-SYSTEM
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente (opcional):
```bash
cp .env.example .env
# Edite o arquivo .env se necessário
```

4. Inicie o servidor:
```bash
# Modo produção
npm start

# Modo desenvolvimento (com auto-reload)
npm run dev
```

5. Acesse o sistema:
- Landing Page: http://localhost:3000
- ERP Dashboard: http://localhost:3000/erp

## 📖 Como Usar

### Calculando Projetos de Esquadrias

1. Acesse o ERP Dashboard em `/erp`
2. Preencha os dados do cliente e projeto
3. Adicione os perfis de alumínio:
   - Tipo de perfil (janela, porta, etc.)
   - Comprimento em metros
   - Quantidade de peças
   - Dimensões opcionais (largura e altura)
   - Cor do alumínio
4. Clique em "Calcular"
5. Visualize os resultados:
   - Área total
   - Metragem total
   - Custo estimado
   - Plano de corte otimizado
   - Desperdício calculado

### API Endpoints

#### POST /api/aluminum/projects
Cria um novo projeto de esquadrias
```json
{
  "clientName": "Nome do Cliente",
  "projectName": "Nome do Projeto",
  "profiles": [
    {
      "profileType": "janela",
      "length": 2.5,
      "quantity": 4,
      "width": 1.2,
      "height": 1.5,
      "color": "branco"
    }
  ]
}
```

#### GET /api/aluminum/projects
Lista todos os projetos

#### GET /api/aluminum/projects/:id
Busca um projeto específico

#### POST /api/aluminum/calculate
Calcula otimização sem salvar
```json
{
  "profiles": [...],
  "barLength": 6.0
}
```

## 🎯 Algoritmo de Otimização

O sistema utiliza o algoritmo **First Fit Decreasing (FFD)**:

1. Ordena os cortes em ordem decrescente
2. Para cada corte, tenta encaixar em uma barra existente
3. Se não couber, cria uma nova barra
4. Calcula o desperdício de cada barra

Isso minimiza:
- Número de barras utilizadas
- Desperdício de material
- Custos de produção

## 🗂️ Estrutura do Projeto

```
ZTOM-SYSTEM/
├── server/
│   ├── controllers/       # Lógica de negócios
│   ├── models/           # Modelos de dados
│   ├── routes/           # Rotas da API
│   ├── utils/            # Utilitários (otimizador)
│   └── index.js          # Servidor Express
├── public/
│   ├── css/              # Estilos
│   ├── js/               # Scripts frontend
│   ├── index.html        # Landing page
│   └── erp.html          # Dashboard ERP
├── package.json
└── README.md
```

## 🌐 Deploy

Para fazer deploy em produção:

1. Configure as variáveis de ambiente
2. Configure um banco MongoDB (opcional)
3. Execute `npm start`
4. Configure um proxy reverso (nginx/apache)

## 📝 Licença

ISC

## 👥 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## 📧 Contato

Para mais informações, entre em contato através do sistema.

// Timemania Generator - Estratégias Matemáticas e Estatísticas
window.historyOfGeneratedSets = [];
let currentStrategy = 'balanced';

// Todos os números de 1 a 80
const TODOS_NUMEROS = Array.from({length: 80}, (_, i) => i + 1);

// Números pares e ímpares
const PARES = TODOS_NUMEROS.filter(n => n % 2 === 0);
const IMPARES = TODOS_NUMEROS.filter(n => n % 2 === 1);

// Números historicamente mais frequentes (baseado nos dados fornecidos)
const NUMEROS_FREQUENTES = [20, 21, 61, 70, 66, 72, 80, 1, 4, 7, 15, 29, 35, 36, 39, 42, 46, 49, 57, 59, 71, 73, 75, 77];

// Grupos numéricos para distribuição
const GRUPOS = {
    1: Array.from({length: 20}, (_, i) => i + 1),      // 1-20
    2: Array.from({length: 20}, (_, i) => i + 21),     // 21-40
    3: Array.from({length: 20}, (_, i) => i + 41),     // 41-60
    4: Array.from({length: 20}, (_, i) => i + 61)      // 61-80
};

// Últimos sorteios para referência
const ULTIMOS_SORTEIOS = [
    [29, 36, 39, 61, 70, 75, 77],
    [1, 15, 29, 49, 57, 59, 73],
    [4, 7, 35, 42, 46, 71, 73]
];

// Times do Coração - Lista completa dos 80 times
const TIMES_CORACAO = [
    { id: 1, nome: 'ABC/RN', frequencia: 'média' },
    { id: 2, nome: 'Americana/SP', frequencia: 'baixa' },
    { id: 3, nome: 'Atlético/GO', frequencia: 'muito-alta' }, // Maior frequência histórica
    { id: 4, nome: 'Atlético/MG', frequencia: 'alta' },
    { id: 5, nome: 'Atlético/PR', frequencia: 'média' },
    { id: 6, nome: 'Avaí/SC', frequencia: 'média' },
    { id: 7, nome: 'Bahia/BA', frequencia: 'alta' },
    { id: 8, nome: 'Botafogo/PB', frequencia: 'alta' },
    { id: 9, nome: 'Botafogo/RJ', frequencia: 'média' },
    { id: 10, nome: 'Brasiliense/DF', frequencia: 'baixa' },
    { id: 11, nome: 'Ceará/CE', frequencia: 'média' },
    { id: 12, nome: 'Coritiba/PR', frequencia: 'média' },
    { id: 13, nome: 'Corinthians/SP', frequencia: 'média' },
    { id: 14, nome: 'CRB/AL', frequencia: 'alta' },
    { id: 15, nome: 'Criciúma/SC', frequencia: 'média' },
    { id: 16, nome: 'Cruzeiro/MG', frequencia: 'média' },
    { id: 17, nome: 'CSA/AL', frequencia: 'baixa' },
    { id: 18, nome: 'Figueirense/SC', frequencia: 'média' },
    { id: 19, nome: 'Flamengo/RJ', frequencia: 'média' },
    { id: 20, nome: 'Fluminense/RJ', frequencia: 'alta' },
    { id: 21, nome: 'Fortaleza/CE', frequencia: 'média' },
    { id: 22, nome: 'Goiás/GO', frequencia: 'média' },
    { id: 23, nome: 'Grêmio/RS', frequencia: 'média' },
    { id: 24, nome: 'Guarani/SP', frequencia: 'média' },
    { id: 25, nome: 'Internacional/RS', frequencia: 'média' },
    { id: 26, nome: 'Joinville/SC', frequencia: 'baixa' },
    { id: 27, nome: 'Juventude/RS', frequencia: 'média' },
    { id: 28, nome: 'Londrina/PR', frequencia: 'baixa' },
    { id: 29, nome: 'Moto Club/MA', frequencia: 'muito-alta' }, // Alta frequência
    { id: 30, nome: 'Náutico/PE', frequencia: 'média' },
    { id: 31, nome: 'Palmas/TO', frequencia: 'baixa' },
    { id: 32, nome: 'Palmeiras/SP', frequencia: 'média' },
    { id: 33, nome: 'Paraná/PR', frequencia: 'média' },
    { id: 34, nome: 'Paysandu/PA', frequencia: 'média' },
    { id: 35, nome: 'Ponte Preta/SP', frequencia: 'média' },
    { id: 36, nome: 'Portuguesa/SP', frequencia: 'baixa' },
    { id: 37, nome: 'Remo/PA', frequencia: 'média' },
    { id: 38, nome: 'River/PI', frequencia: 'baixa' },
    { id: 39, nome: 'Santa Cruz/PE', frequencia: 'média' },
    { id: 40, nome: 'Santo André/SP', frequencia: 'baixa' },
    { id: 41, nome: 'Santos/SP', frequencia: 'média' },
    { id: 42, nome: 'São Caetano/SP', frequencia: 'baixa' },
    { id: 43, nome: 'São Paulo/SP', frequencia: 'média' },
    { id: 44, nome: 'Sampaio Corrêa/MA', frequencia: 'baixa' },
    { id: 45, nome: 'Sport/PE', frequencia: 'média' },
    { id: 46, nome: 'Treze/PB', frequencia: 'alta' },
    { id: 47, nome: 'Vasco/RJ', frequencia: 'média' },
    { id: 48, nome: 'Vila Nova/GO', frequencia: 'baixa' },
    { id: 49, nome: 'Vitória/BA', frequencia: 'alta' },
    { id: 50, nome: 'América/MG', frequencia: 'média' },
    { id: 51, nome: 'América/RN', frequencia: 'baixa' },
    { id: 52, nome: 'Asa/DF', frequencia: 'baixa' },
    { id: 53, nome: 'Atlético/ES', frequencia: 'baixa' },
    { id: 54, nome: 'Boa/MG', frequencia: 'baixa' },
    { id: 55, nome: 'Brasília/DF', frequencia: 'baixa' },
    { id: 56, nome: 'Caldense/MG', frequencia: 'baixa' },
    { id: 57, nome: 'Campinense/PB', frequencia: 'baixa' },
    { id: 58, nome: 'Cene/MS', frequencia: 'baixa' },
    { id: 59, nome: 'Central/PE', frequencia: 'baixa' },
    { id: 60, nome: 'Confiança/SE', frequencia: 'baixa' },
    { id: 61, nome: 'Desportiva/ES', frequencia: 'baixa' },
    { id: 62, nome: 'Fast/AM', frequencia: 'baixa' },
    { id: 63, nome: 'Ferroviário/CE', frequencia: 'baixa' },
    { id: 64, nome: 'Gama/DF', frequencia: 'baixa' },
    { id: 65, nome: 'Ipatinga/MG', frequencia: 'baixa' },
    { id: 66, nome: 'Ji-Paraná/RO', frequencia: 'baixa' },
    { id: 67, nome: 'Luverdense/MT', frequencia: 'baixa' },
    { id: 68, nome: 'Macaé/RJ', frequencia: 'baixa' },
    { id: 69, nome: 'Mixto/MT', frequencia: 'baixa' },
    { id: 70, nome: 'Nacional/AM', frequencia: 'baixa' },
    { id: 71, nome: 'Operário/MS', frequencia: 'baixa' },
    { id: 72, nome: 'Rio Branco/AC', frequencia: 'baixa' },
    { id: 73, nome: 'Salgueiro/PE', frequencia: 'baixa' },
    { id: 74, nome: 'Sampaio Corrêa/RJ', frequencia: 'baixa' },
    { id: 75, nome: 'Serrano/BA', frequencia: 'baixa' },
    { id: 76, nome: 'Tuna Luso/PA', frequencia: 'baixa' },
    { id: 77, nome: 'Uberaba/MG', frequencia: 'baixa' },
    { id: 78, nome: 'Ypiranga/AP', frequencia: 'baixa' },
    { id: 79, nome: 'XV Piracicaba/SP', frequencia: 'baixa' },
    { id: 80, nome: 'São Raimundo/RR', frequencia: 'baixa' }
];

// Times com maior frequência histórica (ordenados por aparições)
const TIMES_MAIS_FREQUENTES = [
    3,   // Atlético/GO - maior frequência
    29,  // Moto Club/MA
    46,  // Treze/PB
    49,  // Vitória/BA
    14,  // CRB/AL
    7,   // Bahia/BA
    20,  // Fluminense/RJ
    8,   // Botafogo/PB
    4    // Atlético/MG
];

// Função para selecionar Time do Coração baseado em estratégia
function selecionarTimeCoracao(estrategia = 'frequente') {
    switch(estrategia) {
        case 'mais-frequente':
            // Retorna o time com maior frequência histórica (Atlético/GO)
            return 3;
        
        case 'top-frequentes':
            // Retorna aleatoriamente um dos times mais frequentes
            return TIMES_MAIS_FREQUENTES[Math.floor(Math.random() * TIMES_MAIS_FREQUENTES.length)];
        
        case 'balanceado':
            // Retorna um time com frequência média-alta (não muito raro, não muito comum)
            const timesBalanceados = TIMES_CORACAO.filter(t => t.frequencia === 'alta' || t.frequencia === 'muito-alta');
            return timesBalanceados[Math.floor(Math.random() * timesBalanceados.length)].id;
        
        case 'aleatorio':
            // Retorna um time completamente aleatório
            return Math.floor(Math.random() * 80) + 1;
        
        default:
            // Por padrão, usa top-frequentes
            return TIMES_MAIS_FREQUENTES[Math.floor(Math.random() * TIMES_MAIS_FREQUENTES.length)];
    }
}

// Função para obter nome do time pelo ID
function getNomeTime(id) {
    const time = TIMES_CORACAO.find(t => t.id === id);
    return time ? time.nome : `Time ${id}`;
}

// Variável global para armazenar o time do coração selecionado
let timeCoracaoSelecionado = null;
let timeCoracaoEstrategia = 'top-frequentes'; // Estratégia padrão

// Seleção de estratégia
document.querySelectorAll('.strategy-card').forEach(card => {
    card.addEventListener('click', function() {
        // Verificar se é card de estratégia de números ou de time
        if (this.dataset.strategy) {
            // Estratégia de números
            document.querySelectorAll('.strategy-card[data-strategy]').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            currentStrategy = this.dataset.strategy;
        } else if (this.dataset.timeStrategy) {
            // Estratégia de Time do Coração
            document.querySelectorAll('.strategy-card[data-time-strategy]').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            timeCoracaoEstrategia = this.dataset.timeStrategy;
            
            // Selecionar time baseado na estratégia
            timeCoracaoSelecionado = selecionarTimeCoracao(timeCoracaoEstrategia);
            
            // Mostrar time selecionado
            const timeDisplay = document.getElementById('timeCoracaoSelecionado');
            const nomeTimeDisplay = document.getElementById('nomeTimeSelecionado');
            nomeTimeDisplay.textContent = `#${timeCoracaoSelecionado} - ${getNomeTime(timeCoracaoSelecionado)}`;
            timeDisplay.style.display = 'block';
        }
    });
});

// Ativar estratégia padrão
document.querySelector('.strategy-card[data-strategy="balanced"]').classList.add('active');

// Ativar estratégia padrão de Time do Coração
const topFrequentesCard = document.querySelector('.strategy-card[data-time-strategy="top-frequentes"]');
if (topFrequentesCard) {
    topFrequentesCard.classList.add('active');
    // Selecionar time inicial
    timeCoracaoSelecionado = selecionarTimeCoracao('top-frequentes');
    const timeDisplay = document.getElementById('timeCoracaoSelecionado');
    const nomeTimeDisplay = document.getElementById('nomeTimeSelecionado');
    nomeTimeDisplay.textContent = `#${timeCoracaoSelecionado} - ${getNomeTime(timeCoracaoSelecionado)}`;
    timeDisplay.style.display = 'block';
}

// Formatação de input
document.getElementById('fixedNumbers').addEventListener('input', function(event) {
    let input = event.target.value;
    let cursorPosition = event.target.selectionStart;
    let cleanedInput = input.replace(/[^0-9,]/g, '');
    let parts = cleanedInput.split(',').map(part => part.trim()).filter(part => part !== '');
    let formattedInput = '';
    
    for (let i = 0; i < parts.length; i++) {
        formattedInput += parts[i];
        if (i < parts.length - 1 || (input.endsWith(',') && i === parts.length - 1)) {
            formattedInput += ', ';
        }
    }
    
    event.target.value = formattedInput;
    let newCursorPosition = cursorPosition;
    if (formattedInput.length < input.length) {
        newCursorPosition -= (input.length - formattedInput.length);
    } else if (formattedInput.length > input.length) {
        newCursorPosition += (formattedInput.length - input.length);
    }
    event.target.selectionStart = event.target.selectionEnd = newCursorPosition;
});

// Validar números fixos
function validateFixedNumbers(input) {
    if (!input) return { valid: true, numbers: [] };
    
    const numbers = input.split(',').map(num => parseInt(num.trim(), 10)).filter(num => !isNaN(num));
    
    // Validar números
    const invalidNumbers = numbers.filter(num => num < 1 || num > 80);
    if (invalidNumbers.length > 0) {
        alert('Por favor, insira números válidos entre 1 e 80.');
        return { valid: false };
    }
    
    // Validar duplicatas
    const uniqueNumbers = new Set(numbers);
    if (uniqueNumbers.size !== numbers.length) {
        alert('Os números fixos não podem ter repetições.');
        return { valid: false };
    }
    
    // Validar máximo de 5 fixos
    if (numbers.length > 5) {
        alert('Você pode definir no máximo 5 números fixos.');
        return { valid: false };
    }
    
    return { valid: true, numbers };
}

// Gerar uma combinação
document.getElementById('generateButton').addEventListener('click', function() {
    const fixedNumbersInput = document.getElementById('fixedNumbers').value;
    const validation = validateFixedNumbers(fixedNumbersInput);
    
    if (!validation.valid) return;
    
    const combination = generateCombination(currentStrategy, validation.numbers);
    window.historyOfGeneratedSets.push(combination);
    displayAllSets();
    updateStats();
});

// Gerar múltiplas combinações
document.getElementById('generateMultipleButton').addEventListener('click', function() {
    const fixedNumbersInput = document.getElementById('fixedNumbers').value;
    const validation = validateFixedNumbers(fixedNumbersInput);
    
    if (!validation.valid) return;
    
    window.historyOfGeneratedSets = [];
    for (let i = 0; i < 10; i++) {
        const combination = generateCombination(currentStrategy, validation.numbers);
        window.historyOfGeneratedSets.push(combination);
    }
    displayAllSets();
    updateStats();
});

// Gerar 50 combinações otimizadas
document.getElementById('generateOptimizedButton').addEventListener('click', function() {
    const fixedNumbersInput = document.getElementById('fixedNumbers').value;
    const validation = validateFixedNumbers(fixedNumbersInput);
    
    if (!validation.valid) return;
    
    window.historyOfGeneratedSets = [];
    
    // Gerar combinações usando diferentes estratégias para diversificar
    const strategies = ['balanced', 'par-heavy', 'impar-heavy', 'frequentes', 'grupos'];
    
    for (let i = 0; i < 50; i++) {
        const strategy = strategies[i % strategies.length];
        const combination = generateCombination(strategy, validation.numbers);
        
        // Evitar duplicatas
        const isDuplicate = window.historyOfGeneratedSets.some(existing => 
            JSON.stringify(existing.sort()) === JSON.stringify(combination.sort())
        );
        
        if (!isDuplicate) {
            window.historyOfGeneratedSets.push(combination);
        } else {
            i--; // Tentar novamente
        }
    }
    
    displayAllSets();
    updateStats();
});

// Função principal de geração
function generateCombination(strategy, fixedNumbers = []) {
    let combination = [...fixedNumbers];
    const remaining = 10 - combination.length;
    
    switch(strategy) {
        case 'balanced':
            return generateBalanced(combination, remaining);
        case 'par-heavy':
            return generateParHeavy(combination, remaining);
        case 'impar-heavy':
            return generateImparHeavy(combination, remaining);
        case 'frequentes':
            return generateFrequentes(combination, remaining);
        case 'grupos':
            return generateGrupos(combination, remaining);
        case 'random':
            return generateRandom(combination, remaining);
        default:
            return generateBalanced(combination, remaining);
    }
}

// Estratégia Balanceada: 5 pares + 5 ímpares (distribuição equilibrada)
function generateBalanced(fixed, remaining) {
    let combination = [...fixed];
    const fixedPares = fixed.filter(n => n % 2 === 0).length;
    const fixedImpares = fixed.filter(n => n % 2 === 1).length;
    
    // Calcular quantos pares e ímpares ainda precisamos
    const targetPares = 5;
    const targetImpares = 5;
    let needPares = Math.max(0, targetPares - fixedPares);
    let needImpares = Math.max(0, targetImpares - fixedImpares);
    
    // Ajustar se já temos mais que o target
    if (fixedPares > targetPares) {
        needPares = 0;
        needImpares = remaining;
    } else if (fixedImpares > targetImpares) {
        needImpares = 0;
        needPares = remaining;
    }
    
    // Adicionar pares
    const availablePares = PARES.filter(n => !combination.includes(n));
    for (let i = 0; i < needPares && combination.length < 10; i++) {
        if (availablePares.length > 0) {
            const index = Math.floor(Math.random() * availablePares.length);
            combination.push(availablePares[index]);
            availablePares.splice(index, 1);
        }
    }
    
    // Adicionar ímpares
    const availableImpares = IMPARES.filter(n => !combination.includes(n));
    for (let i = 0; i < needImpares && combination.length < 10; i++) {
        if (availableImpares.length > 0) {
            const index = Math.floor(Math.random() * availableImpares.length);
            combination.push(availableImpares[index]);
            availableImpares.splice(index, 1);
        }
    }
    
    // Completar se necessário
    while (combination.length < 10) {
        const available = TODOS_NUMEROS.filter(n => !combination.includes(n));
        if (available.length > 0) {
            combination.push(available[Math.floor(Math.random() * available.length)]);
        }
    }
    
    return combination.sort((a, b) => a - b);
}

// Estratégia Par Pesado: 4 pares + 3 ímpares (padrão histórico mais comum)
// Nota: Aqui geramos 10 números, mas usamos a proporção 4:3 nos 7 primeiros
function generateParHeavy(fixed, remaining) {
    let combination = [...fixed];
    const fixedPares = fixed.filter(n => n % 2 === 0).length;
    const fixedImpares = fixed.filter(n => n % 2 === 1).length;
    
    // Alvo: aproximadamente 57% pares, 43% ímpares nos 10 números
    const targetPares = 6; // ~60%
    const targetImpares = 4; // ~40%
    
    let needPares = Math.max(0, targetPares - fixedPares);
    let needImpares = Math.max(0, targetImpares - fixedImpares);
    
    // Adicionar pares
    const availablePares = PARES.filter(n => !combination.includes(n));
    for (let i = 0; i < needPares && combination.length < 10; i++) {
        if (availablePares.length > 0) {
            const index = Math.floor(Math.random() * availablePares.length);
            combination.push(availablePares[index]);
            availablePares.splice(index, 1);
        }
    }
    
    // Adicionar ímpares
    const availableImpares = IMPARES.filter(n => !combination.includes(n));
    for (let i = 0; i < needImpares && combination.length < 10; i++) {
        if (availableImpares.length > 0) {
            const index = Math.floor(Math.random() * availableImpares.length);
            combination.push(availableImpares[index]);
            availableImpares.splice(index, 1);
        }
    }
    
    // Completar se necessário
    while (combination.length < 10) {
        const available = TODOS_NUMEROS.filter(n => !combination.includes(n));
        if (available.length > 0) {
            combination.push(available[Math.floor(Math.random() * available.length)]);
        }
    }
    
    return combination.sort((a, b) => a - b);
}

// Estratégia Ímpar Pesado: 3 pares + 4 ímpares (padrão histórico mais comum)
function generateImparHeavy(fixed, remaining) {
    let combination = [...fixed];
    const fixedPares = fixed.filter(n => n % 2 === 0).length;
    const fixedImpares = fixed.filter(n => n % 2 === 1).length;
    
    // Alvo: aproximadamente 43% pares, 57% ímpares nos 10 números
    const targetPares = 4; // ~40%
    const targetImpares = 6; // ~60%
    
    let needPares = Math.max(0, targetPares - fixedPares);
    let needImpares = Math.max(0, targetImpares - fixedImpares);
    
    // Adicionar ímpares primeiro
    const availableImpares = IMPARES.filter(n => !combination.includes(n));
    for (let i = 0; i < needImpares && combination.length < 10; i++) {
        if (availableImpares.length > 0) {
            const index = Math.floor(Math.random() * availableImpares.length);
            combination.push(availableImpares[index]);
            availableImpares.splice(index, 1);
        }
    }
    
    // Adicionar pares
    const availablePares = PARES.filter(n => !combination.includes(n));
    for (let i = 0; i < needPares && combination.length < 10; i++) {
        if (availablePares.length > 0) {
            const index = Math.floor(Math.random() * availablePares.length);
            combination.push(availablePares[index]);
            availablePares.splice(index, 1);
        }
    }
    
    // Completar se necessário
    while (combination.length < 10) {
        const available = TODOS_NUMEROS.filter(n => !combination.includes(n));
        if (available.length > 0) {
            combination.push(available[Math.floor(Math.random() * available.length)]);
        }
    }
    
    return combination.sort((a, b) => a - b);
}

// Estratégia com Números Frequentes: Prioriza números historicamente mais sorteados
function generateFrequentes(fixed, remaining) {
    let combination = [...fixed];
    
    // Usar 50-60% de números frequentes
    const quantidadeFrequentes = Math.floor(remaining * 0.6);
    const quantidadeAleatorios = remaining - quantidadeFrequentes;
    
    // Adicionar números frequentes
    const frequentesDisponiveis = NUMEROS_FREQUENTES.filter(n => !combination.includes(n));
    for (let i = 0; i < quantidadeFrequentes && combination.length < 10; i++) {
        if (frequentesDisponiveis.length > 0) {
            const index = Math.floor(Math.random() * frequentesDisponiveis.length);
            combination.push(frequentesDisponiveis[index]);
            frequentesDisponiveis.splice(index, 1);
        }
    }
    
    // Completar com números aleatórios
    const todosDisponiveis = TODOS_NUMEROS.filter(n => !combination.includes(n));
    for (let i = 0; i < quantidadeAleatorios && combination.length < 10; i++) {
        if (todosDisponiveis.length > 0) {
            const index = Math.floor(Math.random() * todosDisponiveis.length);
            combination.push(todosDisponiveis[index]);
            todosDisponiveis.splice(index, 1);
        }
    }
    
    // Completar se necessário
    while (combination.length < 10) {
        const available = TODOS_NUMEROS.filter(n => !combination.includes(n));
        if (available.length > 0) {
            combination.push(available[Math.floor(Math.random() * available.length)]);
        }
    }
    
    return combination.sort((a, b) => a - b);
}

// Estratégia com Grupos: Distribuir por faixas numéricas
function generateGrupos(fixed, remaining) {
    let combination = [...fixed];
    
    // Contar quantos números já temos de cada grupo
    const grupoCount = { 1: 0, 2: 0, 3: 0, 4: 0 };
    fixed.forEach(num => {
        if (num <= 20) grupoCount[1]++;
        else if (num <= 40) grupoCount[2]++;
        else if (num <= 60) grupoCount[3]++;
        else grupoCount[4]++;
    });
    
    // Tentar distribuir equilibradamente (2-3 números por grupo)
    const targetPerGroup = 2.5; // Média de 2.5 por grupo (10/4)
    
    while (combination.length < 10) {
        // Encontrar grupo que precisa mais números
        let grupoEscolhido = 1;
        let minCount = grupoCount[1];
        
        for (let g = 2; g <= 4; g++) {
            if (grupoCount[g] < minCount) {
                minCount = grupoCount[g];
                grupoEscolhido = g;
            }
        }
        
        // Pegar número aleatório do grupo escolhido
        const numerosGrupo = GRUPOS[grupoEscolhido].filter(n => !combination.includes(n));
        if (numerosGrupo.length > 0) {
            const escolhido = numerosGrupo[Math.floor(Math.random() * numerosGrupo.length)];
            combination.push(escolhido);
            grupoCount[grupoEscolhido]++;
        } else {
            // Se o grupo está esgotado, usar qualquer número disponível
            const available = TODOS_NUMEROS.filter(n => !combination.includes(n));
            if (available.length > 0) {
                combination.push(available[Math.floor(Math.random() * available.length)]);
            }
        }
    }
    
    return combination.sort((a, b) => a - b);
}

// Estratégia Aleatória
function generateRandom(fixed, remaining) {
    let combination = [...fixed];
    const available = TODOS_NUMEROS.filter(n => !combination.includes(n));
    
    // Embaralhar e pegar os primeiros
    const shuffled = [...available].sort(() => Math.random() - 0.5);
    combination.push(...shuffled.slice(0, remaining));
    
    return combination.sort((a, b) => a - b);
}

// Determinar se número é par ou ímpar para estilização
function isEven(num) {
    return num % 2 === 0;
}

// Determinar se número é frequente
function isFrequent(num) {
    return NUMEROS_FREQUENTES.includes(num);
}

// Exibir todas as combinações
function displayAllSets() {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';
    
    if (window.historyOfGeneratedSets.length === 0) {
        resultDiv.textContent = 'Nenhuma combinação gerada ainda.';
        return;
    }
    
    const header = document.createElement('div');
    header.style.cssText = 'background: linear-gradient(135deg, #00c853 0%, #009624 100%); color: white; padding: 20px; margin-bottom: 20px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0, 200, 83, 0.3);';
    header.innerHTML = `<strong style="font-size: 18px;">Total: ${window.historyOfGeneratedSets.length} combinações geradas</strong><br>
        <small style="opacity: 0.9;">Cada linha contém 10 números da Timemania (1-80)</small>`;
    
    // Adicionar informação do Time do Coração se estiver selecionado
    if (timeCoracaoSelecionado) {
        header.innerHTML += `<br><br><div style="background: rgba(255, 255, 255, 0.2); padding: 10px; border-radius: 8px; margin-top: 10px;">
            <strong>⚽ Time do Coração:</strong> #${timeCoracaoSelecionado} - ${getNomeTime(timeCoracaoSelecionado)}
        </div>`;
    }
    
    resultDiv.appendChild(header);
    
    window.historyOfGeneratedSets.forEach((combination, index) => {
        const lineDiv = document.createElement('div');
        lineDiv.className = 'number-line';
        lineDiv.style.marginBottom = '20px';
        lineDiv.style.paddingBottom = '20px';
        lineDiv.style.borderBottom = '2px solid #eee';
        
        combination.forEach(num => {
            const span = document.createElement('span');
            span.className = 'numero';
            
            // Adicionar classes baseadas nas características do número
            if (isFrequent(num)) {
                span.classList.add('frequente');
            } else if (isEven(num)) {
                span.classList.add('par');
            } else {
                span.classList.add('impar');
            }
            
            span.textContent = num.toString().padStart(2, '0');
            lineDiv.appendChild(span);
        });
        
        resultDiv.appendChild(lineDiv);
    });
}

// Atualizar estatísticas
function updateStats() {
    if (window.historyOfGeneratedSets.length === 0) {
        document.getElementById('stats').style.display = 'none';
        return;
    }
    
    const statsDiv = document.getElementById('stats');
    statsDiv.style.display = 'block';
    
    // Calcular estatísticas
    const totalPares = window.historyOfGeneratedSets.reduce((sum, comb) => 
        sum + comb.filter(n => n % 2 === 0).length, 0);
    const totalImpares = window.historyOfGeneratedSets.reduce((sum, comb) => 
        sum + comb.filter(n => n % 2 === 1).length, 0);
    const avgPares = (totalPares / window.historyOfGeneratedSets.length).toFixed(2);
    const avgImpares = (totalImpares / window.historyOfGeneratedSets.length).toFixed(2);
    
    // Calcular média de números frequentes
    const totalFrequentes = window.historyOfGeneratedSets.reduce((sum, comb) => 
        sum + comb.filter(n => NUMEROS_FREQUENTES.includes(n)).length, 0);
    const avgFrequentes = (totalFrequentes / window.historyOfGeneratedSets.length).toFixed(2);
    
    // Distribuição por grupo
    const grupoCount = { 1: 0, 2: 0, 3: 0, 4: 0 };
    window.historyOfGeneratedSets.forEach(comb => {
        comb.forEach(num => {
            if (num <= 20) grupoCount[1]++;
            else if (num <= 40) grupoCount[2]++;
            else if (num <= 60) grupoCount[3]++;
            else grupoCount[4]++;
        });
    });
    
    let html = `
        <h3>📊 Estatísticas das Combinações</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 15px 0;">
            <div style="background: white; padding: 15px; border-radius: 8px; text-align: center;">
                <strong>Média de Pares</strong><br>
                <span style="font-size: 24px; color: #00c853;">${avgPares}</span>
            </div>
            <div style="background: white; padding: 15px; border-radius: 8px; text-align: center;">
                <strong>Média de Ímpares</strong><br>
                <span style="font-size: 24px; color: #ffc107;">${avgImpares}</span>
            </div>
            <div style="background: white; padding: 15px; border-radius: 8px; text-align: center;">
                <strong>Média de Frequentes</strong><br>
                <span style="font-size: 24px; color: #f44336;">${avgFrequentes}</span>
            </div>
        </div>
        
        <h4>📍 Distribuição por Faixa Numérica:</h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px;">
            <div style="background: white; padding: 10px; border-radius: 5px;">
                <strong>1-20:</strong> ${grupoCount[1]} números
            </div>
            <div style="background: white; padding: 10px; border-radius: 5px;">
                <strong>21-40:</strong> ${grupoCount[2]} números
            </div>
            <div style="background: white; padding: 10px; border-radius: 5px;">
                <strong>41-60:</strong> ${grupoCount[3]} números
            </div>
            <div style="background: white; padding: 10px; border-radius: 5px;">
                <strong>61-80:</strong> ${grupoCount[4]} números
            </div>
        </div>
    `;
    
    // Adicionar informação do Time do Coração
    if (timeCoracaoSelecionado) {
        const time = TIMES_CORACAO.find(t => t.id === timeCoracaoSelecionado);
        const frequenciaTexto = time ? time.frequencia : 'desconhecida';
        
        html += `
            <div style="margin-top: 20px; padding: 15px; background: white; border-radius: 8px;">
                <h4>⚽ Time do Coração Selecionado:</h4>
                <div style="font-size: 18px; color: #00c853; font-weight: bold; margin: 10px 0;">
                    #${timeCoracaoSelecionado} - ${getNomeTime(timeCoracaoSelecionado)}
                </div>
                <div style="font-size: 14px; color: #666;">
                    <strong>Frequência Histórica:</strong> ${frequenciaTexto}<br>
                    <strong>Estratégia:</strong> ${timeCoracaoEstrategia === 'mais-frequente' ? '🏆 Mais Frequente' : 
                                                  timeCoracaoEstrategia === 'top-frequentes' ? '⭐ Top Frequentes' :
                                                  timeCoracaoEstrategia === 'balanceado' ? '⚖️ Balanceado' : '🎲 Aleatório'}
                </div>
            </div>
        `;
    }
    
    statsDiv.innerHTML = html;
}

// Comparar resultados
document.getElementById('compararButton').addEventListener('click', function() {
    const numerosSorteadosInput = document.getElementById('numerosSorteados').value;
    
    if (!numerosSorteadosInput) {
        alert('Por favor, insira os 7 números sorteados');
        return;
    }
    
    const numerosSorteados = numerosSorteadosInput.split(',').map(num => {
        const parsed = parseInt(num.trim(), 10);
        return isNaN(parsed) ? null : parsed;
    }).filter(num => num !== null);
    
    if (numerosSorteados.length !== 7) {
        alert(`Você inseriu ${numerosSorteados.length} números. Por favor, insira exatamente 7 números.`);
        return;
    }
    
    const invalidos = numerosSorteados.filter(num => num < 1 || num > 80);
    if (invalidos.length > 0) {
        alert(`Números inválidos encontrados: ${invalidos.join(', ')}. Os números devem estar entre 1 e 80.`);
        return;
    }
    
    const numerosUnicos = new Set(numerosSorteados);
    if (numerosUnicos.size !== numerosSorteados.length) {
        alert('Há números duplicados. Cada número deve ser único.');
        return;
    }
    
    if (window.historyOfGeneratedSets.length === 0) {
        alert('Por favor, gere combinações primeiro.');
        return;
    }
    
    const numerosSorteadosSet = new Set(numerosSorteados);
    let acertos7 = 0;
    let acertos6 = 0;
    let acertos5 = 0;
    let acertos4 = 0;
    let acertos3 = 0;
    let acertosAbaixo3 = 0;
    
    let melhoresCombinacoes = [];
    
    window.historyOfGeneratedSets.forEach((combinacao, index) => {
        const acertos = combinacao.filter(num => numerosSorteadosSet.has(num)).length;
        
        switch(acertos) {
            case 7: 
                acertos7++; 
                melhoresCombinacoes.push({ combinacao, acertos, index });
                break;
            case 6: 
                acertos6++; 
                if (melhoresCombinacoes.length < 10) {
                    melhoresCombinacoes.push({ combinacao, acertos, index });
                }
                break;
            case 5: 
                acertos5++; 
                if (melhoresCombinacoes.length < 5) {
                    melhoresCombinacoes.push({ combinacao, acertos, index });
                }
                break;
            case 4: acertos4++; break;
            case 3: acertos3++; break;
            default: acertosAbaixo3++;
        }
    });
    
    // Ordenar melhores combinações
    melhoresCombinacoes.sort((a, b) => b.acertos - a.acertos);
    
    const resultadoDiv = document.getElementById('resultadoComparacao');
    resultadoDiv.style.display = 'block';
    
    let html = `
        <h3>📊 Resultado da Comparação</h3>
        <p><strong>Números sorteados:</strong> ${Array.from(numerosSorteadosSet).sort((a, b) => a - b).map(n => n.toString().padStart(2, '0')).join(', ')}</p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 15px; margin-top: 20px;">
            <div style="background: #d4edda; padding: 15px; border-radius: 5px; text-align: center;">
                <div style="font-size: 24px; font-weight: bold; color: #155724;">${acertos7}</div>
                <div>7 acertos 🏆</div>
            </div>
            <div style="background: #cce7ff; padding: 15px; border-radius: 5px; text-align: center;">
                <div style="font-size: 24px; font-weight: bold; color: #004085;">${acertos6}</div>
                <div>6 acertos</div>
            </div>
            <div style="background: #fff3cd; padding: 15px; border-radius: 5px; text-align: center;">
                <div style="font-size: 24px; font-weight: bold; color: #856404;">${acertos5}</div>
                <div>5 acertos</div>
            </div>
            <div style="background: #f8d7da; padding: 15px; border-radius: 5px; text-align: center;">
                <div style="font-size: 24px; font-weight: bold; color: #721c24;">${acertos4}</div>
                <div>4 acertos</div>
            </div>
        </div>
        
        <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #dee2e6;">
            <h4>Detalhamento Completo:</h4>
            <ul>
                <li><strong>${acertos7}</strong> combinações com 7 acertos ${acertos7 > 0 ? '🎉 JACKPOT!' : ''}</li>
                <li><strong>${acertos6}</strong> combinações com 6 acertos</li>
                <li><strong>${acertos5}</strong> combinações com 5 acertos</li>
                <li><strong>${acertos4}</strong> combinações com 4 acertos</li>
                <li><strong>${acertos3}</strong> combinações com 3 acertos</li>
                <li><strong>${acertosAbaixo3}</strong> combinações com menos de 3 acertos</li>
            </ul>
        </div>
    `;
    
    // Adicionar seção de melhores combinações se houver acertos significativos
    if (melhoresCombinacoes.length > 0) {
        html += `
            <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #dee2e6;">
                <h4>⭐ Melhores Combinações:</h4>
                <div style="max-height: 300px; overflow-y: auto; padding: 10px; background: #f8f9fa; border-radius: 5px;">
        `;
        
        melhoresCombinacoes.slice(0, 10).forEach((item, index) => {
            const combinacao = item.combinacao;
            const acertos = item.acertos;
            
            // Destacar números acertados
            const numerosHtml = combinacao.map(num => {
                const acertou = numerosSorteadosSet.has(num);
                const classe = acertou ? 'destaque-acerto' : (isFrequent(num) ? 'frequente' : (isEven(num) ? 'par' : 'impar'));
                return `<span class="numero ${classe}">${num.toString().padStart(2, '0')}</span>`;
            }).join('');
            
            html += `
                <div style="margin: 10px 0; padding: 10px; border: 1px solid #dee2e6; border-radius: 5px; background: white;">
                    <strong>Combinação #${item.index + 1}:</strong> ${acertos} acertos<br>
                    <div style="margin-top: 5px;">${numerosHtml}</div>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    }
    
    resultadoDiv.innerHTML = html;
});

// Inicializar
displayAllSets();

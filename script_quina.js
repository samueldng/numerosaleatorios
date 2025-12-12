// Quina Generator - Estratégias Baseadas em Estatísticas
window.historyOfGeneratedSets = [];
let currentStrategy = 'balanceada';

// Todos os números de 1 a 80
const TODOS_NUMEROS = Array.from({length: 80}, (_, i) => i + 1);

// Números pares e ímpares
const PARES = TODOS_NUMEROS.filter(n => n % 2 === 0);
const IMPARES = TODOS_NUMEROS.filter(n => n % 2 === 1);

// Top 10 números mais frequentes (histórico total até 2025)
const TOP_10_HISTORICO = [4, 52, 26, 49, 31, 44, 16, 39, 29, 5];

// Números mais frequentes em 2025
const QUENTES_2025 = [52, 13, 15, 23, 48, 19, 31, 41, 60];

// Top 20 números frequentes históricos (expandido)
const NUMEROS_FREQUENTES = [4, 52, 26, 49, 31, 44, 16, 39, 29, 5, 13, 15, 23, 48, 19, 41, 60, 35, 42, 53];

// Grupos numéricos para distribuição
const GRUPOS = {
    1: Array.from({length: 20}, (_, i) => i + 1),      // 1-20
    2: Array.from({length: 20}, (_, i) => i + 21),     // 21-40
    3: Array.from({length: 20}, (_, i) => i + 41),     // 41-60
    4: Array.from({length: 20}, (_, i) => i + 61)      // 61-80
};

// Seleção de estratégia
document.querySelectorAll('.strategy-card').forEach(card => {
    card.addEventListener('click', function() {
        document.querySelectorAll('.strategy-card').forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        currentStrategy = this.dataset.strategy;
    });
});

// Ativar estratégia padrão
document.querySelector('.strategy-card[data-strategy="balanceada"]').classList.add('active');

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
function validateFixedNumbers(input, quantidade) {
    if (!input) return { valid: true, numbers: [] };
    
    const numbers = input.split(',').map(num => parseInt(num.trim(), 10)).filter(num => !isNaN(num));
    
    const invalidNumbers = numbers.filter(num => num < 1 || num > 80);
    if (invalidNumbers.length > 0) {
        alert('Por favor, insira números válidos entre 1 e 80.');
        return { valid: false };
    }
    
    const uniqueNumbers = new Set(numbers);
    if (uniqueNumbers.size !== numbers.length) {
        alert('Os números fixos não podem ter repetições.');
        return { valid: false };
    }
    
    if (numbers.length > 3) {
        alert('Você pode definir no máximo 3 números fixos.');
        return { valid: false };
    }
    
    if (numbers.length >= quantidade) {
        alert(`Você está gerando ${quantidade} números, mas definiu ${numbers.length} fixos. Reduza os números fixos.`);
        return { valid: false };
    }
    
    return { valid: true, numbers };
}

// Gerar uma combinação
document.getElementById('generateButton').addEventListener('click', function() {
    const quantidade = parseInt(document.getElementById('quantidadeNumeros').value);
    const fixedNumbersInput = document.getElementById('fixedNumbers').value;
    const validation = validateFixedNumbers(fixedNumbersInput, quantidade);
    
    if (!validation.valid) return;
    
    const combination = generateCombination(currentStrategy, validation.numbers, quantidade);
    window.historyOfGeneratedSets.push(combination);
    displayAllSets();
    updateStats();
});

// Gerar múltiplas combinações
document.getElementById('generateMultipleButton').addEventListener('click', function() {
    const quantidade = parseInt(document.getElementById('quantidadeNumeros').value);
    const fixedNumbersInput = document.getElementById('fixedNumbers').value;
    const validation = validateFixedNumbers(fixedNumbersInput, quantidade);
    
    if (!validation.valid) return;
    
    window.historyOfGeneratedSets = [];
    for (let i = 0; i < 10; i++) {
        const combination = generateCombination(currentStrategy, validation.numbers, quantidade);
        window.historyOfGeneratedSets.push(combination);
    }
    displayAllSets();
    updateStats();
});

// Gerar 50 combinações otimizadas
document.getElementById('generateOptimizedButton').addEventListener('click', function() {
    const quantidade = parseInt(document.getElementById('quantidadeNumeros').value);
    const fixedNumbersInput = document.getElementById('fixedNumbers').value;
    const validation = validateFixedNumbers(fixedNumbersInput, quantidade);
    
    if (!validation.valid) return;
    
    window.historyOfGeneratedSets = [];
    const strategies = ['historico-top10', '2025-quentes', 'balanceada', 'par-impar', 'grupos', 'mista'];
    
    for (let i = 0; i < 50; i++) {
        const strategy = strategies[i % strategies.length];
        const combination = generateCombination(strategy, validation.numbers, quantidade);
        
        const isDuplicate = window.historyOfGeneratedSets.some(existing => 
            JSON.stringify(existing.sort()) === JSON.stringify(combination.sort())
        );
        
        if (!isDuplicate) {
            window.historyOfGeneratedSets.push(combination);
        } else {
            i--;
        }
    }
    
    displayAllSets();
    updateStats();
});

// Função principal de geração
function generateCombination(strategy, fixedNumbers = [], quantidade = 7) {
    let combination = [...fixedNumbers];
    const remaining = quantidade - combination.length;
    
    switch(strategy) {
        case 'historico-top10':
            return generateHistoricoTop10(combination, remaining);
        case '2025-quentes':
            return generate2025Quentes(combination, remaining);
        case 'balanceada':
            return generateBalanceada(combination, remaining);
        case 'par-impar':
            return generateParImpar(combination, remaining);
        case 'grupos':
            return generateGrupos(combination, remaining);
        case 'mista':
            return generateMista(combination, remaining);
        case 'random':
            return generateRandom(combination, remaining);
        default:
            return generateBalanceada(combination, remaining);
    }
}

// Estratégia Top 10 Histórico
function generateHistoricoTop10(fixed, remaining) {
    let combination = [...fixed];
    
    // Usar 60-70% dos top 10
    const quantidadeTop10 = Math.floor(remaining * 0.65);
    const quantidadeAleatorios = remaining - quantidadeTop10;
    
    const top10Disponiveis = TOP_10_HISTORICO.filter(n => !combination.includes(n));
    for (let i = 0; i < quantidadeTop10 && combination.length < (fixed.length + remaining); i++) {
        if (top10Disponiveis.length > 0) {
            const index = Math.floor(Math.random() * top10Disponiveis.length);
            combination.push(top10Disponiveis[index]);
            top10Disponiveis.splice(index, 1);
        }
    }
    
    const todosDisponiveis = TODOS_NUMEROS.filter(n => !combination.includes(n));
    for (let i = 0; i < quantidadeAleatorios && combination.length < (fixed.length + remaining); i++) {
        if (todosDisponiveis.length > 0) {
            const index = Math.floor(Math.random() * todosDisponiveis.length);
            combination.push(todosDisponiveis[index]);
            todosDisponiveis.splice(index, 1);
        }
    }
    
    while (combination.length < (fixed.length + remaining)) {
        const available = TODOS_NUMEROS.filter(n => !combination.includes(n));
        if (available.length > 0) {
            combination.push(available[Math.floor(Math.random() * available.length)]);
        }
    }
    
    return combination.sort((a, b) => a - b);
}

// Estratégia Quentes 2025
function generate2025Quentes(fixed, remaining) {
    let combination = [...fixed];
    
    const quantidadeQuentes = Math.floor(remaining * 0.6);
    const quantidadeAleatorios = remaining - quantidadeQuentes;
    
    const quentesDisponiveis = QUENTES_2025.filter(n => !combination.includes(n));
    for (let i = 0; i < quantidadeQuentes && combination.length < (fixed.length + remaining); i++) {
        if (quentesDisponiveis.length > 0) {
            const index = Math.floor(Math.random() * quentesDisponiveis.length);
            combination.push(quentesDisponiveis[index]);
            quentesDisponiveis.splice(index, 1);
        }
    }
    
    const todosDisponiveis = TODOS_NUMEROS.filter(n => !combination.includes(n));
    for (let i = 0; i < quantidadeAleatorios && combination.length < (fixed.length + remaining); i++) {
        if (todosDisponiveis.length > 0) {
            const index = Math.floor(Math.random() * todosDisponiveis.length);
            combination.push(todosDisponiveis[index]);
            todosDisponiveis.splice(index, 1);
        }
    }
    
    while (combination.length < (fixed.length + remaining)) {
        const available = TODOS_NUMEROS.filter(n => !combination.includes(n));
        if (available.length > 0) {
            combination.push(available[Math.floor(Math.random() * available.length)]);
        }
    }
    
    return combination.sort((a, b) => a - b);
}

// Estratégia Balanceada: 3 pares + 2 ímpares (para 5 números)
// Proporção: 60% pares, 40% ímpares
function generateBalanceada(fixed, remaining) {
    let combination = [...fixed];
    const totalNumeros = fixed.length + remaining;
    const fixedPares = fixed.filter(n => n % 2 === 0).length;
    const fixedImpares = fixed.filter(n => n % 2 === 1).length;
    
    const targetPares = Math.ceil(totalNumeros * 0.6);
    const targetImpares = totalNumeros - targetPares;
    
    let needPares = Math.max(0, targetPares - fixedPares);
    let needImpares = Math.max(0, targetImpares - fixedImpares);
    
    if (fixedPares > targetPares) {
        needPares = 0;
        needImpares = remaining;
    } else if (fixedImpares > targetImpares) {
        needImpares = 0;
        needPares = remaining;
    }
    
    const availablePares = PARES.filter(n => !combination.includes(n));
    for (let i = 0; i < needPares && combination.length < totalNumeros; i++) {
        if (availablePares.length > 0) {
            const index = Math.floor(Math.random() * availablePares.length);
            combination.push(availablePares[index]);
            availablePares.splice(index, 1);
        }
    }
    
    const availableImpares = IMPARES.filter(n => !combination.includes(n));
    for (let i = 0; i < needImpares && combination.length < totalNumeros; i++) {
        if (availableImpares.length > 0) {
            const index = Math.floor(Math.random() * availableImpares.length);
            combination.push(availableImpares[index]);
            availableImpares.splice(index, 1);
        }
    }
    
    while (combination.length < totalNumeros) {
        const available = TODOS_NUMEROS.filter(n => !combination.includes(n));
        if (available.length > 0) {
            combination.push(available[Math.floor(Math.random() * available.length)]);
        }
    }
    
    return combination.sort((a, b) => a - b);
}

// Estratégia Par/Ímpar: 2 pares + 3 ímpares (para 5 números)
// Proporção: 40% pares, 60% ímpares
function generateParImpar(fixed, remaining) {
    let combination = [...fixed];
    const totalNumeros = fixed.length + remaining;
    const fixedPares = fixed.filter(n => n % 2 === 0).length;
    const fixedImpares = fixed.filter(n => n % 2 === 1).length;
    
    const targetPares = Math.floor(totalNumeros * 0.4);
    const targetImpares = totalNumeros - targetPares;
    
    let needPares = Math.max(0, targetPares - fixedPares);
    let needImpares = Math.max(0, targetImpares - fixedImpares);
    
    if (fixedPares > targetPares) {
        needPares = 0;
        needImpares = remaining;
    } else if (fixedImpares > targetImpares) {
        needImpares = 0;
        needPares = remaining;
    }
    
    const availableImpares = IMPARES.filter(n => !combination.includes(n));
    for (let i = 0; i < needImpares && combination.length < totalNumeros; i++) {
        if (availableImpares.length > 0) {
            const index = Math.floor(Math.random() * availableImpares.length);
            combination.push(availableImpares[index]);
            availableImpares.splice(index, 1);
        }
    }
    
    const availablePares = PARES.filter(n => !combination.includes(n));
    for (let i = 0; i < needPares && combination.length < totalNumeros; i++) {
        if (availablePares.length > 0) {
            const index = Math.floor(Math.random() * availablePares.length);
            combination.push(availablePares[index]);
            availablePares.splice(index, 1);
        }
    }
    
    while (combination.length < totalNumeros) {
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
    const totalNumeros = fixed.length + remaining;
    
    const grupoCount = { 1: 0, 2: 0, 3: 0, 4: 0 };
    fixed.forEach(num => {
        if (num <= 20) grupoCount[1]++;
        else if (num <= 40) grupoCount[2]++;
        else if (num <= 60) grupoCount[3]++;
        else grupoCount[4]++;
    });
    
    while (combination.length < totalNumeros) {
        let grupoEscolhido = 1;
        let minCount = grupoCount[1];
        
        for (let g = 2; g <= 4; g++) {
            if (grupoCount[g] < minCount) {
                minCount = grupoCount[g];
                grupoEscolhido = g;
            }
        }
        
        const numerosGrupo = GRUPOS[grupoEscolhido].filter(n => !combination.includes(n));
        if (numerosGrupo.length > 0) {
            const escolhido = numerosGrupo[Math.floor(Math.random() * numerosGrupo.length)];
            combination.push(escolhido);
            grupoCount[grupoEscolhido]++;
        } else {
            const available = TODOS_NUMEROS.filter(n => !combination.includes(n));
            if (available.length > 0) {
                combination.push(available[Math.floor(Math.random() * available.length)]);
            }
        }
    }
    
    return combination.sort((a, b) => a - b);
}

// Estratégia Mista: 50% frequentes + 50% aleatórios
function generateMista(fixed, remaining) {
    let combination = [...fixed];
    
    const quantidadeFrequentes = Math.floor(remaining * 0.5);
    const quantidadeAleatorios = remaining - quantidadeFrequentes;
    
    const frequentesDisponiveis = NUMEROS_FREQUENTES.filter(n => !combination.includes(n));
    for (let i = 0; i < quantidadeFrequentes && combination.length < (fixed.length + remaining); i++) {
        if (frequentesDisponiveis.length > 0) {
            const index = Math.floor(Math.random() * frequentesDisponiveis.length);
            combination.push(frequentesDisponiveis[index]);
            frequentesDisponiveis.splice(index, 1);
        }
    }
    
    const todosDisponiveis = TODOS_NUMEROS.filter(n => !combination.includes(n) && !NUMEROS_FREQUENTES.includes(n));
    for (let i = 0; i < quantidadeAleatorios && combination.length < (fixed.length + remaining); i++) {
        if (todosDisponiveis.length > 0) {
            const index = Math.floor(Math.random() * todosDisponiveis.length);
            combination.push(todosDisponiveis[index]);
            todosDisponiveis.splice(index, 1);
        }
    }
    
    while (combination.length < (fixed.length + remaining)) {
        const available = TODOS_NUMEROS.filter(n => !combination.includes(n));
        if (available.length > 0) {
            combination.push(available[Math.floor(Math.random() * available.length)]);
        }
    }
    
    return combination.sort((a, b) => a - b);
}

// Estratégia Aleatória
function generateRandom(fixed, remaining) {
    let combination = [...fixed];
    const available = TODOS_NUMEROS.filter(n => !combination.includes(n));
    
    const shuffled = [...available].sort(() => Math.random() - 0.5);
    combination.push(...shuffled.slice(0, remaining));
    
    return combination.sort((a, b) => a - b);
}

// Determinar classificação do número
function getNumeroClassificacao(num) {
    if (TOP_10_HISTORICO.includes(num)) {
        return 'muito-frequente';
    } else if (NUMEROS_FREQUENTES.includes(num)) {
        return 'frequente';
    } else if (num % 2 === 0) {
        return 'par';
    } else {
        return 'impar';
    }
}

// Exibir todas as combinações
function displayAllSets() {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';
    
    if (window.historyOfGeneratedSets.length === 0) {
        resultDiv.textContent = 'Nenhuma combinação gerada ainda.';
        return;
    }
    
    const quantidade = window.historyOfGeneratedSets[0].length;
    const header = document.createElement('div');
    header.style.cssText = 'background: linear-gradient(135deg, #9c27b0 0%, #6a1b9a 100%); color: white; padding: 20px; margin-bottom: 20px; border-radius: 12px; box-shadow: 0 4px 15px rgba(156, 39, 176, 0.3);';
    header.innerHTML = `<strong style="font-size: 18px;">Total: ${window.historyOfGeneratedSets.length} combinações geradas</strong><br>
        <small style="opacity: 0.9;">Cada linha contém ${quantidade} números da Quina (1-80)</small>`;
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
            span.classList.add(getNumeroClassificacao(num));
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
    
    const totalPares = window.historyOfGeneratedSets.reduce((sum, comb) => 
        sum + comb.filter(n => n % 2 === 0).length, 0);
    const totalImpares = window.historyOfGeneratedSets.reduce((sum, comb) => 
        sum + comb.filter(n => n % 2 === 1).length, 0);
    const avgPares = (totalPares / window.historyOfGeneratedSets.length).toFixed(2);
    const avgImpares = (totalImpares / window.historyOfGeneratedSets.length).toFixed(2);
    
    const totalTop10 = window.historyOfGeneratedSets.reduce((sum, comb) => 
        sum + comb.filter(n => TOP_10_HISTORICO.includes(n)).length, 0);
    const avgTop10 = (totalTop10 / window.historyOfGeneratedSets.length).toFixed(2);
    
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
                <span style="font-size: 24px; color: #9c27b0;">${avgPares}</span>
            </div>
            <div style="background: white; padding: 15px; border-radius: 8px; text-align: center;">
                <strong>Média de Ímpares</strong><br>
                <span style="font-size: 24px; color: #ff9800;">${avgImpares}</span>
            </div>
            <div style="background: white; padding: 15px; border-radius: 8px; text-align: center;">
                <strong>Média Top 10</strong><br>
                <span style="font-size: 24px; color: #f44336;">${avgTop10}</span>
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
    
    statsDiv.innerHTML = html;
}

// Comparar resultados
document.getElementById('compararButton').addEventListener('click', function() {
    const numerosSorteadosInput = document.getElementById('numerosSorteados').value;
    
    if (!numerosSorteadosInput) {
        alert('Por favor, insira os 5 números sorteados');
        return;
    }
    
    const numerosSorteados = numerosSorteadosInput.split(',').map(num => {
        const parsed = parseInt(num.trim(), 10);
        return isNaN(parsed) ? null : parsed;
    }).filter(num => num !== null);
    
    if (numerosSorteados.length !== 5) {
        alert(`Você inseriu ${numerosSorteados.length} números. Por favor, insira exatamente 5 números.`);
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
    let acertos5 = 0, acertos4 = 0, acertos3 = 0, acertos2 = 0, acertosAbaixo2 = 0;
    let melhoresCombinacoes = [];
    
    window.historyOfGeneratedSets.forEach((combinacao, index) => {
        const acertos = combinacao.filter(num => numerosSorteadosSet.has(num)).length;
        
        switch(acertos) {
            case 5: 
                acertos5++; 
                melhoresCombinacoes.push({ combinacao, acertos, index });
                break;
            case 4: 
                acertos4++; 
                if (melhoresCombinacoes.length < 10) {
                    melhoresCombinacoes.push({ combinacao, acertos, index });
                }
                break;
            case 3: 
                acertos3++; 
                if (melhoresCombinacoes.length < 5) {
                    melhoresCombinacoes.push({ combinacao, acertos, index });
                }
                break;
            case 2: acertos2++; break;
            default: acertosAbaixo2++;
        }
    });
    
    melhoresCombinacoes.sort((a, b) => b.acertos - a.acertos);
    
    const resultadoDiv = document.getElementById('resultadoComparacao');
    resultadoDiv.style.display = 'block';
    
    let html = `
        <h3>📊 Resultado da Comparação</h3>
        <p><strong>Números sorteados:</strong> ${Array.from(numerosSorteadosSet).sort((a, b) => a - b).map(n => n.toString().padStart(2, '0')).join(', ')}</p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 15px; margin-top: 20px;">
            <div style="background: #d4edda; padding: 15px; border-radius: 5px; text-align: center;">
                <div style="font-size: 24px; font-weight: bold; color: #155724;">${acertos5}</div>
                <div>5 acertos (Quina) 🏆</div>
            </div>
            <div style="background: #cce7ff; padding: 15px; border-radius: 5px; text-align: center;">
                <div style="font-size: 24px; font-weight: bold; color: #004085;">${acertos4}</div>
                <div>4 acertos (Quadra)</div>
            </div>
            <div style="background: #fff3cd; padding: 15px; border-radius: 5px; text-align: center;">
                <div style="font-size: 24px; font-weight: bold; color: #856404;">${acertos3}</div>
                <div>3 acertos (Terno)</div>
            </div>
            <div style="background: #f8d7da; padding: 15px; border-radius: 5px; text-align: center;">
                <div style="font-size: 24px; font-weight: bold; color: #721c24;">${acertos2}</div>
                <div>2 acertos (Duque)</div>
            </div>
        </div>
        
        <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #dee2e6;">
            <h4>Detalhamento Completo:</h4>
            <ul>
                <li><strong>${acertos5}</strong> combinações com 5 acertos ${acertos5 > 0 ? '🎉 QUINA!' : ''}</li>
                <li><strong>${acertos4}</strong> combinações com 4 acertos</li>
                <li><strong>${acertos3}</strong> combinações com 3 acertos</li>
                <li><strong>${acertos2}</strong> combinações com 2 acertos</li>
                <li><strong>${acertosAbaixo2}</strong> combinações com menos de 2 acertos</li>
            </ul>
        </div>
    `;
    
    if (melhoresCombinacoes.length > 0) {
        html += `
            <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #dee2e6;">
                <h4>⭐ Melhores Combinações:</h4>
                <div style="max-height: 300px; overflow-y: auto; padding: 10px; background: #f8f9fa; border-radius: 5px;">
        `;
        
        melhoresCombinacoes.slice(0, 10).forEach((item, index) => {
            const combinacao = item.combinacao;
            const acertos = item.acertos;
            
            const numerosHtml = combinacao.map(num => {
                const acertou = numerosSorteadosSet.has(num);
                const classe = acertou ? 'destaque-acerto' : getNumeroClassificacao(num);
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

// Mega Sena Generator - Estratégias Avançadas
window.historyOfGeneratedSets = [];
let currentStrategy = 'balanced';

// Dezenas da Mega Sena
const DEZENAS = {
    1: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],      // 1-10
    2: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20], // 11-20
    3: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30], // 21-30
    4: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40], // 31-40
    5: [41, 42, 43, 44, 45, 46, 47, 48, 49, 50], // 41-50
    6: [51, 52, 53, 54, 55, 56, 57, 58, 59, 60]  // 51-60
};

// Todos os números de 1 a 60
const TODOS_NUMEROS = Array.from({length: 60}, (_, i) => i + 1);

// Números quentes e frios (base histórica simples)
const HOT_NUMBERS = [5, 10, 23, 34, 37, 42, 53];
const COLD_NUMBERS = [8, 9, 26, 27, 44, 50, 60];

// Números pares e ímpares
const PARES = TODOS_NUMEROS.filter(n => n % 2 === 0);
const IMPARES = TODOS_NUMEROS.filter(n => n % 2 === 1);

// Seleção de estratégia
document.querySelectorAll('.strategy-card').forEach(card => {
    card.addEventListener('click', function() {
        document.querySelectorAll('.strategy-card').forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        currentStrategy = this.dataset.strategy;
    });
});

// Ativar estratégia padrão
document.querySelector('.strategy-card[data-strategy="balanced"]').classList.add('active');

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

// Gerar uma combinação
document.getElementById('generateButton').addEventListener('click', function() {
    const fixedNumbersInput = document.getElementById('fixedNumbers').value;
    let fixedNumbers = [];
    
    if (fixedNumbersInput) {
        fixedNumbers = fixedNumbersInput.split(',').map(num => parseInt(num.trim(), 10)).filter(num => !isNaN(num));
        
        // Validar números
        const invalidNumbers = fixedNumbers.filter(num => num < 1 || num > 60);
        if (invalidNumbers.length > 0) {
            alert('Por favor, insira números válidos entre 1 e 60.');
            return;
        }
        
        // Validar duplicatas
        const uniqueFixedNumbers = new Set(fixedNumbers);
        if (uniqueFixedNumbers.size !== fixedNumbers.length) {
            alert('Os números fixos não podem ter repetições.');
            return;
        }
        
        // Validar máximo de 3 fixos
        if (fixedNumbers.length > 3) {
            alert('Você pode definir no máximo 3 números fixos.');
            return;
        }
    }
    
    const combination = generateCombination(currentStrategy, fixedNumbers);
    window.historyOfGeneratedSets.push(combination);
    displayAllSets();
    updateStats();
});

// Gerar múltiplas combinações
document.getElementById('generateMultipleButton').addEventListener('click', function() {
    const fixedNumbersInput = document.getElementById('fixedNumbers').value;
    let fixedNumbers = [];
    
    if (fixedNumbersInput) {
        fixedNumbers = fixedNumbersInput.split(',').map(num => parseInt(num.trim(), 10)).filter(num => !isNaN(num));
        
        const invalidNumbers = fixedNumbers.filter(num => num < 1 || num > 60);
        if (invalidNumbers.length > 0) {
            alert('Por favor, insira números válidos entre 1 e 60.');
            return;
        }
        
        const uniqueFixedNumbers = new Set(fixedNumbers);
        if (uniqueFixedNumbers.size !== fixedNumbers.length) {
            alert('Os números fixos não podem ter repetições.');
            return;
        }
        
        if (fixedNumbers.length > 3) {
            alert('Você pode definir no máximo 3 números fixos.');
            return;
        }
    }
    
    window.historyOfGeneratedSets = [];
    for (let i = 0; i < 10; i++) {
        const combination = generateCombination(currentStrategy, fixedNumbers);
        window.historyOfGeneratedSets.push(combination);
    }
    displayAllSets();
    updateStats();
});

// Função principal de geração
function generateCombination(strategy, fixedNumbers = []) {
    let combination = [...fixedNumbers];
    const remaining = 6 - combination.length;
    
    switch(strategy) {
        case 'balanced':
            return generateBalanced(combination, remaining);
        case 'equilibrado':
            return generateEquilibrado(combination, remaining);
        case 'par-heavy':
            return generateParHeavy(combination, remaining);
        case 'impar-heavy':
            return generateImparHeavy(combination, remaining);
        case 'random':
            return generateRandom(combination, remaining);
        default:
            return generateBalanced(combination, remaining);
    }
}

// Estratégia Balanceada: 3 pares + 3 ímpares, 1 por dezena
function generateBalanced(fixed, remaining) {
    let combination = [...fixed];
    const usedDezenas = new Set(fixed.map(n => getDezena(n)));
    const fixedPares = fixed.filter(n => n % 2 === 0).length;
    const fixedImpares = fixed.filter(n => n % 2 === 1).length;
    
    // Calcular quantos pares e ímpares ainda precisamos
    const targetPares = 3;
    const targetImpares = 3;
    // Usamos let porque vamos decrementar à medida que escolhemos números
    let needPares = Math.max(0, targetPares - fixedPares);
    let needImpares = Math.max(0, targetImpares - fixedImpares);
    
    // Garantir pelo menos 1 número de cada dezena não coberta
    const dezenasNecessarias = [1, 2, 3, 4, 5, 6].filter(d => !usedDezenas.has(d));
    
    // Distribuir números por dezena
    for (let i = 0; i < dezenasNecessarias.length && combination.length < 6; i++) {
        const dezena = dezenasNecessarias[i];
        const numerosDezena = DEZENAS[dezena].filter(n => !combination.includes(n));
        
        if (numerosDezena.length > 0) {
            // Escolher par ou ímpar baseado no que precisamos
            let candidatos = numerosDezena;
            if (needPares > needImpares) {
                candidatos = numerosDezena.filter(n => n % 2 === 0);
                if (candidatos.length === 0) candidatos = numerosDezena;
            } else if (needImpares > needPares) {
                candidatos = numerosDezena.filter(n => n % 2 === 1);
                if (candidatos.length === 0) candidatos = numerosDezena;
            }
            
            const escolhido = candidatos[Math.floor(Math.random() * candidatos.length)];
            combination.push(escolhido);
            usedDezenas.add(dezena);
            
            if (escolhido % 2 === 0) {
                needPares--;
            } else {
                needImpares--;
            }
        }
    }
    
    // Completar até 6 números mantendo balanceamento
    while (combination.length < 6) {
        const available = TODOS_NUMEROS.filter(n => !combination.includes(n));
        let candidatos = available;
        
        // Priorizar balanceamento par/ímpar
        const currentPares = combination.filter(n => n % 2 === 0).length;
        const currentImpares = combination.filter(n => n % 2 === 1).length;
        
        if (currentPares < 3) {
            candidatos = available.filter(n => n % 2 === 0);
        } else if (currentImpares < 3) {
            candidatos = available.filter(n => n % 2 === 1);
        }
        
        if (candidatos.length === 0) candidatos = available;
        const escolhido = candidatos[Math.floor(Math.random() * candidatos.length)];
        combination.push(escolhido);
    }
    
    return combination.sort((a, b) => a - b);
}

// Estratégia Equilibrada Histórica:
// - 2-3 números quentes + 2-3 números frios
// - Balancear pares/ímpares (3/3) e baixos/altos (3 <=30, 3 >30)
function generateEquilibrado(fixed, remaining) {
    const combination = [...fixed];
    const used = new Set(combination);

    let evenCount = combination.filter(n => n % 2 === 0).length;
    let oddCount = combination.length - evenCount;
    let lowCount = combination.filter(n => n <= 30).length;
    let highCount = combination.length - lowCount;

    const addNumber = (num) => {
        if (used.has(num)) return false;
        combination.push(num);
        used.add(num);
        if (num % 2 === 0) evenCount++; else oddCount++;
        if (num <= 30) lowCount++; else highCount++;
        return true;
    };

    const pickFromPool = (pool, maxPick) => {
        const available = pool.filter(n => !used.has(n));
        if (available.length === 0) return;
        const shuffled = available.sort(() => Math.random() - 0.5);
        for (let i = 0; i < Math.min(maxPick, shuffled.length) && combination.length < 6; i++) {
            addNumber(shuffled[i]);
        }
    };

    // 2-3 quentes
    const hotTarget = Math.min(3, Math.max(2, remaining));
    pickFromPool(HOT_NUMBERS, hotTarget);

    // 2-3 frios (ajustando para não ultrapassar 6 números)
    const remainingAfterHot = 6 - combination.length;
    const coldTarget = Math.max(0, Math.min(3, remainingAfterHot));
    pickFromPool(COLD_NUMBERS, coldTarget);

    // Recontar após hot/cold
    evenCount = combination.filter(n => n % 2 === 0).length;
    oddCount = combination.length - evenCount;
    lowCount = combination.filter(n => n <= 30).length;
    highCount = combination.length - lowCount;

    // Balancear par/ímpar até 3/3
    const needEven = Math.max(0, 3 - evenCount);
    const needOdd = Math.max(0, 3 - oddCount);
    if (needEven > 0) {
        pickFromPool(PARES, needEven);
    }
    if (needOdd > 0 && combination.length < 6) {
        pickFromPool(IMPARES, needOdd);
    }

    // Balancear baixos/altos (1-30 / 31-60)
    const LOW = TODOS_NUMEROS.filter(n => n <= 30);
    const HIGH = TODOS_NUMEROS.filter(n => n > 30);
    const needLow = Math.max(0, 3 - lowCount);
    const needHigh = Math.max(0, 3 - highCount);
    if (needLow > 0 && combination.length < 6) {
        pickFromPool(LOW, needLow);
    }
    if (needHigh > 0 && combination.length < 6) {
        pickFromPool(HIGH, needHigh);
    }

    // Completar qualquer slot faltante sem repetir
    while (combination.length < 6) {
        const available = TODOS_NUMEROS.filter(n => !used.has(n));
        if (available.length === 0) break;
        addNumber(available[Math.floor(Math.random() * available.length)]);
    }

    return combination.sort((a, b) => a - b);
}

// Estratégia Par Pesado: 4 pares + 2 ímpares
function generateParHeavy(fixed, remaining) {
    let combination = [...fixed];
    const fixedPares = fixed.filter(n => n % 2 === 0).length;
    const fixedImpares = fixed.filter(n => n % 2 === 1).length;
    
    const needPares = Math.max(0, 4 - fixedPares);
    const needImpares = Math.max(0, 2 - fixedImpares);
    
    // Adicionar pares
    for (let i = 0; i < needPares && combination.length < 6; i++) {
        const available = PARES.filter(n => !combination.includes(n));
        if (available.length > 0) {
            combination.push(available[Math.floor(Math.random() * available.length)]);
        }
    }
    
    // Adicionar ímpares
    for (let i = 0; i < needImpares && combination.length < 6; i++) {
        const available = IMPARES.filter(n => !combination.includes(n));
        if (available.length > 0) {
            combination.push(available[Math.floor(Math.random() * available.length)]);
        }
    }
    
    // Completar se necessário
    while (combination.length < 6) {
        const available = TODOS_NUMEROS.filter(n => !combination.includes(n));
        combination.push(available[Math.floor(Math.random() * available.length)]);
    }
    
    return combination.sort((a, b) => a - b);
}

// Estratégia Ímpar Pesado: 2 pares + 4 ímpares
function generateImparHeavy(fixed, remaining) {
    let combination = [...fixed];
    const fixedPares = fixed.filter(n => n % 2 === 0).length;
    const fixedImpares = fixed.filter(n => n % 2 === 1).length;
    
    const needPares = Math.max(0, 2 - fixedPares);
    const needImpares = Math.max(0, 4 - fixedImpares);
    
    // Adicionar ímpares primeiro
    for (let i = 0; i < needImpares && combination.length < 6; i++) {
        const available = IMPARES.filter(n => !combination.includes(n));
        if (available.length > 0) {
            combination.push(available[Math.floor(Math.random() * available.length)]);
        }
    }
    
    // Adicionar pares
    for (let i = 0; i < needPares && combination.length < 6; i++) {
        const available = PARES.filter(n => !combination.includes(n));
        if (available.length > 0) {
            combination.push(available[Math.floor(Math.random() * available.length)]);
        }
    }
    
    // Completar se necessário
    while (combination.length < 6) {
        const available = TODOS_NUMEROS.filter(n => !combination.includes(n));
        combination.push(available[Math.floor(Math.random() * available.length)]);
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

// Obter dezena de um número
function getDezena(num) {
    if (num <= 10) return 1;
    if (num <= 20) return 2;
    if (num <= 30) return 3;
    if (num <= 40) return 4;
    if (num <= 50) return 5;
    return 6;
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
    header.style.cssText = 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; margin-bottom: 20px; border-radius: 12px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);';
    header.innerHTML = `<strong style="font-size: 18px;">Total: ${window.historyOfGeneratedSets.length} combinações geradas</strong><br>
        <small style="opacity: 0.9;">Cada linha contém 6 números da Mega Sena</small>`;
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
            span.classList.add(`dezena-${getDezena(num)}`);
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
    
    // Distribuição por dezena
    const dezenaCount = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0};
    window.historyOfGeneratedSets.forEach(comb => {
        comb.forEach(num => {
            dezenaCount[getDezena(num)]++;
        });
    });
    
    let html = `
        <h3>📊 Estatísticas das Combinações</h3>
        <p><strong>Média de Pares:</strong> ${avgPares} | <strong>Média de Ímpares:</strong> ${avgImpares}</p>
        <p><strong>Distribuição por Dezena:</strong></p>
        <ul>
            <li>1-10: ${dezenaCount[1]} números</li>
            <li>11-20: ${dezenaCount[2]} números</li>
            <li>21-30: ${dezenaCount[3]} números</li>
            <li>31-40: ${dezenaCount[4]} números</li>
            <li>41-50: ${dezenaCount[5]} números</li>
            <li>51-60: ${dezenaCount[6]} números</li>
        </ul>
    `;
    
    statsDiv.innerHTML = html;
}

// Comparar resultados
document.getElementById('compararButton').addEventListener('click', function() {
    const numerosSorteadosInput = document.getElementById('numerosSorteados').value;
    
    if (!numerosSorteadosInput) {
        alert('Por favor, insira os 6 números sorteados');
        return;
    }
    
    const numerosSorteados = numerosSorteadosInput.split(',').map(num => {
        const parsed = parseInt(num.trim(), 10);
        return isNaN(parsed) ? null : parsed;
    }).filter(num => num !== null);
    
    if (numerosSorteados.length !== 6) {
        alert(`Você inseriu ${numerosSorteados.length} números. Por favor, insira exatamente 6 números.`);
        return;
    }
    
    const invalidos = numerosSorteados.filter(num => num < 1 || num > 60);
    if (invalidos.length > 0) {
        alert(`Números inválidos encontrados: ${invalidos.join(', ')}. Os números devem estar entre 1 e 60.`);
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
    let acertos6 = 0;
    let acertos5 = 0;
    let acertos4 = 0;
    let acertos3 = 0;
    let acertosAbaixo3 = 0;
    
    window.historyOfGeneratedSets.forEach(combinacao => {
        const acertos = combinacao.filter(num => numerosSorteadosSet.has(num)).length;
        
        switch(acertos) {
            case 6: acertos6++; break;
            case 5: acertos5++; break;
            case 4: acertos4++; break;
            case 3: acertos3++; break;
            default: acertosAbaixo3++;
        }
    });
    
    const resultadoDiv = document.getElementById('resultadoComparacao');
    resultadoDiv.style.display = 'block';
    
    let html = `
        <h3>📊 Resultado da Comparação</h3>
        <p><strong>Números sorteados:</strong> ${Array.from(numerosSorteadosSet).sort((a, b) => a - b).map(n => n.toString().padStart(2, '0')).join(', ')}</p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 15px; margin-top: 20px;">
            <div style="background: #d4edda; padding: 15px; border-radius: 5px; text-align: center;">
                <div style="font-size: 24px; font-weight: bold; color: #155724;">${acertos6}</div>
                <div>6 acertos 🏆</div>
            </div>
            <div style="background: #cce7ff; padding: 15px; border-radius: 5px; text-align: center;">
                <div style="font-size: 24px; font-weight: bold; color: #004085;">${acertos5}</div>
                <div>5 acertos</div>
            </div>
            <div style="background: #fff3cd; padding: 15px; border-radius: 5px; text-align: center;">
                <div style="font-size: 24px; font-weight: bold; color: #856404;">${acertos4}</div>
                <div>4 acertos</div>
            </div>
            <div style="background: #f8d7da; padding: 15px; border-radius: 5px; text-align: center;">
                <div style="font-size: 24px; font-weight: bold; color: #721c24;">${acertos3}</div>
                <div>3 acertos</div>
            </div>
        </div>
        
        <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #dee2e6;">
            <h4>Detalhamento Completo:</h4>
            <ul>
                <li><strong>${acertos6}</strong> combinações com 6 acertos ${acertos6 > 0 ? '🎉 JACKPOT!' : ''}</li>
                <li><strong>${acertos5}</strong> combinações com 5 acertos</li>
                <li><strong>${acertos4}</strong> combinações com 4 acertos</li>
                <li><strong>${acertos3}</strong> combinações com 3 acertos</li>
                <li><strong>${acertosAbaixo3}</strong> combinações com menos de 3 acertos</li>
            </ul>
        </div>
    `;
    
    resultadoDiv.innerHTML = html;
});

// Buscar resultados da Mega Sena
document.getElementById('buscarResultadosButton').addEventListener('click', async function() {
    const button = this;
    const originalText = button.innerHTML;
    button.innerHTML = '🔄 Buscando resultados...';
    button.disabled = true;
    
    try {
        if (window.historyOfGeneratedSets.length === 0) {
            alert('Por favor, gere combinações primeiro.');
            return;
        }
        
        // Tentar buscar da API
        const response = await fetch('https://loteriascaixa-api.herokuapp.com/api/megasena/latest');
        
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }
        
        const data = await response.json();
        const numerosSorteados = data.dezenas.map(num => parseInt(num, 10));
        const numerosSorteadosSet = new Set(numerosSorteados);
        const concurso = data.concurso;
        const dataSorteio = data.data;
        
        // Preencher campo automaticamente
        document.getElementById('numerosSorteados').value = numerosSorteados.join(', ');
        
        // Executar comparação
        document.getElementById('compararButton').click();
        
        // Adicionar informações do concurso
        const resultadoDiv = document.getElementById('resultadoComparacao');
        const infoDiv = document.createElement('div');
        infoDiv.style.cssText = 'background: #e7f3ff; padding: 15px; border-radius: 5px; margin-bottom: 15px;';
        infoDiv.innerHTML = `<strong>Concurso:</strong> ${concurso} | <strong>Data:</strong> ${dataSorteio}`;
        resultadoDiv.insertBefore(infoDiv, resultadoDiv.firstChild);
        
    } catch (error) {
        console.error('Erro ao buscar resultados:', error);
        alert('Erro ao buscar resultados da Mega Sena. Por favor, insira os números manualmente.\n\nDetalhes: ' + error.message);
    } finally {
        button.innerHTML = originalText;
        button.disabled = false;
    }
});

// Inicializar
displayAllSets();


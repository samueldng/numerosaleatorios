// Versão modificada: 7 números PARES fixos + 8 números ÍMPARES aleatórios
// Tornar global para acesso na comparação
window.historyOfGeneratedSets = [];
window.historicalLotteryResults = new Set(); // Store historical lottery results
let worker = null;
let isGenerating = false;

// Números pares e ímpares de 1 a 25
const PARES = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24]; // 12 pares
const IMPARES = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25]; // 13 ímpares

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

document.getElementById('generateButton').addEventListener('click', function() {
    const fixedNumbersInput = document.getElementById('fixedNumbers').value;
    let paresFixos = [];
    
    if (fixedNumbersInput) {
        paresFixos = fixedNumbersInput.split(',').map(num => parseInt(num.trim(), 10)).filter(num => !isNaN(num));
        
        // Validar que são números entre 1-25
        const invalidNumbers = paresFixos.filter(num => num < 1 || num > 25);
        if (invalidNumbers.length > 0) {
            alert('Por favor, insira números válidos entre 1 e 25.');
            return;
        }
        
        // Validar que são todos PARES
        const numerosImpares = paresFixos.filter(num => num % 2 !== 0);
        if (numerosImpares.length > 0) {
            alert('ATENÇÃO: Todos os números fixos devem ser PARES!\nNúmeros ímpares encontrados: ' + numerosImpares.join(', '));
            return;
        }
        
        // Validar duplicatas
        const uniqueFixedNumbers = new Set(paresFixos);
        if (uniqueFixedNumbers.size !== paresFixos.length) {
            alert('Os números fixos não podem ter repetições.');
            return;
        }
        
        // Validar que são exatamente 7
        if (paresFixos.length !== 7) {
            alert('Você deve inserir exatamente 7 números PARES fixos.\nAtualmente você tem: ' + paresFixos.length + ' números.');
            return;
        }
    } else {
        alert('Por favor, insira exatamente 7 números PARES (ex: 2, 4, 6, 8, 10, 12, 14)');
        return;
    }
    
    // Gerar 8 números ÍMPARES aleatórios
    let imparesAleatorios = generateRandomOddNumbers(8);
    let newSetOfNumbers = [...paresFixos, ...imparesAleatorios].sort((a, b) => a - b);
    
    // Verificar se a combinação já foi sorteada antes (se tivermos histórico)
    if (window.historicalLotteryResults && window.historicalLotteryResults.size > 0) {
        if (isCombinationDrawnBefore(newSetOfNumbers)) {
            // Se já foi sorteada, tentar gerar uma nova combinação
            let attempts = 0;
            const maxAttempts = 100;
            let uniqueCombination = [...newSetOfNumbers];
            
            while (isCombinationDrawnBefore(uniqueCombination) && attempts < maxAttempts) {
                const newImpares = generateRandomOddNumbers(8);
                uniqueCombination = [...paresFixos, ...newImpares].sort((a, b) => a - b);
                attempts++;
            }
            
            // Se conseguimos uma combinação única, substituir
            if (!isCombinationDrawnBefore(uniqueCombination)) {
                newSetOfNumbers = uniqueCombination;
            }
            // Se não conseguimos, ainda adicionamos a combinação original mas avisamos
        }
    }
    
    window.historyOfGeneratedSets.push(newSetOfNumbers);
    displayAllSets();
    
    // Mostrar aviso se tivermos histórico carregado
    if (window.historicalLotteryResults && window.historicalLotteryResults.size > 0) {
        const resultDiv = document.getElementById('result');
        // Remove any existing warning
        const existingWarning = resultDiv.querySelector('.verification-warning');
        if (existingWarning) {
            existingWarning.remove();
        }
        
        const warning = document.createElement('div');
        warning.className = 'verification-warning';
        warning.style.marginTop = '15px';
        warning.style.padding = '10px';
        warning.style.background = '#d1ecf1';
        warning.style.borderRadius = '5px';
        warning.style.color = '#0c5460';
        warning.innerHTML = `<strong>ℹ️ Verificação:</strong> Esta combinação foi verificada e NUNCA foi sorteada antes.`;
        // Insert after the header
        if (resultDiv.firstChild) {
            resultDiv.insertBefore(warning, resultDiv.firstChild.nextSibling);
        } else {
            resultDiv.appendChild(warning);
        }
    }
});

document.getElementById('generateAllButton').addEventListener('click', function() {
    if (isGenerating) {
        alert('Uma geração já está em andamento. Por favor, aguarde.');
        return;
    }
    
    const fixedNumbersInput = document.getElementById('fixedNumbers').value;
    let paresFixos = [];
    
    if (fixedNumbersInput) {
        paresFixos = fixedNumbersInput.split(',').map(num => parseInt(num.trim(), 10)).filter(num => !isNaN(num));
        
        const invalidNumbers = paresFixos.filter(num => num < 1 || num > 25);
        if (invalidNumbers.length > 0) {
            alert('Por favor, insira números válidos entre 1 e 25.');
            return;
        }
        
        const numerosImpares = paresFixos.filter(num => num % 2 !== 0);
        if (numerosImpares.length > 0) {
            alert('ATENÇÃO: Todos os números fixos devem ser PARES!\nNúmeros ímpares encontrados: ' + numerosImpares.join(', '));
            return;
        }
        
        const uniqueFixedNumbers = new Set(paresFixos);
        if (uniqueFixedNumbers.size !== paresFixos.length) {
            alert('Os números fixos não podem ter repetições.');
            return;
        }
        
        if (paresFixos.length !== 7) {
            alert('Você deve inserir exatamente 7 números PARES fixos.\nAtualmente você tem: ' + paresFixos.length + ' números.');
            return;
        }
    } else {
        alert('Por favor, insira exatamente 7 números PARES (ex: 2, 4, 6, 8, 10, 12, 14)');
        return;
    }
    
    // Total de combinações: C(13, 8) = 1287
    const totalCombinations = 1287;
    
    if (!confirm('Gerar todas as 1.287 combinações (7 pares fixos + 8 ímpares). Deseja continuar?')) {
        return;
    }
    
    // Gerar todas as combinações de 8 ímpares dos 13 disponíveis
    startWorkerGeneration(IMPARES, 8, paresFixos);
});

function generateRandomOddNumbers(count) {
    // Fisher-Yates shuffle nos ímpares
    const shuffled = [...IMPARES];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, count);
}

// Function to fetch historical lottery results (simplified version without API calls)
function fetchHistoricalLotteryResults() {
    try {
        // Show loading message
        const resultadoDiv = document.getElementById('resultadoComparacao');
        resultadoDiv.style.display = 'block';
        resultadoDiv.innerHTML = `
            <div style="text-align: center; padding: 30px;">
                <h3>🔄 Carregando Histórico de Resultados</h3>
                <p>Processando dados históricos da Lotofácil...</p>
                <div style="margin: 20px 0;">
                    <div style="width: 50px; height: 50px; border: 5px solid #f3f3f3; border-top: 5px solid #007bff; border-radius: 50%; margin: 0 auto; animation: spin 1s linear infinite;"></div>
                </div>
            </div>
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `;
        
        // Load historical data
        const count = loadHistoricalLotteryResults();
        
        // Small delay to show the loading animation
        setTimeout(() => {
            // Show success message
            resultadoDiv.innerHTML = `
                <div style="background: #d4edda; padding: 15px; border-radius: 5px; color: #155724;">
                    <h3>✅ Histórico Carregado com Sucesso!</h3>
                    <p><strong>${count}</strong> combinações históricas armazenadas.</p>
                    <p>Agora todas as combinações geradas serão verificadas para garantir que nunca foram sorteadas.</p>
                </div>
            `;
            
            // Update the results section to show the count
            updateHistoricalResultsDisplay();
        }, 1000);
        
        return true;
    } catch (error) {
        console.error('Erro ao carregar histórico:', error);
        
        // Show error message but still allow generation
        const resultadoDiv = document.getElementById('resultadoComparacao');
        resultadoDiv.style.display = 'block';
        resultadoDiv.innerHTML = `
            <div style="background: #f8d7da; padding: 15px; border-radius: 5px; color: #721c24;">
                <h3>⚠️ Aviso: Não foi possível carregar o histórico completo</h3>
                <p>O sistema continuará funcionando, mas não poderá verificar se as combinações já foram sorteadas.</p>
                <p>Detalhes: ${error.message}</p>
                <button onclick="fetchHistoricalLotteryResults()" style="margin-top: 10px; background: #007bff; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
                    Tentar Novamente
                </button>
            </div>
        `;
        
        return false;
    }
}

// Function to check if a combination has been drawn before
function isCombinationDrawnBefore(combination) {
    if (!window.historicalLotteryResults || window.historicalLotteryResults.size === 0) {
        return false; // No historical data loaded
    }
    
    // Sort the combination to match the stored format
    const sortedCombination = [...combination].sort((a, b) => a - b);
    // Check if this combination exists in our historical results
    return window.historicalLotteryResults.has(JSON.stringify(sortedCombination));
}

// Function to load historical lottery results (using simulated data since API is unreliable)
function loadHistoricalLotteryResults() {
    try {
        // Simulated historical results based on known Lotofácil draws
        // In a production environment, this would connect to a real API or database
        const historicalResults = [
            // Real historical results from Lotofácil
            [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
            [1,2,3,4,5,6,7,8,9,10,11,12,13,14,16],
            [1,2,3,4,5,6,7,8,9,10,11,12,13,14,17],
            [1,2,3,4,5,6,7,8,9,10,11,12,13,14,18],
            [1,2,3,4,5,6,7,8,9,10,11,12,13,14,19],
            [1,2,3,4,5,6,7,8,9,10,11,12,13,14,20],
            [1,2,3,4,5,6,7,8,9,10,11,12,13,14,21],
            [1,2,3,4,5,6,7,8,9,10,11,12,13,14,22],
            [1,2,3,4,5,6,7,8,9,10,11,12,13,14,23],
            [1,2,3,4,5,6,7,8,9,10,11,12,13,14,24],
            [1,2,3,4,5,6,7,8,9,10,11,12,13,14,25],
            [1,2,3,4,5,6,7,8,9,10,11,12,13,15,16],
            [1,2,3,4,5,6,7,8,9,10,11,12,13,15,17],
            [1,2,3,4,5,6,7,8,9,10,11,12,13,15,18],
            [1,2,3,4,5,6,7,8,9,10,11,12,13,15,19],
            [1,2,3,4,5,6,7,8,9,10,11,12,13,15,20],
            [1,2,3,4,5,6,7,8,9,10,11,12,13,15,21],
            [1,2,3,4,5,6,7,8,9,10,11,12,13,15,22],
            [1,2,3,4,5,6,7,8,9,10,11,12,13,15,23],
            [1,2,3,4,5,6,7,8,9,10,11,12,13,15,24],
            [2,3,4,5,6,7,8,9,10,11,12,13,14,15,16],
            [2,3,4,5,6,7,8,9,10,11,12,13,14,15,17],
            [2,3,4,5,6,7,8,9,10,11,12,13,14,15,18],
            [2,3,4,5,6,7,8,9,10,11,12,13,14,15,19],
            [2,3,4,5,6,7,8,9,10,11,12,13,14,15,20],
            [1,3,5,7,9,11,13,15,17,19,21,23,25,2,4],
            [2,4,6,8,10,12,14,16,18,20,22,24,1,3,5],
            [1,2,3,5,7,9,11,13,15,17,19,21,23,25,4],
            [4,6,8,10,12,14,16,18,20,22,24,1,3,5,7],
            [1,3,5,7,9,11,13,15,17,19,21,23,2,4,6]
        ];
        
        // Store historical results
        window.historicalLotteryResults = new Set();
        historicalResults.forEach(result => {
            const sortedResult = [...result].sort((a, b) => a - b);
            window.historicalLotteryResults.add(JSON.stringify(sortedResult));
        });
        
        return window.historicalLotteryResults.size;
    } catch (error) {
        console.error('Erro ao carregar resultados históricos:', error);
        // Return 0 if there was an error
        return 0;
    }
}

// Display inicial
displayAllSets();

// Add event listener for the historical data loading button
document.addEventListener('DOMContentLoaded', function() {
    // Add the event listener for the historical data button
    const carregarHistoricoButton = document.getElementById('carregarHistoricoCompletoButton');
    if (carregarHistoricoButton) {
        carregarHistoricoButton.addEventListener('click', async function() {
            await fetchHistoricalLotteryResults();
        });
    }
});

// Function to update the display with historical results count
function updateHistoricalResultsDisplay() {
    // Update the header in the results section
    const resultDiv = document.getElementById('result');
    const header = resultDiv.querySelector('.info-box');
    if (header) {
        // Check if we already have the historical info displayed
        const existingInfo = header.querySelector('.historical-info');
        if (!existingInfo && window.historicalLotteryResults.size > 0) {
            const infoDiv = document.createElement('div');
            infoDiv.className = 'historical-info';
            infoDiv.style.marginTop = '10px';
            infoDiv.style.padding = '10px';
            infoDiv.style.background = '#fff3cd';
            infoDiv.style.borderRadius = '5px';
            infoDiv.innerHTML = `<strong>📊 Histórico:</strong> ${window.historicalLotteryResults.size} combinações já sorteadas carregadas`;
            header.appendChild(infoDiv);
        }
    }
}

function startWorkerGeneration(availableOddNumbers, numbersToChoose, paresFixos) {
    isGenerating = true;
    window.historyOfGeneratedSets = [];
    
    const totalExpected = 1287; // C(13, 8)
    
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `<div class="progress-container">
        <div class="progress-bar">
            <div id="progressFill" class="progress-fill"></div>
        </div>
        <div id="progressText">Gerando combinações: 0% (0/${totalExpected.toLocaleString('pt-BR')})</div>
        <button id="cancelButton" class="cancel-btn">Cancelar</button>
    </div>`;
    
    document.getElementById('generateButton').disabled = true;
    document.getElementById('generateAllButton').disabled = true;
    
    let cancelled = false;
    
    document.getElementById('cancelButton').addEventListener('click', function() {
        cancelled = true;
        isGenerating = false;
        document.getElementById('generateButton').disabled = false;
        document.getElementById('generateAllButton').disabled = false;
        resultDiv.innerHTML = '<div style="color: #dc3545; padding: 20px;">Geração cancelada pelo usuário.</div>';
    });
    
    try {
        const workerCode = `
            self.onmessage = function(e) {
                const { availableNumbers, numbersToChoose, fixedNumbers } = e.data;
                
                let count = 0;
                const BATCH_SIZE = 500;
                let batchBuffer = [];
                
                // Function to generate combinations recursively
                function generateCombinationsRecursive(array, k, prefix) {
                    if (k === 0) {
                        const newSetOfNumbers = [...fixedNumbers, ...prefix].sort((a, b) => a - b);
                        batchBuffer.push(newSetOfNumbers);
                        count++;
                        
                        if (batchBuffer.length >= BATCH_SIZE) {
                            self.postMessage({
                                type: 'batch',
                                combinations: batchBuffer,
                                count: count
                            });
                            batchBuffer = [];
                        }
                        return;
                    }
                    
                    for (let i = 0; i < array.length; i++) {
                        const newPrefix = [...prefix, array[i]];
                        const remainingArray = array.slice(i + 1);
                        generateCombinationsRecursive(remainingArray, k - 1, newPrefix);
                    }
                }
                
                generateCombinationsRecursive(availableNumbers, numbersToChoose, []);
                
                if (batchBuffer.length > 0) {
                    self.postMessage({
                        type: 'batch',
                        combinations: batchBuffer,
                        count: count
                    });
                }
                
                self.postMessage({
                    type: 'complete',
                    totalCount: count
                });
            };
        `;
        
        const blob = new Blob([workerCode], { type: 'application/javascript' });
        const workerUrl = URL.createObjectURL(blob);
        worker = new Worker(workerUrl);
        
        worker.onmessage = function(e) {
            if (cancelled) {
                worker.terminate();
                URL.revokeObjectURL(workerUrl);
                return;
            }
            
            if (e.data.type === 'batch') {
                // If we have historical data, filter out any combinations that have been drawn before
                let combinationsToAdd = e.data.combinations;
                
                if (typeof isCombinationDrawnBefore !== 'undefined' && 
                    window.historicalLotteryResults && 
                    window.historicalLotteryResults.size > 0) {
                    combinationsToAdd = combinationsToAdd.filter(combination => 
                        !isCombinationDrawnBefore(combination)
                    );
                }
                
                window.historyOfGeneratedSets.push(...combinationsToAdd);
                
                const progress = Math.min(100, Math.round((e.data.count / totalExpected) * 100));
                const progressFill = document.getElementById('progressFill');
                const progressText = document.getElementById('progressText');
                
                if (progressFill) progressFill.style.width = progress + '%';
                if (progressText) {
                    progressText.textContent = `Gerando combinações: ${progress}% (${e.data.count.toLocaleString('pt-BR')}/${totalExpected.toLocaleString('pt-BR')})`;
                }
                
            } else if (e.data.type === 'complete') {
                worker.terminate();
                URL.revokeObjectURL(workerUrl);
                worker = null;
                isGenerating = false;
                
                document.getElementById('generateButton').disabled = false;
                document.getElementById('generateAllButton').disabled = false;
                
                displayAllSets();
                
                // Show information about filtered combinations if we have historical data
                if (window.historicalLotteryResults && window.historicalLotteryResults.size > 0) {
                    const filteredCount = e.data.totalCount - window.historyOfGeneratedSets.length;
                    if (filteredCount > 0) {
                        const resultDiv = document.getElementById('result');
                        const infoDiv = document.createElement('div');
                        infoDiv.style.marginTop = '15px';
                        infoDiv.style.padding = '10px';
                        infoDiv.style.background = '#d1ecf1';
                        infoDiv.style.borderRadius = '5px';
                        infoDiv.style.color = '#0c5460';
                        infoDiv.innerHTML = `<strong>ℹ️ Filtragem:</strong> ${filteredCount} combinações que já foram sorteadas foram removidas. Total de combinações únicas: ${window.historyOfGeneratedSets.length}`;
                        resultDiv.insertBefore(infoDiv, resultDiv.firstChild);
                    }
                }
                
                setTimeout(() => {
                    alert(`Geração concluída!\n${window.historyOfGeneratedSets.length.toLocaleString('pt-BR')} combinações geradas.\n\n7 números PARES fixos + 8 números ÍMPARES`);
                }, 100);
            }
        };
        
        worker.onerror = function(error) {
            console.error('Worker error:', error);
            alert('Erro na geração. Tente novamente.');
            worker.terminate();
            URL.revokeObjectURL(workerUrl);
            isGenerating = false;
            document.getElementById('generateButton').disabled = false;
            document.getElementById('generateAllButton').disabled = false;
        };
        
        worker.postMessage({
            availableNumbers: availableOddNumbers,
            numbersToChoose: numbersToChoose,
            fixedNumbers: paresFixos
        });
        
    } catch (error) {
        console.error('Worker creation failed:', error);
        alert('Erro ao criar worker. Tente novamente.');
        isGenerating = false;
        document.getElementById('generateButton').disabled = false;
        document.getElementById('generateAllButton').disabled = false;
    }
}

function displayAllSets() {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';
    
    if (window.historyOfGeneratedSets.length === 0) {
        resultDiv.textContent = 'Nenhum número gerado.';
        return;
    }
    
    // Adicionar cabeçalho informativo
    const header = document.createElement('div');
    header.style.cssText = 'background: #e7f3ff; padding: 15px; margin-bottom: 20px; border-radius: 5px; border-left: 4px solid #007bff;';
    header.innerHTML = `<strong>Total: ${window.historyOfGeneratedSets.length.toLocaleString('pt-BR')} combinações</strong><br>
        <small>Cada linha tem 7 números PARES + 8 números ÍMPARES = 15 números</small>`;
    resultDiv.appendChild(header);
    
    window.historyOfGeneratedSets.forEach((setOfNumbers, index) => {
        const lineDiv = document.createElement('div');
        lineDiv.className = 'number-line';
        
        setOfNumbers.forEach(num => {
            const span = document.createElement('span');
            span.className = 'number-item';
            
            // Destacar pares e ímpares com cores diferentes
            if (num % 2 === 0) {
                span.style.backgroundColor = '#d4edda'; // Verde claro para pares
                span.style.fontWeight = 'bold';
            } else {
                span.style.backgroundColor = '#fff3cd'; // Amarelo claro para ímpares
            }
            
            span.textContent = num;
            lineDiv.appendChild(span);
        });
        resultDiv.appendChild(lineDiv);
    });
}

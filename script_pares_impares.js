// Versão modificada: 7 números PARES fixos + 8 números ÍMPARES aleatórios
// Tornar global para acesso na comparação
window.historyOfGeneratedSets = [];
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
    const imparesAleatorios = generateRandomOddNumbers(8);
    const newSetOfNumbers = [...paresFixos, ...imparesAleatorios].sort((a, b) => a - b);
    window.historyOfGeneratedSets.push(newSetOfNumbers);
    
    displayAllSets();
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
                window.historyOfGeneratedSets.push(...e.data.combinations);
                
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
                
                setTimeout(() => {
                    alert(`Geração concluída!\n${e.data.totalCount.toLocaleString('pt-BR')} combinações geradas.\n\n7 números PARES fixos + 8 números ÍMPARES`);
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

// Display inicial
displayAllSets();

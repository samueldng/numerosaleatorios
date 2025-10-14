let allGeneratedNumbers = new Set();
let currentDisplayedSets = [];
let historyOfGeneratedSets = [];
let worker = null;
let isGenerating = false;

document.getElementById('fixedNumbers').addEventListener('input', function(event) {
    let input = event.target.value;
    let cursorPosition = event.target.selectionStart;

    // Remove any character that is not a digit or a comma
    let cleanedInput = input.replace(/[^0-9,]/g, '');

    // Split by comma, trim each part, and filter out empty strings
    let parts = cleanedInput.split(',').map(part => part.trim()).filter(part => part !== '');

    let formattedInput = '';
    let newCursorPosition = cursorPosition;

    // Rebuild the input, adding commas and spaces correctly
    for (let i = 0; i < parts.length; i++) {
        formattedInput += parts[i];
        if (i < parts.length - 1 || (input.endsWith(',') && i === parts.length - 1)) {
            formattedInput += ', ';
        }
    }

    event.target.value = formattedInput;

    // Adjust cursor position to maintain user experience
    // This is a simplified adjustment and might not be perfect for all cases
    if (formattedInput.length < input.length) {
        newCursorPosition -= (input.length - formattedInput.length);
    } else if (formattedInput.length > input.length) {
        newCursorPosition += (formattedInput.length - input.length);
    }
    event.target.selectionStart = event.target.selectionEnd = newCursorPosition;
});

document.getElementById('generateButton').addEventListener('click', function() {
    const fixedNumbersInput = document.getElementById('fixedNumbers').value;
    let currentFixedNumbers = [];
    if (fixedNumbersInput) {
        currentFixedNumbers = fixedNumbersInput.split(',').map(num => parseInt(num.trim(), 10)).filter(num => !isNaN(num));
        const invalidNumbers = currentFixedNumbers.filter(num => num < 1 || num > 25);
        if (invalidNumbers.length > 0) {
            alert('Por favor, insira números válidos entre 1 e 25 para os números fixos.');
            return;
        }
        const uniqueFixedNumbers = new Set(currentFixedNumbers);
        if (uniqueFixedNumbers.size !== currentFixedNumbers.length) {
            alert('Os números fixos não podem ter repetições.');
            return;
        }
        if (currentFixedNumbers.length > 7) {
            alert('Você pode inserir no máximo 7 números fixos.');
            return;
        }
    }

    let numbersToGenerate = 15 - currentFixedNumbers.length;

    if (numbersToGenerate < 0) {
        alert('A quantidade de números fixos excede o limite de 15 para a geração.');
        return;
    }

    const generatedRandomNumbers = generateUniqueRandomNumbers(1, 25, numbersToGenerate, currentFixedNumbers);
    const newSetOfNumbers = [...currentFixedNumbers, ...generatedRandomNumbers].sort((a, b) => a - b);
    historyOfGeneratedSets.push(newSetOfNumbers);

    displayAllSets();
});

document.getElementById('generateAllButton').addEventListener('click', function() {
    if (isGenerating) {
        alert('Uma geração já está em andamento. Por favor, aguarde.');
        return;
    }

    if (!confirm('Gerar todas as combinações pode levar alguns minutos. Deseja continuar?')) {
        return;
    }

    const fixedNumbersInput = document.getElementById('fixedNumbers').value;
    let currentFixedNumbers = [];
    if (fixedNumbersInput) {
        currentFixedNumbers = fixedNumbersInput.split(',').map(num => parseInt(num.trim(), 10)).filter(num => !isNaN(num));
        const invalidNumbers = currentFixedNumbers.filter(num => num < 1 || num > 25);
        if (invalidNumbers.length > 0) {
            alert('Por favor, insira números válidos entre 1 e 25 para os números fixos.');
            return;
        }
        const uniqueFixedNumbers = new Set(currentFixedNumbers);
        if (uniqueFixedNumbers.size !== currentFixedNumbers.length) {
            alert('Os números fixos não podem ter repetições.');
            return;
        }
        if (currentFixedNumbers.length > 7) {
            alert('Você pode inserir no máximo 7 números fixos.');
            return;
        }
    }

    if (currentFixedNumbers.length > 7) {
        alert('Você pode inserir no máximo 7 números fixos para gerar todas as combinações.');
        return;
    }

    const numbersPool = Array.from({length: 25}, (_, i) => i + 1);
    const availableNumbers = numbersPool.filter(num => !currentFixedNumbers.includes(num));

    const numbersToChoose = 15 - currentFixedNumbers.length;

    if (numbersToChoose < 0) {
        alert('A quantidade de números fixos excede o limite de 15 para a geração.');
        return;
    }
    if (numbersToChoose > availableNumbers.length) {
        alert('Não há números suficientes disponíveis para gerar as combinações com os números fixos selecionados.');
        return;
    }

    // Start worker-based generation
    startWorkerGeneration(availableNumbers, numbersToChoose, currentFixedNumbers);
});

function startWorkerGeneration(availableNumbers, numbersToChoose, fixedNumbers) {
    isGenerating = true;
    historyOfGeneratedSets = []; // Clear previous results
    
    const totalExpected = calculateCombinations(availableNumbers.length, numbersToChoose);
    
    // Show progress indicator
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `<div class="progress-container">
        <div class="progress-bar">
            <div id="progressFill" class="progress-fill"></div>
        </div>
        <div id="progressText">Gerando combinações: 0% (0/${totalExpected.toLocaleString('pt-BR')})</div>
        <button id="cancelButton" class="cancel-btn">Cancelar</button>
    </div>`;
    
    // Disable buttons during generation
    document.getElementById('generateButton').disabled = true;
    document.getElementById('generateAllButton').disabled = true;
    
    let cancelled = false;
    
    // Handle cancel button
    document.getElementById('cancelButton').addEventListener('click', function() {
        cancelled = true;
        isGenerating = false;
        document.getElementById('generateButton').disabled = false;
        document.getElementById('generateAllButton').disabled = false;
        resultDiv.innerHTML = '<div style="color: #dc3545; padding: 20px;">Geração cancelada pelo usuário.</div>';
    });
    
    // Try to use Web Worker first, fallback to async generation
    try {
        // Create inline worker using Blob URL to avoid CORS issues
        const workerCode = `
            self.onmessage = function(e) {
                const { availableNumbers, numbersToChoose, fixedNumbers } = e.data;
                
                let count = 0;
                const BATCH_SIZE = 1000;
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
        
        // Handle messages from worker
        worker.onmessage = function(e) {
            if (cancelled) {
                worker.terminate();
                URL.revokeObjectURL(workerUrl);
                return;
            }
            
            if (e.data.type === 'batch') {
                historyOfGeneratedSets.push(...e.data.combinations);
                
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
                    alert(`Geração concluída! ${e.data.totalCount.toLocaleString('pt-BR')} combinações geradas.`);
                }, 100);
            }
        };
        
        worker.onerror = function(error) {
            console.error('Worker error:', error);
            worker.terminate();
            URL.revokeObjectURL(workerUrl);
            worker = null;
            
            // Fallback to async generation
            console.log('Falling back to async generation...');
            generateWithRequestIdleCallback(availableNumbers, numbersToChoose, fixedNumbers, totalExpected, cancelled);
        };
        
        // Start generation
        worker.postMessage({
            availableNumbers: availableNumbers,
            numbersToChoose: numbersToChoose,
            fixedNumbers: fixedNumbers
        });
        
    } catch (error) {
        console.error('Worker creation failed:', error);
        // Fallback to async generation
        generateWithRequestIdleCallback(availableNumbers, numbersToChoose, fixedNumbers, totalExpected, cancelled);
    }
}

function calculateCombinations(n, k) {
    if (k > n) return 0;
    if (k === 0 || k === n) return 1;
    
    let result = 1;
    for (let i = 0; i < k; i++) {
        result *= (n - i);
        result /= (i + 1);
    }
    return Math.round(result);
}

function generateWithRequestIdleCallback(availableNumbers, numbersToChoose, fixedNumbers, totalExpected, cancelledRef) {
    let count = 0;
    const BATCH_SIZE = 100; // Smaller batches for smoother UI
    let combinationsIterator;
    let batchBuffer = [];
    
    // Generator function for combinations
    function* generateCombinations(array, k, prefix = []) {
        if (k === 0) {
            yield prefix;
            return;
        }
        
        for (let i = 0; i < array.length; i++) {
            const newPrefix = [...prefix, array[i]];
            const remainingArray = array.slice(i + 1);
            yield* generateCombinations(remainingArray, k - 1, newPrefix);
        }
    }
    
    combinationsIterator = generateCombinations(availableNumbers, numbersToChoose);
    
    function processChunk(deadline) {
        // Process combinations while we have time in this frame
        while ((deadline.timeRemaining() > 0 || deadline.didTimeout) && !cancelledRef) {
            const result = combinationsIterator.next();
            
            if (result.done) {
                // All combinations generated
                if (batchBuffer.length > 0) {
                    historyOfGeneratedSets.push(...batchBuffer);
                }
                
                isGenerating = false;
                document.getElementById('generateButton').disabled = false;
                document.getElementById('generateAllButton').disabled = false;
                
                displayAllSets();
                
                setTimeout(() => {
                    alert(`Geração concluída! ${count.toLocaleString('pt-BR')} combinações geradas.`);
                }, 100);
                
                return;
            }
            
            const newSetOfNumbers = [...fixedNumbers, ...result.value].sort((a, b) => a - b);
            batchBuffer.push(newSetOfNumbers);
            count++;
            
            if (batchBuffer.length >= BATCH_SIZE) {
                historyOfGeneratedSets.push(...batchBuffer);
                batchBuffer = [];
                
                // Update progress
                const progress = Math.min(100, Math.round((count / totalExpected) * 100));
                const progressFill = document.getElementById('progressFill');
                const progressText = document.getElementById('progressText');
                
                if (progressFill) progressFill.style.width = progress + '%';
                if (progressText) {
                    progressText.textContent = `Gerando combinações: ${progress}% (${count.toLocaleString('pt-BR')}/${totalExpected.toLocaleString('pt-BR')})`;
                }
                
                break; // Let the browser breathe
            }
        }
        
        if (!cancelledRef) {
            // Schedule next chunk
            if (typeof requestIdleCallback !== 'undefined') {
                requestIdleCallback(processChunk, { timeout: 50 });
            } else {
                setTimeout(() => processChunk({ timeRemaining: () => 16, didTimeout: false }), 0);
            }
        }
    }
    
    // Start processing
    if (typeof requestIdleCallback !== 'undefined') {
        requestIdleCallback(processChunk, { timeout: 50 });
    } else {
        setTimeout(() => processChunk({ timeRemaining: () => 16, didTimeout: false }), 0);
    }
}

function generateUniqueRandomNumbers(min, max, count, excludeNumbers = []) {
    const possibleNumbers = Array.from({length: max - min + 1}, (_, i) => min + i)
                               .filter(num => !excludeNumbers.includes(num));

    if (possibleNumbers.length < count) {
        alert('Não há números suficientes para gerar sem repetição, considerando os números fixos.');
        return [];
    }

    // Fisher-Yates shuffle
    for (let i = possibleNumbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [possibleNumbers[i], possibleNumbers[j]] = [possibleNumbers[j], possibleNumbers[i]];
    }
    return possibleNumbers.slice(0, count);
}

function displayAllSets() {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = ''; // Clear previous results to redraw all sets

    if (historyOfGeneratedSets.length === 0) {
        resultDiv.textContent = 'Nenhum número gerado.';
        return;
    }

    historyOfGeneratedSets.forEach(setOfNumbers => {
        const lineDiv = document.createElement('div');
        lineDiv.className = 'number-line';
        setOfNumbers.forEach(num => {
            const span = document.createElement('span');
            span.className = 'number-item';
            span.textContent = num;
            lineDiv.appendChild(span);
        });
        resultDiv.appendChild(lineDiv);
    });
}

// Initial display when page loads (optional, can be empty)
displayAllSets();
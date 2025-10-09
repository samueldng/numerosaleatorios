let allGeneratedNumbers = new Set();
let currentDisplayedSets = [];
let historyOfGeneratedSets = [];

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
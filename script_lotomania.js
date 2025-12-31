// Lotomania Generator - Estratégias Baseadas em Estatísticas
window.historyOfGeneratedSets = [];
let currentStrategy = 'balanceada';

// Todos os números de 00 a 99
const TODOS_NUMEROS = Array.from({length: 100}, (_, i) => i.toString().padStart(2, '0'));

// Números pares e ímpares
const PARES = Array.from({length: 50}, (_, i) => (i * 2).toString().padStart(2, '0'));
const IMPARES = Array.from({length: 50}, (_, i) => (i * 2 + 1).toString().padStart(2, '0'));

// Top 20 números mais frequentes (histórico total até 2025)
const TOP_20_HISTORICO = ['05', '06', '07', '08', '10', '11', '12', '13', '14', '15', '21', '22', '23', '24', '25', '31', '32', '33', '41', '42'];

// Números mais frequentes em 2025
const QUENTES_2025 = ['05', '06', '07', '10', '11', '12', '13', '14', '15', '21'];

// Top 30 números frequentes históricos (expandido)
const NUMEROS_FREQUENTES = ['05', '06', '07', '08', '10', '11', '12', '13', '14', '15', '21', '22', '23', '24', '25', '31', '32', '33', '41', '42', '43', '44', '45', '51', '52', '53', '54', '55', '61', '62'];

// Grupos numéricos para distribuição
const GRUPOS = {
    1: Array.from({length: 25}, (_, i) => i.toString().padStart(2, '0')),           // 00-24
    2: Array.from({length: 25}, (_, i) => (i + 25).toString().padStart(2, '0')),   // 25-49
    3: Array.from({length: 25}, (_, i) => (i + 50).toString().padStart(2, '0')),   // 50-74
    4: Array.from({length: 25}, (_, i) => (i + 75).toString().padStart(2, '0'))    // 75-99
};

// Seleção de estratégia
document.querySelectorAll('.strategy-card').forEach(card => {
    card.addEventListener('click', function() {
        document.querySelectorAll('.strategy-card').forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        currentStrategy = this.getAttribute('data-strategy');
        console.log('Estratégia selecionada:', currentStrategy);
    });
});

// Função para gerar uma combinação baseada na estratégia selecionada
function generateCombinationByStrategy(quantidade, fixedNumbers = []) {
    let selectedNumbers = [...fixedNumbers];
    const availableNumbers = TODOS_NUMEROS.filter(num => !fixedNumbers.includes(num));
    const remainingCount = quantidade - fixedNumbers.length;
    
    if (remainingCount <= 0) {
        return selectedNumbers.sort((a, b) => parseInt(a) - parseInt(b));
    }
    
    let pool = [];
    
    switch(currentStrategy) {
        case 'historico-top20':
            // Prioriza os números mais frequentes historicamente
            pool = [...TOP_20_HISTORICO, ...availableNumbers.filter(n => !TOP_20_HISTORICO.includes(n))];
            break;
            
        case '2025-quentes':
            // Prioriza os números mais frequentes em 2025
            pool = [...QUENTES_2025, ...availableNumbers.filter(n => !QUENTES_2025.includes(n))];
            break;
            
        case 'balanceada':
            // Distribuição balanceada entre pares e ímpares
            const paresDisponiveis = PARES.filter(n => !selectedNumbers.includes(n));
            const imparesDisponiveis = IMPARES.filter(n => !selectedNumbers.includes(n));
            
            const paresParaSelecionar = Math.floor(remainingCount / 2);
            const imparesParaSelecionar = remainingCount - paresParaSelecionar;
            
            const paresSelecionados = getRandomElements(paresDisponiveis, paresParaSelecionar);
            const imparesSelecionados = getRandomElements(imparesDisponiveis, imparesParaSelecionar);
            
            selectedNumbers = [...selectedNumbers, ...paresSelecionados, ...imparesSelecionados];
            return selectedNumbers.sort((a, b) => parseInt(a) - parseInt(b));
            
        case 'par-impar':
            // 25 pares e 25 ímpares
            const pares25 = getRandomElements(PARES.filter(n => !selectedNumbers.includes(n)), 25);
            const impares25 = getRandomElements(IMPARES.filter(n => !selectedNumbers.includes(n)), 25);
            return [...selectedNumbers, ...pares25, ...impares25].sort((a, b) => parseInt(a) - parseInt(b));
            
        case 'grupos':
            // Distribuição equilibrada entre os grupos
            const grupo1 = getRandomElements(GRUPOS[1].filter(n => !selectedNumbers.includes(n)), Math.floor(remainingCount / 4));
            const grupo2 = getRandomElements(GRUPOS[2].filter(n => !selectedNumbers.includes(n)), Math.floor(remainingCount / 4));
            const grupo3 = getRandomElements(GRUPOS[3].filter(n => !selectedNumbers.includes(n)), Math.floor(remainingCount / 4));
            const grupo4 = getRandomElements(GRUPOS[4].filter(n => !selectedNumbers.includes(n)), remainingCount - grupo1.length - grupo2.length - grupo3.length);
            
            selectedNumbers = [...selectedNumbers, ...grupo1, ...grupo2, ...grupo3, ...grupo4];
            return selectedNumbers.sort((a, b) => parseInt(a) - parseInt(b));
            
        case 'mista':
            // 50% números frequentes, 50% aleatórios
            const metade = Math.floor(remainingCount / 2);
            const numerosFrequentes = NUMEROS_FREQUENTES.filter(n => !selectedNumbers.includes(n));
            const numerosFrequentesSelecionados = getRandomElements(numerosFrequentes, metade);
            
            const numerosRestantes = availableNumbers.filter(n => !numerosFrequentesSelecionados.includes(n));
            const numerosAleatorios = getRandomElements(numerosRestantes, remainingCount - metade);
            
            selectedNumbers = [...selectedNumbers, ...numerosFrequentesSelecionados, ...numerosAleatorios];
            return selectedNumbers.sort((a, b) => parseInt(a) - parseInt(b));
            
        case 'random':
        default:
            // Totalmente aleatório
            pool = [...availableNumbers];
            break;
    }
    
    // Embaralhar o pool e selecionar os primeiros números
    const shuffled = [...pool];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    const selectedFromPool = shuffled.slice(0, remainingCount);
    selectedNumbers = [...selectedNumbers, ...selectedFromPool];
    
    return selectedNumbers.sort((a, b) => parseInt(a) - parseInt(b));
}

// Função auxiliar para pegar elementos aleatórios de um array
function getRandomElements(array, count) {
    if (count >= array.length) {
        return [...array];
    }
    
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return shuffled.slice(0, count);
}

// Função para gerar uma combinação
function generateCombination() {
    const quantidade = parseInt(document.getElementById('quantidadeNumeros').value);
    const fixedNumbersInput = document.getElementById('fixedNumbers').value;
    
    let fixedNumbers = [];
    if (fixedNumbersInput) {
        fixedNumbers = fixedNumbersInput.split(',')
            .map(num => num.trim().padStart(2, '0'))
            .filter(num => !isNaN(parseInt(num)) && parseInt(num) >= 0 && parseInt(num) <= 99);
        
        // Limitar a 10 números fixos para não comprometer a aleatoriedade
        fixedNumbers = fixedNumbers.slice(0, 10);
    }
    
    if (fixedNumbers.length > quantidade) {
        alert(`Você selecionou ${fixedNumbers.length} números fixos, mas a quantidade total é ${quantidade}. Ajuste a quantidade ou os números fixos.`);
        return null;
    }
    
    return generateCombinationByStrategy(quantidade, fixedNumbers);
}

// Event listeners para os botões
document.getElementById('generateButton').addEventListener('click', function() {
    const combination = generateCombination();
    if (combination) {
        window.historyOfGeneratedSets = [combination];
        displayAllSets();
        updateStats();
    }
});

document.getElementById('generateMultipleButton').addEventListener('click', function() {
    const combinations = [];
    for (let i = 0; i < 10; i++) {
        combinations.push(generateCombination());
    }
    window.historyOfGeneratedSets = combinations.filter(c => c !== null);
    displayAllSets();
    updateStats();
});

document.getElementById('generateOptimizedButton').addEventListener('click', function() {
    const combinations = [];
    for (let i = 0; i < 50; i++) {
        combinations.push(generateCombination());
    }
    window.historyOfGeneratedSets = combinations.filter(c => c !== null);
    displayAllSets();
    updateStats();
});

// Função para exibir todas as combinações geradas
function displayAllSets() {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';
    
    if (window.historyOfGeneratedSets.length === 0) {
        resultDiv.textContent = 'Nenhuma combinação gerada ainda.';
        return;
    }
    
    const quantidade = window.historyOfGeneratedSets[0].length;
    const header = document.createElement('div');
    header.style.cssText = 'background: linear-gradient(135deg, #00bcd4 0%, #008ba3 100%); color: white; padding: 20px; margin-bottom: 20px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0, 188, 212, 0.3);';
    header.innerHTML = `<strong style="font-size: 18px;">Total: ${window.historyOfGeneratedSets.length} combinações geradas</strong><br>
        <small style="opacity: 0.9;">Cada linha contém ${quantidade} números da Lotomania (00-99)</small>`;
    resultDiv.appendChild(header);
    
    window.historyOfGeneratedSets.forEach((combination, index) => {
        const lineDiv = document.createElement('div');
        lineDiv.className = 'number-line';
        lineDiv.style.marginBottom = '20px';
        lineDiv.style.paddingBottom = '20px';
        lineDiv.style.borderBottom = '2px solid #eee';
        
        combination.forEach(num => {
            const numDiv = document.createElement('div');
            numDiv.className = 'numero';
            
            // Adiciona classes especiais para números frequentes
            if (TOP_20_HISTORICO.includes(num)) {
                numDiv.classList.add('muito-frequente');
            } else if (QUENTES_2025.includes(num)) {
                numDiv.classList.add('frequente');
            } else if (parseInt(num) % 2 === 0) {
                numDiv.classList.add('par');
            } else {
                numDiv.classList.add('impar');
            }
            
            numDiv.textContent = num;
            lineDiv.appendChild(numDiv);
        });
        
        const label = document.createElement('div');
        label.style.cssText = 'margin-top: 10px; font-weight: bold; color: #00bcd4;';
        label.textContent = `Combinação #${index + 1}:`;
        lineDiv.insertBefore(label, lineDiv.firstChild);
        
        resultDiv.appendChild(lineDiv);
    });
}

// Função para atualizar estatísticas
function updateStats() {
    if (window.historyOfGeneratedSets.length === 0) {
        document.getElementById('stats').style.display = 'none';
        return;
    }
    
    // Contar frequência de cada número em todas as combinações geradas
    const numeroCount = {};
    window.historyOfGeneratedSets.forEach(combination => {
        combination.forEach(num => {
            numeroCount[num] = (numeroCount[num] || 0) + 1;
        });
    });
    
    // Converter para array e ordenar por frequência
    const sortedNumbers = Object.entries(numeroCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10); // Pegar os 10 mais frequentes
    
    const statsDiv = document.getElementById('stats');
    statsDiv.style.display = 'block';
    
    let statsHtml = '<h3>📈 Estatísticas das Combinações Geradas:</h3>';
    statsHtml += '<p><strong>Números mais frequentes nas combinações geradas:</strong></p>';
    
    sortedNumbers.forEach(([numero, count]) => {
        statsHtml += `<div style="margin: 5px 0;">
            <span class="numero" style="width: 30px; height: 30px; line-height: 30px; font-size: 14px;">${numero}</span>
            Apareceu em ${count} combinação(ões)
        </div>`;
    });
    
    statsHtml += `<p style="margin-top: 15px;"><strong>Total de combinações geradas:</strong> ${window.historyOfGeneratedSets.length}</p>`;
    statsHtml += `<p><strong>Números por combinação:</strong> ${window.historyOfGeneratedSets[0].length}</p>`;
    statsHtml += `<p><strong>Estratégia utilizada:</strong> ${currentStrategy}</p>`;
    
    statsDiv.innerHTML = statsHtml;
}

// Função para comparar combinações com números sorteados
document.getElementById('compararButton').addEventListener('click', function() {
    const numerosSorteadosInput = document.getElementById('numerosSorteados').value;
    
    if (!numerosSorteadosInput) {
        alert('Por favor, insira os 20 números sorteados');
        return;
    }
    
    // Parse e validar números sorteados
    const numerosSorteados = numerosSorteadosInput.split(',').map(num => {
        const parsed = parseInt(num.trim(), 10);
        return isNaN(parsed) ? null : parsed.toString().padStart(2, '0');
    }).filter(num => num !== null);
    
    // Validar quantidade
    if (numerosSorteados.length !== 20) {
        alert(`Você inseriu ${numerosSorteados.length} números. Por favor, insira exatamente 20 números.`);
        return;
    }
    
    // Validar faixa
    const invalidos = numerosSorteados.filter(num => parseInt(num) < 0 || parseInt(num) > 99);
    if (invalidos.length > 0) {
        alert(`Números inválidos encontrados: ${invalidos.join(', ')}. Os números devem estar entre 00 e 99.`);
        return;
    }
    
    // Validar duplicatas
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
    let acertos20 = 0, acertos19 = 0, acertos18 = 0, acertos17 = 0, acertos16 = 0, acertos15 = 0, acertosAbaixo15 = 0;
    let melhoresCombinacoes = [];
    
    window.historyOfGeneratedSets.forEach((combinacao, index) => {
        const acertos = combinacao.filter(num => numerosSorteadosSet.has(num)).length;
        
        switch(acertos) {
            case 20: 
                acertos20++; 
                melhoresCombinacoes.push({ combinacao, acertos, index });
                break;
            case 19: 
                acertos19++; 
                if (melhoresCombinacoes.length < 10) {
                    melhoresCombinacoes.push({ combinacao, acertos, index });
                }
                break;
            case 18: 
                acertos18++; 
                if (melhoresCombinacoes.length < 5) {
                    melhoresCombinacoes.push({ combinacao, acertos, index });
                }
                break;
            case 17: 
                acertos17++; 
                break;
            case 16: 
                acertos16++; 
                break;
            case 15: 
                acertos15++; 
                break;
            default: 
                acertosAbaixo15++;
        }
    });
    
    melhoresCombinacoes.sort((a, b) => b.acertos - a.acertos);
    
    const resultadoDiv = document.getElementById('resultadoComparacao');
    resultadoDiv.style.display = 'block';
    
    let html = `
        <h3>📊 Resultado da Comparação</h3>
        <p><strong>Números sorteados:</strong> ${Array.from(numerosSorteadosSet).sort((a, b) => parseInt(a) - parseInt(b)).join(', ')}</p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 15px; margin-top: 20px;">
            <div style="background: #d4edda; padding: 15px; border-radius: 5px; text-align: center;">
                <div style="font-size: 24px; font-weight: bold; color: #155724;">${acertos20}</div>
                <div>20 acertos (JACKPOT) 🏆</div>
            </div>
            <div style="background: #cce7ff; padding: 15px; border-radius: 5px; text-align: center;">
                <div style="font-size: 24px; font-weight: bold; color: #004085;">${acertos19}</div>
                <div>19 acertos</div>
            </div>
            <div style="background: #fff3cd; padding: 15px; border-radius: 5px; text-align: center;">
                <div style="font-size: 24px; font-weight: bold; color: #856404;">${acertos18}</div>
                <div>18 acertos</div>
            </div>
            <div style="background: #f8d7da; padding: 15px; border-radius: 5px; text-align: center;">
                <div style="font-size: 24px; font-weight: bold; color: #721c24;">${acertos17}</div>
                <div>17 acertos</div>
            </div>
            <div style="background: #d1ecf1; padding: 15px; border-radius: 5px; text-align: center;">
                <div style="font-size: 24px; font-weight: bold; color: #0c5460;">${acertos16}</div>
                <div>16 acertos</div>
            </div>
            <div style="background: #e2e3e5; padding: 15px; border-radius: 5px; text-align: center;">
                <div style="font-size: 24px; font-weight: bold; color: #383d41;">${acertos15}</div>
                <div>15 acertos</div>
            </div>
        </div>
        
        <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #dee2e6;">
            <h4>Detalhamento Completo:</h4>
            <ul>
                <li><strong>${acertos20}</strong> combinações com 20 acertos ${acertos20 > 0 ? '🎉 JACKPOT!' : ''}</li>
                <li><strong>${acertos19}</strong> combinações com 19 acertos</li>
                <li><strong>${acertos18}</strong> combinações com 18 acertos</li>
                <li><strong>${acertos17}</strong> combinações com 17 acertos</li>
                <li><strong>${acertos16}</strong> combinações com 16 acertos</li>
                <li><strong>${acertos15}</strong> combinações com 15 acertos</li>
                <li><strong>${acertosAbaixo15}</strong> combinações com menos de 15 acertos</li>
            </ul>
        </div>
    `;
    
    // Adicionar seção de melhores combinações se houver acertos significativos
    if (melhoresCombinacoes.length > 0) {
        html += `
            <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #dee2e6;">
                <h4>⭐ Melhores Combinações:</h4>
                <div style="max-height: 300px; overflow-y: auto; padding: 10px; background: #fff; border-radius: 5px;">
        `;
        
        // Mostrar as melhores combinações
        melhoresCombinacoes.slice(0, 10).forEach((item, index) => {
            const combinacao = item.combinacao;
            const acertos = item.acertos;
            
            // Destacar números acertados
            const numerosHtml = combinacao.map(num => {
                const acertou = numerosSorteadosSet.has(num);
                const classe = acertou ? 'destaque-acerto' : '';
                const estilo = acertou ? 'background: #28a745; color: white; font-weight: bold;' : '';
                return `<span class="numero ${classe}" style="${estilo}">${num}</span>`;
            }).join('');
            
            html += `
                <div style="margin: 10px 0; padding: 10px; border: 1px solid #dee2e6; border-radius: 5px;">
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

// Função para buscar resultados da Lotomania
document.getElementById('buscarResultadosButton')?.addEventListener('click', async function() {
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
        const response = await fetch('https://loteriascaixa-api.herokuapp.com/api/lotomania/latest');
        
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }
        
        const data = await response.json();
        const numerosSorteados = data.dezenas.map(num => num.toString().padStart(2, '0'));
        const numerosSorteadosSet = new Set(numerosSorteados);
        const concurso = data.concurso;
        const dataSorteio = data.data;
        
        // Preencher campo automaticamente
        document.getElementById('numerosSorteados').value = numerosSorteados.join(', ');
        
        // Exibir mensagem de sucesso
        const resultadoDiv = document.getElementById('resultadoComparacao');
        resultadoDiv.style.display = 'block';
        resultadoDiv.innerHTML = `
            <h3>✅ Resultado da Lotomania - Concurso ${concurso}</h3>
            <p><strong>Data do Sorteio:</strong> ${dataSorteio}</p>
            <p><strong>Números Sorteados:</strong> ${numerosSorteados.join(', ')}</p>
            <p><strong>Arrecadação Total:</strong> R$ ${data.arrecadacaoTotal?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'Não informado'}</p>
            
            <div style="margin-top: 20px;">
                <p>Os números sorteados já foram preenchidos no campo acima. Clique no botão "Comparar Resultados" para analisar suas combinações.</p>
            </div>
        `;
    } catch (error) {
        console.error('Erro ao buscar resultados:', error);
        alert('Erro ao buscar resultados da Lotomania. Por favor, tente novamente.\n\nDetalhes: ' + error.message);
    } finally {
        button.innerHTML = originalText;
        button.disabled = false;
    }
});

// Função para carregar dados históricos da Lotomania (simulado)
async function fetchHistoricalLotteryResults() {
    try {
        // Show loading message
        const resultadoDiv = document.getElementById('resultadoComparacao');
        resultadoDiv.style.display = 'block';
        resultadoDiv.innerHTML = `
            <div style="text-align: center; padding: 30px;">
                <h3>🔄 Carregando Histórico de Resultados</h3>
                <p>Processando dados históricos da Lotomania...</p>
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
        
        // Simular carregamento
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Dados históricos simulados (os 10 concursos mais recentes)
        const historicalResults = [
            [05, 06, 07, 08, 10, 11, 12, 13, 14, 15, 21, 22, 23, 24, 25, 31, 32, 33, 41, 42],
            [01, 02, 03, 04, 09, 16, 17, 18, 19, 20, 26, 27, 28, 29, 30, 34, 35, 36, 37, 38],
            [05, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 99],
            [01, 03, 05, 07, 09, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35, 37, 39],
            [02, 04, 06, 08, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40],
            [41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60],
            [61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80],
            [81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 00],
            [01, 06, 11, 16, 21, 26, 31, 36, 41, 46, 51, 56, 61, 66, 71, 76, 81, 86, 91, 96],
            [02, 07, 12, 17, 22, 27, 32, 37, 42, 47, 52, 57, 62, 67, 72, 77, 82, 87, 92, 97]
        ].map(result => result.map(num => num.toString().padStart(2, '0')));
        
        // Adicionar resultados históricos ao conjunto global
        if (!window.historicalLotteryResults) {
            window.historicalLotteryResults = new Set();
        }
        
        historicalResults.forEach(result => {
            const sortedResult = [...result].sort((a, b) => parseInt(a) - parseInt(b));
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
updateStats();

// Add event listener for the historical data loading button if it exists
document.addEventListener('DOMContentLoaded', function() {
    // Add the event listener for the historical data button if it exists
    const carregarHistoricoButton = document.getElementById('carregarHistoricoCompletoButton');
    if (carregarHistoricoButton) {
        carregarHistoricoButton.addEventListener('click', async function() {
            await fetchHistoricalLotteryResults();
        });
    }
    
    // Add event listener for the API results button if it exists
    const buscarResultadosButton = document.getElementById('buscarResultadosButton');
    if (buscarResultadosButton) {
        buscarResultadosButton.addEventListener('click', function() {
            // This is handled in the function above
        });
    }
});
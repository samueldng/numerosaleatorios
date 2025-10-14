// Web Worker for generating combinations without blocking the UI

self.onmessage = function(e) {
    const { availableNumbers, numbersToChoose, fixedNumbers } = e.data;
    
    let count = 0;
    const BATCH_SIZE = 1000; // Send updates every 1000 combinations
    let batchBuffer = [];
    
    function generateCombinationsRecursive(array, k, prefix) {
        if (k === 0) {
            const newSetOfNumbers = [...fixedNumbers, ...prefix].sort((a, b) => a - b);
            batchBuffer.push(newSetOfNumbers);
            count++;
            
            // Send batch to main thread
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
    
    // Start generation
    generateCombinationsRecursive(availableNumbers, numbersToChoose, []);
    
    // Send remaining combinations
    if (batchBuffer.length > 0) {
        self.postMessage({
            type: 'batch',
            combinations: batchBuffer,
            count: count
        });
    }
    
    // Signal completion
    self.postMessage({
        type: 'complete',
        totalCount: count
    });
};

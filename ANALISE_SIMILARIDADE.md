# 🔍 Análise de Similaridade - Combinações com 14 Números em Comum

## 📊 Pergunta

**Das 1.287 combinações possíveis, quantas têm 14 números em comum com:**
```
01, 02, 03, 04, 05, 06, 09, 12, 13, 14, 15, 17, 19, 20, 22
```

---

## ✅ Resposta

**40 combinações** têm exatamente 14 números em comum com a sua!

---

## 🧮 Cálculo Matemático

### Sua Combinação Base

- **7 PARES fixos**: 2, 4, 6, 12, 14, 20, 22
- **8 ÍMPARES**: 1, 3, 5, 9, 13, 15, 17, 19

### Por Que 40 Combinações?

**Raciocínio:**

1. **Os 7 pares são SEMPRE os mesmos** em todas as 1.287 combinações
   - Eles são fixos por definição do sistema

2. **Para ter 14 números em comum:**
   - Precisa ter **7 dos 8 ímpares** que você escolheu
   - Mais **1 ímpar diferente** (dos 5 que você NÃO escolheu)

3. **Cálculo:**
   - Escolher qual dos 8 ímpares remover: **8 opções**
   - Para cada remoção, escolher 1 dos 5 ímpares não usados: **5 opções**
   - **Total: 8 × 5 = 40 combinações**

---

## 📋 Exemplos Práticos

### Seus 8 Ímpares:
```
1, 3, 5, 9, 13, 15, 17, 19
```

### 5 Ímpares NÃO Escolhidos:
```
7, 11, 21, 23, 25
```

### Exemplos de Combinações com 14 em Comum:

#### Exemplo 1: Remover o 1, adicionar o 7
```
Base:    1, 2, 3, 4, 5, 6, 9, 12, 13, 14, 15, 17, 19, 20, 22
Nova:    2, 3, 4, 5, 6, 7, 9, 12, 13, 14, 15, 17, 19, 20, 22
         ❌  ✅ (removeu 1, adicionou 7)
Comum: 14 números
```

#### Exemplo 2: Remover o 3, adicionar o 11
```
Base:    1, 2, 3, 4, 5, 6, 9, 12, 13, 14, 15, 17, 19, 20, 22
Nova:    1, 2, 4, 5, 6, 9, 11, 12, 13, 14, 15, 17, 19, 20, 22
            ❌      ✅ (removeu 3, adicionou 11)
Comum: 14 números
```

#### Exemplo 3: Remover o 19, adicionar o 25
```
Base:    1, 2, 3, 4, 5, 6, 9, 12, 13, 14, 15, 17, 19, 20, 22
Nova:    1, 2, 3, 4, 5, 6, 9, 12, 13, 14, 15, 17, 20, 22, 25
                                                   ❌      ✅
Comum: 14 números
```

---

## 📊 Tabela Completa das 40 Combinações

| # | Ímpar Removido | Ímpar Adicionado | Combinação Resultante |
|---|----------------|------------------|------------------------|
| 1 | 1 | 7 | 2,3,4,5,6,**7**,9,12,13,14,15,17,19,20,22 |
| 2 | 1 | 11 | 2,3,4,5,6,9,**11**,12,13,14,15,17,19,20,22 |
| 3 | 1 | 21 | 2,3,4,5,6,9,12,13,14,15,17,19,20,**21**,22 |
| 4 | 1 | 23 | 2,3,4,5,6,9,12,13,14,15,17,19,20,22,**23** |
| 5 | 1 | 25 | 2,3,4,5,6,9,12,13,14,15,17,19,20,22,**25** |
| 6 | 3 | 7 | 1,2,4,5,6,**7**,9,12,13,14,15,17,19,20,22 |
| 7 | 3 | 11 | 1,2,4,5,6,9,**11**,12,13,14,15,17,19,20,22 |
| 8 | 3 | 21 | 1,2,4,5,6,9,12,13,14,15,17,19,20,**21**,22 |
| 9 | 3 | 23 | 1,2,4,5,6,9,12,13,14,15,17,19,20,22,**23** |
| 10 | 3 | 25 | 1,2,4,5,6,9,12,13,14,15,17,19,20,22,**25** |
| 11 | 5 | 7 | 1,2,3,4,6,**7**,9,12,13,14,15,17,19,20,22 |
| 12 | 5 | 11 | 1,2,3,4,6,9,**11**,12,13,14,15,17,19,20,22 |
| 13 | 5 | 21 | 1,2,3,4,6,9,12,13,14,15,17,19,20,**21**,22 |
| 14 | 5 | 23 | 1,2,3,4,6,9,12,13,14,15,17,19,20,22,**23** |
| 15 | 5 | 25 | 1,2,3,4,6,9,12,13,14,15,17,19,20,22,**25** |
| 16 | 9 | 7 | 1,2,3,4,5,6,**7**,12,13,14,15,17,19,20,22 |
| 17 | 9 | 11 | 1,2,3,4,5,6,**11**,12,13,14,15,17,19,20,22 |
| 18 | 9 | 21 | 1,2,3,4,5,6,12,13,14,15,17,19,20,**21**,22 |
| 19 | 9 | 23 | 1,2,3,4,5,6,12,13,14,15,17,19,20,22,**23** |
| 20 | 9 | 25 | 1,2,3,4,5,6,12,13,14,15,17,19,20,22,**25** |
| 21 | 13 | 7 | 1,2,3,4,5,6,**7**,9,12,14,15,17,19,20,22 |
| 22 | 13 | 11 | 1,2,3,4,5,6,9,**11**,12,14,15,17,19,20,22 |
| 23 | 13 | 21 | 1,2,3,4,5,6,9,12,14,15,17,19,20,**21**,22 |
| 24 | 13 | 23 | 1,2,3,4,5,6,9,12,14,15,17,19,20,22,**23** |
| 25 | 13 | 25 | 1,2,3,4,5,6,9,12,14,15,17,19,20,22,**25** |
| 26 | 15 | 7 | 1,2,3,4,5,6,**7**,9,12,13,14,17,19,20,22 |
| 27 | 15 | 11 | 1,2,3,4,5,6,9,**11**,12,13,14,17,19,20,22 |
| 28 | 15 | 21 | 1,2,3,4,5,6,9,12,13,14,17,19,20,**21**,22 |
| 29 | 15 | 23 | 1,2,3,4,5,6,9,12,13,14,17,19,20,22,**23** |
| 30 | 15 | 25 | 1,2,3,4,5,6,9,12,13,14,17,19,20,22,**25** |
| 31 | 17 | 7 | 1,2,3,4,5,6,**7**,9,12,13,14,15,19,20,22 |
| 32 | 17 | 11 | 1,2,3,4,5,6,9,**11**,12,13,14,15,19,20,22 |
| 33 | 17 | 21 | 1,2,3,4,5,6,9,12,13,14,15,19,20,**21**,22 |
| 34 | 17 | 23 | 1,2,3,4,5,6,9,12,13,14,15,19,20,22,**23** |
| 35 | 17 | 25 | 1,2,3,4,5,6,9,12,13,14,15,19,20,22,**25** |
| 36 | 19 | 7 | 1,2,3,4,5,6,**7**,9,12,13,14,15,17,20,22 |
| 37 | 19 | 11 | 1,2,3,4,5,6,9,**11**,12,13,14,15,17,20,22 |
| 38 | 19 | 21 | 1,2,3,4,5,6,9,12,13,14,15,17,20,**21**,22 |
| 39 | 19 | 23 | 1,2,3,4,5,6,9,12,13,14,15,17,20,22,**23** |
| 40 | 19 | 25 | 1,2,3,4,5,6,9,12,13,14,15,17,20,22,**25** |

---

## 🎯 Distribuição de Similaridade

| Números em Comum | Quantidade | Percentual |
|------------------|------------|------------|
| 15 (idêntica) | 1 | 0.08% |
| 14 | **40** | **3.11%** |
| 13 | ? | ? |
| 12 | ? | ? |
| ... | ... | ... |

---

## 🔍 Como Verificar

Use a ferramenta: **[analisar_similaridade.html](file://c:\Users\Samuel\Desktop\numerosaleatorios\analisar_similaridade.html)**

1. Abra o arquivo
2. Clique em "Analisar Todas as 1.287 Combinações"
3. Aguarde ~2 segundos
4. Veja a lista completa das 40 combinações com 14 em comum!

---

## 💡 Insights Interessantes

### Por Que Sempre 7 Pares Iguais?

Os 7 números pares são **FIXOS** na aplicação. Isso significa:
- Você define quais 7 pares usar
- TODAS as 1.287 combinações terão esses mesmos 7 pares
- A variação acontece apenas nos 8 ímpares escolhidos

### Por Que Exatamente 40?

É uma consequência matemática de:
- **C(8, 1)** = 8 maneiras de escolher qual ímpar remover
- **5** opções de ímpares não usados para adicionar
- **8 × 5 = 40**

### E Se Fossem 13 em Comum?

Com 13 em comum, você teria:
- 6 dos 8 ímpares da sua lista
- 2 ímpares diferentes dos 5 não usados

**Cálculo:** C(8, 6) × C(5, 2) = 28 × 10 = **280 combinações**

---

## 📚 Fórmula Geral

Para **k números em comum** (considerando 7 pares fixos):

**k** em comum = 7 pares + **(k - 7)** ímpares em comum

**Quantidade de combinações:**
```
C(8, k-7) × C(5, 15-k)
```

Onde:
- C(8, k-7) = escolher quantos dos seus 8 ímpares manter
- C(5, 15-k) = escolher quantos dos 5 não usados adicionar

**Exemplos:**
- k = 15: C(8, 8) × C(5, 0) = 1 × 1 = **1** (só a sua)
- k = 14: C(8, 7) × C(5, 1) = 8 × 5 = **40**
- k = 13: C(8, 6) × C(5, 2) = 28 × 10 = **280**
- k = 12: C(8, 5) × C(5, 3) = 56 × 10 = **560**

---

## ✅ Resumo

**Pergunta:** Quantas das 1.287 combinações têm 14 números em comum?

**Resposta:** **40 combinações**

**Como:** Cada uma das suas 8 escolhas de ímpar pode ser trocada por cada um dos 5 ímpares não escolhidos.

**Verificar:** Use [analisar_similaridade.html](file://c:\Users\Samuel\Desktop\numerosaleatorios\analisar_similaridade.html)

---

**Versão:** 1.0  
**Data:** 2025-10-17

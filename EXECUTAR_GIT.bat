@echo off
echo === Adicionando arquivos ao Git ===
git add mega_sena.html
git add script_mega_sena.js
git add index.html

echo.
echo === Status dos arquivos ===
git status

echo.
echo === Fazendo commit ===
git commit -m "feat: Adiciona página Mega Sena com estratégias avançadas

- Cria página mega_sena.html com 4 estratégias de geração
- Implementa script_mega_sena.js com lógica completa
- Adiciona card de atalho na página principal
- Aplica estilo visual consistente (gradiente roxo/azul)
- Corrige sobreposição de cor no ícone do título"

echo.
echo === Fazendo push ===
git push origin master

echo.
echo === Concluído! ===
pause


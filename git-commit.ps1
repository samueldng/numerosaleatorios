# Script para fazer commit e push das alterações
# Execute este script no PowerShell: .\git-commit.ps1

Write-Host "=== Git Commit Script ===" -ForegroundColor Cyan
Write-Host ""

# Verificar se o Git está instalado
try {
    $gitVersion = git --version
    Write-Host "Git encontrado: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "ERRO: Git não está instalado ou não está no PATH" -ForegroundColor Red
    Write-Host "Por favor, instale o Git de: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Adicionando arquivos..." -ForegroundColor Yellow
git add mega_sena.html
git add script_mega_sena.js
git add index.html

Write-Host ""
Write-Host "Status dos arquivos:" -ForegroundColor Yellow
git status --short

Write-Host ""
$confirmation = Read-Host "Deseja fazer commit? (S/N)"
if ($confirmation -eq 'S' -or $confirmation -eq 's') {
    Write-Host ""
    Write-Host "Fazendo commit..." -ForegroundColor Yellow
    git commit -m "feat: Adiciona página Mega Sena com estratégias avançadas

- Cria página mega_sena.html com 4 estratégias de geração
- Implementa script_mega_sena.js com lógica completa
- Adiciona card de atalho na página principal
- Aplica estilo visual consistente (gradiente roxo/azul)
- Corrige sobreposição de cor no ícone do título"
    
    Write-Host ""
    Write-Host "Commit realizado com sucesso!" -ForegroundColor Green
    
    Write-Host ""
    $push = Read-Host "Deseja fazer push para o repositório remoto? (S/N)"
    if ($push -eq 'S' -or $push -eq 's') {
        Write-Host ""
        Write-Host "Fazendo push..." -ForegroundColor Yellow
        git push
        Write-Host ""
        Write-Host "Push realizado com sucesso!" -ForegroundColor Green
    }
} else {
    Write-Host "Commit cancelado." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== Concluído ===" -ForegroundColor Cyan


# Instruções para Fazer Commit e Push

## Arquivos Criados/Modificados:

### Novos Arquivos:
- `mega_sena.html` - Página da Mega Sena com estratégias avançadas
- `script_mega_sena.js` - Lógica JavaScript para Mega Sena

### Arquivos Modificados:
- `index.html` - Adicionado card de atalho para Mega Sena

## Comandos Git:

```bash
# Adicionar todos os arquivos modificados e novos
git add .

# Ou adicionar arquivos específicos:
git add mega_sena.html
git add script_mega_sena.js
git add index.html

# Fazer commit
git commit -m "feat: Adiciona página Mega Sena com estratégias avançadas

- Cria página mega_sena.html com 4 estratégias de geração
- Implementa script_mega_sena.js com lógica completa
- Adiciona card de atalho na página principal
- Aplica estilo visual consistente (gradiente roxo/azul)
- Corrige sobreposição de cor no ícone do título"

# Verificar se há um remote configurado
git remote -v

# Se houver remote, fazer push
git push origin main
# ou
git push origin master
```

## Se o Git não estiver no PATH:

1. Instale o Git: https://git-scm.com/download/win
2. Ou use o Git Bash que vem com a instalação
3. Ou adicione o Git ao PATH do sistema


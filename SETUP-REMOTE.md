# Configuração do Repositório Remoto

## Opção 1: Criar repositório no GitHub (Recomendado)

1. Acesse https://github.com/new
2. Nome do repositório: `cantina-crud`
3. Descrição: "Sistema de gerenciamento para cantina escolar"
4. Deixe como público ou privado conforme preferir
5. **NÃO** marque "Initialize this repository with a README" (já temos um)
6. Clique em "Create repository"

## Opção 2: Comandos para conectar após criar no GitHub

Após criar o repositório no GitHub, execute no PowerShell:

```powershell
# Substituir SEU-USUARIO pelo seu nome de usuário do GitHub
git remote add origin https://github.com/SEU-USUARIO/cantina-crud.git

# Renomear branch para main (padrão moderno)
git branch -M main

# Enviar código para o GitHub
git push -u origin main
```

## Opção 3: Se preferir manter branch master

```powershell
# Conectar ao remoto
git remote add origin https://github.com/SEU-USUARIO/cantina-crud.git

# Enviar código
git push -u origin master
```

## Verificar conexão

Após configurar, verificar com:
```powershell
git remote -v
```

## Estado atual do repositório

✅ README.md criado
✅ .gitignore configurado
✅ Commit inicial realizado
⏳ Aguardando configuração do remoto
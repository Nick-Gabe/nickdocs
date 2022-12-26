---
slug: dynamic-readme
title: Readmes dinâmicos usando Github Actions
authors: [nickgabe]
tags: [github, javascript]
---

**Olá! Você já pensou como seria poder gerar um README dinamicamente para aquele seu projeto do GitHub?**

Eu já, mas nunca pensei em como funcionaria... até eu pesquisar se era possível e acabar me surpreendendo.

Depois de algumas pesquisas descobri uma feature do GitHub chamada "GitHub Actions", e ela consegue executar um código que você especificar, em diversas situações como: após um push, pull-request, e até mesmo em um intervalo especificado. Isso era justamente o que eu precisava, e com essa feature em mãos comecei a escrever meu Javascri- calma...

...Como isso é um guia, melhor eu documentar como fiz e como você também pode fazer e utilizar de diversas maneiras como quiser. Então vamos começar pelo começo:


<!-- truncate -->

## 1. Criando uma base
Gerar um markdown direto do Javascript _não é tão prático assim_, pois para visualizar você precisaria executar o Javascript, e repetir isso para cada mudança definitivamente não é viável a longo prazo _(vamos ignorar o nodemon)_. Por isso eu recomendo criar um **arquivo base em markdown**, e modificá-lo usando Javascript, ao invés de gerá-lo por completo.

Como exemplo, **vou criar um novo repositório** no GitHub e disponibilizarei ao final do blog. Então vamos começar por essa base em markdown (que nomeei como "readme_base"), definindo nela as informações que serão fixas, e quais serão geradas:

```markdown
# %{titulo}
Eu coloquei o titulo dentro de `%{}` apenas para evitar que
haja alguma ambiguidade com textos comuns.

Todas as partes desta base podem ser manipuladas e modificadas,
por exemplo aqui eu irei inserir uma lista de nomes:
%{listaDeNomes}}
```

## 2. Modificando a base
Para testamos se está tudo funcionando, vamos criar um arquivo em Javascript, no qual nomearei como "index.js", para modificar a base:

```javascript
/* o fs é quem irá ler o arquivo e gerar um novo,
ele vem por padrão no node, então não se preocupe */
const fs = require('fs')

// esta parte lê o arquivo "README_BASE"
fs.readFile('README_BASE.md', 'utf-8', (err, data) => {
    if (err) {
        throw err;
    }

/* aqui é onde acontecem as substituições, por exemplo
substituindo %{titulo} por "Dynamic Readme" */
    const substituicoes = {
        titulo: 'Dynamic Readme',
        listaDeNomes: `- Carlos\n- Ana\n- Sérgio`
    }

/* aqui é o que verifica e executa as substituições, um
regex bem simples com object literals, não precisa mexer aqui */
    const modificado = data
        .replace(
            /%{.*}/gm,
            e => substituicoes?.[e.slice(2, -1)] || e
        )

/* após ter feito as mudanças ele cria um arquivo
chamado "README.md" com a nova versão */
    fs.writeFile('README.md', modificado, 'utf-8', (err) => {
        if (err) {
            throw err;
        }
        console.log('✔ Processo finalizado!');
    });
});
```

Este código será executado via node, então **sinta-se livre para adicionar o que quiser**, sejam pacotes, requisições em apis, gerar imagens, está em suas mãos.

## 3. Automatizando o processo
> "Mas isso apenas gerou o arquivo pois fui eu quem iniciou o javascript, então para executar esse processo automaticamente eu precisaria de um host?"

**Felizmente não**, pois no caso do GitHub ele disponibiliza o github actions no qual eu havia falado. Ela permite que o processo rode em diversas circunstâncias, e no caso deste exemplo usarei o `schedule` que permite que o código seja executado a cada intervalo especificado.

Para isso iremos criar uma pasta chamada `.github`, e dentro dela uma outra chamada `workflows`, com um arquivo `main.yaml`.
Resumindo: `.github/workflows/main.yaml`.

No arquivo main.yaml é onde diremos ao github **quando, como e o quê rodar.**
```yaml
# Nome do processo
name: Update automático

on:
  schedule:
    # cron é o "intervalo" de execução, recomendo usar
    # o site crontab.guru para lhe ajudar a definir.
    # nesse caso aqui, ele irá rodar a cada 10 minutos.
    - cron: '*/10 * * * *'

# Aqui vem os passos que a ação segue
jobs:
  build:
    # Inicia uma máquina virtual ubuntu
    runs-on: ubuntu-latest

    # Checa o código atual do repositório
    steps:
    - name: Checkout repo
      uses: actions/checkout@v2

    # Instala o node na versão 16.10
    - name: Use Node.js
      uses: actions/setup-node@v1
      with:
        node-version: 16.10
    - run: npm install
    - run: npm run build --if-present
      env:
        CI: true

    # Aqui em index.js você insere
    # o nome do seu arquivo javascript
    - name: Roda o arquivo
      run: |-
        node index.js
        cat README.md

    # E no final commita e faz um push caso haja alguma diferença
    # comparada ao código atual do repositório
    - name: Commit e push
      run: |-
        git diff
        git config --global user.email "bot-readme@example.com"
        git config --global user.name "bot automático"
        git add -A
        git commit -m "Arquivo atualizado!" || exit 0
        git push
```
Com isso feito, sua pasta/repositório deve estar mais ou menos assim:
```
> .github
  > workflows
    > main.yaml
> index.js
> readme_base.md
> README.md (gerado)
```
Se estiver assim, perfeito, tá tudo certo. Casos os nomes estejam diferentes ou não tenha gerado o README ainda, tá tudo bem também.

Mas só avisando que caso você mande tudo pro GitHub, e em 10 minutos seu repositório não atualize, _calma_. **O GitHub Actions nem sempre é imediato**, algumas vezes leva mais tempo do que o especificado. Por exemplo no meu teste desse repositório, apesar de eu especificar 10 minutos levou 25 😅.

Você pode acompanhar as actions por aqui, sempre que uma for executada ela irá aparecer:
![Actions page](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/8ar3u99uur84gpwc19a6.png)

E falando no repositório, **aqui está o link pra ele**: [Dynamic Readme](https://github.com/Nick-Gabe/dynamic-readme). Se quiser pode fazer um fork e modificar ou seguir este tutorial, como preferir.

## 4. O final
**Opa! Gostou do blog?** É o meu primeiro, mas tentei deixar ele completo e simples de se entender, espero ter conseguido ^^.

E não pensa que dá pra fazer só essas coisinhas de trocar texto por texto não! No [meu readme](https://github.com/Nick-Gabe/Nick-Gabe) eu fiz uma seção que atualiza mostrando minhas atividades mais recentes, e até gera uma imagem utilizando a api do github para pegar um seguidor aleatório meu!
![Sample](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/a2nxpf63ju91qmlurvnd.png)

Tô ansioso pra ver o que vocês também conseguem criar.
Me marca no Twitter caso faça algo bacana com isso. 'Inté!

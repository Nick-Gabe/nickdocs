---
slug: netlify-serverless-functions
title: Funções Serverless do Netlify
authors: [nickgabe]
tags: [netlify, serverless, typescript, javascript]
---

**Por que devo usar Netlify Functions?**

Netlify é um serviço de hospedagem de sites, mas hospeda apenas nosso front-end, enquanto nosso back-end deve ser hospedado em qualquer outro lugar. E isso geralmente é o que você faz, mas se estou apenas planejando construir um pequeno projeto, então isso seria tipo encher um copo d'água com um oceano, não há necessidade disso.

Netlify Functions vem para resolver esse problema, você pode manter seu back-end e front-end juntos usando funções que podem ser chamadas como uma API de back-end. E torna o código mais fácil de editar, pois está tudo em uma pasta.

<!-- truncate -->

_- Tá bom Nick, entendi, mas como que usa esse trem?_
Boa pergunta, vou dividir a resposta em dois tópicos separados: Como implementar usando Javascript e como implementar usando Typescript.

**Repositório criado neste blog: [netlify-functions-tutorial](https://github.com/Nick-Gabe/netlify-functions-tutorial)**
Ao tentar usar o Serverless Functions no Netlify eu realmente lutei para entender como ele funciona e como usá-lo, mesmo com vídeos, blogs... Então levando em consideração meus erros e dúvidas resolvi criar este artigo para você desenvolvedor, que pode estar interessado, mas não sabe como ou mesmo por que usá-lo.

## Serverless com Javascript

**1. Instalar netlify-cli**
Presumo que você já tenha criado uma pasta para o seu projeto, portanto, antes de continuar, devemos instalar um pacote nela.
Para instalar, execute este comando no seu terminal:
```js
npm instalar netlify-cli --dev
```

**2. Crie uma pasta para suas funções**
Então, para começar precisamos criar uma pasta para nossas funções, seu nome pode ser o que você quiser, mas para o propósito deste blog vou nomear o meu como "funções".
Se você já instalou o pacote `netlify-cli` sua pasta deve estar assim:
```
> functions
> node-modules
package.json
package-lock.json
```

**3. Criar netlify.toml**
Agora vamos especificar para o Netlify onde estão nossas funções, e para isso, precisamos criar um arquivo chamado `netlify.toml`.
Dentro dele você deve escrever este código:
```toml title="netlify.toml"
[build]
   functions = "./functions"
```
O "./functions" é o caminho para a pasta de funções, então lembre-se de substituí-lo se você colocar outro nome ou em um local diferente do diretório raiz.

**4. Defina os redirecionamentos**
A url base para acessar suas funções é `localhost:8888/.netlify/functions/functionName` mas é uma url muito longa e desnecessária, então eu gosto de configurar um redirecionamento em meus projetos.
Para isso você deve criar um arquivo chamado `_redirects`_(sem extensão)_ e colocar este código dentro dele:
```txt title="_redirects_"
/api/* /.netlify/functions/:splat 200
```
A `/api/*` será nossa nova url para acessar as funções, ou seja, agora podemos acessar `localhost:8888/api/functionname`. O `/.netlify/functions/:splat` é a url para a qual ele será redirecionado, substituindo o `:splat` pela função que você inseriu. E `200` é apenas o statusCode que será retornado para o redirecionamento.

**5. Criando funções**
Este é o último passo que precisamos. A função que criarei é apenas um exemplo, mas fique à vontade para expandi-la como quiser.

Vamos criar um arquivo chamado "helloworld.js" **dentro** da nossa pasta de funções.
O primeiro código que iremos inserir é basicamente um export, desta forma o Netlify pode recuperar a função e executá-la quando você ou alguém acessar a url da API.
```js title="functions/helloworld.js"
module.exports.handler = async (evento, contexto) => {
}
```
Se você quiser e souber como fazê-lo, poderá alterar a forma de exportação, mas lembre-se de que não pode alterar o nome reservado "handler", caso contrário a função não será legível pelo netlify.

Em nossa função, meu plano é retornar uma string com uma mensagem. Se o usuário enviar um "nome" para nossa API, ela enviará "Hello name!", caso contrário, enviará "Hello world!". Conceito bem simples, vamos fazer!

Escolheremos o nome dos parâmetros da string de consulta. Eles são especificados após um "?" no URL, com uma chave=valor.
![Exemplo de parâmetros de string de consulta](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ia2bze45rwdg78nc44pq.png)

Eu criei uma [destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) que seleciona elementos dos parâmetros do evento e, em seguida, uma variável "mensagem" com um string que pode ser "Hello name!" ou "Olá, mundo!"
```js title="functions/helloworld.js"
module.exports.handler = async (evento, contexto) => {
   const { nome } = event.queryStringParameters
   mensagem const = `Olá ${nome || "mundo"}!`
}
```

Ok, agora precisamos enviar de volta a resposta da nossa requisição, e para isso só precisamos retornar um objeto, contendo um corpo _(Os dados que queremos enviar de volta)_ e um [statusCode](https:/ /developer.mozilla.org/en-US/docs/Web/HTTP/Status).
```js title="functions/helloworld.js"
module.exports.handler = async (evento, contexto) => {
   const { nome } = evento.queryStringParameters
   mensagem const = `Olá ${nome || "mundo"}!`

   return {
     statusCode: 200,
     body: mensagem
   }
}
```
**Incrível! Pronto!** Para testar sua API basta executar o comando `netlify dev` em seu terminal. Ele vai dizer as funções que foram carregadas e também o servidor que está sendo usado _(no meu caso "localhost:8888")_
![Netlify Dev Command Example](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/70m747r0f7kvygh8r6fc.png)
Se você entrar em seu navegador e digitar a url `localhost:8888/api/helloworld`, deverá receber uma string contendo "hello world" assim:
![Olá mundo](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/28n162skydoy4xpfdwem.png)
Se você inserir seu nome como parâmetro na url assim: `localhost:8888/api/helloworld?name=Nick`, ele retornará uma resposta diferente:
![Olá Nick](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/boev7pw7x2ffhxujf84z.png)

Para coletar esses dados do front-end, basta fazer uma solicitação local, um exemplo seria `fetch("/api/helloworld")`, já que tanto o front quanto o back rodam no mesmo host.

**6. Bônus: Enviando JSON's**
Na maioria dos casos, você não deseja retornar apenas uma string, mas sim um [JSON](https://www.w3schools.com/js/js_json_intro.asp), basicamente um objeto que pode ser lido pelo navegador. E a implementação é bem direta, você só precisa enviar o corpo da sua resposta como um JSON.stringify(object).
Veja este exemplo:
```js
module.exports.handler = async (evento, contexto) => {
   const { nome } = event.queryStringParameters
   mensagem const = `Olá ${nome || "mundo"}!`

   Retorna {
     statusCode: 200,
     body: JSON.stringify({ data: mensagem })
   }
}
```
Em vez de retornar uma string, desta vez retornaremos um JSON de um objeto contendo uma propriedade chamada "data" que contém nossa mensagem.
Se inserirmos a url novamente...
![JSON](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/2t5siv6w2za9txhdr13b.png)
Maravilha, funcionou! Com o Netlify Functions você pode criar o que quiser, desde autorizações de token, modificações de banco de dados...

## Serverless com Typescript
O processo é quase o mesmo do Javascript, com as únicas exceções sendo a criação da função e alguns pacotes que você precisa instalar.
Junto com o `netlify-cli` que você instalou antes, você precisa instalar o `@netlify-functions` para obter os tipos de função. Para fazer isso, basta executar isso no seu terminal:
```js
npm i @netlify/functions --dev
```

Agora vamos adaptar a função Javascript anterior que criamos em uma função Typescript.

```js title="functions/helloworld.ts"
// Importei o tipo "Handler" para usar na função
import type { Handler } from "@netlify/functions";

// Cria uma variável chamada handler, do tipo Handler
// e sendo uma função assíncrona
const: Handler = async (evento, contexto) => {
   // Este código é quase o mesmo, só adicionei um
   // verificação de nulidade nos parâmetros da consulta
   const { nome } = evento.queryStringParameters ?? {}
   const mensagem = `Olá ${nome || "mundo"}!`

   return  {
     statusCode: 200,
     body: JSON.stringify({ data: mensagem })
   }
}

// Em vez de usar as exportações do módulo, vamos
// use export { handler }, e assim como javascript,
// handler é uma palavra reservada, outros nomes não serão lidos
export { handler };
```
E pronto, todo arquivo que você criar será um novo endpoint.
Não expliquei o Typescript tão detalhadamente quanto o Javascript simplesmente porque o processo é quase o mesmo e seria meio redundante fazê-lo.

## Fim
Isso me levou algumas horas para escrever, espero ter ajudado, mas se ainda houver alguma dúvida, sinta-se à vontade para me enviar DM no [Twitter](https://twitter.com/MyNickIsNick_) e tentarei ajudar no teu caso específico :).
Também não escrevo muitos artigos, mas enfim, até mais!
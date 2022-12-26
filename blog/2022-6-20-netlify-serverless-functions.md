---
slug: netlify-serverless-functions
title: Netlify Serverless Functions
authors: [nickgabe]
tags: [netlify, serverless, typescript, javascript]
---

**Why should I use Netlify Functions?**

Netlify is a website hosting service, but it only hosts our front-end, while our back-end must be hosted anywhere else. And that usually is what you do, but if I'm just planning to build a small project that would be like filling a cup of water with an ocean, there is no need for that.

Netlify Functions comes to solve this problem, you can keep your back and front-end together by using Functions that can be called just like a back-end api. And it makes the code easier to edit since it's all in one folder.

<!-- truncate -->

_- Ok ok Nick, I understood, but how do I use that thing?_
Good question, I'll divide the answer in two separate topics: How to implement it using Javascript and how to implement it using Typescript.

**Repository created in this blog: [netlify-functions-tutorial](https://github.com/Nick-Gabe/netlify-functions-tutorial)**
When trying to use Serverless Functions on Netlify I really struggled to understand how it works and how to use it, even with videos, blogs... So taking in mind my mistakes and doubts I decided to create this article for you, developer, that may be interested but doesn't know how or even why using it.

## Serverless with Javascript

**1. Install netlify-cli**
Im presuming you already created a folder to your project, so before continuing we must install a package into it.
To install, execute this command in your terminal:
```js
npm install netlify-cli --dev
```

**2. Create a folder for your functions**
So, to begin we need to create a folder for our functions, its name can be anything you want, but for the purpose of this blog I'll name mine as "functions".
If you already installed the `netlify-cli` package your folder must be like this:
```
> functions
> node-modules
package.json
package-lock.json
```

**3. Create netlify.toml**
Now we'll specify to Netlify where our functions are, and to do that, we need to create a file called `netlify.toml`.
Inside it you should write this code:
```
[build]
  functions = "./functions"
```
The "./functions" is the path to your functions folder, so remember to replace that if you put another name or in a different place than the root directory.

**4. Set the redirects**
The base url for acessing your functions is `localhost:8888/.netlify/functions/functionname` but that's a really long and unnecessary url, so I like to set up a redirect in my projects.
To do that you must create a file called `_redirects`_(without extension)_ and put this code inside it:
```
/api/* /.netlify/functions/:splat 200
```
The `/api/*` will be our new url to acess the functions, meaning that now we can acess `localhost:8888/api/functionname`. The `/.netlify/functions/:splat` is the url it will be redirected to, replacing the `:splat` with the function you inserted. And `200` is just the status code that will be returned to the redirect.

**5. Creating functions**
This is the last step we need. The function I will create is just an example, but feel free to expand it however you want.

Let's create a file called "helloworld.js" **inside** our functions folder.
The first code we will insert is basically an export, this way Netlify can retrieve the function and execute it when you or someone acesses the api url.
```js
module.exports.handler = async (event, context) => {
}
```
If you want and know how to it, you can change how you export it, but keep in mind you can't change the "handler" name, else the function will not be readable.

In our function my plan is to return a string with a message. If the user sends a "name" to our api, it will send "Hello name!", if not, then it sends "Hello world!". Pretty simple concept, let's do it!

We will pick the name from the query string parameters. They are specified after a "?" in the url, with a key=value.
![Query String Parameters Example](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ia2bze45rwdg78nc44pq.png)

I created a [destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) that picks elements from the event parameters, and then a variable "message" with a string that can be either "Hello name!" or "Hello world!"
```js
module.exports.handler = async (event, context) => {
  const { name } = event.queryStringParameters
  const message = `Hello ${name || "world"}!`
}
```

Ok, now we need to send back the answer to our requisition, and to do that we only need to return an object, containing a body _(The data we want to send back)_ and a [status code](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status).
```js
module.exports.handler = async (event, context) => {
  const { name } = event.queryStringParameters
  const message = `Hello ${name || "world"}!`

  return {
    statusCode: 200,
    body: message
  }
}
```
**Amazing! It's done!** To test your API just run the command `netlify dev` in your terminal. It will say the functions that were loaded and also the server being used _(in my case "localhost:8888")_
![Netlify Dev Command Example](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/70m747r0f7kvygh8r6fc.png)
If you go in your browser and enter the url `localhost:8888/api/helloworld` you should receive a string containing "hello world" just like this:
![Hello world](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/28n162skydoy4xpfdwem.png)
If you insert your name as a parameter in the url like this: `localhost:8888/api/helloworld?name=Nick`, it will return a different response:
![Hello Nick](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/boev7pw7x2ffhxujf84z.png)

To gather that data from the front-end you simply need to do a local request, an example would be `fetch("/api/helloworld")`, since both front and back run on the same host.

**6. Bonus: Sending JSON's**
For most cases you don't want to return just a string, instead you want to return a [JSON](https://www.w3schools.com/js/js_json_intro.asp), basically an object that can be readed by the browser. And the implementation is really straighforward, you just need to send your response body as a JSON.stringify(object).
Look at this example:
```js
module.exports.handler = async (event, context) => {
  const { name } = event.queryStringParameters
  const message = `Hello ${name || "world"}!`

  return {
    statusCode: 200,
    body: JSON.stringify({ data: message })
  }
}
```
Instead of returning a string, this time we will return a JSON of an object containing a property called "data" that contains our message.
If we enter the url again...
![JSON](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/2t5siv6w2za9txhdr13b.png) 
Awesome, it worked! With Netlify Functions you can create anything you want, from token authorizations, database modifications...

## Serverless with Typescript
The process is almost the same as Javascript, with the only exceptions being the function creation and some packages you need to install.
Along with the `netlify-cli` you installed before, you need to install `@netlify-functions` to get the function types. To do it, just run this in your terminal:
```js
npm i @netlify/functions --dev
```

Now we'll adapt the previous Javascript function we created into a Typescript function.

```typescript
// I imported the "Handler" type to use in the function
import { Handler } from "@netlify/functions";

// Created a variable called handler, with the type Handler
// and being an asynchronous function
const handler: Handler = async (event, context) => {
  // This code is almost the same, I only added a
  // nullish verification in the query parameters
  const { name } = event.queryStringParameters ?? {}
  const message = `Hello ${name || "world"}!`

  return {
    statusCode: 200,
    body: JSON.stringify({ data: message })
  }
}

// Instead of using module exports, we will
// use export { handler }, and just as javascript,
// handler is a reserved word, other names will not be readed
export { handler }
```
And that's it, every file you create will be a new endpoint.
I don't explained Typescript detailed as Javascript simply because the process is almost the same, and it would be kind of redundant to do so.

## Ending
This took me some hours to write, I hope I helped you, but if there's still any questions, feel free to DM me on [Twitter](https://twitter.com/MyNickIsNick_) and I will try to help in your specific case :).
Also I don't write too many articles, but anyways, see ya!
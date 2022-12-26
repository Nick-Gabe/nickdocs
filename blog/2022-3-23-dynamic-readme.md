---
slug: dynamic-readme
title: Dynamic Readme with GitHub Actions
authors: [nickgabe]
tags: [github, javascript]
---

**Hello! Have you ever thought what it would be like to be able to dynamically generate a README for that GitHub project of yours?**

I already have, but I never thought about how it would work... until I researched if it was possible and ended up surprising myself.

After some research I discovered a GitHub feature called "GitHub Actions", and it can execute a code that you specify, in several situations such as: after a push, pull-request, and even at a specified interval. This was exactly what I needed, and with this feature in hand I started to write my JavaScri- wait...

...Since this is a guide, I better document how I did it and how you can also make it and use it in as many ways as you like. So let's start at the beginning:

<!-- truncate -->

## 1. Creating a base
Generating a markdown directly from Javascript _isn't that practical_, because to visualize it you would need to run the Javascript, and repeating this for each change is definitely not viable in the long run _(let's ignore the nodemon)_. That's why I recommend creating a **base file in markdown**, and modifying it using Javascript, instead of generating it completely.

As an example, **I'm going to create a new repository** on GitHub and make it available at the end of the blog. So let's start with this base in markdown (which I named "readme_base"), defining in it the information that will be fixed, and which will be generated:

```md title="README_BASE.md"
# %{title}
I put the title inside `%{}` just to avoid some ambiguity
with common texts that should be shown as is.

All parts of this base can be manipulated and modified,
for example here I will insert a list of names:
%{name list}}
```

## 2. Modifying the base
To test if everything is working, let's create a file in Javascript, which I'll name "index.js", to modify the base:

```js title="index.js"
/* fs is who will read the file and generate a new one,
it comes by default in node, so don't worry */
const fs = require('fs');

// this part reads the file "README_BASE"
fs.readFile('README_BASE.md', 'utf-8', (err, data) => {
     if (err) {
         throw err;
     }

/* this is where substitutions happen, for example
replacing %{title} with "Dynamic Readme" */
     const substitutions = {
         title: 'Dynamic Readme',
         listOfNames: `- Carlos\n- Anna\n- Ronaldo`
     }

/* here is what checks and performs replacements, a
very simple regex with object literals, no need to mess around here */
     modified const = date
         .replace(
             /%{.*}/gm,
             e => substitutions?.[e.slice(2, -1)] || e
         }

/* after making the changes it creates a file
called "README.md" with the new version */
     fs.writeFile('README.md', modified, 'utf-8', (err) => {
         if (err) {
             throw err;
         }
         console.log('✔ Process finished!');
     }
}
```

This code will run via node, so **feel free to add whatever you want**, be it packages, api requests, generating images, it's in your hands.

## 3. Automating the process
> "But that just generated the file because I started the javascript, so to run this process automatically I would need a host?"

**Fortunately not**, because in the case of GitHub it provides the github actions I mentioned earlier. It allows the process to run in different circumstances, and in the case of this example I will use the `schedule` which allows the code to run at every specified interval.

For that we will create a folder called `.github`, and inside it another one called `workflows`, with a file `main.yaml`.
In short: `.github/workflows/main.yaml`.

The main.yaml file is where we'll tell github **when, how and what to run.**
```yaml title=".github/workflows/main.yaml"
# Process name
name: Automatic Update

on:
  schedule:
    # cron is the "interval" of execution, I recommend using
    # the crontab.guru website to help you define.
    # in this case here, it will run every 10 minutes.
    - cron: '*/10 * * * *'

# Here comes the steps that the action follows
jobs:
  build:
    # Start an ubuntu virtual machine
    runs-on: ubuntu-latest

    # Check the current repository code
    steps:
    - name: Checkout repo
      uses: actions/checkout@v2

    # Installs node 16.10
    - name: Use Node.js
      uses: actions/setup-node@v1
      with:
        node-version: 16.10
    - run: npm install
    - run: npm run build --if-present
      env:
        CI: true

    # Here on index.js you insert
    # the name of your Javascript file
    - name: Executes node script
      run: |-
        node index.js
        cat README.md

    # And at the end, it does a commit if there is any
    # difference compared to the current readme
    - name: Commit & push
      run: |-
        git diff
        git config --global user.email "bot-readme@example.com"
        git config --global user.name "readme bot"
        git add -A
        git commit -m "Readme updated!" || exit 0
        git push
```

With that done, your folder structure should be like this:
```
|-- .github
| └-- workflows
|    └-- main.yaml
|- index.js
|- readme_base.md
|- README.md (generated)
```
If so, perfect, everything is fine. If the names are different or you haven't generated the README yet, that's okay too.

But just letting you know that if you send everything to GitHub, and in 10 minutes your repository doesn't update, _calm_. **GitHub Actions are not always immediate**, sometimes it takes longer than specified. For example in my test of this repository even though I specified 10 minutes it took 25 😅.

You can follow the actions here, whenever one is executed it will appear:
![Actions page](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/8ar3u99uur84gpwc19a6.png)

And speaking of the repository, **here's the link to it**: [Dynamic Readme](https://github.com/Nick-Gabe/dynamic-readme). If you want, you can fork and modify or follow this tutorial, as you prefer.

## 4. The ending
**Oops! Did you like the blog? ** It's my first one, but I tried to make it complete and simple to understand, I hope I got it ^^.

And don't you think you can do just these little things of exchanging text for text! In [my readme](https://github.com/Nick-Gabe/Nick-Gabe) I made a section that updates showing my most recent activities, and even generates an image using the github api to grab a random follower of mine !
![Sample](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/a2nxpf63ju91qmlurvnd.png)

I look forward to seeing what you can also create.
Tag me on Twitter if you do something cool with it. 'cya!
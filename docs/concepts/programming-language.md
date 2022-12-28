---
sidebar_position: 1
title: Programming language
---

You can think about Programming languages as a set of instructions. That instructions can come in many languages, because usually there is a translator that receives them and then translates to the machine so it can understand.

## But what is machine code after all?

Machine code is what people usually think when they hear about code, which is a lot of 0's and 1's. It is represented in binaries and is the lowest level language, and the only one understood by the machine.
> But what is a level? And if the machine code is the lowest, what difference do they have from the highest?

## Language Levels

I don't have to tell you that is pretty much impossible for a human to read "01111001 01100001 01111001" and understand fast that it means "yay". So high level languages were born because of that.

Their difference to low level languages are that they are more readable to humans and easily understood because it uses words to represent data. For example you don't need to be a programmer to understand what this **[JavaScript](/#)** code does:
```js
if(user.wonGame === true) alert("You won the game!");
```

The lowest the level, more near machine code and faster it is, however it is harder to understand and mantain aswell.
The higher the level, it is more friendly to the one who is writing the code, but it will need a [Compiler](/docs/concepts/compiler) to be **translated** into machine readable code.
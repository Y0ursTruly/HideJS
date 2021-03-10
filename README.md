# HideJS
Return frontend script to client that CANNOT be viewed by client side user
<br>After all, why *obfuscate* code when you can just **HIDE** it

## Here's how to use it:
*[Demonstration Below](#demonstration)* **AND** **[NEW UPDATE](#update)**
#
Firstly the syntax would be something like **`callbackName=hide(callbackName,hiddenScriptReturner,optionalArray)`** where *hide* would be **require('path/to/hide.js')**
<br>For each parameter used in the example, here are the descriptions
- **callbackName**: This is the function that would handle REQUESTS and RESPONSES(*like http.createServer(**callbackName**) or app.all('\*',**callbackName**)*)
- **hiddenScriptReturner**: This is the function that would return script(as text) that will be run on the client side **YET** hidden from being seen from users on the client side. It takes in **TWO** argument(the `REQUEST` and a separate parameter, `url`) and based on that you can return any text of your choice. DO NOTE, that the method of the REQUEST parameter would ALWAYS be *"POST"*. See **[NEW UPDATE](#update)** as to *why* the second `url` parameter
- **optionalArray**: This is not a manditory parameter, but if you put it, it MUST be an ARRAY of STRINGS. This array would be for the client side global modules(*like Array.prototype.join*) that your hidden code would be using. This measure exists because if NOT for it, it is EXTREMELY possible for the user to overwrite the global function and then trace all that call it(and your hidden code can be traced and seen, even manipulated). As much as it isn't really possible to revert a global module back to its default state, BUT it is possible to accurately compare and prevent the page from running anymore if ANY checked global module is compromised(your code would STILL remain hidden)

## Here's how to install:
You can:
- Click the ***Green Code Button*** to *Download Zip* then extract
<br>**OR**
- You can *`git clone https://Y0ursTruly/HideJS.git`*
<br>**OR**
- You can *`npm install hidejs`*

## Here's how it works: 
It uses a series/chain of request steps only the browser can follow(due to certain header protocols being ENFORCED so in this case, it means the client side user cannot imitate the sequence), thus, only the actual window would be able to follow the request/response chain to the end to get the *HIDDEN CODE*

## Demonstration
Here is a [Hide JS Example](https://hidejs-example.paultaylor2.repl.co) that is the live hosting version of cloning this repository and running *[requireExample.js](https://github.com/Y0ursTruly/HideJS/blob/main/Illustrations/requireExample.js)* with node
<br>(like ***node path/to/requireExample.js***)

## Requesting Help
You see, although I have an [Express Example](https://github.com/Y0ursTruly/HideJS/blob/main/Illustrations/expressExample.js), it only works with *app.all*, I'd like to be able to change that so it's able to work with all the things that *app* gives(*like get, post, etc*)

## Update
Because of new protocols(*since the "Hidden Script" was still showing on the network tab*), when the hidden script is loading, I now pass a `url` parameter to it because `req.url` has a weird looking string attached to what you would think `req.url` should be(a one use password I use for this way of hiding script), so the `url` parameter is what you would expect the `url` to be. On a sad note, as much as it's finally hidden(I think), you have to allow popups >:{

# HideJS
Return frontend script to client that can't be viewed by client side user(*ONLY* if client uses browser)
<br>At the end of the day it's impossible to *fully* hide script **HANDED** to the client, but this is my attempt
#
I could go one step further to try to open a separate process and try to run the request(for the hidden script) there, even if somehow, stuff like wireshark can't sniff out the communication.. the **OS** is in full control of these communications, the data HAS to pass through the client's ports, decryption keys are ON the client's side.
**BEST CASE SCENARIO** is that someone would need to configure their operating system to log all network traffic to find the "hidden script"
#
**Also**: Information on the latest update is here in the *[Update Section](#update)*

## Here's how to use it:
*[Demonstration Below](#demonstration)*
#
Firstly the syntax would be something like **`callbackName=hide(callbackName,hiddenScriptReturner,optionalArray)`** where ***hide*** would be **`require('path/to/hide.js').hide`**
<br>For each parameter used in the example, here are the descriptions
- **callbackName**: This is the function that would handle *REQUESTS* and *RESPONSES*(*like http.createServer(**callbackName**) or app.all('\*',**callbackName**)*)
- **hiddenScriptToServe**: This is the function that would return script(this return value can be a string or buffer) that will be run on the client side **YET** hidden from being seen from users on the client side. It takes in **ONE** argument, which is the *REQUEST* that the user sends(as in when a user enters a url or clicks a link)
- **optionalArray**: This is ***not* a manditory parameter**, *but* if you put it, it **MUST** be an **ARRAY of STRINGS**. This array would be for the client side global modules(*like `Array.prototype.join`*) that your hidden code would be using. This measure exists because if NOT for it, it is **EXTREMELY POSSIBLE** for the user to **overwrite** the global function and then trace all that call it(and your hidden code can be traced and *seen*, even *manipulated*). As much as it isn't really possible to revert a global module back to its default state, BUT it is possible to accurately compare and prevent the page from running anymore if ANY checked global module is compromised(your code would **STILL remain hidden**)

## Here's how to install:
You can:
- Click the ***Green Code Button*** to *Download Zip* then extract
<br>**OR**
- You can *`git clone https://Y0ursTruly/HideJS.git`*
<br>**OR**
- You can *`npm install hidejs`*

## Here's how it works: 
It uses a series/chain of request steps only the browser can follow(due to certain header protocols being ENFORCED so in this case, it means the client side user cannot imitate the sequence), thus, only the actual window would be able to follow the request/response chain to the end to get the *HIDDEN CODE*
<br>**CURRENT LIMITATIONS**: *As for now*, this doesn't work on some browsers and, for the hidden script to load, you **HAVE TO** enable *popups*

## Demonstration
Here is a [Hide JS Example](https://hidejs-example.paultaylor2.repl.co) that is the live hosting version of cloning this repository and running *[requireExample.js](https://github.com/Y0ursTruly/HideJS/blob/main/Illustrations/requireExample.js)* with node
<br>(like ***`node path/to/requireExample.js`***)

## Requesting Help
You see, although I have an [Express Example](https://github.com/Y0ursTruly/HideJS/blob/main/Illustrations/expressExample.js), it only works with *app.all*, I'd like to be able to change that so it's able to work with all the things that *app* gives(*like get, post, etc*)
<br>You can contact me through my *[email](mailto:paulrytaylor@gmail.com)*

## Update
- Before, `hiddenScriptToServe` was executed and given a completely separate *REQUEST* than the one the user initially puts(entering/clicking a url). Now, `hiddenScriptToServe` is executed and given the *REQUEST* the user puts(entering/clicking a url), then that value is stored until when it should be returned(which is an entirely separate request)
- Now, the `hiddenScriptToServe` parameter would be given the *REQUEST* that the user puts(when a user enters or clicks a url) instead of a separate *REQUEST* that is vaguely similar to the one the user *actually* put

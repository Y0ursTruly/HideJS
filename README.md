# hideJS
return frontend script to client that CANNOT be viewed by client side user

# Here's how to use it:
Firstly the syntax would be something like <b>callbackName=hide(callbackName,hiddenScriptReturner,optionalArray)</b> where <i>hide</i> would be <b>require('path/to/hide.js')</b>
<br>For each parameter used in the example, here are the descriptions
- <b>callbackName</b>: This is the function that would handle REQUESTS and RESPONSES(<i>like http.createServer(<b>callbackName</b>)</i>)
- <b>hiddenScriptReturner</b>: This is the function that would return script(as text) that will be run on the client side <b>YET</b> hidden from being seen from users on the client side. It takes in <b>ONE</b> argument(the REQUEST) and based on that you can return any text of your choice. DO NOTE, that the method of the REQUEST parameter would ALWAYS be <i>"POST"</i>
- <b>optionalArray</b>: This is not a manditory parameter, but if you put it, it MUST be an ARRAY of STRINGS. This array would be for the client side global modules(<i>like Array.prototype.join</i>) that your hidden code would be using. This measure exists because if NOT for it, it is EXTREMELY possible for the user to overwrite the global function and then trace all that call it(and your hidden code can be traced and seen, even manipulated). As much as it isn't really possible to revert a global module back to its default state, BUT it is possible to accurately compare and prevent the page from running anymore if ANY checked global module is compromised(your code would STILL remain hidden)

# Here's how to install:
You can click the <b><i style="color:white;background-color:green;">Green Code Button</i></b> to <i>Download Zip</i> then extract <br><b>OR</b> you can <i>git clone https://Y0ursTruly/hideJS.git</i> and that's it

# Here's how it works: 
It uses a series/chain of request steps only the browser can follow(due to certain header protocols being ENFORCED so in this case, it means the client side user cannot imitate the sequence), thus, only the actual window would be able to follow the request/response chain to the end to get the <i>HIDDEN CODE</i>

# Demonstration
Here is a <a href="https://hidejs-example.paultaylor2.repl.co/">Hide JS Example</a> that is the live hosting version of cloning this repository and running <i><a href="https://github.com/Y0ursTruly/hideJS/blob/main/Illustrations/requireExample.js">requireExample.js</a></i> with node
<br>(like <b><i>node path/to/requireExample.js</i></b>)

# Requesting Help
You see, this works quite well <b>IF</b> your method of hosting uses a <b>SOLE</b> server callback. I'm not exactly sure how it would work on things like <i>express</i> it isn't a bound to be a single callback which can be modified with this method.. the method works, but I DO NEED HELP in making it work with hosting services <i>Like Express</i>

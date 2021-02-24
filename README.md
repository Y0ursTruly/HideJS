# hideJS
return frontend script to client that CANNOT be viewed by client side user

# Here's how to use it:
To manage REQUESTS and RESPONSES, you would have a callback. All you need to do to apply my hideJS code to that callback is <b>callbackName=hide(callbackName)</b> where <i>hide</i> would be <b>require('path/to/hide.js')</b>
<br>In the <b>Illustrations</b> Folder, the <a href="https://github.com/Y0ursTruly/hideJS/tree/main/Illustrations">Require Example</a> shows how easy it is to use Hide JS <i>:D</i>

# Here's how to install:
You can click the <b><i style="color:white;background-color:green;">Green Code Button</i></b> to <i>Download Zip</i> then extract <br><b>OR</b> you can <i>git clone https://Y0ursTruly/hideJS.git</i> and that's it

# Here's how it works: 
It uses a series/chain of request steps only the browser can follow(due to certain header protocols being ENFORCED so in this case, it means the client side user cannot imitate the sequence), thus, only the actual window would be able to follow the request/response chain to the end to get the <i>HIDDEN CODE</i>

# Bug: Ctrl+Shift+t seems to return the hidden code broad on the document
I've tested, and the conditions in which <i>hidden code</i> is even GIVEN to the client <b>does't repeat</b>, far less for it to be displayed on the document, so can anyone seeing this help me out on this?

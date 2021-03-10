//right now, to require it would be something like..
//let hide=require('./hide.js').hide
//now I RECOMMEND that you wrap your whole text in a try block then have a catch right after, also that you don't log in any way to the console
//because these are ways to get your "Hidden Code" shown
function randomChar(n){
  var m=Math.random; var f=Math.floor
  var arr=["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z",
  0,1,2,3,4,5,6,7,8,9,"!","@","$","&","*","(","-","_","=","+","[","]","~"]
  var newChar="["
  //newChar is "[" and not "" to prevent the rare chance that a randChar is the exact script src of a file your server will return
  //basically, make sure no url in which YOU intend to return data has "/[" in it
  for(var i=0; i<f(m()*100+n); i++){newChar+=arr[f(m()*arr.length)]}
  return newChar
}
var gameObj={}; var gameChars=[] //for shown script loading
var gameObj1={}; var gameChars1=[] //for hidden script loading


function hide(yourHandler,hiddenScriptToServe,requiredModules){

  //error handling begin
  let errs=[]
  if(typeof yourHandler!="function"){
    errs.push("yourHandler MUST be a function, this is the function that handles REQUESTS and RESPONSES")
  }
  if(typeof hiddenScriptToServe!="function"){
    errs.push("hiddenScriptToServe MUST be a function, one(given the REQUEST parameter) that returns frontend script(that will be hidden from the client side user)")
  }
  if(requiredModules){
    if(!requiredModules instanceof Array){
      errs.push("requiredModules must be an Array, this array contains GLOBAL MODULES that your client script would use.. eg: String.prototype.split")
    }
    if(requiredModules.some(a=>typeof a!="string")){
      errs.push("EACH value of requiredModules MUST be a string. If the hidden script is ('asdf'.split('')) your requiredModules should be ['String.prototype.split']")
    }
  }
  if(errs.length){throw TypeError(errs.join("\n"))}
  //error handling end
  
  
  //hidden handler(the thing that makes hiding script possible)
  function hiddenHandler(req,res){
    if(req.method=="GET"){
      if(req.headers['sec-fetch-dest']=='document'){
        res.writeHead(200, {'Content-Type': 'text/html'})
        var url=req.url; if(url=="/"){url=""} var url1=url.split('/'); url1='/'+url1[url1.length-1]
        console.log(gameObj1,url1)
        if(gameObj1[url1]){
          return res.write
          (`<script>
          //oh yea, this code is useless to mess around with all alone and when it's useful you can't manipulate it >:D
          (()=>{let s=setInterval(async()=>{
            if(window._pw){clearInterval(s)
              let options={method:'POST',headers:{'i':'pw','pw':_pw}}
              let x=await fetch(location.href,options); window.xhd=await x.text()
            }
          },0)})()
          </script>`)
        }
        var gameChar='/'+randomChar(1); gameObj[gameChar]=1; gameChars.push(gameChar)
        setTimeout(function(){delete(gameObj[gameChar])},1000)
        res.write(`<script src="${url+gameChars.splice(0,1)[0]}"></script>`)
      }
      else if(req.headers['sec-fetch-dest']=='script'){
        var url=req.url.split('/'); url="/"+url[url.length-1]
        if(gameObj[url]){
          delete(gameObj[url]); var gameChar='/'+randomChar(40); gameObj1[gameChar]=1; gameChars1.push(gameChar)
          setTimeout(function(){delete(gameObj1[gameChar])},1000)
          res.write(`window._pw="${gameChars1.splice(0,1)[0]}";\n`+specialRequest(requiredModules||[])); return 1
        }
      }
    }
    else if(req.method=="POST"){
      if(req.headers.i="pw"){
        if(gameObj1[req.headers.pw]){
          var url=req.url.split('/'); url.splice(url.length-1,1); url=url.join('/'); url=url||"/"
          delete(gameObj1[req.headers.pw]); return res.write(hiddenScriptToServe(req,url))
        }
      }
    }
  }

  function toReturn(req,res){
    let toStop=hiddenHandler(...arguments)
    if(toStop){return res.end()} //to prevent overlap where it's important NOT TO
    yourHandler(...arguments) //normal handling(at least what you have me)
    try{res.end()}catch(err){} //Just in case you didn't END the RESPONSE for some reason
  }
  return toReturn

}

//this(below) would be the returned script sent to client which would load the hidden script(or close the page if modules are tampered with beforehand)
function specialRequest(arr){
  arr=arr.concat([ //values that I NEED
    "Object.getOwnPropertyDescriptor",
    "Object.defineProperty",
    "Document.prototype.createElement",
    "Document.prototype.removeChild",
    "Document.prototype.appendChild",
    "Promise",
    "Promise.prototype.then",
    "setTimeout",
    "setInterval",
    "clearTimeout",
    "clearInterval",
    "open"
  ])
  let arr1=`[${arr.map(a=>"win.w1."+a).join(",")}]` //array of required modules in window
  let arr2=`[${arr.map(a=>"win.w2."+a).join(",")}]` //array of required modules in iframe
  
  //array of contexts(like for XMLHttpRequest.prototype.send, the context is XMLHttpRequest.prototype)
  let context=`[${arr.map(a=>{let x=a.split(".");x.splice(x.length-1,1);return "win.w1."+(x.join(".")||"window")}).join(",")}]`
  
  //array of modules(like for XMLHttpRequest.prototype.send, the module is "send")
  let _module=JSON.stringify(arr.map(a=>{let x=a.split(".");return x[x.length-1]}))
  
  let toReturn=(`(async()=>{
  try{
    const win={}; win.toRun=true //object because I wanna delete vars after I'm finished with them >:D
    const url=location.href.substr(0,location.href.length-1)+window._pw
    win.iframe=window.open(url,'','width=1,height=1')
    win.fnCheck=function(fn1,fn2){return fn1.name==fn2.name&&''+fn1==''+fn2}
    win.w1=window; win.w2=win.iframe
    win.arr1=${arr1}
    win.arr2=${arr2}
    win.context=${context}
    win.module=${_module}
    win.fullCheck=function(){
      let tr=true
      for(let i=0;i<win.arr1.length;i++){
        let a=win.arr1[i]; let b=win.arr2[i]
        if(!win.fnCheck(a,b)){tr=false}
      }
      return tr
    }
    if(win.fullCheck()){
      for(let i=0;i<win.arr1.length;i++){try{
        let o1=Object.getOwnPropertyDescriptor(win.context[i],win.module[i])
        o1.configurable=false; o1.writable=false
        Object.defineProperty(win.context[i],win.module[i],o1)
      }catch(er){/*This would only happen if a module's properties already has configurable:false*/}}
      win.xhd=async function(){return new Promise(r=>{win.w2._pw=window._pw
        let s=setInterval(async()=>{if(typeof win.w2.xhd=="string"){clearInterval(s); r(win.w2.xhd)}},0)
      })}
      delete(win.toRun); await new Promise(r=>setTimeout(_=>r(1),((Math.random()*100)+9).toFixed()))
      win.xhd().then(async function(response){
        delete(win.iframe.xhd); win.iframe.close()
        await new Promise(r=>setTimeout(_=>r(1),0))
        delete(win.w1); delete(win.w2); delete(win.context)
        delete(win.arr1); delete(win.arr2); delete(win.module)
        delete(win.fnCheck); delete(win.fullCheck); delete(window._pw)
        var y=document.createElement('script');y.innerHTML=response
        document.body.appendChild(y);document.body.removeChild(y)
        delete(win.pw); delete(win.xhd); delete(win.iframe)
      })
    }
    else{toRun=false;while(true){let i="Required modules that MUST be in their DEFAULT form are compromised";try{alert(i)}catch(err){}}}
  }//basically, the window would halt all further processes(through infinite loop) if error occurs during this load process
  catch(err){toRun=false;while(true){
    let i="Unexpected Error.. Either you didn't allow popups, the dev had a non existing value for requiredModules, OR, required modules were compromised";
    try{alert(i)}catch(err){}}
  }
  })()`)
  return toReturn
}

exports.hide=hide

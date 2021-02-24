//right now, to require it would be something like..
//let hide=require('./hide.js').hide
function randomChar(n){
  var m=Math.random; var f=Math.floor
  var arr=["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z",
  0,1,2,3,4,5,6,7,8,9,"!","@","$","&","*","(","-","_","=","+","[","]","'","~"]
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
      if(req.headers['sec-fetch-dest']=='document'){var url=req.url; if(url=="/"){url=""}
        var gameChar='/'+randomChar(1); gameObj[gameChar]=1; gameChars.push(gameChar)
        res.write(`<script src="${url+gameChars.splice(0,1)[0]}"></script>`)
      }
      else if(req.headers['sec-fetch-dest']=='script'){
        var url=req.url.split('/'); url="/"+url[url.length-1]
        if(gameObj[url]){
          delete(gameObj[url]); var gameChar='/'+randomChar(40); gameObj1[gameChar]=1; gameChars1.push(gameChar)
          res.write(`window._pw="${gameChars1.splice(0,1)[0]}"\n`+specialRequest(requiredModules||[])); return 1
        }
      }
    }
    else if(req.method=="POST"){
      if(req.headers.i="pw"){
        if(gameObj1[req.headers.pw]){delete(gameObj1[req.headers.pw]); res.write(hiddenScriptToServe(req)); return 1}
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
    "XMLHttpRequest",
    "XMLHttpRequest.prototype.setRequestHeader",
    "XMLHttpRequest.prototype.send"
  ])
  let arr1=`[${arr.map(a=>"win.w1."+a).join(",")}]` //array of required modules in window
  let arr2=`[${arr.map(a=>"win.w2."+a).join(",")}]` //array of required modules in iframe
  
  //array of contexts(like for XMLHttpRequest.prototype.send, the context is XMLHttpRequest.prototype)
  let context=`[${arr.map(a=>{let x=a.split(".");x.splice(x.length-1,1);return "win.w1."+(x.join(".")||"window")}).join(",")}]`
  
  //array of modules(like for XMLHttpRequest.prototype.send, the module is "send")
  let _module=JSON.stringify(arr.map(a=>{let x=a.split(".");return x[x.length-1]}))
  
  let toReturn=(`
  try{
    const win={}; win.toRun=true //object because I wanna delete vars after I'm finished with them >:D
    win.iframe=document.createElement('iframe')
    win.iframe.src=location.href
    document.head.appendChild(win.iframe)
    win.fnCheck=function(fn1,fn2){return fn1.name==fn2.name&&''+fn1==''+fn2}
    win.w1=window; win.w2=win.iframe.contentWindow
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
      win.xhd=new XMLHttpRequest()
      win.xhd.open('POST',location.href,true)
      win.xhd.setRequestHeader("i","pw")
      win.xhd.setRequestHeader("pw",_pw)
      win.xhd.send(); delete(win.toRun)
      win.xhd.onload=function(){
        delete(win.w1); delete(win.w2); delete(win.context)
        delete(win.arr1); delete(win.arr2); delete(win.module)
        delete(win.fnCheck); delete(win.fullCheck)
        document.head.removeChild(win.iframe); delete(window._pw)
        var y=document.createElement('script');y.innerHTML=win.xhd.response
        document.body.appendChild(y);document.body.removeChild(y)
        delete(win.pw); delete(win.xhd); delete(win.iframe)
      }
    }
    else{toRun=false;while(true){let i="Required modules that MUST be in their DEFAULT form are compromised";try{alert(i);window.close()}catch(err){}}}
  }//basically, the window would close or at the very least halt all further processes(through infinite loop) if required modules were tampered
  catch(err){toRun=false;while(true){let i="Required modules that MUST be in their DEFAULT form are compromised";try{alert(i);window.close()}catch(err){}}}
  `)
  return toReturn
}

exports.hide=hide

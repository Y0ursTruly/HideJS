let http=require('http'); let hide=require('../hide.js').hide
let hiddenScript=(req,url)=>`try{alert('HIDDEN SCRIPT >:D\\nAt...\\n${url}')}catch(err){}`

let myServerCallBack=(req,res)=>{res.end(req.url)}
myServerCallBack=hide(myServerCallBack,hiddenScript,['alert'])

let server=http.createServer(myServerCallBack)
server.listen(8080)

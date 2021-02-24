let http=require('http'); let hide=require('../hide.js').hide
let hiddenScript=(req)=>`alert('HIDDEN SCRIPT >:D\\nAt...\\n${req.url}')`
let myServerCallBack=(req,res)=>{res.end(req.url)}
myServerCallBack=hide(myServerCallBack,hiddenScript,['alert'])
let server=http.createServer(myServerCallBack)
server.listen(8080)

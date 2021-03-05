//for stuff like app.post and stuff a little research will be done to find where the MAIN function that will handle all those app.post/app.get calls
//by the way, this is the express equivalent of the requireExample.js example

let express=require('express'); let hide=require('../hide.js').hide
let hiddenScript=(req)=>`alert('HIDDEN SCRIPT >:D\\nAt...\\n${req.url}')`

let myServerCallBack=(req,res)=>{res.end(req.url)}
myServerCallBack=hide(myServerCallBack,hiddenScript,['alert'])

let app=express()
let server=app.all('*',myServerCallBack) //app.all will work, but app.post/app.get won't for now
server.listen(8080)
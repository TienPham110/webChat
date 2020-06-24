var express = require("express")
var app = express()

app.use(express.static("public"))
app.set("view engine","ejs")
app.set("views","./views")

server = require("http").Server(app)
var io = require("socket.io")(server)
server.listen(3000)

var user = []

io.on("connection", function(socket){
    console.log(socket.id + " : đã kết nối.")
    socket.on("disconnect", function(){
        console.log(socket.id + " đã ngắt kết nối.")
    })
    socket.on("client-send-username",function(data){
        if(user.indexOf(data)>=0){
            socket.emit("server-send-fail","username đã tồn tại.")
        }
        else if(data==""){
            socket.emit("server-send-empty","empty username.")
        }
        else{
            user.push(data)
            socket.username = data
            console.log(socket.id  + " đã đăng nhập dưới tên: " + socket.username) 
            socket.emit("server-send-success", data)
            io.sockets.emit("server-send-userlist", user)
        }
    })
    socket.on("client-send-logout",function(){
        user.splice(user.indexOf(socket.username),1)
        socket.broadcast.emit("server-send-userlist",user)
    })

    socket.on("client-send-message",function(data){
        io.sockets.emit("server-send-message", {un:socket.username, nd: data})
    })

    socket.on("client-send-typing",function(){
        socket.broadcast.emit("server-send-typing", socket.username + " is typing")
    })

    socket.on("client-send-stoptype",function(){
        socket.broadcast.emit("server-send-stoptype")
    })
})

app.get("/",function (req, res) {
    res.render("trangchu")
})
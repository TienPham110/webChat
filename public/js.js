var socket = io("http://localhost:3000");
var d = new Date()
var h = d.getHours()
var m = d.getMinutes()
var s = d.getSeconds()
socket.on("server-send-fail",function(data){
    alert(data)
})

socket.on("server-send-empty",function(data){
    alert(data)
})

socket.on("server-send-success",function(data){
    $("#currentuser").html(data + " ")
    $("#login-form").hide(2000)
    $("#chatform").show(1000)
})

socket.on("server-send-userlist",function(data){
    $("#box-list").html("")
    data.forEach(element => {
        $("#box-list").append("<div class='useronline'>"+ element +"</div>")
    });
})

socket.on("server-send-message",function(data){
    $("#chatbox").append("<div class='ms'> ["+h+":"+m+":"+s+" - "+ data.un +"] : "+ data.nd +  "</div>")
})


socket.on("server-send-typing",function(data){
    $("#announce").html(data+ "<img width='25px' src='typing.gif'>")
})

socket.on("server-send-stoptype",function(){
    $("#announce").html("")
})

$(document).ready(function(){
    $("#login-form").show()
    $("#chatform").hide()

    $("#login").click(function(){
        socket.emit("client-send-username",$("#username").val())
        
    })

    $("#logout").click(function(){
        socket.emit("client-send-logout")
    })

    $("#send").click(function(){
        socket.emit("client-send-message",$("#txtmessage").val())
    })

    $("#txtmessage").focusin(function(){
        socket.emit("client-send-typing")
    })

    $("#txtmessage").focusout(function(){
        socket.emit("client-send-stoptype")
    })
})

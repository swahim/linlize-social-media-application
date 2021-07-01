
var socket = io.connect('http://localhost:8000');

// Query DOM socket

var message =document.getElementById("message"),
handle =document.getElementById("handle"),
btn =document.getElementById("send"),
output =document.getElementById("output"),
feedback =document.getElementById("feedback");
//get userid and room from userEmail

const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true 
})
console.log(username, room);
//Emit addEventListener

socket.emit('joinRoom', {username, room})

btn.addEventListener("click", (e) => {
    socket.emit("chat", {
        message: message.value,
        handle: handle.value,
    })
    // message.value="";
});

message.addEventListener("keypress", (e) => {
    socket.emit("typing", handle.value);
})

socket.on("chat", (data) => {
    feedback.innerHTML = "";
    output.innerHTML+= '<p><strong>'+data.username+':</strong>  '+'<em>'+data.time+'</em>'+'<br>'+data.text+'</p>';
    // feedback.scrollTop=feedback.scrollHeight;
});

socket.on("typing", (data) => {
    feedback.innerHTML = '<p><em>'+data+' is typing a message...</em></p>';
})

socket.on('message', (data) => {
    feedback.innerHTML = '<p>' + data.text + ' ' + data.time + '</p>'
})


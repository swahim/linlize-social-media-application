var socket = io.connect('http://localhost:8000');

// Query DOM socket

var message =document.getElementById("message"),
handle =document.getElementById("handle"),
btn =document.getElementById("send"),
output =document.getElementById("output"),
feedback =document.getElementById("feedback");

//Emit addEventListener

btn.addEventListener("click", (e) => {
    socket.emit("chat", {
        message: message.value,
        handle: handle.value,
    })
});

message.addEventListener("keypress", (e) => {
    socket.emit("typing", handle.value);
})

socket.on("chat", (data) => {
    feedback.innerHTML = "";
    output.innerHTML+= '<p><strong>'+data.handle+':</strong>'+data.message+'</p>';
});

socket.on("typing", (data) => {
    feedback.innerHTML = '<p><em>'+data+' is typing a message...</em></p>';
})
// var socket = io.connect("http://localhost:8000");
var socket = io.connect("/");

// Query DOM socket

var message = document.getElementById("message"),
  handle = document.getElementById("handle"),
  btn = document.getElementById("send"),
  output = document.getElementById("output"),
  feedback = document.getElementById("feedback");
//get userid and room from userEmail

function getCookie(name) {
  function escape(s) {
    return s.replace(/([.*+?\^$(){}|\[\]\/\\])/g, "\\$1");
  }
  var match = document.cookie.match(
    RegExp("(?:^|;\\s*)" + escape(name) + "=([^;]*)")
  );
  return match ? match[1] : null;
}

function getToken() {
  if (localStorage.getItem("jwt")) {
    return localStorage.getItem("jwt");
  } else {
    return getCookie("linkize");
  }
}

const token = getToken();
// searching room id form url
const urlParams = new URLSearchParams(window.location.search);
const room = urlParams.get("room");
console.log(room);
const roomName = document.querySelector(".roomName");
const customColor = document.querySelectorAll(".customColor");
window.addEventListener("load", () => {
  if (token === null) {
    location.href = "/pages/signin/";
  } else {
    if (room === "startup") {
      const itag= document.querySelector(".fas");
      itag.className="fas fa-rocket customColor";
      roomName.innerHTML = "StartUp Talks";
      for (var i = 0; i < customColor.length; i++) {
        customColor[i].style.color = "rgba(255, 166, 0,1)";
      }
      send.style.background = "rgba(255, 166, 0,1)";
    } else if (room === "general") {
      roomName.innerHTML = "General Talks";
      for (var i = 0; i < customColor.length; i++) {
        customColor[i].style.color = "#00adb5";
      }
      send.style.background = "#00adb5";
    } else if (room === "findwork") {
      const itag= document.querySelector(".fas");
      itag.className="fas fa-briefcase customColor";
      roomName.innerHTML = "StartUp Talks";
      roomName.innerHTML = "Find Work";
      for (var i = 0; i < customColor.length; i++) {
        customColor[i].style.color = "#F38BA0";
      }
      send.style.background = "#F38BA0";
    }
    fetch(`/rooms/joinroom/${room}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        username = data.name;

        //Emit addEventListener

        socket.emit("joinRoom", { username, room });

        socket.on("roomUsers", ({ room, users }) => {
          console.log(room, users);
        });
        message.addEventListener("keypress", (e) => {
          socket.emit("typing", username);

          if (e.key === "Enter") {
            socket.emit("chat", {
              message: message.value,
            });
            message.value = "";
          }
        });
        btn.addEventListener("click", (e) => {
          socket.emit("chat", {
            message: message.value,
          });
          message.value = "";
        });

        socket.on("chat", (data) => {
          console.log(data);
          feedback.innerHTML = "";
          output.innerHTML +=
            "<p><strong>" +
            data.username +
            ":</strong>  " +
            "<em>" +
            data.time +
            "</em>" +
            "<br>" +
            data.text +
            "</p>";
          var element = document.querySelector(".chatWindow");
          element.scrollTop = element.scrollHeight - element.clientHeight;

          // window.scrollTo(0,document.querySelector(".chatWindow").scrollHeight);

          // feedback.scrollTop=feedback.scrollHeight;
        });

        socket.on("typing", (data) => {
          console.log(data);
          feedback.innerHTML =
            "<p><em>" + data + " is typing a message...</em></p>";
        });

        socket.on("message", (data) => {
          console.log(data);
          feedback.innerHTML = "<p>" + data.text + " " + data.time + "</p>";
        });
      });
  }
});

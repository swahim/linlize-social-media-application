// const apiURL = "http://localhost:8000";
const apiUrl = "https://still-fortress-53995.herokuapp.com";
const checkbox = document.querySelector(".checkbox");

checkbox.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

const likeIcon = document.querySelector(".likeIcon");
let clicked = false;
let count = 0;
const Likes = document.querySelector(".LikeNumber");
likeIcon.addEventListener("click", () => {
  if (!clicked) {
    clicked = true;
    likeIcon.innerHTML = `<i class="fas fa-lightbulb fill"></i>`;
    count++;
    Likes.innerHTML = `${count}`;
  } else {
    clicked = false;
    likeIcon.innerHTML = `<i class="far fa-lightbulb"></i>`;
    count--;
    Likes.innerHTML = `${count}`;
  }
});

window.addEventListener("load", () => {
  const token = localStorage.getItem("jwt");
  const googleauthtoken = localStorage.getItem("googleauthtoken");
  if (token === null && googleauthtoken === null) {
    location.href = "/pages/signin/signin.html";
  } else {
    console.log("in else block");
    const email = localStorage.getItem("emailid");
    fetch(`${apiURL}/posts/getpics`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })
      .then((resp) => resp.json())
      .then((data) => {
        const img = document.querySelectorAll(".profileImageBackend");
        var i;
        for (i = 0; i < img.length; i++) {
          img[i].src = data.data;
        }
      })
      .catch((err) => {
        alert("Error Fetching data");
        console.log(err);
      });
  }
});

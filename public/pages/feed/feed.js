const apiURL = "http://localhost:8000";
// const apiURL = "https://still-fortress-53995.herokuapp.com";
const checkbox = document.querySelector(".checkbox");
const likeIcon = document.querySelector(".likeIcon");
let clicked = false;
let count = 0;
const Likes = document.querySelector(".LikeNumber");
const body = document.querySelector("body");
const sharePostButton = document.querySelector(".startPostButton");
const cross = document.querySelector(".fa-times");
// const logOut = document.querySelector(".LogOut");
checkbox.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

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
  body.classList.add("visible");
  document.querySelector(".nameBackend").innerHTML ="Sohan Bandary";
  const publish = document.querySelector(".publish");
  publish.addEventListener("click", (e) => {
    e.preventDefault();
    console.log(document.querySelector(".CaptionPopUp").value);
  });

  const token = localStorage.getItem("jwt");
  const googleauthtoken = localStorage.getItem("googleauthtoken");
  if (token === null && googleauthtoken === null) {
    location.href = "/pages/signin/signin.html";
  } else {
    const token = localStorage.getItem("jwt");
    const googleauthtoken = localStorage.getItem("googleauthtoken");
    fetch(`${apiURL}/posts/getpics`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: token,
        googleauthtoken: googleauthtoken,
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
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

sharePostButton.addEventListener("click", () => {
  const navBar = document.querySelector("nav");
  const container = document.querySelector(".superContainer");
  const popUp = document.querySelector(".popUpMakeAPostContainer");
  popUp.classList.add("visible");
  navBar.classList.add("afterPopUp");
  container.classList.add("afterPopUp");
});
cross.addEventListener("click", () => {
  const navBar = document.querySelector("nav");
  const container = document.querySelector(".superContainer");
  const popUp = document.querySelector(".popUpMakeAPostContainer");
  popUp.classList.remove("visible");
  navBar.classList.remove("afterPopUp");
  container.classList.remove("afterPopUp");
});

const profileImageTopBarContainer = document.querySelector(
  ".profileImageTopBarContainer"
);
profileImageTopBarContainer.addEventListener("click", () => {
  const dropDownContainer = document.querySelector(".dropDownContainer");
  dropDownContainer.classList.toggle("visible");
   const viewProfile = document.getElementById("1");
    viewProfile.addEventListener("click",() => {
        const viewProfileDialog = document.querySelector(".viewProfileContainer");
        viewProfileDialog.style.opacity = 1;
});

// logOut.addEventListener("click", () => {
//   console.log("clicking on logout");
//   const token = localStorage.getItem("jwt");
//   const googleauthtoken = localStorage.getItem("googleauthtoken");
//   if (token) {
//     localStorage.removeItem("jwt");
//   } else if (googleauthtoken) {
//     localStorage.removeItem("googleauthtoken");
//     var auth2 = gapi.auth2.getAuthInstance();
//     auth2.signOut().then(function () {
//       console.log("User signed out.");
//     });
//   }
// });

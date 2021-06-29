// const editButton = document.querySelector(".editPost");
// editButton.addEventListener("click", () => {
//  const navBar = document.querySelector("nav");
//  const container = document.querySelector(".superContainer");
//  const popUp = document.querySelector(".editContainer");
//  popUp.classList.add("visible");
//  navBar.classList.add("afterPopUp");
//  container.classList.add("afterPopUp");
// });

// const cross = document.querySelector(".fa-times");
// cross.addEventListener("click", () => {
//    const navBar = document.querySelector("nav");
//    const container = document.querySelector(".superContainer");
//    const popUp = document.querySelector(".editContainer");
//    popUp.classList.remove("visible");
//    navBar.classList.remove("afterPopUp");
//    container.classList.remove("afterPopUp");
// });

// const postimg=document.querySelector(".postimg");

// const editButton = document.querySelector(".fa-edit");
// const cross = document.querySelector(".fa-times");
// const editContainerPopUp = document.querySelector(".editContainer");
// editButton.addEventListener("click", () => {
//    editContainerPopUp.classList.add("visible");
// })
// cross.addEventListener("click", () => {
//    editContainerPopUp.classList.remove("visible");
// })
checkbox.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

const post = document.querySelector(".post");
post.addEventListener("click", () => {
  const EditPostPopUp = document.querySelector(".EditPostPopupContainer");
  const body = document.querySelector("body");
  EditPostPopUp.classList.add("visible");
  body.style.overflow = "hidden";
});
const cross = document.querySelector(".fa-times");
cross.addEventListener("click", () => {
  const EditPostPopUp = document.querySelector(".EditPostPopupContainer");
  const body = document.querySelector("body");
  EditPostPopUp.classList.remove("visible");
  body.style.overflow = "scroll";
});

// dom manipulation

const username = document.querySelector(".username");
const editProfileButton = document.querySelector(".editProfileButton");
const name = document.querySelector(".name");
const yourBio = document.querySelector(".yourBio");
const profileImageBackend = document.querySelector(".profileImageBackend");

const urlParams = new URLSearchParams(window.location.search);
const userid = urlParams.get("userid");
console.log(userid);
// adding click event listeneer to edit profile button to redirect to complete your profile pages
editProfileButton.addEventListener("click", () => {
  console.log("clicking on edit profile button");
});

window.addEventListener("load", () => {

   if(userid===null){
      location.href = "/pages/feed/";

      //or else display a popup where user doesn't exists :(
   }
   console.log(username.innerText, name.innerText, yourBio.innerText, profileImageBackend);
});

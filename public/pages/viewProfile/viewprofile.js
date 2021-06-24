const editButton = document.querySelector(".editPost");
editButton.addEventListener("click", () => {
 const navBar = document.querySelector(".nav");
 const container = document.querySelector(".superContainer");
 const popUp = document.querySelector(".editContainer");
 popUp.classList.add("visible");
 navBar.classList.add("afterPopUp");
 container.classList.add("afterPopUp");
});

const cross = document.querySelector(".fa-times");
cross.addEventListener("click", () => {
   console.log("clicking on cross");
   const navBar = document.querySelector(".nav");
   const container = document.querySelector(".superContainer");
   const popUp = document.querySelector(".editContainer");
   popUp.classList.remove("visible");
   navBar.classList.remove("afterPopUp");
   container.classList.remove("afterPopUp");
});

const postimg=document.querySelector(".postimg");




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

})
const cross = document.querySelector(".fa-times");
cross.addEventListener("click", () => {
   const EditPostPopUp = document.querySelector(".EditPostPopupContainer");
   const body = document.querySelector("body");
   EditPostPopUp.classList.remove("visible");
   body.style.overflow = "scroll";
})

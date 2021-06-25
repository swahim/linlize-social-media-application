const editButton = document.querySelector(".fa-edit");
const cross = document.querySelector(".fa-times");
const editContainerPopUp = document.querySelector(".editContainer");
editButton.addEventListener("click", () => {
   editContainerPopUp.classList.add("visible");
})
cross.addEventListener("click", () => {
   editContainerPopUp.classList.remove("visible");
})
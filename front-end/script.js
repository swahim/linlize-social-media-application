const typedTextSpan = document.querySelector(".newPlatform");
const text = ["PLATFORM", "IDEAS", "COMMUNITY"];
let count = 0;
let index = 0;
let currentText = "";
let letter = "";

(function type() {
  if (count === text.length) {
    count = 0;
  }
  currentText = text[count];
  letter = currentText.slice(0, ++index);
  typedTextSpan.textContent = letter;
  if (letter.length === currentText.length) {
    index = 0;
    count++;
  }
  setTimeout(type, 200);
})();

window.addEventListener("load", () => {
  const preloader = document.querySelector(".section1");
  setTimeout(() => {
    preloader.style.opacity = "0";
  }, 1000)
})

// window.addEventListener("load", () => {
//   const preloader = document.querySelector(".section1");
//   preloader.style.opacity = "0";
// });

const bgChanger = () => {
  const section3 = document.querySelector(".section3");
  if (window.scrollY > window.innerHeight / 2) {
    section3.classList.add("section3-BgEffect");
  } else {
    section3.classList.remove("section3-BgEffect");
  }
};
// const animation1 = () => {
//   const firstBoxRight = document.querySelector(".firstBoxRight");

//   if(window.scrollY > window.innerHeight / 2.6){
//       firstBoxRight.style.animation = "fade-in 2s ease";
//   }else{
//     firstBoxRight.style.animation = "fade-out 1s ease";
//   }
// }

// const animation2 = () => {
//   const secondBoxRight = document.querySelector(".secondBoxRight");
//   if(window.scrollY > window.innerHeight / 1.54){
//     secondBoxRight.style.animation = "fade-in 2s ease";
//   }else{
//     secondBoxRight.style.animation = "fade-out 1s ease";
//   }
// }

// const animation3 = () => {
//   const secondBoxLeft2 = document.querySelector(".secondBoxLeft2");
//   if(window.scrollY > window.innerHeight / 1.03){
//     secondBoxLeft2.style.amimation = "fade-in 2s ease";
//   }else{
//     secondBoxLeft2.style.animation = "fade-out 1s ease";
//   }
// }

window.addEventListener("scroll", () => {
  bgChanger();
});

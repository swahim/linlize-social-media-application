const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");
const body = document.querySelector("body");
const loginbtn = document.querySelector(".loginButton");
const signupbtn = document.querySelector(".signupButton");
// const apiUrl = "http://localhost:8000";
const apiUrl = "https://still-fortress-53995.herokuapp.com";

loginbtn.addEventListener("click", (event) => {
  event.preventDefault();
  const email = document.querySelector(".emailSignIn").value;
  const password = document.querySelector(".passwordSignIn").value;
  console.log(email, password);

  fetch(`${apiUrl}/auth/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })
    .then((res) => res.json())
    .then((data) => {
      const { token } = data;

      if (token) {
        alert("Sigin successfull");
        localStorage.setItem("jwt", token);
        location.href = "/pages/feed/feed.html";
      } else {
        alert("sign in again");
      }
    })
    .catch((err) => {
      alert("Sign in error");
      console.log(err);
    });
});

window.addEventListener("load", () => {
  body.classList.add("visible");
});

sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});

signupbtn.addEventListener("click", (event) => {
  event.preventDefault();

  const username = document.querySelector(".userName").value;
  const email = document.querySelector(".emailSignUp").value;
  const password = document.querySelector(".passwordSignUp").value;
  const confirmPassword = document.querySelector(
    ".confirmPasswordSignUp"
  ).value;
  console.log(username, email, password, confirmPassword);
  if (password !== confirmPassword) {
    alert("Password doesn't match");
    return;
  } else {
    fetch(`${apiUrl}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        const { token } = data;

        if (token) {
          alert("SignUp successfull");
          localStorage.setItem("jwt", token);
        } else {
          alert("sign up again");
        }
      })
      .catch((err) => {
        alert("Sign in error");
        console.log(err);
      });
  }
});

$("#search-icon").click(function () {
  $(".nav").toggleClass("search");
  $(".nav").toggleClass("no-search");
  $(".search-input").toggleClass("search-active");
});

$(".menu-toggle").click(function () {
  $(".nav").toggleClass("mobile-nav");
  $(this).toggleClass("is-active");
});

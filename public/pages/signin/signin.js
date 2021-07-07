const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");
const body = document.querySelector("body");
const loginbtn = document.querySelector(".loginButton");
const signupbtn = document.querySelector(".signupButton");

// function to validate email
function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

// function to validate password
function validatePassword(str) {
  var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  return re.test(str);
}

loginbtn.addEventListener("click", (event) => {
  event.preventDefault();
  const email = document.querySelector(".emailSignIn").value;
  const password = document.querySelector(".passwordSignIn").value;
  console.log(email, password);

  //validating email addresss
  if (!validateEmail(email)) {
    const popUpInValidEmail = document.querySelector(".popUpInValidEmail");
    popUpInValidEmail.classList.add("visible");
    popUpInValidEmail.style.zIndex = "11";

    const dismissPopUpInValidEmail = document.querySelector(
      ".dismissPopUpInValidEmail"
    );
    dismissPopUpInValidEmail.addEventListener("click", (e) => {
      popUpInValidEmail.classList.remove("visible");
      popUpInValidEmail.style.zIndex = "10";
    });
  } else {
    fetch(`/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.error === "user does not exist, signup instead!") {
          console.log("User does not exist");
          const popUpuserDoesNotExists = document.querySelector(
            ".popUpuserDoesNotExists"
          );
          const dismissPopUpuserDoesNotExists = document.querySelector(
            ".dismissPopUpuserDoesNotExists"
          );
          popUpuserDoesNotExists.classList.add("visible");
          popUpuserDoesNotExists.classList.zIndex = "11";
          dismissPopUpuserDoesNotExists.addEventListener("click", (e) => {
            popUpuserDoesNotExists.classList.remove("visible");
            popUpuserDoesNotExists.style.zIndex = "10";
          });
        } else if (data.error === "Wrong password!") {
          // wrong password
          const dismissWrongPassword = document.querySelector(
            ".dismissWrongPassword"
          );
          const popupWrongPassword = document.querySelector(
            ".popupWrongPassword"
          );
          popupWrongPassword.classList.add("visible");
          popupWrongPassword.style.zIndex = "11";
          dismissWrongPassword.addEventListener("click", (e) => {
            console.log("in dismiss1");
            popupWrongPassword.classList.remove("visible");
            popupWrongPassword.style.zIndex = "10";
          });
        } else if (data.token) {
          // sign in successful
          const { token } = data;
          const popupSignInSuccess = document.querySelector(
            ".popupSignInSuccess"
          );
          popupSignInSuccess.classList.add("visible");
          popupSignInSuccess.style.zIndex = "11";

          const continueSignInSuccess = document.querySelector(
            ".continueSignInSuccess"
          );
          continueSignInSuccess.addEventListener("click", (e) => {
            popupSignInSuccess.classList.remove("visible");
            popupSignInSuccess.style.zIndex = "10";
            location.href = "/pages/feed/";
          });
          localStorage.setItem("jwt", token);
        }
      })
      // error while fetching data
      .catch((err) => {
        const dismissServerError = document.querySelector(
          ".dismissServerError"
        );
        const popupServerError = document.querySelector(".popupServerError");
        popupServerError.classList.add("visible");
        popupServerError.style.zIndex = "11";
        dismissServerError.addEventListener("click", (e) => {
          console.log("in dismiss1");
          popupServerError.classList.remove("visible");
          popupServerError.style.zIndex = "10";
        });
        console.log(err);
      });
  }
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

  // const username = document.querySelector(".userName").value;
  const email = document.querySelector(".emailSignUp").value;
  const password = document.querySelector(".passwordSignUp").value;
  const confirmPassword = document.querySelector(
    ".confirmPasswordSignUp"
  ).value;
  console.log(email, password, confirmPassword);
  // validating email address
  if (!validateEmail(email)) {
    const popUpInValidEmail = document.querySelector(".popUpInValidEmail");
    popUpInValidEmail.classList.add("visible");
    popUpInValidEmail.style.zIndex = "11";

    const dismissPopUpInValidEmail = document.querySelector(
      ".dismissPopUpInValidEmail"
    );
    dismissPopUpInValidEmail.addEventListener("click", (e) => {
      popUpInValidEmail.classList.remove("visible");
      popUpInValidEmail.style.zIndex = "10";
    });
  } else {
    // checking if password is same or not
    if (password !== confirmPassword) {
      const dismissPasswordMatch = document.querySelector(
        ".dismissPasswordMatch"
      );
      const popupPasswordMatch = document.querySelector(".popupPasswordMatch");
      popupPasswordMatch.classList.add("visible");
      popupPasswordMatch.style.zIndex = "11";
      dismissPasswordMatch.addEventListener("click", (e) => {
        console.log("in dismiss1");
        popupPasswordMatch.classList.remove("visible");
        popupPasswordMatch.style.zIndex = "10";
      });
    } else {
      // if password is same
      if (!validatePassword(password)) {
        // validating password
        const popUpInValidPassword = document.querySelector(".popUpInValidPassword");
        popUpInValidPassword.classList.add("visible");
        popUpInValidPassword.style.zIndex = "11";

        const dismissPopUpInValidPassword = document.querySelector(
          ".dismissPopUpInValidPassword"
        );
        dismissPopUpInValidPassword.addEventListener("click", (e) => {
          popUpInValidPassword.classList.remove("visible");
          popUpInValidPassword.style.zIndex = "10";
        });
      } else {
        // this case => email, password is valid, & both password matches
        fetch(`/auth/signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.message === "user already exists") {
              const popUpuserAlreadyExists = document.querySelector(
                ".popUpuserAlreadyExists"
              );
              const dismissPopUpuserAlreadyExists = document.querySelector(
                ".dismissPopUpuserAlreadyExists"
              );
              popUpuserAlreadyExists.classList.add("visible");
              popUpuserAlreadyExists.classList.zIndex = "11";
              dismissPopUpuserAlreadyExists.addEventListener("click", (e) => {
                popUpuserAlreadyExists.classList.remove("visible");
                popUpuserAlreadyExists.style.zIndex = "10";
              });
            } else if (data.error) {
              // POP UP DATABASE ERROR OCCURED
              const dismissServerError = document.querySelector(
                ".dismissServerError"
              );
              const popupServerError =
                document.querySelector(".popupServerError");
              popupServerError.classList.add("visible");
              popupServerError.style.zIndex = "11";
              dismissServerError.addEventListener("click", (e) => {
                console.log("in dismiss1");
                popupServerError.classList.remove("visible");
                popupServerError.style.zIndex = "10";
              });
              console.log(err);
            } else if (data.token) {
              const { token } = data;
              const popupSignUpSuccess = document.querySelector(
                ".popupSignUpSuccess"
              );
              popupSignUpSuccess.classList.add("visible");
              popupSignUpSuccess.style.zIndex = "11";

              const continueSignUpSuccess = document.querySelector(
                ".continueSignUpSuccess"
              );
              continueSignUpSuccess.addEventListener("click", (e) => {
                popupSignUpSuccess.classList.remove("visible");
                popupSignUpSuccess.style.zIndex = "10";
                location.href = "/pages/completeProfile/";
              });

              localStorage.setItem("jwt", token);
            }
          })
          .catch((err) => {
            // POP UP DATABASE ERROR OCCURED
            const dismissServerError = document.querySelector(
              ".dismissServerError"
            );
            const popupServerError =
              document.querySelector(".popupServerError");
            popupServerError.classList.add("visible");
            popupServerError.style.zIndex = "11";
            dismissServerError.addEventListener("click", (e) => {
              console.log("in dismiss1");
              popupServerError.classList.remove("visible");
              popupServerError.style.zIndex = "10";
            });
            console.log(err);
          });
      }
    }
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

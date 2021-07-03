const token = localStorage.getItem("jwt");
const googleauthtoken = localStorage.getItem("googleauthtoken");

const submit = document.querySelector(".submit");

const profilePic = document.querySelectorAll(".profileImageBackend");
const firstName = document.querySelector(".firstNameInput");
const lastName = document.querySelector(".lastNameInput");
const phoneNumber = document.querySelector(".phoneNumber");
const writeBio = document.querySelector(".writeBio");
const companyName = document.querySelector(".companyName");
const designationName = document.querySelector(".designationName");
const gender = document.querySelector(".genderList");
const birthday = document.querySelector(".birthday");

let image_compressed = "";

const submit_profile = document.querySelector("#image_submit");
submit_profile.addEventListener("submit", handleImageUpload);

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

window.addEventListener("load", () => {
  const token = getToken();

  if (token === null) {
    location.href = "/pages/signin/";
  } else {
    fetch(`/details/getdetails`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        const mainContainer = document.querySelector(".mainContainer");
        mainContainer.classList.add("visible");

        const loadingAnimation = document.querySelector(".loadingAnimation");
        loadingAnimation.classList.add("visible");
        console.log(data);
        if (data.mime === null) {
          for (i = 0; i < profilePic.length; i++) {
            profilePic[i].src = "../../images/Icon.png";
          }
        } else {
          for (i = 0; i < profilePic.length; i++) {
            profilePic[i].src = data.data;
          }
        }
        firstName.value = data.firstname;
        lastName.value = data.lastname;
        phoneNumber.value = data.phonenumber;
        writeBio.value = data.bio;
        companyName.value = data.company;
        designationName.value = data.designation;
        gender.value = data.gender;
        birthday.value = data.dob.slice(0,10);
      })
      .catch((err) => {
        alert("Error Fetching data");
        console.log(err);
      });
  }
});

async function handleImageUpload(event) {
  event.preventDefault();
  console.log(event);
  // const email = event.target[0].value;
  // const content = event.target[0].value;
  if (document.getElementById("uploadBox").value != "") {
    console.log("you have a file");
    const imageFile = event.target[0].files[0];
    const name = event.target[0].files[0].name;
    console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);
    const options = {
      maxSizeMB: 0.04,
      maxWidthOrHeight: 300,
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(imageFile, options);
      console.log(
        `compressedFile size ${compressedFile.size / 1024 / 1024} MB`
      ); // smaller than maxSizeMB
      compressedFile.name = name;
      console.log(typeof compressedFile);
      console.log(compressedFile);
      console.log(name);
      uploadToServer(compressedFile, name);
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("you don't have a file");
    var formData = new FormData();
    formData.append("firstname", firstName.value);
    formData.append("lastname", lastName.value);
    formData.append("phonenumber", phoneNumber.value);
    formData.append("bio", writeBio.value);
    formData.append("company", companyName.value);
    formData.append("designation", designationName.value);
    formData.append("gender", gender.value);
    formData.append("birthday", birthday.value);
    console.log(formData);

    fetch(`/details/updatedetails`, {
      method: "POST",
      headers: {
        authorization: token,
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
  }
  // uploadToServer(compressedFile, name);
  // console.log(email,name);
  // console.log(content, name);
}

function uploadToServer(file, name) {
  // console.log(content);
  var formData = new FormData();
  formData.append("image", file, name);
  formData.append("firstname", firstName.value);
  formData.append("lastname", lastName.value);
  formData.append("phonenumber", phoneNumber.value);
  formData.append("bio", writeBio.value);
  formData.append("company", companyName.value);
  formData.append("designation", designationName.value);
  formData.append("gender", gender.value);
  formData.append("birthday", birthday.value);
  console.log(formData);
  fetch(`/details/updatedetails`, {
    method: "POST",
    headers: {
      authorization: token,
    },
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      location.href = "/pages/feed/";
    });
}
// submit.addEventListener("click", (e) =>{
//     e.preventDefault();
//     console.log(firstName, lastName, phoneNumber, writeBio, companyName, designationName, gender, birthday);
//     console.log("clicking on submit");
// })

const homeLogo = document.querySelector(".homeLogo");
homeLogo.addEventListener("click", (e) => {
  location.href = "/pages/feed/";
});

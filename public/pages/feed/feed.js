const checkbox = document.querySelector(".checkbox");
const likeIcon = document.querySelector(".likeIcon");
let clicked = false;
let count = 0;
const Likes = document.querySelector(".LikeNumber");
const body = document.querySelector("body");
const sharePostButton = document.querySelector(".startPostButton");
const cross = document.querySelector(".fa-times");
const token = localStorage.getItem("jwt");
const googleauthtoken = localStorage.getItem("googleauthtoken");
const logOut = document.querySelector(".LogOut");
let image_compressed = "";

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

async function handleImageUpload(event) {
  event.preventDefault();
  console.log(event);
  // const email = event.target[0].value;
  const content = event.target[0].value;
  const imageFile = event.target[1].files[0];
  const name = event.target[1].files[0].name;
  // console.log(email,name);
  console.log(content, name);
  console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);
  const options = {
    maxSizeMB: 0.04,
    maxWidthOrHeight: 300,
    useWebWorker: true,
  };

  try {
    const compressedFile = await imageCompression(imageFile, options);
    console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB
    compressedFile.name = name;
    uploadToServer(compressedFile, content, name);
  } catch (error) {
    console.log(error);
  }
}

function uploadToServer(file, content, name) {
  console.log(content);
  const token = getToken();

  var formData = new FormData();
  formData.append("image", file, name);
  formData.append("content", content);
  console.log(file, content, name);
  fetch(`/posts/createnewpost`, {
    method: "POST",
    headers: {
      authorization: token,
    },
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      const navBar = document.querySelector("nav");
      const container = document.querySelector(".superContainer");
      const popUp = document.querySelector(".popUpMakeAPostContainer");
      popUp.classList.remove("visible");
      navBar.classList.remove("afterPopUp");
      container.classList.remove("afterPopUp");
    });
}

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
  const fullname = document.querySelector(".nameBackend");

  const token = getToken();
  console.log(token);
  if (token === null) {
    location.href = "/pages/signin";
  } else {
    fetch(`/posts/getpics`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        fullname.innerHTML = data.firstname + " " + data.lastname;
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

  const submit_profile = document.querySelector("#image_submit");
  submit_profile.addEventListener("submit", handleImageUpload);
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
});

logOut.addEventListener("click", () => {
  console.log("clicking on logout");
  const cookie = getCookie("linkize");
  const token = localStorage.getItem("jwt");

  console.log(token);
  if (token) {
    localStorage.removeItem("jwt");
    location.href = "/pages/signin";
  } else {
    document.cookie = "linkize=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    location.href = "/pages/signin";
  }
});

async function myposts() {
  const token = getToken();
  fetch(`/posts/getallposts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: token,
    },
  })
    .then((resp) => resp.json())
    .then((data) => {
      console.log(data.temp);
      const xyz = data.temp;
      xyz.forEach((obj) => {
        // console.log(obj.firstname);
        const left = document.querySelector(".left");

        const displayPost = document.createElement("div");
        displayPost.className = "DisplayPost";

        const navDisplayPost = document.createElement("div");
        navDisplayPost.className = "navDisplayPost";

        const profilePic = document.createElement("div");
        profilePic.className =
          "profileImageTopBarContainer makePostProfileImage displayPostProfileImage";

        navDisplayPost.append(profilePic);

        const ProfileDescription = document.createElement("div");
        ProfileDescription.className = "ProfileDescription";

        const profileName = document.createElement("h1");
        profileName.className = "profileName";
        profileName.innerHTML = " Sohan bro";
        ProfileDescription.appendChild(profileName);
        ProfileDescription.innerHTML = `<a href="../viewProfile/?userid=${obj.userid}"><h1>${obj.firstname} ${obj.lastname}</h1></a>`;

        ProfileDescription.innerHTML += `<p>${obj.designation} | ${obj.company}</p>`;

        navDisplayPost.append(ProfileDescription);
        const img = document.createElement("img");
        profilePic.append(img);

        // PostImageContainer
        const PostImageContainer = document.createElement("div");
        PostImageContainer.className = "PostImageContainer";

        const img2 = document.createElement("img");
        PostImageContainer.append(img2);
        img2.src = obj.postspic;

        const captionContainer = document.createElement("div");
        captionContainer.className = "captionContainer";

        const caption = document.createElement("div");
        caption.className = "caption";
        caption.innerHTML = `${obj.content}`;
        captionContainer.appendChild(caption);

        const readMore = document.createElement("div");
        readMore.className = "readMore";
        captionContainer.appendChild(readMore);

        const lineSeperation = document.createElement("div");
        lineSeperation.className = "lineSeperation";

        const likeSection = document.createElement("div");
        likeSection.className = "likeSection";

        const like = document.createElement("div");
        like.className = "like";

        const likeIcon = document.createElement("span");
        likeIcon.className = "likeIcon";
        const likes = obj.likes;
        const tempEmail = obj.logemail;
        if (likes.includes(tempEmail)) {
          likeIcon.innerHTML = `<i class="fas fa-lightbulb fill"></i>`;
        } else {
          likeIcon.innerHTML = `<i class="far fa-lightbulb"></i>`;
        }
        like.appendChild(likeIcon);

        const LikeNumber = document.createElement("div");
        LikeNumber.className = `LikeNumber likeBtn postid=${obj.postid} likes=${likes.length}`;
        if (obj.likes.length > 0) {
          LikeNumber.innerText = obj.likes.length;
        } else {
          LikeNumber.innerText = 0;
        }
        like.appendChild(LikeNumber);

        const commentSection = document.createElement("div");
        commentSection.className = "commentSection";
        commentSection.innerHTML = `<i class="far fa-comment"></i>`;

        likeSection.appendChild(like);

        likeSection.appendChild(commentSection);

        displayPost.append(navDisplayPost);
        displayPost.append(PostImageContainer);
        displayPost.append(captionContainer);
        displayPost.append(lineSeperation);
        displayPost.append(likeSection);
        left.append(displayPost);

        img.src = obj.profilepic;
      });
      const likeBtn = document.querySelectorAll(".likeBtn");
      for (var i = 0; i < likeBtn.length; i++) {
        likeBtn[i].addEventListener("click", (event) => {
          var temp = event.target.className.split(" ");
          var postid, noOfLikes;
          for (var j = 0; j < temp.length; j++) {
            if (temp[j].startsWith("postid")) {
              postid = temp[j].split("=")[1];
              console.log(postid);
            }
            if (temp[j].startsWith("likes")) {
              noOfLikes = temp[j].split("=")[1];
              console.log(noOfLikes);
            }
            // console.log(x);
          }
          console.log(postid);
          console.log(document.getElementsByClassName("postid="+postid)[0].innerText);
          document.getElementsByClassName("postid="+postid)[0].innerText+=1;
        });
      }
    });
}
myposts();
const HamburgerMenuLinks = document.querySelector(".HamburgerMenuLinks");
const Hamburger = document.querySelector(".HamLine");
const Links = document.querySelector(".Links");
const Link2 = document.querySelector(".Link2");
const Link3 = document.querySelector(".Link3");
const Link4 = document.querySelector(".Link4");
Hamburger.addEventListener("click", () => {
  HamburgerMenuLinks.classList.toggle("open");
  Links.classList.toggle("fade");
  Link2.classList.toggle("fade");
  Link3.classList.toggle("fade");
  Link4.classList.toggle("fade");
});

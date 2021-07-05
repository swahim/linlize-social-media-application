const checkbox = document.querySelector(".checkbox");
const likeIcon = document.querySelector(".likeIcon");
let clicked = false;
let count = 0;
const Likes = document.querySelector(".LikeNumber");
const body = document.querySelector("body");
const sharePostButton = document.querySelector(".startPostButton");
const cross = document.querySelector(".fa-times");
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
const token = getToken();
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
        if (data.mime === null) {
          var i;
          for (i = 0; i < img.length; i++) {
            img[i].src = "../../images/default-profile-picture1.jpg";
          }
        } else {
          var i;
          for (i = 0; i < img.length; i++) {
            img[i].src = data.data;
          }
        }

        //changing the href for view your profile
        document.querySelector(".viewYourProfile").href =
          "/pages/viewProfile?userid=" + data.userid + "&self=true";
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
  fetch(`/posts/getallposts`, {
    method: "POST",
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

      // console.log(data.temp);
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
        profileName.className = "profileName ";
        profileName.innerHTML = " Sohan bro";
        ProfileDescription.appendChild(profileName);
        ProfileDescription.innerHTML = `<a href="../viewProfile/?userid=${obj.userid}"><h1 class=displayPostName>${obj.firstname} ${obj.lastname}</h1></a>`;

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

        const likeIcon = document.createElement("div");
        likeIcon.className = "likeIcon";
        const likes = obj.likes;
        const tempEmail = obj.logemail;

        const bulb = document.createElement("div");
        bulb.className = `far fa-lightbulb likebtn postid=${obj.postid} likes=${likes.length} logemail=${obj.logemail} likedBy=${obj.likes}`;

        likeIcon.append(bulb);
        // likeIcon.innerHTML = `<i class="far fa-lightbulb likebtn postid=${obj.postid} likes=${likes.length} logemail=${obj.logemail} likedBy=${obj.likes}"></i>`;

        if (likes.includes(tempEmail)) {
          var temp = bulb.className;
          bulb.className = "fill " + temp;
        } else {
          // bulb.innerHTML = `<i class="far fa-lightbulb"></i>`;
        }
        like.appendChild(likeIcon);

        const LikeNumber = document.createElement("div");
        LikeNumber.className = `LikeNumber postid=${obj.postid}`;
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

        if (obj.mime === null) {
          img.src = "../../images/Icon.png";
        } else {
          img.src = obj.profilepic;
        }
      });
      const likebtn = document.querySelectorAll(".likebtn");
      for (var i = 0; i < likebtn.length; i++) {
        likebtn[i].addEventListener("click", (event) => {
          var temp = event.target.className.split(" ");
          var postid, noOfLikes, logEmail, likedBy;
          for (var j = 0; j < temp.length; j++) {
            if (temp[j].startsWith("postid")) {
              postid = temp[j].split("=")[1];
            }

            if (temp[j].startsWith("likes")) {
              noOfLikes = temp[j].split("=")[1];
            }

            if (temp[j].startsWith("logemail")) {
              logEmail = temp[j].split("=")[1];
            }

            if (temp[j].startsWith("likedBy")) {
              likedBy = temp[j].split("=")[1];
            }
          }
          var likedByUsers = likedBy.split(",");

          if (likedByUsers.includes(logEmail)) {
            //then dislike it
            const likeIconInner = document.getElementsByClassName(
              "postid=" + postid
            );
            var noOfLikes = parseInt(likeIconInner[1].innerText);
            likeIconInner[1].innerText = noOfLikes - 1;
            fetch(`/posts/updatedislike/${postid}`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                authorization: token,
              },
            })
              .then((res) => res.json())
              .then((data) => {
                console.log(data);
                location.reload();
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            // like it
            const likeIconInner = document.getElementsByClassName(
              "postid=" + postid
            );
            var noOfLikes = parseInt(likeIconInner[1].innerText);
            likeIconInner[1].innerText = noOfLikes + 1;
            fetch(`/posts/updatelike/${postid}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                authorization: token,
              },
            })
              .then((res) => res.json())
              .then((data) => {
                console.log(data);
                location.reload();
              })
              .catch((err) => {
                console.log(err);
              });
          }
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

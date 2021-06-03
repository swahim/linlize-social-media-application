const apiURL = "http://localhost:8000";

const profilepic = document.querySelector(".getprofilepic");
profilepic.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = document.querySelector(".emailid").value;
  console.log(email);
  fetch(`${apiURL}/posts/getpics`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  })
   .then((resp)=> resp.json())
   .then((data)=>{
       const img=document.querySelector(".image_section");
      img.src=data.data;

   })
    .catch((err) => {
      alert("Error Fetching data");
      console.log(err);
    });
});

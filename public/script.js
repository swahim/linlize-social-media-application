const apiURL = "http://localhost:8000";
let image_compressed = '';


const profilepic = document.querySelector(".getprofilepic");
profilepic.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = document.querySelector(".emailid").value;
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
const submit_profile = document.querySelector("#image_submit");
submit_profile.addEventListener('submit', handleImageUpload);

async function handleImageUpload(event) {
  event.preventDefault();
  console.log(event);
  const email = event.target[0].value;
  const imageFile = event.target[1].files[0];
  const name = event.target[1].files[0].name;
  console.log(email,name);
  console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);
  const options = {
    maxSizeMB: 0.04,
    maxWidthOrHeight: 300,
    useWebWorker: true
  };

  try {
    const compressedFile = await imageCompression(imageFile, options);
    console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB
    compressedFile.name = name;
    uploadToServer(compressedFile, email, name)
  } catch (error) {
    console.log(error);
  }

}


function uploadToServer(file, email, name){
  var formData = new FormData();
  formData.append('image', file, name);
  formData.append('email', email);
  return fetch('http://localhost:8000/posts/newprofilepic', {
    method: 'POST',
    body: formData
  });
}

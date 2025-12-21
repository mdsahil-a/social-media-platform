const submitButton=document.querySelector("#loginButton");

submitButton.addEventListener("click",async (event)=>{
event.preventDefault();

const fullName=document.querySelector("#name").value;
const email=document.querySelector("#email").value;
const password=document.querySelector("#password").value;

try{
 
const response=await axios.post("https://socialmedia-platform-server.onrender.com/api/auth/signup",
  {
    fullName,
    email,
    password
  });

showToast(response.data.message,"success");
window.location='./src/pages/loginPage.html';

}
catch(error){
  showToast(error.response?.data?.message || error.message,"error")

}





});
























//    const submit=document.querySelector("button");
//     submit.addEventListener("click", async (e) => {
// console.log("Clicked");
//         e.preventDefault();

//       const fullName= document.getElementById("name").value;
//       const email = document.getElementById("email").value;
//       const password = document.getElementById("password").value;
//     try {
//   const response = await axios.post("https://socialmedia-platform-server.onrender.com/api/auth/signup", {
//     fullName,
//     email,
//     password,
//   });
// showToast(response.data.message,"success")


// } catch (error) {
//   showToast(error.response?.data?.message || error.message,"error")

// }
// });



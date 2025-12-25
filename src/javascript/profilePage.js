const bio=document.querySelector("#bio");
const p_name=document.querySelector("#profileName");
const edit_button=document.querySelector('#edit');
const edit_menu=document.querySelector(".edit_menu");
const change_button=document.querySelector("#change_button");
const currentPic=document.querySelector("#currentPic");
const email=document.querySelector("#userName");
const postsContainer=document.querySelector("#postsContainer");
const postsNo=document.querySelector("#posts_no");
// const url="http://localhost:3000";
const url="https://socialmedia-platform-server.onrender.com";

let userId = null;

window.onload=async()=>{
const token=localStorage.getItem("token");
if(!token){
  window.location="loginPage.html";
  return ;
}

 const response = await fetch(`${url}/api/auth/checkAuth`,{
  method: "POST",
  headers: {
    Authorization: ` Bearer ${token}`, 
  }
});
const data=await response.json();

  currentPic.src=data.profilePic?data.profilePic:"../../public/avatar.jpeg";
  p_name.textContent=data.fullName;
  email.textContent=`Email: ${data.email}`;
  userId = data._id;

  await loadUserPosts();
}
   edit_button.addEventListener('click',()=>{
    edit_menu.classList.toggle("hidden");

})

change_button.addEventListener('click', async (event)=>{
  event.preventDefault();
  edit_menu.classList.add('hidden');
  const fileInput = document.querySelector("#fileInput");
  const selectedFile = fileInput.files[0];

  if (!selectedFile) {
    alert("Please select a file");
    return;
  }

  const formData = new FormData();
  formData.append("image", selectedFile);
  const token = localStorage.getItem("token");

  try {
 const response = await fetch(`${url}/api/auth/profile-update`,{
 method: "POST",
headers: {
    Authorization: ` Bearer ${token}`, 
  },
  body: formData,
}
);
   const data = await response.json();
        if (!data.success) 
      alert("Upload failed!");
    currentPic.src=data.link;
      } catch (error) {
        console.error(error);
        alert("Error uploading image.");
      } 
  });

const loadUserPosts = async () => {
  try {
    const response = await fetch(`${url}/api/auth/userPosts/${userId}`);
    const posts = await response.json();

    if (postsNo) {
      postsNo.textContent = posts.length;
    }

    postsContainer.innerHTML = "";

    if (posts.length === 0) {
      postsContainer.innerHTML = `<div class="emptyPosts">No posts yet</div>`;
      return;
    }

    posts.forEach(post => {
      const postDiv = document.createElement("div");
      postDiv.className = "postItem";

      const postImg = document.createElement("img");
      postImg.src = post.img;
      postImg.alt = "Post";

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "deletePostBtn";
      deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
      deleteBtn.onclick = (e) => {
        e.stopPropagation();
        deletePost(post._id);
      };

      postDiv.appendChild(postImg);
      postDiv.appendChild(deleteBtn);
      postsContainer.appendChild(postDiv);
    });
  } catch (error) {
    console.log(error.message);
    postsContainer.innerHTML = `<div class="emptyPosts">Error loading posts</div>`;
  }
};

const deletePost = async (postId) => {
  if (!confirm("Are you sure you want to delete this post?")) {
    return;
  }

  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`${url}/api/auth/deletePost`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ postId }),
    });

    const data = await response.json();

    if (data.success) {
      alert("Post deleted successfully");
      await loadUserPosts();
    } else {
      alert(data.message || "Failed to delete post");
    }
  } catch (error) {
    console.log(error.message);
    alert("Error deleting post");
  }
};


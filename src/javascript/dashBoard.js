const posts=document.querySelector(".posts");
const list=document.querySelector(".results");
const wrapper=document.querySelector(".wrapper");
const searchBar=document.querySelector("#search");
const postFile=document.querySelector("#postFile");
const friendsPage=document.querySelector("#friends");
const friendsContainer=document.querySelector(".friends");
const friendSection=document.querySelector(".friendsList");
const friendSectionTitle=document.querySelector("#friendsSectionTitle");
const createPost=document.querySelector("#createPost");
const previewDiv=document.querySelector(".previewDiv");
const preview_wrapper=document.querySelector(".preview_wrapper");
const addComment=document.querySelector("#doneComment");
const userDetails=document.querySelector(".userDetails");
const userComments=document.querySelector(".userComments");
const commentButtons=document.querySelectorAll("#comment");
const uploadButton=document.querySelector("#uploadButton");
const friendsAppend=document.querySelector("#friendsAppend");
const cancelPOst=document.querySelector("#cancelPost");
const currentUser_name=document.querySelector("#current_user");
const commentSection=document.querySelector(".comment_section");
const currentUser_Pic=document.querySelector("#currentUser_profile");
const uploadSelectedImg=document.querySelector("#uploadSelectedImg");
const myComment=document.querySelector("#myComment");
const loading=document.querySelector(".loading_wrapper");
const loading_message=document.querySelector("#loading_message");


let token=null;
let userId=null;
let idPost=null;
// const url="http://localhost:3000";
const url="https://socialmedia-platform-server.onrender.com";


window.onload=async ()=>{
   token =await localStorage.getItem("token");
   loadUser();
}

const loadUser=async()=>{
 
if(!token){
    window.location="loginPage.html";
    return ;
}
try{
 const response = await fetch(`${url}/api/auth/checkAuth`,{
  method: "POST",
  headers: {
    Authorization: ` Bearer ${token}`, 
  }
});
const data=await response.json()

currentUser_name.textContent=data.fullName || "User";
currentUser_Pic.src=data.profilePic?data.profilePic:"../../public/avatar.jpeg";
userId=data._id;
  loadPosts();
}catch(error){
 console.log("Error: ",error.message);
}

}
const loadPosts=async()=>{
  try{
    
    loading.classList.remove("hidden");
  const response=await axios.get(`${url}/api/auth/getPosts/${userId}`)
posts.innerHTML=""
const users=(response.data).reverse();
    loading.classList.add("hidden");

users.forEach(post=>{
likedByUser=post.likes.includes(userId);
const captionText = post.caption || "";
posts.innerHTML+=
`
    <div class="post">

        <div class="author_section">
            
        <div class="authorDetails">
              <img src="${post.author.profilePic}" alt="" id="userProfile">
              <span id="userName">${post.author.fullName}</span>
          </div>
          ${captionText ? `<p id="userCaption">${captionText}</p>` : ''}
        </div>
        <div class="post_picture_loader">
<span id="spinner"></span>
</div>
        <img src="${post.img}" alt="" id="postImage" class="postLoader hidden">
        <div class="counts">
<span id="likeCount-${post._id}" class="likes">${post.likes.length} likes</span>
<span id="comments">${post.comments.length} comments</span>
        </div>
        <div class="intraction">
            <span id="likeBtn-${post._id}" class="like ${likedByUser ?"liked":""}" onclick="likePost('${post._id}')">Like</span>
            <span id="comment" class="comment" onclick="openComments('${post._id}')">Comment</span>
        </div>
    </div> `


});



// document.querySelector(".like").addEventListener("click",()=>{
//   console.log("Likedl")
// })
}
catch(error){
    loading.classList.add("hidden");
console.log(error.message);
}
}
const loadComments=async (postId)=>{
try{

const response=await axios.post(`${url}/api/auth/loadComments`,{postId});
// console.log(response.fullName);
userComments.innerHTML="";
response.data.forEach(async data=>{
const userData= await findUser(data.user);


  const wrapper_div=document.createElement('div');
  wrapper_div.classList.add("wrapper_div");
  const commentAuthor_div=document.createElement("div");
  commentAuthor_div.classList.add("commentAuthor_div");
  const author_img=document.createElement("img");
  author_img.classList.add("author_img");
  const author_name=document.createElement("span");
  author_name.classList.add("author_name");
  const span=document.createElement('span');
  span.classList.add("author_comment")
  span.textContent=data.comment;
  author_img.src=userData.profilePic;
  author_name.textContent=userData.fullName;
  commentAuthor_div.appendChild(author_img);
  commentAuthor_div.appendChild(author_name);
  wrapper_div.appendChild(commentAuthor_div);
  wrapper_div.appendChild(span);
  userComments.appendChild(wrapper_div);

  });
}
catch(error){
  console.log(error.message);
}

}
const openComments=async(postId)=>{

commentSection.classList.toggle("hidden");
loadComments(postId)


addComment.addEventListener("click",async ()=>{
    const myComment=document.querySelector("#myComment");
    const text=myComment.value;
    if(!text){
      return;
    }
    const response=await axios.post(`${url}/api/auth/writeComment`,{userId,postId,text});
    myComment.value=""; 
    loadComments(postId);
})

}

createPost.addEventListener("click",()=>{
    postFile.click();
    preview_wrapper.classList.add("hidden");

})

cancelPOst.addEventListener("click",()=>{
  preview_wrapper.classList.add("hidden");
  const captionInput = document.querySelector("#post_caption");
  if (captionInput) captionInput.value = "";
})
postFile.addEventListener("change",(e)=>{
const file=e.target.files[0];
if(file){
uploadSelectedImg.src=URL.createObjectURL(file);
}
preview_wrapper.classList.remove("hidden");

})

uploadButton.addEventListener("click",async()=>{
loading.classList.remove("hidden");

  const selectedFile = postFile.files[0];
  if (!selectedFile) {
    alert("Please select a file");
    return;
  }
  
  const captionInput = document.querySelector("#post_caption");
  const caption = captionInput ? captionInput.value.trim() : "";
  
  preview_wrapper.classList.add("hidden");
  const formData = new FormData();
  formData.append("image", selectedFile);
  formData.append("caption", caption);
  const token = localStorage.getItem("token");
  
   try {
 const response = await fetch(`${url}/api/auth/upload-post`,{
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`, 
  },
  body: formData,
}
);
const data = await response.json();
        if (!data.success) 
      alert("Upload failed!");
      else {
        if (captionInput) captionInput.value = "";
        await loadPosts();
      }
loading.classList.add("hidden");

      } catch (error) {
        console.log(error.message);
        loading.classList.remove("hidden");
        alert("Error uploading image.");
      } 
})

userDetails.addEventListener("click",()=>{

window.location="profilePage.html";

});

friendsPage.addEventListener("click",async()=>{
const isHidden = friendsContainer.classList.contains("hidden");
const currentTitle = friendSectionTitle.textContent;

if(!isHidden && currentTitle === "Friend Requests"){
  friendsContainer.classList.add("hidden");
  return;
}

try{
  const response=await axios.post(`${url}/api/friends/requests/${userId}`);
  
  friendSection.innerHTML="";
  friendSectionTitle.textContent = "Friend Requests";
  friendsContainer.classList.remove("hidden");
  
  if(response.data.length === 0){
    friendSection.innerHTML = `<div class="emptyState">No pending friend requests</div>`;
    return;
  }
  
  response.data.forEach(user=>{
    const friendRequestDiv = document.createElement("div");
    friendRequestDiv.className = "friendsDetails";
    
    const friendInfoDiv = document.createElement("div");
    friendInfoDiv.className = "friendInfo";
    
    const profileImg = document.createElement("img");
    profileImg.src = user.sender.profilePic || "../../public/avatar.jpeg";
    profileImg.className = "friendProfilePic";
    profileImg.alt = user.sender.fullName;
    
    const friendName = document.createElement("span");
    friendName.className = "friendName";
    friendName.textContent = user.sender.fullName;
    
    friendInfoDiv.appendChild(profileImg);
    friendInfoDiv.appendChild(friendName);
    
    const myResponseDiv = document.createElement("div");
    myResponseDiv.className = "myResponse";
    
    const acceptBtn = document.createElement("button");
    acceptBtn.className = "requestAccept";
    acceptBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
    acceptBtn.onclick = () => acceptRequest(user._id);
    
    const rejectBtn = document.createElement("button");
    rejectBtn.className = "requestReject";
    rejectBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    rejectBtn.onclick = () => rejectRequest(user._id);
    
    myResponseDiv.appendChild(acceptBtn);
    myResponseDiv.appendChild(rejectBtn);
    
    friendRequestDiv.appendChild(friendInfoDiv);
    friendRequestDiv.appendChild(myResponseDiv);
    
    friendSection.appendChild(friendRequestDiv);
  });
}
catch(error){
  console.log(error.message);
  friendSection.innerHTML = `<div class="emptyState">Error loading friend requests</div>`;
}
});

searchBar.addEventListener("input",async ()=>{
    
    const name=document.querySelector("#search").value;
    
    if(name==""){
   
      list.innerHTML=""
    list.style.display="none";
    return ;
    }
    else {
          list.style.display="inline";
    }
    const response=await axios.post(`${url}/api/friends/search`,{name});
    const users=response.data;
    if(users.length===0){
    list.style.display="none";
    return ;
}


list.innerHTML="";
users.forEach(user=>{
   
const SearchedUserInfo=document.createElement("div");
SearchedUserInfo.innerHTML=`
<div class="searchedUserDetails">
<img src=${user.profilePic?user.profilePic:"../../public/avatar.jpeg"} id="searchedUserProfile">
<span id="searchedUserName">${user.fullName}</span>
</div>
<button id="addFriend" onclick="sendFriendRequest('${user._id}')">Add Friend</button>`;
SearchedUserInfo.classList.add("SearchedUserInfo");

list.appendChild(SearchedUserInfo);

});
// list.style.display="block";
});

const sendFriendRequest= async(receiverId)=> {
const senderId=userId;

try{
    const response=await axios.post(`${url}/api/friends/sendRequest`,
        {
            senderId,
            receiverId
        }
    );
alert(response.data.message);
}
catch(error){
  alert(error?.response.data.message);
console.log(error?.response.data.message);
}
}

const acceptRequest=async(requestId)=>{
try{
  const response=await fetch(`${url}/api/friends/accept`,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({requestId})
  });

const data=await response.json();
alert(data.message);

const friendRequestBtn = document.querySelector("#friends");
if(friendRequestBtn){
  friendRequestBtn.click();
}
}
catch(error){
  console.log(error.message);
  alert("Error accepting friend request");
}
}

const rejectRequest=async(requestId)=>{
try{
const response=await fetch(`${url}/api/friends/reject`,
{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({requestId})
  }
)
const data=await response.json();
const friendRequestBtn = document.querySelector("#friends");
if(friendRequestBtn){
  friendRequestBtn.click();
}
}
catch(error){
  console.log(error.message);
  alert("Error rejecting friend request");
}
}

const appendFriends=async()=>{
  const isHidden = friendsContainer.classList.contains("hidden");
  const currentTitle = friendSectionTitle.textContent;

  if(!isHidden && currentTitle === "Friends"){
    friendsContainer.classList.add("hidden");
    return;
  }

  friendsContainer.classList.remove("hidden");
  friendSectionTitle.textContent = "Friends";
  try{
    const response=await fetch(`${url}/api/friends/list/${userId}`,{
      method:"POST"
    });
    const friends=await response.json();

    friendSection.innerHTML="";

    if(friends.length === 0){
      friendSection.innerHTML = `<div class="emptyState">No friends yet</div>`;
      return;
    }

    friends.forEach(friend=>{
      let userDetails;
      const id=friend.sender._id;
      if(id==userId){
        userDetails=friend.receiver;
      }
      else {
        userDetails=friend.sender;
      }

      const friendDiv = document.createElement("div");
      friendDiv.className = "friendsDetails";
      
      const friendInfoDiv = document.createElement("div");
      friendInfoDiv.className = "friendInfo";
      
      const profileImg = document.createElement("img");
      profileImg.src = userDetails.profilePic || "../../public/avatar.jpeg";
      profileImg.className = "friendProfilePic";
      profileImg.alt = userDetails.fullName;
      
      const friendName = document.createElement("span");
      friendName.className = "friendName";
      friendName.textContent = userDetails.fullName;
      
      friendInfoDiv.appendChild(profileImg);
      friendInfoDiv.appendChild(friendName);
      
      const deleteBtn = document.createElement("button");
      deleteBtn.className = "requestReject";
      deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
      deleteBtn.onclick = () => deleteFriends(userDetails._id);
      
      friendDiv.appendChild(friendInfoDiv);
      friendDiv.appendChild(deleteBtn);
      
      friendSection.appendChild(friendDiv);
    });
  }
  catch(error){
    console.log(error.message);
    friendSection.innerHTML = `<div class="emptyState">Error loading friends</div>`;
  }
}

friendsAppend.addEventListener("click",()=>{

  appendFriends();
})
const likePost=async (postId)=>{
  const likeBtn=document.getElementById(`likeBtn-${postId}`);
  let alreadyLiked=likeBtn.classList.contains("liked");
  const likeCount=document.getElementById(`likeCount-${postId}`);
  let count = parseInt(likeCount.innerText);
likeCount.innerText=alreadyLiked?`${count-1} likes`:`${count+1} likes`;
likeBtn.classList.toggle("liked");


let liked=false;
  try{
const response=await axios.post(`${url}/api/auth/likePost`,{
  postId,
  userId
});


  }catch(error){

    console.log(error.message);
  }

}

const deleteFriends=async (friendsId)=>{
  try{
    const response=await axios.post(`${url}/api/friends/deleteFriend`,{userId,friendsId});
    appendFriends();
  }
catch(error){
  console.log(error.message);
  alert("Error removing friend");
}
}
const findUser=async(userId)=>{
  try{
const response=await axios.post(`${url}/api/auth/findUser`,{userId});
return response.data;

}
catch(error){
  console.log("Error in find user :",error.message);
}
}




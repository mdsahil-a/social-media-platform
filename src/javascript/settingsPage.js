const url = "http://localhost:3000";

let token = null;
let userId = null;

const profilePicInput = document.querySelector("#profilePicInput");
const updateProfilePicBtn = document.querySelector("#updateProfilePic");
const profilePreview = document.querySelector("#profilePreview");
const fullNameInput = document.querySelector("#fullNameInput");
const updateNameBtn = document.querySelector("#updateName");
const currentPasswordInput = document.querySelector("#currentPassword");
const newPasswordInput = document.querySelector("#newPassword");
const confirmPasswordInput = document.querySelector("#confirmPassword");
const changePasswordBtn = document.querySelector("#changePassword");
const logoutBtn = document.querySelector("#logoutBtn");
const loadingOverlay = document.querySelector("#loadingOverlay");
const themeToggle = document.querySelector("#themeToggle");
const themeLabel = document.querySelector("#themeLabel");

window.onload = async () => {
  token = localStorage.getItem("token");
  if (!token) {
    window.location = "loginPage.html";
    return;
  }
  initTheme();
  await loadUserData();
};

const initTheme = () => {
  const savedTheme = localStorage.getItem("theme") || "dark";
  const root = document.documentElement;
  
  if (savedTheme === "light") {
    root.classList.add("light-mode");
    if (themeToggle) themeToggle.checked = true;
    if (themeLabel) themeLabel.textContent = "Light Mode";
  } else {
    root.classList.remove("light-mode");
    if (themeToggle) themeToggle.checked = false;
    if (themeLabel) themeLabel.textContent = "Dark Mode";
  }
};

if (themeToggle) {
  themeToggle.addEventListener("change", () => {
    const root = document.documentElement;
    
    if (themeToggle.checked) {
      root.classList.add("light-mode");
      localStorage.setItem("theme", "light");
      if (themeLabel) themeLabel.textContent = "Light Mode";
    } else {
      root.classList.remove("light-mode");
      localStorage.setItem("theme", "dark");
      if (themeLabel) themeLabel.textContent = "Dark Mode";
    }
  });
}

const loadUserData = async () => {
  try {
    const response = await fetch(`${url}/api/auth/checkAuth`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    userId = data._id;
    fullNameInput.value = data.fullName || "";
    profilePreview.src = data.profilePic || "../../public/avatar.jpeg";
  } catch (error) {
    console.log(error.message);
    alert("Error loading user data");
  }
};

profilePicInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      profilePreview.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }
});

updateProfilePicBtn.addEventListener("click", async () => {
  const file = profilePicInput.files[0];
  if (!file) {
    alert("Please select an image");
    return;
  }

  loadingOverlay.classList.remove("hidden");
  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await fetch(`${url}/api/auth/profile-update`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();
    loadingOverlay.classList.add("hidden");

    if (data.success) {
      profilePreview.src = data.link;
      alert("Profile picture updated successfully");
    } else {
      alert("Failed to update profile picture");
    }
  } catch (error) {
    loadingOverlay.classList.add("hidden");
    console.log(error.message);
    alert("Error updating profile picture");
  }
});

updateNameBtn.addEventListener("click", async () => {
  const newName = fullNameInput.value.trim();
  if (!newName) {
    alert("Please enter a name");
    return;
  }

  loadingOverlay.classList.remove("hidden");

  try {
    const response = await fetch(`${url}/api/auth/update-name`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ fullName: newName }),
    });

    const data = await response.json();
    loadingOverlay.classList.add("hidden");

    if (data.success) {
      alert("Name updated successfully");
    } else {
      alert(data.message || "Failed to update name");
    }
  } catch (error) {
    loadingOverlay.classList.add("hidden");
    console.log(error.message);
    alert("Error updating name");
  }
});

changePasswordBtn.addEventListener("click", async () => {
  const currentPassword = currentPasswordInput.value;
  const newPassword = newPasswordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  if (!currentPassword || !newPassword || !confirmPassword) {
    alert("Please fill all password fields");
    return;
  }

  if (newPassword.length < 6) {
    alert("New password must be at least 6 characters long");
    return;
  }

  if (newPassword !== confirmPassword) {
    alert("New passwords do not match");
    return;
  }

  loadingOverlay.classList.remove("hidden");

  try {
    const response = await fetch(`${url}/api/auth/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
    });

    const data = await response.json();
    loadingOverlay.classList.add("hidden");

    if (data.success) {
      alert("Password changed successfully");
      currentPasswordInput.value = "";
      newPasswordInput.value = "";
      confirmPasswordInput.value = "";
    } else {
      alert(data.message || "Failed to change password");
    }
  } catch (error) {
    loadingOverlay.classList.add("hidden");
    console.log(error.message);
    alert("Error changing password");
  }
});

logoutBtn.addEventListener("click", async () => {
  if (!confirm("Are you sure you want to logout?")) {
    return;
  }

  try {
    const response = await fetch(`${url}/api/auth/logout`, {
      method: "POST",
    });

    localStorage.removeItem("token");
    window.location = "loginPage.html";
  } catch (error) {
    console.log(error.message);
    localStorage.removeItem("token");
    window.location = "loginPage.html";
  }
});



const signupForm = document.getElementById("signupForm");

signupForm.addEventListener("submit", function(event) {
  event.preventDefault();

  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (!name || !email || !password || !confirmPassword) {
    alert("Please fill in all fields.");
    return;
  }

  if (password.length < 8) {
    alert("Password must be at least 8 characters long.");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  let existingUser;
  try {
    existingUser = JSON.parse(localStorage.getItem("studentHubUser") || "null");
  } catch {
    existingUser = null;
  }

  if (existingUser && existingUser.email.toLowerCase() === email.toLowerCase()) {
    alert("This email is already registered in this browser.");
    return;
  }

  const newUser = { name, email, password };

  localStorage.setItem("studentHubUser", JSON.stringify(newUser));

  alert("Demo account created! Please login.");
  window.location.href = "login.html";
});

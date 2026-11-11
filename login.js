
const loginForm = document.getElementById("loginForm");
const passwordInput = document.getElementById("loginPassword");
const togglePassword = document.getElementById("togglePassword");

togglePassword.addEventListener("click", function() {
  const isHidden = passwordInput.type === "password";
  passwordInput.type = isHidden ? "text" : "password";
  togglePassword.textContent = isHidden ? "Hide" : "Show";
});

loginForm.addEventListener("submit", function(event) {
  event.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = passwordInput.value;

  let savedUser;
  try {
    savedUser = JSON.parse(localStorage.getItem("studentHubUser") || "null");
  } catch {
    savedUser = null;
  }

  if (!savedUser) {
    alert("Please create a demo account first.");
    window.location.href = "signup.html";
    return;
  }

  if (
    email.toLowerCase() === savedUser.email.toLowerCase() &&
    password === savedUser.password
  ) {
    sessionStorage.setItem("studentHubLoggedIn", "true");
    window.location.href = "index.html";
  } else {
    alert("Incorrect email or password. Please try again.");
  }
});

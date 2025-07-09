// ✅ Get token from localStorage
export function getToken() {
  return localStorage.getItem("token");
}

// ✅ Redirect if not logged in
export function redirectIfNotLoggedIn() {
  const token = getToken();
  if (!token) {
    window.location.href = "index.html";
  }
}

// ✅ Generic error handler
export function handleError(message) {
  const el = document.getElementById("message") || document.getElementById("error");
  if (el) {
    el.textContent = message;
    el.style.color = "red";
  } else {
    alert(message);
  }
}

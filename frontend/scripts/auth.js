const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const loginToggle = document.getElementById("loginToggle");
const signupToggle = document.getElementById("signupToggle");
const message = document.getElementById("message");

loginToggle.onclick = () => {
  loginForm.classList.add("active");
  signupForm.classList.remove("active");
  loginToggle.classList.add("active");
  signupToggle.classList.remove("active");
  message.textContent = "";
};

signupToggle.onclick = () => {
  signupForm.classList.add("active");
  loginForm.classList.remove("active");
  signupToggle.classList.add("active");
  loginToggle.classList.remove("active");
  message.textContent = "";
};

loginForm.onsubmit = async (e) => {
  e.preventDefault();
  const identifier = document.getElementById("loginIdentifier").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  const data = isEmail(identifier)
    ? { email: identifier, password }
    : { mobile: identifier, password };

  try {
    const res = await fetch("http://localhost:8080/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await res.json();
    if (res.ok) {
      localStorage.setItem("token", result.token);

      const payload = decodeJwt(result.token);
      if (payload && payload.role === "ADMIN") {
        window.location.href = "admin-dashboard.html";
      } else {
        window.location.href = "students.html";
      }
    } else {
      message.textContent = result.message || "Login failed";
    }
  } catch (err) {
    message.textContent = "Error during login";
  }
};

document.getElementById("sendOtpBtn").onclick = async () => {
  const identifier = document.getElementById("signupIdentifier").value.trim();
  const password = document.getElementById("signupPassword").value.trim();

  const data = isEmail(identifier)
    ? { email: identifier, password }
    : { mobile: identifier, password };

  try {
    const res = await fetch("http://localhost:8080/auth/request-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await res.text();
    if (res.ok) {
      document.getElementById("otpField").style.display = "block";
      message.style.color = "green";
      message.textContent = result;
    } else {
      message.style.color = "red";
      message.textContent = result;
    }
  } catch {
    message.textContent = "Error sending OTP";
  }
};

signupForm.onsubmit = async (e) => {
  e.preventDefault();
  const identifier = document.getElementById("signupIdentifier").value.trim();
  const password = document.getElementById("signupPassword").value.trim();
  const otp = document.getElementById("signupOtp").value.trim();

  const data = isEmail(identifier)
    ? { email: identifier, password, otp }
    : { mobile: identifier, password, otp };

  try {
    const res = await fetch("http://localhost:8080/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await res.json();
    if (res.ok) {
      message.style.color = "green";
      message.textContent = "Signup successful! Redirecting to login...";
      setTimeout(() => loginToggle.click(), 2000);
    } else {
      message.style.color = "red";
      message.textContent = result.message || "Signup failed";
    }
  } catch {
    message.textContent = "Error during signup";
  }
};

function isEmail(value) {
  return /\S+@\S+\.\S+/.test(value);
}

function decodeJwt(token) {
  try {
    const payloadBase64 = token.split('.')[1];
    const payload = JSON.parse(atob(payloadBase64));
    return payload;
  } catch (e) {
    console.error("Failed to decode token", e);
    return null;
  }
}

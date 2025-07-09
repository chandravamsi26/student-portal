const BASE_URL = "http://localhost:8080";

function showMessage(id, msg, type = 'info') {
  const el = document.getElementById(id);
  el.textContent = msg;
  el.className = `message ${type}`;
  el.style.display = 'block';
  setTimeout(() => {
    el.style.display = 'none';
  }, 4000);
}

function isValidMobile(mobile) {
  return /^[6-9]\d{9}$/.test(mobile);
}

function isValidPassword(password) {
  return password.length >= 6;
}

function login() {
  const mobile = document.getElementById('loginMobile').value.trim();
  const password = document.getElementById('loginPassword').value.trim();

  if (!isValidMobile(mobile)) {
    return showMessage("loginMessage", "Enter valid 10-digit mobile number", "error");
  }

  if (!isValidPassword(password)) {
    return showMessage("loginMessage", "Password must be at least 6 characters", "error");
  }

  fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ userId: mobile, password })
  })
  .then(res => {
    if (!res.ok) throw new Error("Invalid login credentials");
    return res.json();
  })
  .then(data => {
    localStorage.setItem("token", data.token);
    showMessage("loginMessage", "Login successful!", "success");
    setTimeout(() => window.location.href = "/dashboard.html", 1500);
  })
  .catch(err => showMessage("loginMessage", err.message, "error"));
}

function requestOtp() {
  const mobile = document.getElementById('signupMobile').value.trim();
  const password = document.getElementById('signupPassword').value.trim();

  if (!isValidMobile(mobile)) {
    return showMessage("signupMessage", "Enter valid 10-digit mobile number", "error");
  }

  if (!isValidPassword(password)) {
    return showMessage("signupMessage", "Password must be at least 6 characters", "error");
  }

  fetch(`${BASE_URL}/auth/request-otp`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ userId: mobile, password })
  })
  .then(res => {
    if (!res.ok) return res.text().then(msg => { throw new Error(msg); });
    return res.text();
  })
  .then(msg => {
    showMessage("signupMessage", msg, "info");
    document.getElementById("otpGroup").style.display = "block";
    document.getElementById("verifyOtpBtn").style.display = "block";
    document.getElementById("requestOtpBtn").style.display = "none";
  })
  .catch(err => showMessage("signupMessage", err.message, "error"));
}

function verifyOtp() {
  const mobile = document.getElementById('signupMobile').value.trim();
  const password = document.getElementById('signupPassword').value.trim();
  const otp = document.getElementById('signupOtp').value.trim();

  if (!otp) {
    return showMessage("signupMessage", "Please enter OTP", "error");
  }

  fetch(`${BASE_URL}/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: mobile, password, otp })
  })
  .then(res => {
    if (!res.ok) return res.json().then(err => { throw new Error(err.message || "OTP verification failed"); });
    return res.json();
  })
  .then(() => {
    showMessage("signupMessage", "Signup successful! Please login.", "success");
    document.getElementById('signupMobile').value = '';
    document.getElementById('signupPassword').value = '';
    document.getElementById('signupOtp').value = '';
    document.getElementById("otpGroup").style.display = "none";
    document.getElementById("verifyOtpBtn").style.display = "none";
    document.getElementById("requestOtpBtn").style.display = "block";
    setTimeout(() => {
      toggle();
    }, 1500);
  })
  .catch(err => showMessage("signupMessage", err.message, "error"));
}

function loginWithGoogle() {
  window.location.href = `${BASE_URL}/auth/google`;
}

let container = document.getElementById('container');

function toggle() {
  container.classList.toggle('sign-in');
  container.classList.toggle('sign-up');
}

setTimeout(() => {
  container.classList.add('sign-in');
}, 200);

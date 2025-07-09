import {
  getToken,
  redirectIfNotLoggedIn,
  handleError
} from "./utils.js";

const token = getToken();
redirectIfNotLoggedIn();

const apiBase = "http://localhost:8080/api/student";

window.addEventListener("DOMContentLoaded", () => {
  fetch(`${apiBase}/details`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then(res => res.json())
    .then(data => {
      if (data.student && data.student.formSubmitted) {
        window.location.href = "./syllabus.html";
      } else {
        document.getElementById("form-container").style.display = "block";
      }
    })
    .catch(() => handleError("Failed to load student data."));
});

document.getElementById("studentForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = {
    fullName: document.getElementById("fullName").value,
    rollNumber: document.getElementById("rollNumber").value,
    schoolName: document.getElementById("schoolName").value,
    className: document.getElementById("className").value,
    fatherName: document.getElementById("fatherName").value,
    motherName: document.getElementById("motherName").value,
  };

  try {
    const res = await fetch(`${apiBase}/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    const result = await res.json();

    if (res.ok) {
      window.location.href = "./syllabus.html";
    } else {
      handleError(result.error || "Submission failed.");
    }
  } catch {
    handleError("Submission failed.");
  }
});

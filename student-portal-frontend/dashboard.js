document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Please login first.");
    window.location.href = "/index.html";
    return;
  }

  // 👉 Fetch student details
  fetch("http://localhost:8080/api/student/details", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(res => res.json())
    .then(data => {
      const student = data.student;

      if (!student) return;

      if (student.formSubmitted) {
        window.location.href = "/syllabus.html";
        return;
      }

      document.getElementById("fullName").value = student.fullName || "";
      document.getElementById("rollNumber").value = student.rollNumber || "";
      document.getElementById("schoolName").value = student.schoolName || "";
      document.getElementById("className").value = student.className || "";
      document.getElementById("familyDetails").value = student.familyDetails || "";
    })
    .catch(err => {
      console.error("Error fetching student details:", err);
    });

  // 👉 Handle form submission
  const form = document.getElementById("studentForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const studentData = {
      fullName: document.getElementById("fullName").value,
      rollNumber: document.getElementById("rollNumber").value,
      schoolName: document.getElementById("schoolName").value,
      className: document.getElementById("className").value,
      familyDetails: document.getElementById("familyDetails").value,
    };

    fetch("http://localhost:8080/api/student/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(studentData),
    })
      .then(res => res.json())
      .then(data => {
        if (data.message && data.message.includes("success")) {
          alert("Form submitted successfully!");
          window.location.href = "/syllabus.html";
        } else {
          alert("Error: " + (data.error || "Failed to submit form."));
        }
      })
      .catch(err => {
        console.error("Error submitting form:", err);
        alert("Submission failed. Try again.");
      });
  });
});

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  alert("You have been logged out.");
  window.location.href = "/index.html";
});

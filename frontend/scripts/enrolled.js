import {
  getToken,
  redirectIfNotLoggedIn,
  handleError
} from "./utils.js";

const token = getToken();
redirectIfNotLoggedIn();

const coursesContainer = document.getElementById("coursesContainer");
const message = document.getElementById("message");

fetch("http://localhost:8080/api/enroll/my-courses", {
  headers: { Authorization: `Bearer ${token}` },
})
  .then(res => {
    if (!res.ok) throw new Error("Failed to load courses");
    return res.json();
  })
  .then(courses => {
    if (!Array.isArray(courses) || courses.length === 0) {
      message.textContent = "No courses enrolled yet.";
      return;
    }

    courses.forEach(course => {
      const card = document.createElement("div");
      card.className = "course-card";
      card.innerHTML = `
        <div class="course-title">${course.title}</div>
        <div class="course-details">
          <p><strong>Instructor:</strong> ${course.instructorName}</p>
          <p><strong>Duration:</strong> ${course.duration}</p>
          <p><strong>Class:</strong> ${course.className}</p>
        </div>
      `;
      coursesContainer.appendChild(card);
    });
  })
  .catch(() => handleError("Error loading enrolled courses."));

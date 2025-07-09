import {
  getToken,
  redirectIfNotLoggedIn,
  handleError
} from "./utils.js";

const token = getToken();
redirectIfNotLoggedIn();

const courseList = document.getElementById("courseList");
const heading = document.getElementById("heading");
const errorMsg = document.getElementById("error");

let enrolledCourseIds = [];

window.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const className = urlParams.get("class");

  if (!className) {
    handleError("Invalid access. Please login again.");
    return;
  }

  heading.textContent = `Courses for Class ${className}`;

  try {
    // ✅ Step 1: Fetch enrolled course IDs
    const enrolledRes = await fetch("http://localhost:8080/api/enroll/my-courses", {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!enrolledRes.ok) throw new Error("Failed to fetch enrolled courses");

    const enrolledCourses = await enrolledRes.json();
    enrolledCourseIds = enrolledCourses.map(c => c.courseId);

    // ✅ Step 2: Fetch class-specific courses
    const res = await fetch(`http://localhost:8080/api/courses/${className}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      courseList.innerHTML = "<p>No courses available for this class.</p>";
      return;
    }

    courseList.innerHTML = "";
    data.forEach(course => {
      const card = document.createElement("div");
      card.classList.add("course-card");

      const alreadyEnrolled = enrolledCourseIds.includes(course.id);

      card.innerHTML = `
        <h3>${course.title}</h3>
        <p><strong>Instructor:</strong> ${course.instructorName}</p>
        <p><strong>Duration:</strong> ${course.duration}</p>
        <p class="price">₹${course.price === 0 ? "Free" : course.price}</p>
        ${alreadyEnrolled
          ? `<p style="color: green;"><strong>Already Enrolled</strong></p>`
          : `<button onclick="window.location.href='payment.html?courseId=${course.id}'">Enroll</button>`
        }
      `;

      courseList.appendChild(card);
    });

  } catch (err) {
    console.error(err);
    handleError("Failed to load courses.");
  }
});

import {
  getToken,
  redirectIfNotLoggedIn,
  handleError
} from "./utils.js";

const token = getToken();
redirectIfNotLoggedIn();

const classFilter = document.getElementById("classFilter");
const courseList = document.getElementById("courseList");
const modal = document.getElementById("courseModal");
const courseForm = document.getElementById("courseForm");
const modalTitle = document.getElementById("modalTitle");
const addCourseBtn = document.getElementById("addCourseBtn");

let currentEditingCourseId = null;

// Fetch and show courses by class
classFilter.addEventListener("change", () => {
  const className = classFilter.value;
  if (!className) return;

  fetch(`http://localhost:8080/api/courses/${className}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(data => {
      courseList.innerHTML = "";
      data.forEach(course => {
        const card = document.createElement("div");
        card.className = "course-card";
        card.innerHTML = `
          <h3>${course.title}</h3>
          <p><strong>Instructor:</strong> ${course.instructorName}</p>
          <p><strong>Price:</strong> ₹${course.price}</p>
          <button class="edit-btn" data-id="${course.id}">Edit</button>
          <button class="delete-btn" data-id="${course.id}">Delete</button>
        `;
        courseList.appendChild(card);
      });

      document.querySelectorAll(".edit-btn").forEach(btn =>
        btn.addEventListener("click", () => openEditModal(btn.dataset.id))
      );

      document.querySelectorAll(".delete-btn").forEach(btn =>
        btn.addEventListener("click", () => deleteCourse(btn.dataset.id))
      );
    })
    .catch(() => handleError("Failed to load courses"));
});

// Show modal to add new
addCourseBtn.addEventListener("click", () => {
  currentEditingCourseId = null;
  modalTitle.textContent = "Add Course";
  courseForm.reset();
  modal.style.display = "flex";
});

// Save or update course
courseForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const dto = {
    title: courseForm.title.value,
    description: courseForm.description.value,
    className: courseForm.className.value,
    price: parseFloat(courseForm.price.value),
    duration: courseForm.duration.value,
    instructorName: courseForm.instructorName.value,
    courseUrl: courseForm.courseUrl.value,
    thumbnailUrl: courseForm.thumbnailUrl.value,
  };

  const method = currentEditingCourseId ? "PUT" : "POST";
  const url = currentEditingCourseId
    ? `http://localhost:8080/api/courses/${currentEditingCourseId}`
    : `http://localhost:8080/api/courses`;

  fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(dto)
  })
    .then(res => res.text())
    .then(() => {
      modal.style.display = "none";
      classFilter.dispatchEvent(new Event("change")); // refresh course list
    })
    .catch(() => handleError("Failed to save course"));
});

// Edit
function openEditModal(courseId) {
  currentEditingCourseId = courseId;
  modalTitle.textContent = "Edit Course";

  fetch(`http://localhost:8080/api/courses/details/${courseId}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(course => {
      courseForm.title.value = course.title;
      courseForm.description.value = course.description;
      courseForm.className.value = course.className;
      courseForm.price.value = course.price;
      courseForm.duration.value = course.duration;
      courseForm.instructorName.value = course.instructorName;
      courseForm.courseUrl.value = course.courseUrl;
      courseForm.thumbnailUrl.value = course.thumbnailUrl;

      modal.style.display = "flex";
    });
}

// Delete
function deleteCourse(courseId) {
  if (!confirm("Are you sure you want to delete this course?")) return;

  fetch(`http://localhost:8080/api/courses/${courseId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(() => classFilter.dispatchEvent(new Event("change")))
    .catch(() => handleError("Failed to delete course"));
}

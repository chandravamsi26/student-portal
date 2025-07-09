import {
  getToken,
  redirectIfNotLoggedIn,
  handleError
} from "./utils.js";

const token = getToken();
redirectIfNotLoggedIn();

const studentList = document.getElementById("studentList");

const modal = document.getElementById("editStudentModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const editForm = document.getElementById("editStudentForm");

const fullNameInput = document.getElementById("editFullName");
const rollNumberInput = document.getElementById("editRollNumber");
const schoolNameInput = document.getElementById("editSchoolName");
const classNameInput = document.getElementById("editClassName");
const studentIdInput = document.getElementById("editStudentId");
const fatherNameInput = document.getElementById("editFatherName");
const motherNameInput = document.getElementById("editMotherName");


function openEditModal(student) {
  fullNameInput.value = student.fullName;
  rollNumberInput.value = student.rollNumber;
  schoolNameInput.value = student.schoolName;
  classNameInput.value = student.className;
  fatherNameInput.value = student.fatherName || "";
  motherNameInput.value = student.motherName || "";
  studentIdInput.value = student.id;

  modal.style.display = "flex";
}

closeModalBtn.onclick = () => modal.style.display = "none";

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

editForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const updatedData = {
  fullName: fullNameInput.value,
  rollNumber: rollNumberInput.value,
  schoolName: schoolNameInput.value,
  className: classNameInput.value,
  fatherName: fatherNameInput.value,
  motherName: motherNameInput.value
};

  const studentId = studentIdInput.value;

  try {
    const res = await fetch(`http://localhost:8080/api/student/${studentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(updatedData)
    });

    if (res.ok) {
      alert("Student updated successfully.");
      modal.style.display = "none";
      window.location.reload();
    } else {
      handleError("Update failed");
    }
  } catch {
    handleError("Update failed");
  }
});

function createStudentCard(student) {
  const card = document.createElement("div");
  card.className = "student-card";

  const enrolledCourses = student.enrollments || [];

  const enrolledListHtml = enrolledCourses.length
    ? `<ul class="enrolled-list">
         ${enrolledCourses.map(
           (enr) => `<li>${enr.courseTitle || "Untitled Course"}</li>`
         ).join("")}
       </ul>`
    : `<p class="no-enrollments">No enrolled courses</p>`;

  card.innerHTML = `
    <h3>${student.fullName} (Class ${student.className})</h3>
    <p><strong>School:</strong> ${student.schoolName}</p>
    <p><strong>Roll No:</strong> ${student.rollNumber}</p>
    <p><strong>Enrolled Courses:</strong> ${enrolledCourses.length}</p>
    ${enrolledListHtml}
    <button class="edit-btn">Edit</button>
    <button class="delete-btn">Delete</button>
  `;

  card.querySelector(".edit-btn").addEventListener("click", () => openEditModal(student));
  card.querySelector(".delete-btn").addEventListener("click", () => handleDelete(student.id));

  return card;
}

function handleDelete(studentId) {
  if (confirm("Are you sure you want to delete this student?")) {
    fetch(`http://localhost:8080/api/student/${studentId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then(() => {
        alert("Student deleted.");
        window.location.reload();
      })
      .catch(() => handleError("Failed to delete student."));
  }
}

window.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:8080/api/student/admin/students", {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then((res) => res.json())
    .then((students) => {
      if (!Array.isArray(students)) {
        return handleError("Invalid data");
      }

      studentList.innerHTML = "";
      students.forEach((student) => {
        const card = createStudentCard(student);
        studentList.appendChild(card);
      });
    })
    .catch(() => handleError("Failed to load student list."));
});

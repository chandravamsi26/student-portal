import {
  getToken,
  redirectIfNotLoggedIn,
  handleError
} from "./utils.js";

const token = getToken();
redirectIfNotLoggedIn();

const heading = document.getElementById("heading");
const syllabusList = document.getElementById("syllabusList");

window.addEventListener("DOMContentLoaded", async () => {
  try {
    const studentRes = await fetch("http://localhost:8080/api/student/details", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const studentData = await studentRes.json();

    const studentClass = parseInt(studentData.student?.className);
    if (!studentClass) return handleError("Invalid student class");

    heading.textContent =
      studentClass <= 10
        ? `Syllabus for Classes 1 to 10`
        : `Syllabus for Class ${studentClass}`;

    const syllabusRes = await fetch("http://localhost:8080/api/syllabus/student", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const allSyllabus = await syllabusRes.json();

    // Filter based on class rule
    const filtered = allSyllabus.filter(syl => {
      const cls = parseInt(syl.className);
      return studentClass <= 10 ? cls <= 10 : cls === studentClass;
    });

    if (filtered.length === 0) {
      syllabusList.innerHTML = "<p>No syllabus available.</p>";
      return;
    }

    syllabusList.innerHTML = "";

    filtered.forEach(({ className, subjects }) => {
      const card = document.createElement("li");
      card.classList.add("syllabus-card");
      card.onclick = () => {
        window.location.href = `courses.html?class=${className}`;
      };

      const subjectList = Object.entries(subjects || {})
        .slice(0, 3) // Show max 3 subjects for preview
        .map(([subject, topics]) => `<li><strong>${subject}</strong>: ${topics.split(",")[0]}...</li>`)
        .join("");

      card.innerHTML = `
        <h3>Class ${className}</h3>
        <ul class="subject-preview">${subjectList}</ul>
        <p class="click-note">Click to view courses</p>
      `;

      syllabusList.appendChild(card);
    });

  } catch (err) {
    console.error("Error loading syllabus:", err);
    handleError("Could not load syllabus");
  }
});

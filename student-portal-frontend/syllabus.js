document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Please login first.");
    window.location.href = "/index.html";
    return;
  }

  fetch("http://localhost:8080/api/syllabus/student", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(res => {
      if (!res.ok) throw new Error("Failed to fetch syllabus");
      return res.json();
    })
    .then(data => {
      // Check if user is in class 11 or 12
      const classNum = parseInt(data.className);
      if (classNum >= 11) {
        // Only show their own class syllabus
        renderClassSyllabus(data.className, data.subjects);
      } else {
        // Fetch all class syllabi for 1–10
        const promises = [];
        for (let i = 1; i <= 10; i++) {
          promises.push(
            fetch(`http://localhost:8080/api/syllabus/${i}`, {
              headers: { Authorization: `Bearer ${token}` },
            }).then(res => res.ok ? res.json() : null)
          );
        }

        Promise.all(promises)
          .then(syllabi => {
            syllabi.forEach(s => {
              if (s) renderClassSyllabus(s.className, s.subjects);
            });
          });
      }
    })
    .catch(err => {
      console.error("Error:", err);
      alert("Could not load syllabus.");
    });
});

function renderClassSyllabus(className, subjects) {
  const container = document.getElementById("syllabusContainer");

  const card = document.createElement("div");
  card.className = "class-card";
  card.onclick = () => {
    window.location.href = `/courses.html?className=${className}`;
  };

  const title = document.createElement("h2");
  title.textContent = `Class ${className}`;
  card.appendChild(title);

  const list = document.createElement("ul");
  for (const subject in subjects) {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${subject}:</strong> ${subjects[subject]}`;
    list.appendChild(li);
  }

  card.appendChild(list);
  container.appendChild(card);
}

export function loadAdminSidebar(active) {
  const sidebar = `
    <aside class="sidebar">
      <h2>Admin Panel</h2>
      <ul>
        <li><a href="admin-dashboard.html" class="${active === 'dashboard' ? 'active' : ''}">Dashboard</a></li>
        <li><a href="admin-students.html" class="${active === 'students' ? 'active' : ''}">Manage Students</a></li>
        <li><a href="admin-courses.html" class="${active === 'courses' ? 'active' : ''}">Manage Courses</a></li>
        <li><a href="admin-syllabus.html" class="${active === 'syllabus' ? 'active' : ''}">Add Syllabus</a></li>
        <li><button id="logoutBtn">Logout</button></li>
      </ul>
    </aside>
  `;

  document.body.insertAdjacentHTML("afterbegin", sidebar);

  // Load and attach logout script
  const script = document.createElement("script");
  script.src = "scripts/logout.js";
  script.onload = function () {
    if (typeof window.attachLogout === "function") {
      window.attachLogout(); // ⬅️ Call it after the button is in DOM
    }
  };
  document.body.appendChild(script);
}

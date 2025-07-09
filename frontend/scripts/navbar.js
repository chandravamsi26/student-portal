import { getToken, redirectIfNotLoggedIn } from "./utils.js";

export function loadNavbar(activePage) {
  const token = getToken();
  redirectIfNotLoggedIn();

  const navbar = document.createElement("nav");
  navbar.className = "navbar";

  navbar.innerHTML = `
    <div class="nav-left">
      <h1 class="logo">Student Portal</h1>
    </div>
    <ul class="nav-links">
      <li><a href="syllabus.html" class="${activePage === 'syllabus' ? 'active' : ''}">Syllabus</a></li>
      <li><a href="enrolled.html" class="${activePage === 'enrolled' ? 'active' : ''}">My Courses</a></li>
      <li><button id="logoutBtn">Logout</button></li>
    </ul>
  `;

  document.body.insertBefore(navbar, document.body.firstChild);

  if (window.attachLogout) {
    window.attachLogout();
  }
}

const API_BASE = 'http://localhost:8080/api/syllabus';
const token = localStorage.getItem('token');

const classButtonsContainer = document.getElementById('classButtons');
const syllabusContainer = document.getElementById('syllabusContainer');
const addBtn = document.getElementById('addSyllabusBtn');
const modal = document.getElementById('syllabusModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const syllabusForm = document.getElementById('syllabusForm');
const modalTitle = document.getElementById('modalTitle');

const classNameInput = document.getElementById('classNameInput');
const subjectsInput = document.getElementById('subjectsInput');
const syllabusIdInput = document.getElementById('syllabusId');

let currentClass = null;

// const classes = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

const classFilter = document.getElementById("classFilter");

classFilter.addEventListener("change", () => {
  const selectedClass = classFilter.value;
  if (selectedClass) {
    currentClass = selectedClass;
    fetchSyllabusByClass(selectedClass);
  } else {
    syllabusContainer.innerHTML = "<p>Please select a class to view syllabus.</p>";
  }
});


// Fetch syllabus by class
function fetchSyllabusByClass(className) {
  syllabusContainer.innerHTML = '';
  fetch(`${API_BASE}/${className}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(data => {
      if (data && data.subjects) {
        renderSyllabusCard(data);
      } else {
        syllabusContainer.innerHTML = '<p>No syllabus found for this class.</p>';
      }
    })
    .catch(() => {
      syllabusContainer.innerHTML = '<p>Error loading syllabus.</p>';
    });
}

// Render syllabus card
function renderSyllabusCard(syllabus) {
  const card = document.createElement('div');
  card.className = 'syllabus-card';

  const title = document.createElement('h3');
  title.textContent = `Class ${syllabus.className}`;
  card.appendChild(title);

  const ul = document.createElement('ul');
  Object.entries(syllabus.subjects).forEach(([subject, content]) => {
    const li = document.createElement('li');
    li.textContent = `${subject}: ${content}`;
    ul.appendChild(li);
  });
  card.appendChild(ul);

  const editBtn = document.createElement('button');
  editBtn.textContent = 'Edit';
  editBtn.className = 'edit-btn';
  editBtn.onclick = () => openEditModal(syllabus);

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.className = 'delete-btn';
  deleteBtn.onclick = () => deleteSyllabus(syllabus.id);

  card.appendChild(editBtn);
  card.appendChild(deleteBtn);

  syllabusContainer.appendChild(card);
}

// Open modal to add or edit
function openModal() {
  modal.style.display = 'flex';
}

function closeModal() {
  modal.style.display = 'none';
  syllabusForm.reset();
  syllabusIdInput.value = '';
  modalTitle.textContent = 'Add Syllabus';
}

// Add syllabus button
addBtn.addEventListener('click', () => {
  modalTitle.textContent = 'Add Syllabus';
  openModal();
  if (currentClass) classNameInput.value = currentClass;
});

// Close modal
closeModalBtn.addEventListener('click', closeModal);
window.addEventListener('click', e => {
  if (e.target === modal) closeModal();
});

// Handle form submit
syllabusForm.addEventListener('submit', e => {
  e.preventDefault();

  const id = syllabusIdInput.value;
  const className = classNameInput.value.trim();
  let subjects;
  try {
    subjects = JSON.parse(subjectsInput.value.trim());
  } catch {
    alert('Invalid JSON format for subjects.');
    return;
  }

  const body = JSON.stringify({ className, subjects });

  const method = id ? 'PUT' : 'POST';
  const url = id ? `${API_BASE}/${id}` : API_BASE;

  fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body
  })
    .then(res => {
      if (!res.ok) throw new Error('Failed to save');
      return res.json().catch(() => ({})); // For POST that returns plain string
    })
    .then(() => {
      alert('Syllabus saved successfully.');
      closeModal();
      fetchSyllabusByClass(className);
    })
    .catch(() => alert('Error saving syllabus.'));
});

// Open modal to edit syllabus
function openEditModal(syllabus) {
  modalTitle.textContent = 'Edit Syllabus';
  syllabusIdInput.value = syllabus.id;
  classNameInput.value = syllabus.className;
  subjectsInput.value = JSON.stringify(syllabus.subjects, null, 2);
  openModal();
}

// Delete syllabus
function deleteSyllabus(id) {
  if (!confirm('Are you sure you want to delete this syllabus?')) return;

  fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => {
      if (!res.ok) throw new Error();
      alert('Syllabus deleted successfully.');
      fetchSyllabusByClass(currentClass);
    })
    .catch(() => alert('Failed to delete syllabus.'));
}


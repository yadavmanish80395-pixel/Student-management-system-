
// Demo login protection. This is not real server-side security.
if (sessionStorage.getItem("studentHubLoggedIn") !== "true") {
  window.location.replace("login.html");
}

const studentForm = document.getElementById("studentFormElement");
const nameInput = document.getElementById("name");
const rollInput = document.getElementById("roll");
const emailInput = document.getElementById("email");
const courseInput = document.getElementById("course");
const studentList = document.getElementById("studentList");
const searchInput = document.getElementById("search");
const totalStudents = document.getElementById("totalStudents");
const totalCourses = document.getElementById("totalCourses");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");
const exportBtn = document.getElementById("exportBtn");
const emptyMessage = document.getElementById("emptyMessage");

let students = JSON.parse(localStorage.getItem("students") || "[]");
let editingId = null;

const currentUser = JSON.parse(localStorage.getItem("studentHubUser") || "null");
if (currentUser) {
  document.getElementById("userName").textContent = currentUser.name;
  document.getElementById("userAvatar").textContent =
    currentUser.name.charAt(0).toUpperCase();
}

function saveStudents() {
  localStorage.setItem("students", JSON.stringify(students));
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[character]);
}

function renderStudents() {
  const searchTerm = searchInput.value.toLowerCase().trim();

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm) ||
    student.roll.toLowerCase().includes(searchTerm) ||
    student.email.toLowerCase().includes(searchTerm) ||
    student.course.toLowerCase().includes(searchTerm)
  );

  studentList.innerHTML = "";

  filteredStudents.forEach(student => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>
        <div class="student-name">${escapeHTML(student.name)}</div>
        <div class="student-email">${escapeHTML(student.email)}</div>
      </td>
      <td>${escapeHTML(student.roll)}</td>
      <td><span class="course-badge">${escapeHTML(student.course)}</span></td>
      <td>
        <button class="action-btn edit-btn" data-action="edit" data-id="${student.id}">Edit</button>
        <button class="action-btn delete-btn" data-action="delete" data-id="${student.id}">Delete</button>
      </td>
    `;

    studentList.appendChild(row);
  });

  totalStudents.textContent = students.length;
  totalCourses.textContent = new Set(students.map(student => student.course)).size;
  emptyMessage.classList.toggle("hidden", filteredStudents.length !== 0);
}

studentForm.addEventListener("submit", function(event) {
  event.preventDefault();

  const studentData = {
    name: nameInput.value.trim(),
    roll: rollInput.value.trim(),
    email: emailInput.value.trim(),
    course: courseInput.value
  };

  if (!studentData.name || !studentData.roll ||
      !studentData.email || !studentData.course) {
    alert("Please fill all fields.");
    return;
  }

  const duplicateRoll = students.some(student =>
    student.roll.toLowerCase() === studentData.roll.toLowerCase() &&
    student.id !== editingId
  );

  if (duplicateRoll) {
    alert("This roll number already exists!");
    return;
  }

  if (editingId !== null) {
    students = students.map(student =>
      student.id === editingId
        ? { ...student, ...studentData }
        : student
    );
    alert("Student updated successfully!");
  } else {
    students.push({
      id: Date.now(),
      ...studentData
    });
    alert("Student added successfully!");
  }

  saveStudents();
  resetForm();
  renderStudents();
});

studentList.addEventListener("click", function(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const id = Number(button.dataset.id);
  const action = button.dataset.action;
  const student = students.find(item => item.id === id);

  if (!student) return;

  if (action === "edit") {
    editingId = id;
    nameInput.value = student.name;
    rollInput.value = student.roll;
    emailInput.value = student.email;
    courseInput.value = student.course;

    document.getElementById("formTitle").textContent = "Edit Student";
    submitBtn.textContent = "Update Student";
    cancelBtn.classList.remove("hidden");

    document.getElementById("students").scrollIntoView({
      behavior: "smooth"
    });
  }

  if (action === "delete") {
    if (confirm(`Delete ${student.name} from the records?`)) {
      students = students.filter(item => item.id !== id);
      saveStudents();
      renderStudents();
      if (editingId === id) resetForm();
    }
  }
});

function resetForm() {
  studentForm.reset();
  editingId = null;
  document.getElementById("formTitle").textContent = "Add New Student";
  submitBtn.textContent = "＋ Add Student";
  cancelBtn.classList.add("hidden");
}

cancelBtn.addEventListener("click", resetForm);
searchInput.addEventListener("input", renderStudents);

exportBtn.addEventListener("click", function() {
  if (students.length === 0) {
    alert("There are no student records to export.");
    return;
  }

  const headers = ["Name", "Roll Number", "Email", "Course"];
  const rows = students.map(student => [
    student.name, student.roll, student.email, student.course
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.map(value =>
      `"${String(value).replace(/"/g, '""')}"`
    ).join(","))
    .join("\n");

  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;"
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "StudentHub-Records.csv";
  link.click();
  URL.revokeObjectURL(url);
});

document.getElementById("logoutBtn").addEventListener("click", function() {
  sessionStorage.removeItem("studentHubLoggedIn");
  window.location.href = "login.html";
});

renderStudents();

// To-Do List functionality
const todoInput = document.getElementById("todoInput");
const addButton = document.getElementById("addButton");
const todoList = document.getElementById("todoList");

// Ambil data dari local storage atau buat array kosong
let todos = JSON.parse(localStorage.getItem("todos")) || [];

// Fungsi untuk menyimpan ke local storage
function saveToLocalStorage() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// Fungsi untuk menampilkan to-do list
function renderTodos() {
  console.log(todos);
  todoList.innerHTML = ""; // Bersihkan isi daftar

  if (todos.length === 0) {
    todoList.innerHTML = `<li class="empty">Belum ada target belajar. Tambahkan sesuatu!</li>`;
    return;
  }

  todos.forEach((todo, index) => {
    // Buat elemen list
    const li = document.createElement("li");
    li.className = todo.completed ? "completed" : "";
    console.log(`Todo: ${todo.text}, Completed: ${todo.completed}, Class: ${li.className}`);

    li.innerHTML = `
      <span>${todo.text}</span>
      <div>
        <button class="complete-btn" data-index="${index}">✔</button>
        <button class="delete-btn" data-index="${index}">✖</button>
      </div>
    `;

    todoList.appendChild(li);
  });
}

// Fungsi untuk menambahkan item baru
function addTodo() {
  const todoText = todoInput.value.trim();
  if (todoText) {
    todos.push({ text: todoText, completed: false });
    saveToLocalStorage();
    renderTodos();
    todoInput.value = "";
  } else {
    alert("Harap masukkan target belajar!");
  }
}

// Fungsi untuk menandai item sebagai selesai atau belum selesai
function toggleComplete(index) {
  todos[index].completed = !todos[index].completed;
  saveToLocalStorage();
  renderTodos();
}

// Fungsi untuk menghapus item
function deleteTodo(index) {
  if (confirm("Anda yakin ingin menghapus target ini?")) {
    todos.splice(index, 1);
    saveToLocalStorage();
    renderTodos();
  }
}

// Event listener untuk tombol tambah
addButton.addEventListener("click", addTodo);

// Event listener untuk menekan Enter di input
todoInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    addTodo();
  }
});

// Event delegation untuk tombol selesai dan hapus
todoList.addEventListener("click", (e) => {
  const index = e.target.dataset.index;
  if (e.target.classList.contains("complete-btn")) {
    toggleComplete(index);
  } else if (e.target.classList.contains("delete-btn")) {
    deleteTodo(index);
  }
});

// Render todo saat halaman dimuat
renderTodos();

// Timer functionality
let timerInterval;
let isRunning = false;
let totalSeconds = 0;
let mode = "work"; // "work" atau "break"

// Fungsi untuk memperbarui tampilan waktu
function updateTimeDisplay() {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  document.getElementById("minutes").textContent = minutes;
  document.getElementById("seconds").textContent = seconds;
}

// Fungsi untuk memulai timer
function startTimer() {
  if (isRunning) return;
  isRunning = true;

  const workTime = Math.max(1, parseInt(document.getElementById("workTime").value, 10)) * 60;
  const breakTime = Math.max(1, parseInt(document.getElementById("breakTime").value, 10)) * 60;

  totalSeconds = totalSeconds || workTime;
  updateTimeDisplay();

  timerInterval = setInterval(() => {
    totalSeconds--;

    if (totalSeconds < 0) {
      clearInterval(timerInterval);
      mode = mode === "work" ? "break" : "work";
      totalSeconds = mode === "work" ? workTime : breakTime;
      alert(`Waktunya ${mode === "work" ? "belajar" : "istirahat"}!`);
      startTimer();
    }

    updateTimeDisplay();
  }, 1000);
}

// Fungsi untuk menjeda timer
function pauseTimer() {
  clearInterval(timerInterval);
  isRunning = false;
}

// Fungsi untuk mereset timer
function resetTimer() {
  pauseTimer();
  const workTime = Math.max(1, parseInt(document.getElementById("workTime").value, 10)) * 60;
  totalSeconds = workTime;
  mode = "work";
  updateTimeDisplay();
}

// Event listeners untuk tombol timer
document.getElementById("startButton").addEventListener("click", startTimer);
document.getElementById("pauseButton").addEventListener("click", pauseTimer);
document.getElementById("resetButton").addEventListener("click", resetTimer);

// Perbarui tampilan waktu saat halaman dimuat
updateTimeDisplay();

/* ==============================
   1. Get HTML Elements
============================== */

const tasksList = document.getElementById("tasks-list");
const emptyState = document.getElementById("empty-state");

const taskModal = document.getElementById("task-modal");
const taskForm = document.getElementById("task-form");

const taskIdInput = document.getElementById("task-id");
const taskTitleInput = document.getElementById("task-title");
const taskDescriptionInput = document.getElementById("task-description");
const taskCategoryInput = document.getElementById("task-category");
const taskPriorityInput = document.getElementById("task-priority");
const taskDateInput = document.getElementById("task-date");

const modalTitle = document.getElementById("modal-title");

const searchInput = document.getElementById("search-input");

const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toast-message");

const themeButton = document.getElementById("theme-btn");
const sidebar = document.getElementById("sidebar");

let tasks = getTasks();

let currentFilter = "all";
let toastTimer;

/* ==============================
   2. Helper Functions
============================== */

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, function (character) {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };

    return entities[character];
  });
}

function getCategoryName(category) {
  const categories = {
    study: "دراسة",
    work: "عمل",
    personal: "شخصي",
    development: "برمجة",
  };

  return categories[category] || "عام";
}

function getPriorityName(priority) {
  const priorities = {
    high: "عالية",
    medium: "متوسطة",
    low: "منخفضة",
  };

  return priorities[priority] || "متوسطة";
}

function formatDate(date) {
  if (!date) return "بدون تاريخ";

  const parsedDate = new Date(date + "T00:00:00");

  if (Number.isNaN(parsedDate.getTime())) {
    return "بدون تاريخ";
  }

  return parsedDate.toLocaleDateString("ar-EG", {
    day: "numeric",
    month: "short",
  });
}

function showToast(message) {
  toastMessage.textContent = message;

  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(function () {
    toast.classList.remove("show");
  }, 2500);
}

function updateStorage() {
  saveTasks(tasks);
}

/* ==============================
   3. Render Tasks
============================== */

function renderTasks() {
  const searchValue = searchInput.value.trim().toLowerCase();

  let filteredTasks = tasks.filter(function (task) {
    const matchesFilter =
      currentFilter === "all" ||
      (currentFilter === "active" && !task.completed) ||
      (currentFilter === "completed" && task.completed);

    const matchesSearch =
      task.title.toLowerCase().includes(searchValue) ||
      (task.description || "").toLowerCase().includes(searchValue);

    return matchesFilter && matchesSearch;
  });

  tasksList.innerHTML = "";

  document.getElementById("tasks-counter").textContent =
    `${filteredTasks.length} مهمة`;

  if (filteredTasks.length === 0) {
    emptyState.style.display = "block";
    return;
  }

  emptyState.style.display = "none";

  filteredTasks.forEach(function (task) {
    const taskElement = document.createElement("article");

    taskElement.className = `task-card ${task.completed ? "is-completed" : ""}`;

    taskElement.innerHTML = `
            <button
                class="task-check ${task.completed ? "checked" : ""}"
                data-action="toggle"
                data-id="${task.id}"
                aria-label="تغيير حالة المهمة"
                title="تغيير الحالة"
            >
                ${task.completed ? '<i class="fa-solid fa-check"></i>' : ""}
            </button>

            <div class="task-content">
                <h3>${escapeHTML(task.title)}</h3>
                <p>${escapeHTML(task.description || "لا يوجد وصف للمهمة")}</p>
            </div>

            <div class="task-meta">

                <span class="task-badge priority-${escapeHTML(task.priority)}">
                    ${getPriorityName(task.priority)}
                </span>

                <span class="task-badge category-badge">
                    ${getCategoryName(task.category)}
                </span>

                <span class="task-date">
                    <i class="fa-regular fa-calendar"></i>
                    ${formatDate(task.date)}
                </span>

            </div>

            <div class="task-actions">

                <button
                    data-action="edit"
                    data-id="${task.id}"
                    title="تعديل المهمة"
                    aria-label="تعديل المهمة"
                >
                    <i class="fa-solid fa-pen"></i>
                </button>

                <button
                    class="delete-task"
                    data-action="delete"
                    data-id="${task.id}"
                    title="حذف المهمة"
                    aria-label="حذف المهمة"
                >
                    <i class="fa-regular fa-trash-can"></i>
                </button>

            </div>
        `;

    tasksList.appendChild(taskElement);
  });
}

/* ==============================
   4. Update Statistics
============================== */

function updateStatistics() {
  const total = tasks.length;

  const completed = tasks.filter(function (task) {
    return task.completed;
  }).length;

  const active = total - completed;

  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  document.getElementById("total-tasks").textContent = total;

  document.getElementById("active-tasks").textContent = active;

  document.getElementById("completed-tasks").textContent = completed;

  document.getElementById("completion-rate").textContent = percentage + "%";

  document.getElementById("progress-label").textContent = percentage + "%";

  document.getElementById("progress-fill").style.width = percentage + "%";

  document.getElementById("all-count").textContent = total;
}

/* ==============================
   5. Render Everything
============================== */

function renderApp() {
  renderTasks();
  updateStatistics();
}

/* ==============================
   6. Open and Close Modal
============================== */

function openModal() {
  taskForm.reset();

  taskIdInput.value = "";

  modalTitle.textContent = "إضافة مهمة جديدة";

  taskModal.querySelector(".save-btn").innerHTML =
    '<i class="fa-solid fa-plus"></i> حفظ المهمة';

  taskModal.classList.add("show");

  taskTitleInput.focus();
}

function closeModal() {
  taskModal.classList.remove("show");
}

document.getElementById("add-task-btn").addEventListener("click", openModal);

document
  .getElementById("sidebar-add-btn")
  .addEventListener("click", function () {
    openModal();
    sidebar.classList.remove("open");
  });

document.getElementById("empty-add-btn").addEventListener("click", openModal);

document.getElementById("close-modal").addEventListener("click", closeModal);

document.getElementById("cancel-modal").addEventListener("click", closeModal);

taskModal.addEventListener("click", function (event) {
  if (event.target === taskModal) {
    closeModal();
  }
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeModal();
  }
});

/* ==============================
   7. Add or Edit Task
============================== */

taskForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const title = taskTitleInput.value.trim();

  if (!title) {
    showToast("يرجى كتابة عنوان المهمة");
    return;
  }

  const existingId = taskIdInput.value;

  const taskData = {
    title: title,
    description: taskDescriptionInput.value.trim(),
    category: taskCategoryInput.value,
    priority: taskPriorityInput.value,
    date: taskDateInput.value,
    completed: false,
  };

  if (existingId) {
    const taskIndex = tasks.findIndex(function (task) {
      return String(task.id) === existingId;
    });

    if (taskIndex !== -1) {
      taskData.completed = tasks[taskIndex].completed;

      tasks[taskIndex] = {
        ...tasks[taskIndex],
        ...taskData,
      };

      showToast("تم تعديل المهمة بنجاح");
    }
  } else {
    const newTask = {
      id: Date.now(),
      ...taskData,
    };

    tasks.unshift(newTask);

    showToast("تمت إضافة المهمة بنجاح");
  }

  updateStorage();

  renderApp();

  closeModal();
});

/* ==============================
   8. Edit Task
============================== */

function editTask(id) {
  const task = tasks.find(function (item) {
    return String(item.id) === String(id);
  });

  if (!task) return;

  taskIdInput.value = task.id;

  taskTitleInput.value = task.title;

  taskDescriptionInput.value = task.description || "";

  taskCategoryInput.value = task.category;

  taskPriorityInput.value = task.priority;

  taskDateInput.value = task.date || "";

  modalTitle.textContent = "تعديل المهمة";

  taskModal.querySelector(".save-btn").innerHTML =
    '<i class="fa-solid fa-floppy-disk"></i> حفظ التعديلات';

  taskModal.classList.add("show");

  taskTitleInput.focus();
}

/* ==============================
   9. Toggle Task
============================== */

function toggleTask(id) {
  const task = tasks.find(function (item) {
    return String(item.id) === String(id);
  });

  if (!task) return;

  task.completed = !task.completed;

  updateStorage();

  renderApp();

  showToast(
    task.completed
      ? "أحسنت! تم إنجاز المهمة 🎉"
      : "تمت إعادة المهمة إلى قيد التنفيذ",
  );
}

/* ==============================
   10. Delete Task
============================== */

function deleteTask(id) {
  const confirmed = confirm("هل أنت متأكد من حذف هذه المهمة؟");

  if (!confirmed) return;

  tasks = tasks.filter(function (task) {
    return String(task.id) !== String(id);
  });

  updateStorage();

  renderApp();

  showToast("تم حذف المهمة بنجاح");
}

/* ==============================
   11. Task Actions
============================== */

tasksList.addEventListener("click", function (event) {
  const button = event.target.closest("button[data-action]");

  if (!button) return;

  const action = button.dataset.action;

  const id = button.dataset.id;

  if (action === "toggle") {
    toggleTask(id);
  }

  if (action === "edit") {
    editTask(id);
  }

  if (action === "delete") {
    deleteTask(id);
  }
});

/* ==============================
   12. Filter Tasks
============================== */

function setFilter(filter) {
  currentFilter = filter;

  document.querySelectorAll(".filter-btn").forEach(function (button) {
    button.classList.toggle("active", button.dataset.filter === filter);
  });

  document.querySelectorAll(".nav-link[data-filter]").forEach(function (link) {
    link.classList.toggle("active", link.dataset.filter === filter);
  });

  renderTasks();
}

document.querySelectorAll(".filter-btn").forEach(function (button) {
  button.addEventListener("click", function () {
    setFilter(button.dataset.filter);
  });
});

document.querySelectorAll(".nav-link[data-filter]").forEach(function (link) {
  link.addEventListener("click", function (event) {
    event.preventDefault();

    setFilter(link.dataset.filter);

    sidebar.classList.remove("open");
  });
});

/* ==============================
   13. Search Tasks
============================== */

searchInput.addEventListener("input", function () {
  renderTasks();
});

/* ==============================
   14. Dark Mode
============================== */

function applyTheme(theme) {
  document.body.classList.toggle("dark-mode", theme === "dark");

  themeButton.innerHTML =
    theme === "dark"
      ? '<i class="fa-solid fa-sun"></i>'
      : '<i class="fa-regular fa-moon"></i>';

  saveTheme(theme);
}

themeButton.addEventListener("click", function () {
  const isDark = document.body.classList.contains("dark-mode");

  const newTheme = isDark ? "light" : "dark";

  applyTheme(newTheme);

  showToast(
    newTheme === "dark" ? "تم تفعيل الوضع الليلي" : "تم تفعيل الوضع النهاري",
  );
});

/* ==============================
   15. Mobile Sidebar
============================== */

document.getElementById("menu-btn").addEventListener("click", function () {
  sidebar.classList.toggle("open");
});

document.addEventListener("click", function (event) {
  const menuButton = document.getElementById("menu-btn");

  if (
    window.innerWidth <= 800 &&
    !sidebar.contains(event.target) &&
    !menuButton.contains(event.target)
  ) {
    sidebar.classList.remove("open");
  }
});

/* ==============================
   16. Current Date
============================== */

function showCurrentDate() {
  const today = new Date();

  const formattedDate = today.toLocaleDateString("ar-EG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  document.getElementById("current-date").textContent = formattedDate;
}

/* ==============================
   17. Initialize App
============================== */

function initApp() {
  applyTheme(getSavedTheme());

  showCurrentDate();

  renderApp();

  console.log("Taskora App Started Successfully!");
}

initApp();

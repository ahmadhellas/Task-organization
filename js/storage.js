const STORAGE_KEY = "taskora_tasks";

function getTasks() {
  const savedTasks = localStorage.getItem(STORAGE_KEY);

  if (savedTasks) {
    try {
      const parsedTasks = JSON.parse(savedTasks);

      if (Array.isArray(parsedTasks)) {
        return parsedTasks;
      }
    } catch (error) {
      console.error("Error reading tasks:", error);
    }
  }

  return [...defaultTasks];
}

function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function getSavedTheme() {
  return localStorage.getItem("taskora_theme") || "light";
}

function saveTheme(theme) {
  localStorage.setItem("taskora_theme", theme);
}

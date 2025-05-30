/**
 * @module Modal
 * @description Manages the modal for creating and editing tasks in the Kanban app.
 */

let currentTask = null;
let isEditing = false;

/**
 * Opens the modal for creating or editing a task.
 * @function
 * @param {Object|null} task - The task to edit (null for creating a new task).
 * @param {boolean} editing - Whether the modal is in edit mode.
 */
export function openModal(task = null, editing = false) {
  const modal = document.getElementById('task-modal');
  const titleInput = document.getElementById('task-title');
  const descriptionInput = document.getElementById('task-description');
  const statusSelect = document.getElementById('task-status');
  const prioritySelect = document.getElementById('task-priority');
  const deleteTaskBtn = document.getElementById('delete-task');
  const saveChangesBtn = document.getElementById('save-changes');

  isEditing = editing;
  currentTask = task;

  if (isEditing && task) {
    titleInput.value = task.title;
    descriptionInput.value = task.description || '';
    statusSelect.value = task.status;
    prioritySelect.value = task.priority || 'Medium';
    deleteTaskBtn.style.display = 'block';
    saveChangesBtn.textContent = 'Save Changes';
  } else {
    titleInput.value = '';
    descriptionInput.value = '';
    statusSelect.value = 'todo';
    prioritySelect.value = 'Medium';
    deleteTaskBtn.style.display = 'none';
    saveChangesBtn.textContent = 'Create Task';
  }

  modal.style.display = 'block';
}

/**
 * Closes the modal and resets state.
 * @function
 */
export function closeModal() {
  const modal = document.getElementById('task-modal');
  modal.style.display = 'none';
  currentTask = null;
  isEditing = false;
}

/**
 * Saves a new task or updates an existing one.
 * @function
 * @param {Array<Object>} tasks - The current array of tasks.
 * @param {Function} updateTasks - The function to update tasks in storage.
 * @param {Function} renderTasks - The function to render tasks.
 * @returns {void}
 */
export function saveChanges(tasks, updateTasks, renderTasks) {
  const titleInput = document.getElementById('task-title');
  const descriptionInput = document.getElementById('task-description');
  const statusSelect = document.getElementById('task-status');
  const prioritySelect = document.getElementById('task-priority');

  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();
  const status = statusSelect.value;
  const priority = prioritySelect.value;

  if (!title) {
    alert('Please enter a title!');
    return;
  }

  if (isEditing && currentTask) {
    currentTask.title = title;
    currentTask.description = description;
    currentTask.status = status;
    currentTask.priority = priority;
  } else {
    const newTask = {
      id: tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
      title,
      description,
      status,
      priority
    };
    tasks.push(newTask);
  }

  updateTasks(tasks);
  renderTasks(tasks, openModal);
  closeModal();
}

/**
 * Deletes the current task being edited.
 * @function
 * @param {Array<Object>} tasks - The current array of tasks.
 * @param {Function} updateTasks - The function to update tasks in storage.
 * @param {Function} renderTasks - The function to render tasks.
 * @returns {void}
 */
export function deleteTask(tasks, updateTasks, renderTasks) {
  if (!currentTask || !isEditing) return;
  const updatedTasks = tasks.filter(t => t.id !== currentTask.id);
  updateTasks(updatedTasks);
  renderTasks(updatedTasks, openModal);
  closeModal();
}
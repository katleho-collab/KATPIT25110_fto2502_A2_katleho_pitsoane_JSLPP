/**
 * @module Render
 * @description Manages rendering and sorting of tasks in the Kanban app.
 */

/**
 * Renders all tasks into their respective columns, sorted by priority.
 * @function
 * @param {Array<Object>} tasks - The array of tasks to render.
 * @param {Function} openModal - The function to open the modal for editing a task.
 */
export function renderTasks(tasks, openModal) {
  const columns = {
    'todo': document.querySelector('.column-div[data-status="todo"] .tasks-container'),
    'doing': document.querySelector('.column-div[data-status="doing"] .tasks-container'),
    'done': document.querySelector('.column-div[data-status="done"] .tasks-container')
  };

  // Clear existing tasks in all columns
  Object.values(columns).forEach(column => column.innerHTML = '');

  // Define priority order for sorting
  const priorityOrder = {
    'High': 1,
    'Medium': 2,
    'Low': 3
  };

  // Sort tasks by priority within each status
  const todoTasks = tasks
    .filter(t => t.status === 'todo')
    .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  const doingTasks = tasks
    .filter(t => t.status === 'doing')
    .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  const doneTasks = tasks
    .filter(t => t.status === 'done')
    .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  // Render tasks for each column
  todoTasks.forEach(task => {
    const taskDiv = document.createElement('div');
    taskDiv.classList.add('task-div');
    taskDiv.innerHTML = `
      <span>${task.title}</span>
      <span class="priority-badge priority-${task.priority.toLowerCase()}"></span>
    `;
    taskDiv.addEventListener('click', () => openModal(task, true));
    columns['todo'].appendChild(taskDiv);
  });

  doingTasks.forEach(task => {
    const taskDiv = document.createElement('div');
    taskDiv.classList.add('task-div');
    taskDiv.innerHTML = `
      <span>${task.title}</span>
      <span class="priority-badge priority-${task.priority.toLowerCase()}"></span>
    `;
    taskDiv.addEventListener('click', () => openModal(task, true));
    columns['doing'].appendChild(taskDiv);
  });

  doneTasks.forEach(task => {
    const taskDiv = document.createElement('div');
    taskDiv.classList.add('task-div');
    taskDiv.innerHTML = `
      <span>${task.title}</span>
      <span class="priority-badge priority-${task.priority.toLowerCase()}"></span>
    `;
    taskDiv.addEventListener('click', () => openModal(task, true));
    columns['done'].appendChild(taskDiv);
  });

  // Update column headers with task counts
  document.getElementById('toDoText').textContent = `TODO (${todoTasks.length})`;
  document.getElementById('doingText').textContent = `DOING (${doingTasks.length})`;
  document.getElementById('doneText').textContent = `DONE (${doneTasks.length})`;
}
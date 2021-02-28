import { getDataFromApi, addTaskToApi, deleteTaskFromApi } from './data';
import getIcon from './styles/deleteicon';

class PomodoroApp {
  constructor(options) {
    let { tableTbodySelector, taskFormSelector } = options;
    this.$tableTbody = document.querySelector(tableTbodySelector);
    this.$taskForm = document.querySelector(taskFormSelector);
    this.$taskFormInput = this.$taskForm.querySelector('input');
    this.$formButton = this.$taskForm.querySelector('button');
  }

  addTask(task) {
    this.$formButton.textContent = 'Loading...';
    this.$formButton.disabled = true;
    addTaskToApi(task)
      .then((data) => data.json())
      .then((newTask) => {
        this.addTaskToTable(newTask);
        this.$formButton.textContent = 'Add Task';
        this.$formButton.disabled = false;
      });
  }

  addTaskToTable(task, index) {
    const $newTaskEl = document.createElement('tr');
    $newTaskEl.innerHTML = `
    <th scope="row">${task.id}</th>
    <td>${task.title}</td>
    <td>
    <button type="button" class="btn btn-danger" id='${task.id}'>
        ${getIcon('trash')}
      </button>
    </td>`;
    this.$tableTbody.appendChild($newTaskEl);
    this.$taskFormInput.value = '';

    const btn = document.getElementById(task.id);

    btn.addEventListener('click', () =>
      this.handleDeleteTask(task.id, $newTaskEl)
    );
  }

  handleAddTask() {
    this.$taskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const task = { title: this.$taskFormInput.value };
      this.addTask(task);
    });
  }

  handleDeleteTask(id, $newTaskEl) {
    deleteTaskFromApi(id).then((res) => {
      if (res.status === 200) $newTaskEl.remove();
    });
  }

  fillTasksTable() {
    getDataFromApi().then((currentTasks) => {
      currentTasks.forEach((task, index) => {
        this.addTaskToTable(task, index + 1);
      });
    });
  }

  init() {
    this.fillTasksTable();
    this.handleAddTask();
  }
}

export default PomodoroApp;

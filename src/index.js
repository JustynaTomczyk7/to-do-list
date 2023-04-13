import "./reset.css";
import "./style.css";
import { default as binImage } from "./img/bin.png";
import { default as approvedImage } from "./img/approved.png";

const taskInput = document.querySelector("#new-task");
const addBtn = document.querySelector("#add");
const alertText = document.querySelector("#alert");
const todoList = document.querySelector("#todo-list");
const uncheckedBtn = document.querySelectorAll(".unchecked");
const approvedBtn = document.querySelectorAll(".approved");
const binBtn = document.querySelectorAll(".bin");
const deleteAllBtn = document.querySelector("#deleteAll");

let idLastElement = 0;
const tabTasks = [
  {
    id: idLastElement++,
    value: "Zrobić trening",
    isDone: true,
  },
  {
    id: idLastElement++,
    value: "Podlać kwiatki",
    isDone: false,
  },
  {
    id: idLastElement++,
    value: "Umówić się do lekarza",
    isDone: false,
  },
  {
    id: idLastElement++,
    value: "Odpisać na maile",
    isDone: false,
  },
];

function getTasks() {
  const localStorageTasks = localStorage.getItem("tasks");
  const tasksFromLocalStorage =
    localStorageTasks && JSON.parse(localStorage.getItem("tasks"));
  const newTasksList =
    tasksFromLocalStorage && tasksFromLocalStorage.length
      ? tasksFromLocalStorage
      : tabTasks;
  const ids = newTasksList.map((task) => task.id);

  idLastElement = Math.max(...ids) + 1;
  localStorage.setItem("tasks", JSON.stringify(newTasksList));

  return newTasksList;
}

const tasks = getTasks();

function selection(element) {
  element.addEventListener("click", (e) => {
    e.stopPropagation();
    const approvedElement = e.target.querySelector(".approved");
    approvedElement.classList.add("display-block");
    approvedElement.classList.remove("display-none");

    const taskListInput = approvedElement
      .closest(".task")
      .querySelector(".input-list-task");
    taskListInput.classList.add("text-decoration");
    taskListInput.classList.remove("text-decoration-none");

    todoList.appendChild(approvedElement.closest(".task"));

    const data = approvedElement.closest(".task").id;
    const taskId = data.slice(-1);
    const task = tasks.find((taskEl) => taskEl.id === Number(taskId));
    task.isDone = true;

    localStorage.setItem("tasks", JSON.stringify(tasks));
  });
}

function deselect(element) {
  element.addEventListener("click", (e) => {
    e.stopPropagation();
    const approvedElement = e.target;
    approvedElement.classList.add("display-none");
    approvedElement.classList.remove("display-block");

    const taskListInput = approvedElement
      .closest(".task")
      .querySelector(".input-list-task");
    taskListInput.classList.add("text-decoration-none");
    taskListInput.classList.remove("text-decoration");

    todoList.prepend(approvedElement.closest(".task"));

    const data = approvedElement.closest(".task").id;
    const taskId = data.slice(-1);
    const task = tasks.find((taskEl) => taskEl.id === Number(taskId));
    task.isDone = false;

    localStorage.setItem("tasks", JSON.stringify(tasks));
  });
}

function deleteTask(element) {
  element.addEventListener("click", (e) => {
    e.stopPropagation();
    const taskToDelete = e.target.closest(".task");
    const taskId = Number(taskToDelete.id.slice(-1));
    const index = tasks.findIndex((el) => el.id == taskId);

    taskToDelete.remove();
    tasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  });
}

function renderHTMLElement(id, value, isDone) {
  const listElement = document.createElement("li");
  listElement.classList.add("task");
  listElement.setAttribute("id", `list-element-${id}`);
  listElement.innerHTML += `
            <span class="unchecked"><img class="approved ${
              isDone ? "" : "display-none"
            }" src="${approvedImage}" alt="approved"></span>
            <input class="${
              isDone ? "text-decoration" : ""
            } input-list-task" type="text" readonly value="${value}" readonly>
            <img class="bin" src="${binImage}" alt="bin">
        `;

  const elementUncheckedBtn = listElement.querySelector(".unchecked");
  const elementApprovedBtn = listElement.querySelector(".approved");
  const elementBinBtn = listElement.querySelector(".bin");

  selection(elementUncheckedBtn);
  deselect(elementApprovedBtn);
  deleteTask(elementBinBtn);

  if (isDone == true) {
    todoList.appendChild(listElement);
  } else {
    todoList.prepend(listElement);
  }
}

function rendering() {
  tasks.forEach((task) => {
    renderHTMLElement(task.id, task.value, task.isDone);
  });
}

function newTask() {
  const newTaskId = idLastElement++;
  const newTaskOnList = {
    id: newTaskId,
    value: taskInput.value,
    isDone: false,
  };

  renderHTMLElement(newTaskId, taskInput.value, false);
  tasks.push(newTaskOnList);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  taskInput.value = "";
  alertText.classList.add("display-none");
  alertText.classList.remove("display-block");
}

function actualTime() {
  const today = new Date();
  document.querySelector(
    "#time"
  ).innerHTML = `${today.toLocaleDateString()}, ${today.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

setInterval(actualTime, 1000 * 30);
actualTime();

addBtn.addEventListener("click", () => {
  if (taskInput.value == "") {
    alertText.classList.add("display-block");
    alertText.classList.remove("display-none");
  } else {
    newTask();
  }
});

deleteAllBtn.addEventListener("click", () => {
  todoList.innerHTML = "";
  tasks.length = 0;
  localStorage.removeItem("tasks");
});

uncheckedBtn.forEach((element) => {
  selection(element);
});

approvedBtn.forEach((element) => {
  deselect(element);
});

binBtn.forEach((element) => {
  deleteTask(element);
});

rendering();

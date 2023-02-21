import './reset.css';
import './style.css';
import { default as binImage } from './img/bin.png'
import { default as approvedImage } from './img/approved.png'

const taskInput = document.querySelector("#new-task");
const todoList = document.querySelector("#todo-list");
const uncheckedBtn = document.querySelectorAll('.unchecked');
const approvedBtn = document.querySelectorAll('.approved');
const binBtn = document.querySelectorAll('.bin');
const addBtn = document.querySelector('#add');
const alertText = document.querySelector('#alert');

function actualTime() {
    const today = new Date();
    document.querySelector("#time").innerHTML = `${today.toLocaleDateString()}, ${today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

function selection(element) {
    element.addEventListener('click', (e) => {
        e.stopPropagation();
        const approvedElement = e.target.querySelector('.approved');
        approvedElement.classList.add('display-block');
        approvedElement.classList.remove('display-none');

        const taskListInput = approvedElement.closest('.task').querySelector('.input-list-task');
        taskListInput.classList.add('text-decoration');
        taskListInput.classList.remove('text-decoration-none');

        todoList.appendChild(approvedElement.closest('.task'));
    })
}

function deselect(element) {
    element.addEventListener('click', (e) => {
        e.stopPropagation();
        const approvedElement = e.target;
        approvedElement.classList.add('display-none');
        approvedElement.classList.remove('display-block');

        const taskListInput = approvedElement.closest('.task').querySelector('.input-list-task');
        taskListInput.classList.add('text-decoration-none');
        taskListInput.classList.remove('text-decoration');

        todoList.prepend(approvedElement.closest('.task'));
    })
}

function deleteTask(element) {
    element.addEventListener('click', (e) => {
        e.stopPropagation();
        const taskToDelete = e.target.closest(('.task'));
        taskToDelete.remove();
    })
}

function newTask() {
    const newListElement = document.createElement('li');
    newListElement.classList.add('task');

    newListElement.innerHTML += `
        <span class="unchecked"><img class="approved display-none" src="${approvedImage}" alt="approved"></span>
        <input class="input-list-task" type="text" readonly value="${taskInput.value}" readonly>
        <img class="bin" src="${binImage}" alt="bin">
    `;

    const newElementUncheckedBtn = newListElement.querySelector('.unchecked');
    const newElementApprovedBtn = newListElement.querySelector('.approved');
    const newElementBinBtn = newListElement.querySelector('.bin');

    selection(newElementUncheckedBtn);
    deselect(newElementApprovedBtn);
    deleteTask(newElementBinBtn);

    todoList.prepend(newListElement);
    taskInput.value = "";

    alertText.classList.add('display-none');
    alertText.classList.remove('display-block');
}

setInterval(actualTime, 1000 * 30);
actualTime();

addBtn.addEventListener('click', () => {
    if (taskInput.value == "") {
        alertText.classList.add('display-block');
        alertText.classList.remove('display-none');
    } else {
        newTask();
    }
})

uncheckedBtn.forEach((element) => {
    selection(element)
})

approvedBtn.forEach((element) => {
    deselect(element)
})

binBtn.forEach((element) => {
    deleteTask(element)
})





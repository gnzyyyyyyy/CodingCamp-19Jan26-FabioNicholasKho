// DOM ELEMENTS
const taskInput = document.getElementById('taskInput');
const dateInput = document.getElementById('dateInput');
const addTaskBtn = document.getElementById('addTask');
const taskTableBody = document.getElementById('taskTableBody');
const totalTasks = document.getElementById('totalTasks');
const completedTasks = document.getElementById('completedTasks');
const pendingTasks = document.getElementById('pendingTasks');
const searchInput = document.getElementById('searchInput');
const statusFilter = document.getElementById('statusFilter');

// GLOBAL VARIABLES
let tasks = [];

// EVENT LISTENERS
addTaskBtn.addEventListener('click', addTaskHandler);
searchInput.addEventListener('input', searchInputHandler);
statusFilter.addEventListener('change', statusFilterHandler);

//FUNCTIONS
function addTaskHandler() {
    const task = taskInput.value.trim();
    const dueDate = dateInput.value;

    if (task == "" || dueDate == "") {
        alert("Please enter a task and a due date.");
        return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDate = new Date(dueDate);
    if (selectedDate < today) {
        alert("Due date cannot be in the past.");
        return;
    }

    tasks.push({
        id: Date.now(),
        task,
        dueDate,
        completed: false
    });

    taskInput.value = "";
    dateInput.value = "";
    renderTasks();
    updateDashboard();
}

function renderTasks(taskList = tasks) {
    taskTableBody.innerHTML = "";
    taskList.forEach((task) => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${task.task}</td>
            <td>${task.dueDate}</td>
            <td>${task.completed ? 'Completed' : 'Pending'}</td>
            <td>
                <button class="edit-btn">Edit</button>
                <button class="status-btn">
                    ${task.completed ? "Undo" : "Mark As Done"}
                </button>
                <button class="delete-btn">Delete</button>
            </td>
        `;

        row.querySelector('.edit-btn').addEventListener('click', () => {
            editTask(task.id);
        });

        row.querySelector('.status-btn').addEventListener('click', () => {
            toggleTask(task.id);
        });
        row.querySelector('.delete-btn').addEventListener('click', () => {
            deleteTask(task.id);
        });

        taskTableBody.appendChild(row);
    });
}

function editTask(id) {
    const task = tasks.find((task) => task.id === id);
    taskInput.value = task.task;
    dateInput.value = task.dueDate;
    tasks = tasks.filter((task) => task.id !== id);
    renderTasks();
    updateDashboard();
}

function deleteTask(id) {
    tasks = tasks.filter((task) => task.id !== id);
    renderTasks();
    updateDashboard();
}

function toggleTask(id) {
    tasks = tasks.map((task) => {
        if (task.id === id) {
            task.completed = !task.completed;
        }
        return task;
    });
    renderTasks();
    updateDashboard();
}

function updateDashboard() {
    totalTasks.textContent = tasks.length;
    completedTasks.textContent = tasks.filter(t => t.completed).length;
    pendingTasks.textContent = tasks.filter(t => !t.completed).length;
}

function searchInputHandler() {
    const searchTerm = searchInput.value.toLowerCase();

    const filteredTasks = tasks.filter(task =>
        task.task.toLowerCase().includes(searchTerm)
    );

    renderTasks(filteredTasks);
}

function statusFilterHandler() {
    const selectedStatus = statusFilter.value;

    let filteredTasks;

    if (selectedStatus === "all") {
        filteredTasks = tasks;
    } else {
        const isCompleted = selectedStatus === "completed";
        filteredTasks = tasks.filter(task => task.completed === isCompleted);
    }

    renderTasks(filteredTasks);
}
const presetValues = [
    {
        title: "Wake up at 5am",
        completed: true
    },
    {
        title: "Learn how to use Vue.js",
        completed: false
    },
    {
        title: "Drink coffee",
        completed: false
    }
];

const STORAGE_KEY = "todo-app";
const todoStorage = {
    fetch: function() {
        var todos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || presetValues;
        todos.forEach(function(todo, index) {
            todo.id = index;
        });
        todoStorage.uid = todos.length;
        return todos;
    },
    save: function(todos) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    }
};

var todos = todoStorage.fetch();
var newTodoInput = document.getElementById("new-todo");
var addTodoButton = document.getElementById("add-todo");
var todoList = document.querySelector(".todo-list");
var toggleAllCheckbox = document.getElementById("toggle-all");
var clearCompletedButton = document.getElementById("clear-completed");
var remainingCount = document.getElementById("remaining-count");
var remainingPluralize = document.getElementById("remaining-pluralize");
var allFilterLink = document.querySelector('.filters li:first-child a');
var activeFilterLink = document.querySelector('.filters li:nth-child(2) a');
var completedFilterLink = document.querySelector('.filters li:nth-child(3) a');

function addTodo() {
    var value = newTodoInput.value.trim();
    if (value !== "") {
        todos.push({
            id: todoStorage.uid++,
            title: value,
            completed: false
        });
        newTodoInput.value = "";
        renderTodos();
    }
}

function removeTodo(todo) {
    todos.splice(todos.indexOf(todo), 1);
    renderTodos();
}

function toggleTodoComplete(event) {
    var todoItem = event.target.closest("li");
    todoItem.classList.toggle("completed");
    updateRemainingCount();
}

function updateRemainingCount() {
    var incompleteTodos = todos.filter(function(todo) {
        return !todo.completed;
    });
    remainingCount.textContent = incompleteTodos.length;
    remainingPluralize.textContent = incompleteTodos.length === 1 ? "task" : "tasks";
}

function clearCompletedTodos() {
    todos = todos.filter(function(todo) {
        return !todo.completed;
    });
    renderTodos();
}

function renderTodos() {
    var filteredTodos = todos;
    var hash = window.location.hash.replace(/#\/?/, "");

    if (hash === "active") {
        filteredTodos = todos.filter(function(todo) {
            return !todo.completed;
        });
    } else if (hash === "completed") {
        filteredTodos = todos.filter(function(todo) {
            return todo.completed;
        });
    }

    todoList.innerHTML = "";
    filteredTodos.forEach(function(todo) {
        var todoItem = document.createElement("li");
        todoItem.className = "todo";
        todoItem.classList.toggle("completed", todo.completed);
        todoItem.innerHTML = `
            <div class="view">
                <input class="toggle" type="checkbox" ${todo.completed ? "checked" : ""}>
                <label>${todo.title}</label>
                <button class="destroy"></button>
            </div>
        `;
        var destroyButton = todoItem.querySelector(".destroy");
        destroyButton.addEventListener("click", function() {
            removeTodo(todo);
        });
        var toggleCheckbox = todoItem.querySelector(".toggle");
        toggleCheckbox.addEventListener("change", toggleTodoComplete);
        todoList.appendChild(todoItem);
    });

    updateRemainingCount();
}

function handleFilterClick(event) {
    event.preventDefault();
    var filterLinks = document.querySelectorAll(".filters a");
    filterLinks.forEach(function(link) {
        link.classList.toggle("selected", link === event.target);
    });
    renderTodos();
}

function handleToggleAllChange(event) {
    var isChecked = event.target.checked;
    todos.forEach(function(todo) {
        todo.completed = isChecked;
    });
    renderTodos();
}

addTodoButton.addEventListener("click", addTodo);
newTodoInput.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        addTodo();
    }
});
clearCompletedButton.addEventListener("click", clearCompletedTodos);
allFilterLink.addEventListener("click", handleFilterClick);
activeFilterLink.addEventListener("click", handleFilterClick);
completedFilterLink.addEventListener("click", handleFilterClick);
toggleAllCheckbox.addEventListener("change", handleToggleAllChange);

renderTodos();

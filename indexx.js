// Preset todo list values
const presetValues = [
    {
        title: "Make a ToDo Using Vanilla.js",
        completed: true
    },
    {
        title: "Complete the modules",
        completed: false
    },
    {
        title: "Test 1",
        completed: false
    }
];


//local Storage
const STORAGE_KEY = "todo-app";

//handle localStorage ops
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

//fetch Todo
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

//func to Add a ToDo
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

// func to remove a todo
function removeTodo(todo) {
    todos.splice(todos.indexOf(todo), 1);
    renderTodos();
}

//completion of a todo
function toggleTodoComplete(event) {
    var todoItem = event.target.closest("li");
    todoItem.classList.toggle("completed");
    updateRemainingCount();
}

//update the count 
function updateRemainingCount() {
    var incompleteTodos = todos.filter(function(todo) {
        return !todo.completed;
    });
    remainingCount.textContent = incompleteTodos.length;
    remainingPluralize.textContent = incompleteTodos.length === 1 ? "task" : "tasks";
}

//clear Todos
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

//Click Events
function handleFilterClick(event) {
    event.preventDefault();
    var filterLinks = document.querySelectorAll(".filters a");
    filterLinks.forEach(function(link) {
        link.classList.toggle("selected", link === event.target);
    });
    renderTodos();
}

//handle toggling of checkbox
function handleToggleAllChange(event) {
    var isChecked = event.target.checked;
    todos.forEach(function(todo) {
        todo.completed = isChecked;
    });
    renderTodos();
}


//event Listener
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

//function call
renderTodos();

// Model
// Storing data and manipulating them
let schedule;
const savedTodos = JSON.parse(localStorage.getItem("schedule"));

if (typeof(savedTodos) === 'object' && savedTodos !== null) schedule = savedTodos;
else schedule = {};

function storeTodo(tarefa, data, id) {
    schedule[tarefa] = {
        dueDate: data,
        status: "Undone",
        id: id
    };
    saveTodos();
};

function unStoreTodo(idToDelete) {
    const toBeDeleted = getTodo(idToDelete);
    delete schedule[toBeDeleted];
    saveTodos();
    return toBeDeleted
};

function getTodo(knownId) {
    let tasks = Object.keys(schedule);
    const chosenOne = tasks.filter(task => schedule[task].id === knownId);
    return chosenOne[0];
};

function saveTodos() {
    localStorage.setItem("schedule", JSON.stringify(schedule));
};

// View
// Handles what is displayed on the screen
render();

function removeTaskDiv(toBeDeleted) {
    const div = document.getElementById(toBeDeleted);
    div.parentNode.removeChild(div);
};

function render() {
    board = document.getElementById("to-do");
    tasks = Object.keys(schedule);
    board.innerHTML = "";
    tasks.forEach(task => {
        displayingTask(task, board);
    });
};

function displayingTask(task) {
    let board = document.getElementById("to-do");
    let todo = document.createElement("div");
    todo.id = task;
    const texto = document.createElement("p");
    texto.style.display = "inline";
    texto.innerHTML = task + " " + schedule[task].dueDate;
    if (schedule[task].status === "Done") {
        texto.style.textDecoration = "line-through";
        texto.style.color = "grey";
    }
    similarities(todo, texto, task);
    board.prepend(todo);
};

function similarities(todo, texto, task) {
    let edit, done, deleted;
    edit = createButton(" ", edit, editTask, task);
    done = createButton("✓", done, checkTask, task);
    deleted = createButton("✕", deleted, deleteTask, task);
    todo.innerHTML = null;
    todo.appendChild(texto);
    todo.prepend(edit);
    todo.appendChild(done);
    todo.appendChild(deleted);
};

function displayingChangedTask(task, div) {
    const texto = document.createElement("p");
    texto.style.display = "inline";
    texto.innerHTML = task + " " + schedule[task].dueDate;
    div.id = task;
    similarities(div, texto, task);
    div.style.backgroundColor = "rgba(95, 158, 160, 0.13)";
};

function createButton(name, varName, funcao, task) {
    varName = document.createElement("button");
    varName.innerHTML = name;
    varName.onclick = funcao;
    varName.id = schedule[task].id;
    if (name === "✓" || name === "✕") varName.className = "gemeos";
    else if (name === ".") {
        varName.className = "saveButton";
        varName.innerHTML = " ";
    }
    return varName;
};

function renderNewInputs(toBeEdited, divToBeChanged) {
    const input = document.createElement("input");
    const inputDate = document.createElement("input");
    let button;
    button = createButton(".", button, updateTodo, toBeEdited);
    button.style.backgroundImage = "url('img/icons/save_task.png')";
    button.style.backgroundSize = "20px";
    button.style.backgroundRepeat = "no-repeat";
    button.style.backgroundPosition = "center";
    button.style.padding = "15px";
    input.type = "text";
    input.id = schedule[toBeEdited].id + "task";
    inputDate.type = "date";
    inputDate.id = schedule[toBeEdited].id + "date";
    input.value = toBeEdited;
    divToBeChanged.innerHTML = null;
    divToBeChanged.appendChild(input);
    input.focus();
    divToBeChanged.appendChild(inputDate);
    divToBeChanged.appendChild(button);
    divToBeChanged.style.backgroundColor = "rgba(95, 158, 160, 0.397)";
};

// Controller
// The buttons and iterations the user presses or does
function checkTask(event) {
    const toBeStyled = getTodo(event.target.id);
    const elemento = document.getElementById(toBeStyled).children[1];
    elemento.style.textDecoration = "line-through";
    elemento.style.color = "grey";
    schedule[toBeStyled].status = "Done";
    saveTodos();
};

function addTask() {
    const elInp = document.getElementById("textoTask");
    const tarefa = elInp.value;
    const data = document.getElementById("textoData").value;
    const board = document.getElementById("to-do");
    const id = "" + new Date().getTime();
    if (tarefa && !(schedule.hasOwnProperty(tarefa))) {
        storeTodo(tarefa, data, id);
        displayingTask(tarefa, board);
    };
    elInp.value = "";
    elInp.focus();
};

function deleteTask(event) {
    const idToDelete = event.target.id;
    removeTaskDiv(unStoreTodo(idToDelete));
};

function editTask(event) {
    const idToEdit = event.target.id;
    const toBeEdited = getTodo(idToEdit);
    const divToBeChanged = document.getElementById(toBeEdited);
    renderNewInputs(toBeEdited, divToBeChanged);
};

function updateTodo() {
    const div = document.getElementById(getTodo(this.id));
    unStoreTodo(this.id);
    const tarefa = document.getElementById(this.id+"task").value;
    const data = document.getElementById(this.id+"date").value;
    if (!tarefa || schedule[tarefa]) div.parentNode.removeChild(div);
    else {
        storeTodo(tarefa, data, this.id);
        displayingChangedTask(tarefa, div);
    };
};
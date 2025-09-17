// ========== DOM tipado (con genéricos en querySelector) ==========
const form = document.querySelector("#task-form");
const input = document.querySelector("#task-input");
const list = document.querySelector("#task-list");
const filtroSelect = document.querySelector("#filtro");
const btnBorrarTodo = document.querySelector("#borrar-todo");
const contador = document.querySelector("#contador-tareas");
// Si querés evitar el "!" y ser 100% seguro:
// if (!form || !input || !list || !filtroSelect || !btnBorrarTodo || !contador) {
//   throw new Error("Faltan elementos en el DOM");
// }
// ========== Storage ==========
const STORAGE_KEY = "tasks";
function loadTasks() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw)
        return [];
    try {
        const data = JSON.parse(raw);
        if (!Array.isArray(data))
            return [];
        // Luego validamos con Zod; por ahora casteo suave:
        return data;
    }
    catch {
        return [];
    }
}
function saveTasks(tasks) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}
// ========== Estado ==========
let tasks = loadTasks();
let currentFilter = "todas";
// ========== Mutadores ==========
function addTask(text) {
    const t = {
        id: crypto.randomUUID(),
        text,
        done: false,
        createdAt: Date.now(),
    };
    tasks = [t, ...tasks];
    saveTasks(tasks);
    return t;
}
function toggleTask(id) {
    tasks = tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
    saveTasks(tasks);
}
function updateTaskText(id, newText) {
    tasks = tasks.map((t) => (t.id === id ? { ...t, text: newText } : t));
    saveTasks(tasks);
}
function deleteTask(id) {
    tasks = tasks.filter((t) => t.id !== id);
    saveTasks(tasks);
}
function clearAll() {
    tasks = [];
    saveTasks(tasks);
}
// ========== Filtro / Visibilidad ==========
function getVisibleTasks() {
    switch (currentFilter) {
        case "completadas":
            return tasks.filter((t) => t.done);
        case "pendientes":
            return tasks.filter((t) => !t.done);
        default:
            return tasks;
    }
}
// ========== Render ==========
function renderList() {
    list.innerHTML = "";
    for (const t of getVisibleTasks()) {
        list.appendChild(renderItem(t));
    }
    renderCounter();
}
function renderItem(t) {
    const li = document.createElement("li");
    if (t.done)
        li.classList.add("done");
    // Checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = t.done;
    checkbox.addEventListener("change", () => {
        toggleTask(t.id);
        renderList(); // simple y efectivo
    });
    // Texto (editable con doble click)
    const span = document.createElement("span");
    span.textContent = t.text;
    span.title = "Doble click para editar";
    span.addEventListener("dblclick", (_e) => {
        const inputEdit = document.createElement("input");
        inputEdit.type = "text";
        inputEdit.value = t.text;
        inputEdit.classList.add("editar-input");
        const save = () => {
            const nuevo = inputEdit.value.trim();
            if (nuevo && nuevo !== t.text) {
                updateTaskText(t.id, nuevo);
            }
            renderList();
        };
        inputEdit.addEventListener("keydown", (ke) => {
            if (ke.key === "Enter")
                save();
            if (ke.key === "Escape")
                renderList();
        });
        inputEdit.addEventListener("blur", save);
        li.replaceChild(inputEdit, span);
        inputEdit.focus();
        inputEdit.setSelectionRange(inputEdit.value.length, inputEdit.value.length);
    });
    // Botón borrar
    const delBtn = document.createElement("button");
    delBtn.type = "button";
    delBtn.textContent = "Eliminar";
    delBtn.addEventListener("click", () => {
        deleteTask(t.id);
        renderList();
    });
    li.append(checkbox, span, delBtn);
    return li;
}
function renderCounter() {
    const total = tasks.length;
    const pendientes = tasks.filter((t) => !t.done).length;
    contador.textContent = `${pendientes} tareas pendientes / ${total} en total`;
}
// ========== Eventos ==========
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const value = input.value.trim();
    if (!value)
        return;
    addTask(value);
    input.value = "";
    renderList();
});
filtroSelect.addEventListener("change", () => {
    // El value del <select> ya es "todas" | "completadas" | "pendientes"
    // pero lo asertamos para que TS lo entienda como Filter:
    currentFilter = filtroSelect.value;
    renderList();
});
btnBorrarTodo.addEventListener("click", () => {
    if (confirm("¿Borrar todas las tareas?")) {
        clearAll();
        renderList();
    }
});
// ==========  ==========
renderList();
export {};
//# sourceMappingURL=script.js.map
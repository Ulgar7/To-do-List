// Elementos del DOM
const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const list = document.getElementById("task-list");


const filtroSelect = document.getElementById("filtro");
let filtroActual = "todas";

const botonTema = document.getElementById("toggle-tema")

// Cargar tareas desde localStorage al iniciar
document.addEventListener("DOMContentLoaded", () => {
  const temaGuardado = localStorage.getItem("tema")

  if (temaGuardado === "dark") {
    document.body.classList.add("dark")
  }

  actualizarIconoTema();
  renderizarTodasLasTareas();
  actualizarEstado();
});

botonTema.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  const temaActual = document.body. classList.contains("dark")
    ? "dark"
    : "light";

    localStorage.setItem("tema", temaActual)
    actualizarIconoTema();
}) 

function actualizarIconoTema(){
  if(document.body.classList.contains("dark")){
    botonTema.textContent = "☀️ Cambiar tema" ;
  }else{
    botonTema.textContent = "🌙 Cambiar tema";
  }
}

function renderizarTodasLasTareas() {
  list.innerHTML = ""; // Borramos todo lo visible

  const tareasGuardadas = JSON.parse(localStorage.getItem("tareas")) || [];
  tareasGuardadas.forEach(tarea => renderizarTarea(tarea));
}


// Función para renderizar una tarea en la lista
function renderizarTarea(tarea) {
  const li = document.createElement("li");
  const spanTexto = document.createElement("span");
  spanTexto.textContent = tarea.texto;
  li.appendChild(spanTexto);
  

  // Edicion de Texto
  spanTexto.addEventListener("dblclick", (e) => {
    
    
  const inputEdicion = document.createElement("input");
  inputEdicion.type = "text";
  inputEdicion.value = tarea.texto;
  inputEdicion.classList.add("editar-input");

  li.replaceChild(inputEdicion, spanTexto);
  inputEdicion.focus();

  const guardarCambios = () => {
    const nuevoTexto = inputEdicion.value.trim();
    if (nuevoTexto !== "") {
      tarea.texto = nuevoTexto;
      spanTexto.textContent = nuevoTexto;
    }
    li.replaceChild(spanTexto, inputEdicion);
    actualizarEstado();
  };

  inputEdicion.addEventListener("blur", guardarCambios);
  inputEdicion.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      guardarCambios();
    }
  });
});

//  Botón para agregar una subtarea
const btnAgregarSubtarea = document.createElement("button");
btnAgregarSubtarea.textContent = "+"
btnAgregarSubtarea.classList.add("btn-subtarea")

li.appendChild(btnAgregarSubtarea);

btnAgregarSubtarea.addEventListener("click", (e) => {
  e.stopPropagation();

  

  if (li.querySelector(".nueva-subtarea")) return;
  

  let ulSubtareas = li.querySelector("ul.subtareas");

  if(!ulSubtareas){
    ulSubtareas = document.createElement("ul");
    ulSubtareas.classList.add("subtareas");
    li.appendChild(ulSubtareas)
  }
  
  const formSub = document.createElement("form");
  formSub.classList.add("nueva-subtarea");

  const inputSub = document.createElement("input");
  inputSub.type = "text";
  inputSub.placeholder = "Nueva subtarea...";
  inputSub.autocomplete = "off";

  formSub.appendChild(inputSub);
  ulSubtareas.appendChild(formSub);

  inputSub.focus();

  let confirmando = false;
  
  formSub.addEventListener("submit", (e) =>{
    e.preventDefault();
    confirmando = true;

    const textoLimpio = inputSub.value.trim();

    setTimeout(() => {
  if (formSub.isConnected) formSub.remove();
});

    if (textoLimpio === "") return;

    const liSub = document.createElement("li");

    const spanSub = document.createElement("span");
    spanSub.textContent = textoLimpio;
    liSub.appendChild(spanSub);

    const btnEliminarSub = document.createElement("button");
    btnEliminarSub.textContent = "X";
    btnEliminarSub.classList.add("eliminar-subtarea");
    

    btnEliminarSub.addEventListener("click", (e) =>{
      e.stopPropagation();
      liSub.remove()
      actualizarEstado()
    });

    liSub.appendChild(btnEliminarSub)

    liSub.addEventListener("click", (e) => {
    e.stopPropagation();
    liSub.classList.toggle("completada");
    actualizarEstado()

  });
  ulSubtareas.appendChild(liSub);
  actualizarEstado();
  
})

inputSub.addEventListener("keydown", (e) => {
  if(e.key === "Escape"){
  setTimeout(() => {
  if (formSub.isConnected) formSub.remove();
});
  }
})
inputSub.addEventListener("blur", () =>{
  setTimeout(() => {
  if (formSub.isConnected) formSub.remove();
});
})
})
  






  li.classList.toggle("completada", tarea.completada);

  // Marcar como completada al hacer clic
  li.addEventListener("click", (e) => {
    if(li.querySelector("input"))return;
    e.stopPropagation();
    li.classList.toggle("completada");
    actualizarEstado();
  });

  // Botón eliminar
  const botonEliminar = document.createElement("button");
  botonEliminar.textContent = "✖";
  botonEliminar.classList.add("eliminar");
  botonEliminar.addEventListener("click", (e) => {
    e.stopPropagation(); // para que no se active el toggle de completado
    li.remove();
    actualizarEstado();
  });

  li.appendChild(botonEliminar);


  // Filtrar visibilidad según filtro
if (
  (filtroActual === "completadas" && !tarea.completada) ||
  (filtroActual === "pendientes" && tarea.completada)
) {
  li.style.display = "none";
}

if(Array.isArray(tarea.subtareas) && tarea.subtareas.length > 0) {
  const ulSubtareas = document.createElement("ul");
  ulSubtareas.classList.add("subtareas")

  tarea.subtareas.forEach(subtarea => {
    const liSub = document.createElement("li");
    const spanSubtarea = document.createElement("span");
    spanSubtarea.textContent = subtarea.texto;
    const btnEliminarSub = document.createElement("button");
    btnEliminarSub.textContent = "X";
    btnEliminarSub.classList.add("eliminar-subtarea");

    liSub.appendChild(spanSubtarea)
    liSub.appendChild(btnEliminarSub);

    btnEliminarSub.addEventListener("click", (e) =>{
      e.stopPropagation();
      liSub.remove()
      actualizarEstado()
    });

    liSub.classList.toggle("completada", subtarea.completada);

    liSub.addEventListener("click", (e) =>{
      e.stopPropagation();
      liSub.classList.toggle("completada");
      actualizarEstado()
    })

    ulSubtareas.appendChild(liSub);

  });
  li.appendChild(ulSubtareas);
}
list.appendChild(li);
}



// Escuchar el envío del formulario
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const texto = input.value.trim();
  if (texto === "") return;

  const nuevaTarea = {
    texto,
    completada: false
  };

  renderizarTarea(nuevaTarea);
  actualizarEstado();
  input.value = "";
});

// Actualizar localStorage con las tareas actuales
function actualizarEstado() {
  const tareas = [];
  Array.from(list.children).forEach(li =>{
    const texto = li.querySelector("span")?.textContent || "";
    const completada =  li.classList.contains("completada");

    const tarea = {
      texto,
      completada
    }

    const ulSubtareas = li.querySelector("ul.subtareas");
    if (ulSubtareas){
      const subtareas = [];

      ulSubtareas.querySelectorAll("li").forEach(liSub => {
        subtareas.push({
          texto: liSub.querySelector("span")?.textContent || "",
          completada: liSub.classList.contains("completada")
        });
      });
      tarea.subtareas = subtareas;

    }
    tareas.push(tarea)
  })

  localStorage.setItem("tareas", JSON.stringify(tareas));


  // Actualizar contador de tareas
  const tareasPendientes = tareas.filter(t => !t.completada).length;
  const totalTareas = tareas.length;

  const contador = document.getElementById("contador-tareas");
  contador.textContent = `${tareasPendientes} ${tareasPendientes === 1 ? 'tarea pendiente' : 'tareas pendientes'} / ${totalTareas} en total`;


}
filtroSelect.addEventListener("change", () => {
  filtroActual = filtroSelect.value;
  renderizarTodasLasTareas();
});

const botonBorrarTodo = document.getElementById("borrar-todo");

botonBorrarTodo.addEventListener("click", () => {
  const confirmar = confirm("¿Estás seguro de que querés borrar TODAS las tareas?");
  if (!confirmar) return;

  localStorage.removeItem("tareas");  // borramos del almacenamiento
  list.innerHTML = "";               // limpiamos la lista en pantalla
});

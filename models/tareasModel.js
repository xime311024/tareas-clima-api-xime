const tareas = [
  { id: 1, titulo: 'Tarea inicial 1' },
  { id: 2, titulo: 'Tarea inicial 2' }
];

function listar() {
  return tareas;
}

function obtenerPorId(id) {
  return tareas.find((tarea) => tarea.id === id) || null;
}

function crear(tarea) {
  const nuevoId = tareas.length > 0 ? tareas[tareas.length - 1].id + 1 : 1;
  const nuevaTarea = { id: nuevoId, ...tarea };
  tareas.push(nuevaTarea);
  return nuevaTarea;
}

function eliminar(id) {
  const indice = tareas.findIndex((tarea) => tarea.id === id);
  if (indice === -1) {
    return false;
  }
  tareas.splice(indice, 1);
  return true;
}

module.exports = {
  listar,
  obtenerPorId,
  crear,
  eliminar
};

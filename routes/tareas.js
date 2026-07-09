const express = require('express');
const tareasModel = require('../models/tareasModel');

const router = express.Router();

router.get('/', (req, res) => {
  res.json(tareasModel.listar());
});

router.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  const tarea = tareasModel.obtenerPorId(id);
  if (!tarea) {
    return res.status(404).json({ mensaje: 'Tarea no encontrada' });
  }
  res.json(tarea);
});

router.post('/', (req, res) => {
  const { titulo } = req.body;
  if (!titulo || typeof titulo !== 'string' || titulo.trim().length === 0) {
    return res.status(400).json({ mensaje: 'Título inválido' });
  }
  const nuevaTarea = tareasModel.crear({ titulo: titulo.trim() });
  res.status(201).json(nuevaTarea);
});

router.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  const tarea = tareasModel.obtenerPorId(id);
  if (!tarea) {
    return res.status(404).json({ mensaje: 'Tarea no encontrada' });
  }
  const { titulo } = req.body;
  if (!titulo || typeof titulo !== 'string' || titulo.trim().length === 0) {
    return res.status(400).json({ mensaje: 'Título inválido' });
  }
  tarea.titulo = titulo.trim();
  res.json(tarea);
});

router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  const eliminado = tareasModel.eliminar(id);
  if (!eliminado) {
    return res.status(404).json({ mensaje: 'Tarea no encontrada' });
  }
  res.status(204).send();
});

module.exports = router;

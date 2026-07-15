const express = require('express');
const { query, validationResult } = require('express-validator');
const tareasModel = require('../models/tareasModel');
const weather = require('../services/weather');

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

// Endpoint combinado: devuelve la tarea y el clima para una ciudad indicada
router.get(
  '/:id/clima',
  query('ciudad')
    .trim()
    .notEmpty().withMessage('El parámetro ciudad es obligatorio')
    .matches(/^[a-zA-ZÀ-ÿ0-9\s\.\-,()']+$/).withMessage('Caracteres de ciudad inválidos'),
  async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }

    const id = Number(req.params.id);
    const tarea = tareasModel.obtenerPorId(id);
    if (!tarea) {
      return res.status(404).json({ mensaje: 'Tarea no encontrada' });
    }

    const ciudad = req.query.ciudad;
    try {
      const clima = await weather.obtenerClima(ciudad);
      res.json({ tarea, clima });
    } catch (err) {
      console.error('Error obteniendo clima para tarea:', err);
      res.status(502).json({ mensaje: 'Servicio de clima externo no disponible', detalle: err.message });
    }
  }
);

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

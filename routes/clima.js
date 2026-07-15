const express = require('express');
const { param, validationResult } = require('express-validator');
const weather = require('../services/weather');

const router = express.Router();

router.get(
  '/:ciudad',
  param('ciudad')
    .trim()
    .notEmpty().withMessage('El parámetro ciudad es obligatorio')
    .matches(/^[a-zA-ZÀ-ÿ0-9\s\.\-,()']+$/).withMessage('Caracteres de ciudad inválidos'),
  async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }

    const ciudad = req.params.ciudad;
    try {
      const resultado = await weather.obtenerClima(ciudad);
      res.json(resultado);
    } catch (err) {
      console.error('Error obteniendo clima:', err);
      res.status(502).json({ mensaje: 'Servicio de clima externo no disponible', detalle: err.message });
    }
  }
);

module.exports = router;

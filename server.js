
require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const { body, validationResult } = require('express-validator');

const app = express();

app.use(helmet());              // cabeceras de seguridad HTTP
app.use(express.json());        // parseo seguro de JSON
app.use(morgan('dev'));         // bitácora de peticiones

// Ruta de prueba con validación de entrada
app.post(
  '/api/echo',
  body('mensaje').isString().trim().isLength({ min: 1, max: 200 }).escape(),
  (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    res.json({ recibido: req.body.mensaje });
  }
);

// Endpoint de registro con validación de entrada
// Principios de codificación segura aplicados:
// 1. INPUT VALIDATION (Validación de Entrada): Se validan los datos recibidos
//    asegurando que cumplan con formatos esperados (correo válido, nombre no vacío).
//    Esto previene inyecciones y datos malformados que podrían causar errores.
// 2. WHITELIST/ALLOWLIST: Solo se aceptan campos específicos (nombre, correo) con
//    reglas estrictas, rechazando cualquier dato que no cumpla los criterios.
// 3. SANITIZACIÓN: Se usa escape() para prevenir XSS (Cross-Site Scripting) al
//    escapar caracteres especiales en el nombre.
// 4. MANEJO DE ERRORES EXPLÍCITO: Se devuelven errores específicos sin exponer
//    detalles internos de la aplicación.
app.post(
  '/api/registro',
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre no puede estar vacío')
    .isLength({ max: 100 }).withMessage('El nombre no puede exceder 100 caracteres')
    .escape(),
  body('correo')
    .isEmail().withMessage('Correo inválido')
    .normalizeEmail(),
  (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ 
        mensaje: 'Datos inválidos',
        errores: errores.array() 
      });
    }
    
    // Aquí irían las lógicas adicionales (guardar en BD, enviar confirmación, etc.)
    res.status(201).json({ 
      mensaje: 'Registro exitoso',
      datos: {
        nombre: req.body.nombre,
        correo: req.body.correo
      }
    });
  }
);

app.get('/api/salud', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = app;
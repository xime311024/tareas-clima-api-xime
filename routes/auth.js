const express = require('express');
const { body, validationResult } = require('express-validator');
const authService = require('../services/authService');

const router = express.Router();

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ mensaje: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const usuario = authService.verificarToken(token);
    req.usuario = usuario;
    next();
  } catch (err) {
    return res.status(401).json({ mensaje: 'Token inválido' });
  }
}

router.post(
  '/registro',
  body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio').isLength({ max: 100 }),
  body('correo').isEmail().withMessage('Correo inválido').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }

    const { nombre, correo, password } = req.body;
    if (authService.obtenerUsuarioPorCorreo(correo)) {
      return res.status(409).json({ mensaje: 'El correo ya está registrado' });
    }

    const usuario = authService.crearUsuario({ nombre, correo, password });
    res.status(201).json({ mensaje: 'Registro exitoso', usuario: { id: usuario.id, nombre: usuario.nombre, correo: usuario.correo } });
  }
);

router.post(
  '/login',
  body('correo').isEmail().withMessage('Correo inválido').normalizeEmail(),
  body('password').notEmpty().withMessage('La contraseña es obligatoria'),
  (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }

    const { correo, password } = req.body;
    const usuario = authService.obtenerUsuarioPorCorreo(correo);
    if (!usuario || !authService.verificarPassword(usuario, password)) {
      return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos' });
    }

    const token = authService.generarToken(usuario);
    res.json({ mensaje: 'Login exitoso', token });
  }
);

router.get('/perfil', authMiddleware, (req, res) => {
  res.json({ usuario: req.usuario });
});

module.exports = router;

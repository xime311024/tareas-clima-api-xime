const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const usuarios = [];
const JWT_SECRET = process.env.JWT_SECRET || 'secret_jwt_development';
const JWT_EXPIRES_IN = '1h';

function crearUsuario({ nombre, correo, password }) {
  const usuario = {
    id: usuarios.length + 1,
    nombre,
    correo,
    passwordHash: bcrypt.hashSync(password, 10)
  };
  usuarios.push(usuario);
  return usuario;
}

function obtenerUsuarioPorCorreo(correo) {
  return usuarios.find((usuario) => usuario.correo === correo) || null;
}

function verificarPassword(usuario, password) {
  return bcrypt.compareSync(password, usuario.passwordHash);
}

function generarToken(usuario) {
  const payload = {
    id: usuario.id,
    nombre: usuario.nombre,
    correo: usuario.correo
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function verificarToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = {
  crearUsuario,
  obtenerUsuarioPorCorreo,
  verificarPassword,
  generarToken,
  verificarToken
};

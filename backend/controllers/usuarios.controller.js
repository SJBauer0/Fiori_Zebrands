const Usuario = require('../models/usuarios.model');
const Rol = require('../models/roles.model');
const Etiqueta = require('../models/etiquetas.model');
const UsuarioEtiqueta = require('../models/usuarios_etiquetas.model');
const isAuth = require('../utils/is-auth');

exports.fetchUsuarios = async (req, res, next) => {
  try {
    const usuarios = await Usuario.fetchUsuarios();
    res.json({ usuarios });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'Error al obtener los usuarios.' });
  }
};

exports.fetchUsuarioById = async (req, res, next) => {
  try {
    const usuarioId = req.params.id;
    const usuario = await Usuario.fetchUsuarioById(usuarioId);
    res.json({ usuario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el usuario.' });
  }
};

exports.createUsuario = async (req, res, next) => {
  const { correo, rol, etiquetas, usuario_jira } = req.body;
  try {
    const usuario = await Usuario.createUsuario(
      correo,
      rol,
      usuario_jira
    );
    for (let etiqueta of etiquetas) {
      const etiquetaObj = await Etiqueta.getEtiquetaById(etiqueta.id);
      const etiquetaObjeto = etiquetaObj[0][0];
      await UsuarioEtiqueta.createUsuarioEtiqueta(
        usuario.id,
        etiquetaObjeto.id
      );
    }
    res.json({ message: 'Usuario creado correctamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear el usuario.' });
  }
};

exports.deleteUsuarioById = async (req, res, next) => {
  const usuarioId = req.params.id;
  try {
    await Usuario.deleteUsuarioById(usuarioId);
    res.json({ message: 'Usuario eliminado correctamente.' });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'Error al eliminar el usuario.' });
  }
};

exports.updateUsuarioById = async (req, res, next) => {
  const usuarioId = req.params.id;
  const { nombre, rol, etiquetas, id_jira } = req.body;
  try {
    await Usuario.updateUsuarioById(usuarioId, nombre, rol, id_jira);
    await UsuarioEtiqueta.deleteEtiquetasUsuario(usuarioId);
    for (let etiqueta of etiquetas) {
      await UsuarioEtiqueta.createUsuarioEtiqueta(
        usuarioId,
        etiqueta.id
      );
    }
    res.json({ message: 'Usuario actualizado correctamente.' });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'Error al actualizar el usuario.' });
  }
};

exports.updateRolUsuarioById = async (req, res, next) => {
  const usuarioId = req.params.id;
  const { rol } = req.body;
  try {
    await Usuario.updateRolUsuarioById(usuarioId, rol);
    res.json({ message: 'Rol actualizado correctamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el rol.' });
  }
};

exports.fetchUsuario = async (req, res, next) => {
  try {
    const [rows] = await Usuario.fetchOne(req.user.email);
    if (rows.length > 0) {
      res.json(rows[0]);
    }
  } catch (err) {
    console.log(err);
  }
};

const db = require('../database/db');

module.exports = class Usuarios {
  constructor(usuario) {
    this.correo = usuario.correo || null;
    this.password = usuario.password || null;
    this.nombre = usuario.nombre || null;
    this.foto = usuario.foto || null;
    this.rol = usuario.rol || null;
    this.createdAt = usuario.createdAt || null;
    this.updatedAt = usuario.updatedAt || null;
    this.idEtiqueta = usuario.idEtiqueta || null;
  }

  static async createUsuario(correo, rol, usuarioJira) {
    const [result] = await db.execute(
      `INSERT INTO usuarios (correo, id_rol, id_jira) VALUES (?, ?, ?)`,
      [correo, rol, usuarioJira]
    );
    const usuarioId = result.insertId;
    return { id: usuarioId, correo };
  }

  static async fetchUsuarios() {
    const [rows] = await db.execute(`
    SELECT 
      u.id, 
      u.nombre, 
      u.correo, 
      u.foto, 
      u.id_rol,
      GROUP_CONCAT(DISTINCT CONCAT_WS(':', e.id, e.etiqueta, c.color) SEPARATOR ';') AS etiquetas
    FROM usuarios u
    LEFT JOIN usuarios_etiquetas ue ON u.id = ue.id_usuario
    LEFT JOIN etiquetas e ON e.id = ue.id_etiqueta
    LEFT JOIN colores c ON e.id_color = c.id
    GROUP BY u.id
    ORDER BY u.nombre ASC
  `);

    const usuarios = rows.map((row) => {
      const etiquetas = row.etiquetas
        ? row.etiquetas.split(';').map((etiqueta) => {
            const [id, nombre, color] = etiqueta.split(':');
            return { id, nombre, color };
          })
        : [];

      return {
        id: row.id,
        nombre: row.nombre,
        correo: row.correo,
        foto: row.foto,
        rol: row.id_rol,
        etiquetas,
      };
    });

    return usuarios;
  }

  static async fetchUsuarioById(id) {
    const [rows] = await db.execute(
      `
    SELECT 
      u.id, 
      u.id_jira,
      u.nombre, 
      u.correo, 
      u.foto, 
      u.id_rol,
      GROUP_CONCAT(DISTINCT CONCAT_WS(':', e.id, e.etiqueta, c.color) SEPARATOR ';') AS etiquetas
    FROM usuarios u
    LEFT JOIN usuarios_etiquetas ue ON u.id = ue.id_usuario
    LEFT JOIN etiquetas e ON e.id = ue.id_etiqueta
    LEFT JOIN colores c ON e.id_color = c.id
    WHERE u.id = ?
    GROUP BY u.id;
  `,
      [id]
    );

    const usuarios = rows.map((row) => {
      const etiquetas = row.etiquetas
        ? row.etiquetas.split(';').map((etiqueta) => {
            const [id, nombre, color] = etiqueta.split(':');
            return { id, nombre, color };
          })
        : [];

      return {
        id: row.id,
        nombre: row.nombre,
        correo: row.correo,
        foto: row.foto,
        rol: row.id_rol,
        id_jira: row.id_jira,
        etiquetas,
      };
    });

    return usuarios;
  }

  static async deleteUsuarioById(id) {
    const [result] = await db.execute(
      `DELETE FROM usuarios WHERE id = ?`,
      [id]
    );
    return result;
  }

  static updateUsuarioById(id, nombre, rol, id_jira) {
    return db.execute(
      `UPDATE usuarios SET nombre = ?, id_rol = ?, id_jira = ?, updatedAt = CURTIME() WHERE id = ?`,
      [nombre, rol, id_jira, id]
    );
  }

  static updateRolUsuarioById(id, rol) {
    return db.execute(
      `UPDATE usuarios SET id_rol = ?, updatedAt = CURTIME() WHERE id = ?`,
      [rol, id]
    );
  }

  static async fetchOne(correo) {
    return db.execute(
      `SELECT correo, nombre, foto, id_jira, id_rol, id as id_usuario
        FROM usuarios
        WHERE correo = ?`,
      [correo]
    );
  }

  static async updateData(nombre, foto, id_google, correo) {
    return db.execute(
      `UPDATE usuarios SET nombre = ?, foto = ?, id_google = ? WHERE correo = ?`,
      [nombre, foto, id_google, correo]
    );
  }
};

const db = require('../database/db');
const axios = require('axios');
const auth = {
  username: process.env.JIRA_USERNAME_FIORI,
  password: process.env.JIRA_PASSWORD_FIORI,
};
const URL_BOARD = process.env.JIRA_BOARD_URL;

module.exports = class Accionable {
  constructor(newAccionable) {
    this.id = newAccionable.id || null;
    this.id_usuario = newAccionable.id_usuario || null;
    this.accionable = newAccionable.accionable || null; // Cambia 'descripcion' a 'accionable'
    this.fecha = newAccionable.fecha || null;
  }

  static fetchAll() {
    return db.execute('SELECT * FROM accionables');
  }

  static createAccionable(id_usuario, accionable, fecha, key_jira) {
    return db.execute(
      `INSERT INTO accionables (id_usuario, descripcion, fecha_esperada, key_jira)
       VALUES (?, ?, ?, ?)`,
      [id_usuario, accionable, fecha, key_jira]
    );
  }

  static postAccionable = async (id_usuario, descripcion) => {
    const bodyData = {
      fields: {
        project: {
          key: 'FIORI',
        },
        summary: `${descripcion}`,
        issuetype: {
          name: process.env.JIRA_BOARD_ISSUE_TYPE,
        },
        customfield_10016: 1,
        assignee: `${id_usuario}`,
      },
    };

    const response = await axios.post(URL_BOARD, bodyData, {
      auth: auth,
    });

    return response.data;
  };

  static getAccionablesByUserId(id_usuario) {
    return db.execute(
      `
        SELECT id, descripcion, fecha_esperada, key_jira, createdAt FROM accionables
        WHERE id_usuario = ?
      `,
      [id_usuario]
    );
  }

  static getAccionableInfo(id) {
    return db.execute(
      `
        SELECT * FROM accionables 
        WHERE id = ?
      `,
      [id]
    );
  }

  static deleteAccionable(id) {
    return db.execute(
      `
        DELETE FROM accionables
        WHERE id = ?
          `,
      [id]
    );
  }

  static solveAccionable = async (id) => {
    const bodyData = {
      transition: {
        id: '31',
      },
    };
    await axios.post(`${URL_BOARD}/${id}/transitions`, bodyData, {
      auth: auth,
    });
  };
};

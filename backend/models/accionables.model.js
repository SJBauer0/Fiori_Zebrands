const db = require('../database/db');
const axios = require('axios');
const auth = {
  username: process.env.JIRA_USERNAME_FIORI,
  password: process.env.JIRA_PASSWORD_FIORI,
};

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

  static createAccionable(id_usuario, accionable, fecha) {
    return db.execute(
      `INSERT INTO accionables (id_usuario, descripcion, fecha_esperada)
       VALUES (?, ?, ?)`,
      [id_usuario, accionable, fecha]
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
          name: 'Bug',
        },
        customfield_10016: 100,
        // customfield_10036: '2022-04-25',
        assignee: `${id_usuario}`,
      },
    };

    axios.post(
      'https://fioritec.atlassian.net/rest/api/3/issue/',
      bodyData,
      {
        auth: auth,
      }
    );
  };

  static getAccionablesByUserId(id_usuario) {
    return db.execute(
      `
        SELECT id, descripcion, fecha_esperada FROM accionables
        WHERE id_usuario = ?
      `,
      [id_usuario]
    );
  }

  static getAccionableInfo(id) {
    return db.execute(
      `
        SELECT *FROM accionables 
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
};

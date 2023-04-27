const usuarios_jiraModel = require('../models/usuarios_jira.model');
const db = require('../database/db');

exports.getJiraUsers = async (req, res, next) => {
  try {
    const usuarios = await usuarios_jiraModel
      .getJiraUsers()
      .then(([rows, fieldData]) => {
        res.json(rows);
      });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'Error al obtener los usuarios.' });
  }
};

exports.postJiraUsers = async (req, res, next) => {
  try {
    const usuarios = await usuarios_jiraModel.fetchJiraUsers();
    for (let usuario of usuarios) {
      await usuarios_jiraModel.postJiraUser(
        usuario.accountId,
        usuario.displayName
      );
    }
    console.log('Usuarios de Jira guardados en la base de datos.');
    res.end();
  } catch (error) {
    console.log(error);
    res.end();
  }
};

exports.getOneJiraUser = async (req, res, next) => {
  const id_jira = req.params.id_jira;
  try {
    const usuario = await usuarios_jiraModel
      .getOneJiraUser(id_jira)
      .then(([rows, fieldData]) => {
        res.json(rows);
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el usuario.' });
  }
};

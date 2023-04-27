const Accionables = require('../models/accionables.model');

const getAccionablesByUserId = async (req, res) => {
  const id_usuario = req.params.id;

  try {
    const [accionables] = await Accionables.getAccionablesByUserId(
      id_usuario
    );
    res.json(accionables);
  } catch (err) {
    console.log(err);
  }
};

const createAccionable = (req, res) => {
  const { id_usuario, descripcion, fecha_estimada, key_jira } =
    req.body;
  const [anio, mes, dia] = fecha_estimada.split('-');
  const fechaFormatoMySQL = `${anio}-${mes}-${dia} 00:00:00`;

  Accionables.createAccionable(
    id_usuario,
    descripcion,
    fechaFormatoMySQL,
    key_jira
  )
    .then(([rows, fieldData]) => {
      res.json(rows);
    })
    .catch((err) => console.log(err));
};

const getAccionableInfo = async (req, res) => {
  const id = req.params.id;
  const response = await Accionables.getAccionableInfo(id);
  res.json(response[0]);
};

const postAccionable = async (req, res) => {
  try {
    const { id_usuario, descripcion } = req.params;
    const respuesta = await Accionables.postAccionable(
      id_usuario,
      descripcion
    );
    res.send(respuesta);
  } catch (err) {
    console.log(err);
  }
};

const solveAccionable = async (req, res) => {
  try {
    const { key_jira, id } = req.params;
    Accionables.solveAccionable(key_jira);
    Accionables.deleteAccionable(id);
    res.end();
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getAccionablesByUserId,
  createAccionable,
  postAccionable,
  getAccionableInfo,
  solveAccionable,
};

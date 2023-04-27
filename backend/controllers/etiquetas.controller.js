const Etiquetas = require("../models/etiquetas.model");

exports.getEtiquetas = (req, res, next) => {
  Etiquetas.getEtiquetas()
    .then(([rows, fieldData]) => {
      res.json(rows);
    })
    .catch((err) => console.log(err));
};

exports.getEtiquetaById = (req, res, next) => {
  const id = req.params.id;
  Etiquetas.getEtiquetaById(id)
    .then(([rows, fieldData]) => {
      res.json(rows);
    })
    .catch((err) => console.log(err));
};

exports.updateEtiqueta = (req, res, next) => {
  const id = req.params.id;
  const etiqueta = req.body.etiqueta;
  const color = req.body.color;
  Etiquetas.updateEtiqueta(id, etiqueta, color)
    .then(([rows, fieldData]) => {
      res.json(rows);
    })
    .catch((err) => console.log(err));
};

exports.createEtiqueta = (req, res, next) => {
  const etiqueta = req.body.etiqueta;
  const color = req.body.color;
  Etiquetas.createEtiqueta(etiqueta, color)
    .then(([rows, fieldData]) => {
      res.json(rows);
    })
    .catch((err) => console.log(err));
};

exports.deleteEtiqueta = (req, res, next) => {
  const id = req.params.id;
  Etiquetas.deleteEtiqueta(id)
    .then(([rows, fieldData]) => {
      res.json(rows);
    })
    .catch((err) => console.log(err));
};

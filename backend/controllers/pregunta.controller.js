const Pregunta = require('../models/pregunta.model');

exports.getAllPreguntas = async (req, res) => {
  try {
    const [preguntas] = await Pregunta.fetchAll();
    res.json(preguntas);
  } catch (err) {
    console.log(err);
  }
};

exports.createPregunta = async (req, res, next) => {
  try {
    const newPregunta = {
      id_pregunta: req.body.id,
      pregunta: req.body.pregunta,
      predeterminada: req.body.predeterminada,
      id_tipo_pregunta: req.body.id_tipo_pregunta,
      opciones_respuesta: req.body.opciones,
    };

    const [result] = await Pregunta.registrarPregunta(newPregunta);
    res.status(201).json({
      message: 'Pregunta creada exitosamente',
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear la pregunta' });
  }
};

exports.deletePreguntaById = async (req, res, next) => {
  const id_pregunta = req.params.id;
  try {
    await Pregunta.eliminarPreguntaById(id_pregunta);
    res.json({
      message: 'Pregunta eliminada exitosamente',
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'Error al eliminar la pregunta' });
  }
};

exports.editarPreguntaById = async (req, res, next) => {
  try {
    const Question = {
      id_pregunta: req.body.id,
      pregunta: req.body.pregunta,
      predeterminada: req.body.predeterminada,
      id_tipo_pregunta: req.body.id_tipo_pregunta,
      opciones_respuesta: req.body.opciones,
    };
    const [result] = await Pregunta.updatePreguntaById(Question);
    res.json({
      message: 'Pregunta actualizada exitosamente',
      data: result,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'Error al actualizar la pregunta' });
  }
};
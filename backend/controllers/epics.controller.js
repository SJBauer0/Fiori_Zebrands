const epicsModel = require('../models/epics.model');
const db = require('../database/db');

exports.getEpicsJira = async (req, res, next) => {
  try {
    res.json(await epicsModel.fetchEpicsJira());
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los epics.' });
  }
};

exports.getEpicsWithIssues = async (req, res, next) => {
  try {
    res.json(await epicsModel.getEpicsWithIssues());
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los epics.' });
  }
};

exports.postEpicsJira = async (req, res, next) => {
  try {
    const epics = await epicsModel.fetchEpicsJira();
    for (let epic of epics) {
      await epicsModel.postEpicsJira(
        epic.key,
        epic.summary,
        epic.status,
        epic.color,
        epic.createdAt.slice(0, 10),
        epic.updatedAt.slice(0, 10)
      );
    }
    res.end();
    console.log('Epics guardados');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los epics.' });
    console.log('error en los epics');
  }
};

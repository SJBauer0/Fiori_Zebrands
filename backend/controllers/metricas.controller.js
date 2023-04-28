const sprintsDataModel = require('../models/metricas.model');
const db = require('../database/db');

exports.fetchSprintsByIds = async (req, res, next) => {
  const sprintIds = req.params.ids.split(',').map(Number);
  try {
    const sprints = await sprintsDataModel.getIssuesBySprints(
      sprintIds
    );
    res.json({ sprints });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'Error al obtener los sprints.' });
  }
};

exports.fetchStoryPoints = async (req, res, next) => {
  const sprintIds = req.params.ids.split(',').map(Number);
  try {
    const sprints = await sprintsDataModel.getIssuesByStoryPoints(
      sprintIds
    );
    res.json({ sprints });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'Error al obtener los sprints.' });
  }
};

exports.fetchUserIssues = async (req, res, next) => {
  const userId = req.params.id;
  const sprintIds = req.params.ids.split(',').map(Number);
  try {
    const issues = await sprintsDataModel.getIssuesByUser(
      userId,
      sprintIds
    );
    res.json({ issues });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los issues.' });
  }
};

exports.fetchUserIssuesSolo = async (req, res, next) => {
  const userId = req.params.id;
  try {
    const issues = await sprintsDataModel.getIssuesByUserSolo(userId);
    res.json({ issues });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los issues.' });
  }
};

exports.fetchUserStoryPoints = async (req, res, next) => {
  const userId = req.params.id;
  const sprintIds = req.params.ids.split(',').map(Number);
  try {
    const issues = await sprintsDataModel.getStoryPointsByUser(
      userId,
      sprintIds
    );
    res.json({ issues });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los issues.' });
  }
};

exports.fetchUserStoryPointsSolo = async (req, res, next) => {
  const userId = req.params.id;
  try {
    const issues = await sprintsDataModel.getStoryPointsByUserSolo(
      userId
    );
    res.json({ issues });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los issues.' });
  }
};
exports.fetchIssuesByEpic = async (req, res, next) => {
  const epicId = req.params.id;
  try {
    const issues = await sprintsDataModel.getIssuesByEpic(epicId);
    res.json({ issues });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los issues.' });
  }
};

exports.fetchStoryPointsByEpic = async (req, res, next) => {
  const epicId = req.params.id;
  try {
    const issues = await sprintsDataModel.getStoryPointsByEpic(
      epicId
    );
    res.json({ issues });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los issues.' });
  }
};

exports.fetchPersonalStoryPointsLastSprints = async (
  req,
  res,
  next
) => {
  const userId = req.params.id;
  try {
    const issues =
      await sprintsDataModel.getPersonalStoryPointsLastSprints(
        userId
      );
    res.json({ issues });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los issues.' });
  }
};

exports.fetchPersonalToDoStoryPointsLastSprints = async (
  req,
  res,
  next
) => {
  const userId = req.params.id;
  try {
    const issues =
      await sprintsDataModel.getPersonalToDoStoryPointsLastSprints(
        userId
      );
    res.json({ issues });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los issues.' });
  }
};

exports.fetchDoneStoryPointsLastSprints = async (req, res, next) => {
  try {
    const sprints =
      await sprintsDataModel.getDoneStoryPointsLastSprints();
    res.json({ sprints });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los issues.' });
  }
};

exports.fetchToDoStoryPointsLastSprints = async (req, res, next) => {
  try {
    const sprints =
      await sprintsDataModel.getToDoStoryPointsLastSprints();
    res.json({ sprints });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los issues.' });
  }
};

exports.fetchDoneStoryPointsLastEpics = async (req, res, next) => {
  try {
    const sprints =
      await sprintsDataModel.getDoneStoryPointsLastEpics();
    res.json({ sprints });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los epics.' });
  }
};

exports.fetchToDoStoryPointsLastEpics = async (req, res, next) => {
  try {
    const sprints =
      await sprintsDataModel.getToDoStoryPointsLastEpics();
    res.json({ sprints });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los epics.' });
  }
};

exports.fetchPersonalStoryPointsProgressiveLastSprints = async (
  req,
  res,
  next
) => {
  const userId = req.params.id;
  try {
    const issues =
      await sprintsDataModel.getPersonalStoryPointsProgressiveLastSprints(
        userId
      );
    res.json({ issues });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los issues.' });
  }
};

exports.fetchPersonalToDoStoryPointsProgressiveLastSprints = async (
  req,
  res,
  next
) => {
  const userId = req.params.id;
  try {
    const issues =
      await sprintsDataModel.getPersonalToDoStoryPointsProgressiveLastSprints(
        userId
      );
    res.json({ issues });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los issues.' });
  }
};

exports.fetchDoneStoryPointsProgressiveLastSprints = async (
  req,
  res,
  next
) => {
  try {
    const sprints =
      await sprintsDataModel.getDoneStoryPointsProgressiveLastSprints();
    res.json({ sprints });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los issues.' });
  }
};

exports.fetchToDoStoryPointsProgressiveLastSprints = async (
  req,
  res,
  next
) => {
  try {
    const sprints =
      await sprintsDataModel.getToDoStoryPointsProgressiveLastSprints();
    res.json({ sprints });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los issues.' });
  }
};

exports.fetchDoneStoryPointsProgressiveLastEpics = async (
  req,
  res,
  next
) => {
  try {
    const sprints =
      await sprintsDataModel.getDoneStoryPointsProgressiveLastEpics();
    res.json({ sprints });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los epics.' });
  }
};

exports.fetchToDoStoryPointsProgressiveLastEpics = async (
  req,
  res,
  next
) => {
  try {
    const sprints =
      await sprintsDataModel.getToDoStoryPointsProgressiveLastEpics();
    res.json({ sprints });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los epics.' });
  }
};

exports.fetchDoneEpicReport = async (req, res, next) => {
  try {
    const sprints = await sprintsDataModel.getDoneEpicReport();
    res.json({ sprints });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los epics.' });
  }
};

exports.fetchToDoEpicReport = async (req, res, next) => {
  try {
    const sprints = await sprintsDataModel.getToDoEpicReport();
    res.json({ sprints });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los epics.' });
  }
};

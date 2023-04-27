const sprintModel = require('../models/sprints.model');

exports.getSprintsJira = async (req, res, next) => {
  try {
    const [sprints] = await sprintModel.getSprints();
    res.json(sprints);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'Error al obtener los Sprints.' });
  }
};

exports.postSprintsJira = async (req, res, next) => {
  try {
    var sprintsDB = await sprintModel.getSprints();
    sprintsDB = sprintsDB.shift();
    const sprints = await sprintModel.fetchSprintsJira();
    for (let sprint of sprints) {
      if (sprintsDB.length > 0) {
        for (let sprintDB of sprintsDB) {
          if (sprintDB.state != 'active') {
            await sprintModel.postSprints(
              sprint.id.toString(),
              sprint.nombre,
              sprint.fecha_inicio.slice(0, 10),
              sprint.fecha_fin,
              sprint.state,
              sprint.boardId.toString()
            );
          } else {
            await sprintModel.updateSprint(sprint.id, sprint.state);
            await sprintModel.postSprints(
              sprint.id.toString(),
              sprint.nombre,
              sprint.fecha_inicio.slice(0, 10),
              sprint.fecha_fin,
              sprint.state,
              sprint.boardId.toString()
            );
          }
        }
      } else {
        await sprintModel.postSprints(
          sprint.id.toString(),
          sprint.nombre,
          sprint.fecha_inicio.slice(0, 10),
          sprint.fecha_fin,
          sprint.state,
          sprint.boardId.toString()
        );
      }
    }
    console.log('Sprints guardados');
    res.send('Sprints guardados en la base de datos');
  } catch (error) {
    console.log(error);
    res.end();
  }
};

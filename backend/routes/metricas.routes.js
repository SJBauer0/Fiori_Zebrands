const express = require('express');
const router = express.Router();
const sprintsDataController = require('../controllers/metricas.controller');

router.get(
  '/storypoints/:ids',
  sprintsDataController.fetchStoryPoints
);

router.get('/user/:id/:ids', sprintsDataController.fetchUserIssues);
router.get('/user/:id', sprintsDataController.fetchUserIssuesSolo);

router.get(
  '/userstorypoints/:id/:ids',
  sprintsDataController.fetchUserStoryPoints
);

router.get('/epic/:id', sprintsDataController.fetchIssuesByEpic);
router.get(
  '/epic/storypoints/:id',
  sprintsDataController.fetchStoryPointsByEpic
);
router.get('/user/:id', sprintsDataController.fetchUserIssuesSolo);
router.get(
  '/userstorypoints/:id',
  sprintsDataController.fetchUserStoryPointsSolo
);

router.get(
  '/lastsprintsstorypoints/:id',
  sprintsDataController.fetchPersonalStoryPointsLastSprints
);

router.get(
  '/lastsprintstodostorypoints/:id',
  sprintsDataController.fetchPersonalToDoStoryPointsLastSprints
);

router.get(
  '/sprintsdoneglobal',
  sprintsDataController.fetchDoneStoryPointsLastSprints
);

router.get(
  '/sprintstodoglobal',
  sprintsDataController.fetchToDoStoryPointsLastSprints
);

router.get(
  '/epicsdoneglobal',
  sprintsDataController.fetchDoneStoryPointsLastEpics
);

router.get(
  '/epicstodoglobal',
  sprintsDataController.fetchToDoStoryPointsLastEpics
);

router.get(
  '/personalSUM/:id',
  sprintsDataController.fetchPersonalStoryPointsProgressiveLastSprints
);

router.get(
  '/personalSUMtodo/:id',
  sprintsDataController.fetchPersonalToDoStoryPointsProgressiveLastSprints
);

router.get(
  '/SUMdoneglobal',
  sprintsDataController.fetchDoneStoryPointsProgressiveLastSprints
);

router.get(
  '/SUMtodoglobal',
  sprintsDataController.fetchToDoStoryPointsProgressiveLastSprints
);

router.get(
  '/epicsSUMdoneglobal',
  sprintsDataController.fetchDoneStoryPointsProgressiveLastEpics
);

router.get(
  '/epicsSUMtodoglobal',
  sprintsDataController.fetchToDoStoryPointsProgressiveLastEpics
);

router.get('/donereporte', sprintsDataController.fetchToDoEpicReport);

router.get('/todoreporte', sprintsDataController.fetchDoneEpicReport);

router.get('/sprints/:ids', sprintsDataController.fetchSprintsByIds);
module.exports = router;

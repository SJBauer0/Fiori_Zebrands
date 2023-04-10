const express = require('express');
const router = express.Router();
const sprintsDataController = require('../controllers/sprintsDataMetrica.controller');

router.get('/:ids', sprintsDataController.fetchSprintsByIds);
router.get(
  '/storypoints/:ids',
  sprintsDataController.fetchStoryPoints
);

router.get('/user/:id/:ids', sprintsDataController.fetchUserIssues);
router.get(
  '/userstorypoints/:id/:ids',
  sprintsDataController.fetchUserStoryPoints
);

router.get('/user/:id', sprintsDataController.fetchUserIssuesSolo);

module.exports = router;

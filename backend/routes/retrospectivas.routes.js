const express = require('express');
const router = express.Router();
const retrospectivaController = require('../controllers/retrospectivaController');

router.get('/', retrospectivaController.getAllRetrospectivas);
router.get('/panelRetros', retrospectivaController.getPanelRetros);

module.exports = router;

const express = require('express');
const router = express.Router();

const accionablesController = require('../controllers/accionables.controller');

router.get('/info/:id', accionablesController.getAccionableInfo);
router.get('/:id', accionablesController.getAccionablesByUserId);
router.post('/', accionablesController.createAccionable);
router.post(
  '/post/:id_usuario/:descripcion',
  accionablesController.postAccionable
);
router.post(
  '/solve/:key_jira/:id',
  accionablesController.solveAccionable
);
module.exports = router;

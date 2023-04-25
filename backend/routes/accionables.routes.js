const express = require('express');
const router = express.Router();

const accionablesController = require('../controllers/accionables.controller');

router.get(
  '/:id_usuario',
  (req, res, next) => {
    console.log('Ruta accionables GET'); // Agrega esta línea
    next();
  },
  accionablesController.getAccionablesByUserId
);
router.post('/', accionablesController.createAccionable);
router.post(
  '/post/:id_usuario/:descripcion',
  accionablesController.postAccionable
);

module.exports = router;

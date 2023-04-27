require('dotenv').config();
require('./auth/passportGoogleSSO');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const authRoutes = require('./auth/index');
const cookieSession = require('cookie-session');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  cors({
    origin: process.env.FRONTEND_URI,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
    ],
  })
);

app.use(express.json());

app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    keys: [process.env.COOKIE_KEY_1, process.env.COOKIE_KEY_2],
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get('/api', (req, res, next) => {
  res.json({ message: 'Fiori' });
});

app.use(authRoutes);

app.use((err, req, res, next) => {
  if (err.message === 'UserNotFound') {
    req.session.destroy();
    res.redirect('/api');
  } else {
    next(err);
  }
});

const retrospectivaRoutes = require('./routes/retrospectivas.routes');
const respuestaRoutes = require('./routes/respuesta.routes');
const usuariosRoutes = require('./routes/usuarios.routes');
const preguntaRoutes = require('./routes/preguntas.routes');
const rolesRoutes = require('./routes/roles.routes');
const etiquetasRoutes = require('./routes/etiquetas.routes');
const coloresRoutes = require('./routes/colores.routes');
const usuariosJiraRoutes = require('./routes/usuarios_jira.routes');
const issuesJiraRoutes = require('./routes/issuesJira.routes');
const sprintsJiraRoutes = require('./routes/sprints.routes');
const epicJiraRoutes = require('./routes/epicsJira.routes');
const metricasRoutes = require('./routes/metricas.routes');
const accionablesRoutes = require('./routes/accionables.routes');

//Rutas para Deploy en AWS

app.use('/api/usuarios', usuariosRoutes);
app.use('/api/usuarios_jira', usuariosJiraRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/etiquetas', etiquetasRoutes);
app.use('/api/colores', coloresRoutes);
app.use('/api/user', usuariosRoutes);
app.use('/api/retrospectivas', retrospectivaRoutes);
app.use('/api/respuesta', respuestaRoutes);
app.use('/api/issues', issuesJiraRoutes);
app.use('/api/sprints', sprintsJiraRoutes);
app.use('/api/epics', epicJiraRoutes);
app.use('/api/metricas', metricasRoutes);
app.use('/api/preguntas', preguntaRoutes);

app.get('/api/logout', (req, res) => {
  req.logout();
  res.clearCookie('connect.sid');
  res.redirect('/api');
});

app.listen(8000, () => {
  console.log('Server is running on port 8000');
});

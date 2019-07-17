const express = require('express');
const bodyParser = require('body-parser');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();
const router = express.Router();

const user_routes = require('./routes/user');
const team_routes = require('./routes/team');
const match_routes = require('./routes/match');

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/v1', router);

app.use('/api/user', user_routes);
app.use('/api/team', team_routes);
app.use('/api/match', match_routes);

module.exports = app;
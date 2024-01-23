let nodeConfig = require('./config/nodeConfig');
const express = require('express');
let bodyParser = require('body-parser');
const morgan = require('morgan');
const routes = require('./Router/index');
const cors = require('cors');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());


morgan.token('id', function getId(req) {
    return req.id
});

morgan.token('req', function (req) {
    return JSON.stringify(req.body);
});

let loggerFormat = 'Logger --  :id [:date[web]] ":method :url" :status :response-time :req ';

app.use(morgan(loggerFormat, {
    skip: (req, res) => {
        return res.statusCode >= 400
    },
    stream: process.stdout
}));

app.use(morgan(loggerFormat, {
    skip: (req, res) => {
        return res.statusCode < 400
    },
    stream: process.stderr
}));

app.enable("trust proxy");

app.use(routes);

const { exec } = require('child_process');

(async function () {
    await new Promise((resolve, reject) => {
        const migrate = exec(
            'sequelize db:migrate',
            { env: process.env },
            err => (err ? reject(err) : resolve())
        );

        // Forward stdout+stderr to this process
        migrate.stdout.pipe(process.stdout);
        migrate.stderr.pipe(process.stderr);
    });
}());

module.exports = app;
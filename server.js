const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { HttpError } = require('./server/middleware');

const app = express();

app.use(logger('dev'));

//request data parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//static path and files
app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (req, res) => res.sendFile('index.html', { root: 'dist'}));

//catch 404 error
app.use((req, res, next) => {
    let error = new HttpError(404, `Not Found ${ req.path }`);

    next(error);
});

//app error handler
app.use((error, req, res, next) => {
    if (error.status) res.status(error.status).json({ message: error.message });
    if (error.errors) res.status(400).json({ error: { name: error.name, errors: error.errors } });

    next(error);
});

module.exports = app;

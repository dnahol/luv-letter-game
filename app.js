'use strict';

const PORT = process.env.PORT || 8000;

require('dotenv').config();

var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var http = require('http');
var path = require('path');

var app = express();

var mongoose = require('mongoose');

const MONGOURL = process.env.MONGODB_URI || 'mongodb://localhost/test';

mongoose.connect(MONGOURL, err => {
  console.log(err || `MongoDB connected to ${MONGOURL}`);
});

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));


app.use('/api', require('./routes/api'));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/index.html'));
});

var server = http.createServer(app);

server.listen(PORT, err => {
  console.log(err || `Server listening on port ${PORT}`);
});

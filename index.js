const express = require('express'),
    morgan = require('morgan'),
    app = express(),
    Config = require('./config'),
    passport = require('passport'),
    cors = require('cors'),
    { check, validationResult } = require('express-validator'),
    mongoose = require('mongoose'),
    Models = require('./models.js'),
    Movies = Models.Movie,
    Users = Models.User;;

let allowedOrigins = ['http://localhost:8080', 'http://testsite.com'];
app.use(cors());

mongoose.connect(Config.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true}, (err, data) => {
 if (!err) console.log("connected to db")
});
app.use(express.json());
app.use(morgan('common'));
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something is broken');
});


app.get('/movies',  (req, res) => {
    res.send("movies")
});

// Listens for requests
app.listen(8001, () => {
    console.log('Listening on Port ' + Config.PORT);
});


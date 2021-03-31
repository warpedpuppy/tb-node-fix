const express = require('express'),
    morgan = require('morgan'),
    app = express(),
    Config = require('./config'),
    passport = require('passport'),
    cors = require('cors'),
    { check, validationResult } = require('express-validator'),
    mongoose = require('mongoose'),
    Models = require('./models.js'),
    Movies = Models.Movie;

let allowedOrigins = ['http://localhost:8080', 'https://boemyflix.herokuapp.com/'];




app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use(morgan('common'));
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something is broken');
});

let auth = require('./auth')(app);
require('./passport');

mongoose.connect(Config.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true}, err => {
    if (err) {
        console.error('db connection error')
    } else {
        console.log("db good to go")
    }
});

// GET Requests
app.get('/', (req, res) => {
    res.status(200).send('Welcome to the myFlix API!');
});

app.get('/movies', (req, res) => {
    Movies.find()
        .then((movies) => {
            res.status(200).json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error ' + err);
        });
});


// Listens for requests
app.listen(Config.PORT, '0.0.0.0', () => {
    console.log('Listening on Port ' + Config.PORT);
});





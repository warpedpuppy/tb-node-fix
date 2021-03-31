const express = require('express'),
    morgan = require('morgan'),
    app = express(),
    Config = require('./config'),
    passport = require('passport'),
    cors = require('cors'),
    mongoose = require('mongoose'),
    Models = require('./models.js'),
    Movies = Models.Movie,
    Users = Models.User;



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

mongoose.connect(Config.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true})
.then(res => console.log("successful db connect"))
.catch(e => console.error("db connection failed"))

// GET Requests
app.get('/', (req, res) => {
    res.status(200).send('Welcome to the myFlix API!');
});
passport.authenticate('jwt', { session: false }),
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





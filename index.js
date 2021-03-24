const express = require('express'),
    morgan = require('morgan');
    // bodyParser = require('body-parser');

const app = express();

app.use(express.json());

app.use(morgan('common'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something is broken');
});

let topMovies = [
    {
        title: 'The Other Guys',
        director: 'Adam McKay',
        genre: 'Comedy',
        releaseDate: '08/05/2010',
        rating: 'PG-13'
    },
    {
        title: '21 Jump Street',
        director: 'Phil Lord, Chris Miller',
        genre: 'Comedy',
        releaseDate: '03/16/2012',
        rating: 'R'
    },
    {
        title: '22 Jump Street',
        director: 'Phil Lord, Chris Miller',
        genre: 'Comedy',
        releaseDate: '06/13/2014',
        rating: 'R'
    },
    {
        title: 'Kingsman: The Secret Service',
        director: 'Matthew Vaughn',
        genre: 'Comedy',
        releaseDate: '02/12/2015',
        rating: 'R'
    },
    {
        title: 'Kingsman: The Golden Circle',
        director: 'Matthew Vaughn',
        genre: 'Comedy',
        releaseDate: '09/22/2017',
        rating: 'R'
    },
    {
        title: 'Rush Hour',
        director: 'Brett Ratner',
        genre: 'Comedy',
        releaseDate: '09/18/1998',
        rating: 'PG-13'
    },
    {
        title: 'Rush Hour 2',
        director: 'Brett Ratner',
        genre: 'Comedy',
        releaseDate: '08/03/2001',
        rating: 'PG-13'
    },
    {
        title: 'Rush Hour 3',
        director: 'Brett Ratner',
        genre: 'Comedy',
        releaseDate: '08/10/2007',
        rating: 'PG-13'
    },
    {
        title: 'Central Intelligence',
        director: 'Rawson Marshall Thurber',
        genre: 'Comedy',
        releaseDate: '06/10/2016',
        rating: 'PG-13'
    },
    {
        title: 'Spy',
        director: 'Paul Feig',
        genre: 'Comedy',
        releaseDate: '06/05/2015',
        rating: 'R'
    },
    {
        title: 'Ride Along',
        director: 'Tim Story',
        genre: 'Comedy',
        releaseDate: '01/17/2014',
        rating: 'PG-13'
    },
    {
        title: 'Ride Along 2',
        director: 'Tim Story',
        genre: 'Comedy',
        releaseDate: '01/15/2016',
        rating: 'PG-13'
    },
    {
        title: 'Red',
        director: 'Robert Schwentke',
        genre: 'Comedy',
        releaseDate: '10/15/2010',
        rating: 'PG-13'
    },
    {
        title: 'Red 2',
        director: 'Dean Parisot',
        genre: 'Comedy',
        releaseDate: '07/19/2013',
        rating: 'PG-13'
    },
    {
        title: 'Get Smart',
        director: 'Peter Segal',
        genre: 'Comedy',
        releaseDate: '06/20/2008',
        rating: 'PG-13'
    },
    {
        title: 'Killers',
        director: 'Robert Luketic',
        genre: 'Comedy',
        releaseDate: '06/04/2010',
        rating: 'PG-13'
    },
    {
        title: 'The Avengers',
        director: 'Joss Whedon',
        genre: 'Adventure',
        releaseDate: '05/04/2012',
        rating: 'PG-13'
    },
    {
        title: 'Guardians of the Galaxy',
        director: 'James Gunn',
        genre: 'Sci-fi',
        releaseDate: '08/01/2014',
        rating: 'PG-13'
    }
];

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

app.get('/movies/:Title', (req, res) => {
    Movies.findOne({Title: req.params.Title})
        .then((movies) => {
            res.status(200).json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error ' + err);
        });
});

app.get('/movies/genres/:Title', (req, res) => {
    Movies.findOne({'Genre.Name': req.params.Title}, 'Genre')
        .then((genre) => {
            res.status(200).json(genre);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error ' + err);
        });
});

app.get('/movies/director/:Name', (req, res) => {
    Movies.findOne({'Director.Name': req.params.Name}, 'Director')
        .then((director) => {
            res.status(200).json(director);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error ' + err);
        });
});

app.get('/users', (req, res) => {
    Users.find()
        .then((users) => {
            res.status(200).json(users);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

app.post('/users', (req, res) => {
    Users.findOne({ Username: req.body.Username })
        .then((user) => {
            if (user) {
                return res.status(400).send(req.body.Username + ' already exists.');
            } else {
                Users
                    .create({
                        Username: req.body.Username,
                        Password: req.body.Password,
                        Email: req.body.Email,
                        Birthday: req.body.Birthday
                    })
                    .then((user) => {res.status(201).json(user) })
                .catch((error) => {
                    console.error(error);
                    res.status(500).send('Error: ' + error);
                })
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
});

app.get('/users/:Username', (req, res) => {
    Users.findOne({Username: req.params.Username})
        .then((user) => {
            res.status(200).json(user);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
});

app.put('/users/:Username', (req, res) => {
    Users.findOneAndUpdate({Username: req.params.Username},
        {
            $set:
            {
                Username: req.body.Username,
                Password: req.body.Password,
                Email: req.body.Email,
                Birthday: req.body.Birthday
            }
        },
        { new: true})
        .then((updateUser) => {
            res.status(201).json(updateUser);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
});

app.post('/users/:Username/movies/:MovieID', (req, res) => {
    Users.findOneAndUpdate({Username: req.params.Username},
        {
            $push: {FavoriteMovies: req.params.MovieID}
        },
        {new: true},
        (err, updateUser) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error ' + err);
            } else {
                res.json(updateUser);
            }
        });
});

app.delete('/users/:Username/movies/:MovieID', (req, res) => {
    Users.findOneAndUpdate({Username: req.params.Username},
        {
            $pull: { FavoriteMovies: req.params.MovieID}
        })
        .then(() => {
            res.status(200).send(req.params.MovieID + 'was successfully deleted from ' + req.params.Username + '\'s list of favorite movies.');
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

app.delete('/users/:Username', (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username})
        .then((user) => {
            if (!user) {
                res.status(400).send(req.params.Username + ' was not found');
            } else {
                res.status(200).send(req.params.Username + ' was deleted.');
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// Listens for requests
app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});

app.use(express.static('public'));

const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true});

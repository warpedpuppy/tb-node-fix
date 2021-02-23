const express = require('express'),
    morgan = require('morgan');

const app = express();

app.use(morgan('common'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something is broken');
});

let topMovies = [
    {
        title: 'The Other Guys',
        director: 'Adam McKay',
        releaseDate: '08/05/2010',
        rating: 'PG-13'
    },
    {
        title: '21 Jump Street',
        director: 'Phil Lord, Chris Miller',
        releaseDate: '03/16/2012',
        rating: 'R'
    },
    {
        title: '22 Jump Street',
        director: 'Phil Lord, Chris Miller',
        releaseDate: '06/13/2014',
        rating: 'R'
    },
    {
        title: 'Kingsman: The Secret Service',
        director: 'Matthew Vaughn',
        releaseDate: '02/12/2015',
        rating: 'R'
    },
    {
        title: 'Kingsman: The Golden Circle',
        director: 'Matthew Vaughn',
        releaseDate: '09/22/2017',
        rating: 'R'
    },
    {
        title: 'Rush Hour',
        director: 'Brett Ratner',
        releaseDate: '09/18/1998',
        rating: 'PG-13'
    },
    {
        title: 'Rush Hour 2',
        director: 'Brett Ratner',
        releaseDate: '08/03/2001',
        rating: 'PG-13'
    },
    {
        title: 'Rush Hour 3',
        director: 'Brett Ratner',
        releaseDate: '08/10/2007',
        rating: 'PG-13'
    },
    {
        title: 'Central Intelligence',
        director: 'Rawson Marshall Thurber',
        releaseDate: '06/10/2016',
        rating: 'PG-13'
    },
    {
        title: 'Spy',
        director: 'Paul Feig',
        releaseDate: '06/05/2015',
        rating: 'R'
    },
    {
        title: 'Ride Along',
        director: 'Tim Story',
        releaseDate: '01/17/2014',
        rating: 'PG-13'
    },
    {
        title: 'Ride Along 2',
        director: 'Tim Story',
        releaseDate: '01/15/2016',
        rating: 'PG-13'
    },
    {
        title: 'Red',
        director: 'Robert Schwentke',
        releaseDate: '10/15/2010',
        rating: 'PG-13'
    },
    {
        title: 'Red 2',
        director: 'Dean Parisot',
        releaseDate: '07/19/2013',
        rating: 'PG-13'
    },
    {
        title: 'Get Smart',
        director: 'Peter Segal',
        releaseDate: '06/20/2008',
        rating: 'PG-13'
    },
    {
        title: 'Killers',
        director: 'Robert Luketic',
        releaseDate: '06/04/2010',
        rating: 'PG-13'
    },
];

// GET Requests
app.get('/', (req, res) => {
    res.send('Welcome to my Movie API!');
});

app.get('/documentation', (req, res) => {
    res.sendFile('public/documentation.html', {root: __dirname});
});

app.get('/movies', (req, res) => {
    res.json(topMovies);
});



// Listens for requests
app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});

app.use(express.static('public'));

const bodyParser = require('body-parser'),
    methodOverride = require('method-override');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());
app.use(methodOverride());

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});


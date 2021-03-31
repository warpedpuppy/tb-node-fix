require('dotenv').config();
const jwt = require('jsonwebtoken');

//Dependencies
const mongoose = require("mongoose");
const Models = require("./models.js");

const Movies = Models.Movie;
const Users = Models.User;

/**
 * list off all inused modules 
 * 
 * @param {string} list - list of all  
 * 
 */


// Local database
// mongoose.connect("mongodb://localhost:27017/myFlixDB", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

// Remote database
mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const express = require("express"),
  morgan = require("morgan"),
  bodyParser = require("body-parser");

const app = express();
const cors = require("cors");

app.use(cors());
app.use(morgan("common"));
app.use(express.static("public"));
app.use(bodyParser.json());

let auth = require("./auth")(app);

const passport = require("passport");
require("./passport");

const { check, validationResult } = require("express-validator");
const { response } = require("express");

// All movies
let movies = [];

//Favourite movies
let FavouriteMovies = [];

//Allows all domains to make api requests
// let allowedOrigins = ["http://localhost:4200"];
let allowedOrigins = ["*"];


function normalizeUser (user) {
  console.log(user);
  const { _id: id, Username: username, Email: email, Birthday: birthday, FavouriteMovies: favouriteMovies } = user;

  return {
    id, username, email, birthday, favouriteMovies
  };
  // response.json(normalizeUser(user));
}

function normalizeMovie (movie) {
  const {
    Director: {
      Name: directorName, Bio: directorBio, Birth: directorBirth, Death: directorDeath
    } = {},
    Genre: {
      Name: genreName, Description: genreDescription
    } = {},
    _id: id, Title: title, Description: description, ImagePath: imagePath, Featured: featured 
    } = movie;

  return {
    id, title, description, imagePath, featured, genre: {name: genreName, description: genreDescription},
    director: {name: directorName, bio: directorBio, birth: directorBirth, death: directorDeath}
  }
}

//Home page
app.get("/", (req, res) => {
  res.send("Version 2");
});

//----------------------MOVIES-----------------------------

/**
 * GET all movies
 * 
 * the API to get all movies list 
 * @returns {string} movies 
 * 
 */

app.get(
  "/movies",
  passport.authenticate('jwt', { session: false}), 
  (req, res) => {
    Movies.find()
      .then(movies => {
        res.json(movies.map(normalizeMovie));
      })
      .catch(err => {
        console.error(err);
        res.status(500).send("Error: " + err.message + err.stack);
      });
  }
);

/**
 * 
 * the API req to get one movie by title 
 * 
 * @param {string} Title returns movie by title
 * @returns {string} movie 
 */
app.get(
  "/movies/:Title",
  passport.authenticate('jwt', { session: false}), 
  (req, res) => {
    Movies.findOne({ Title: req.params.Title })
      .then(movie => {
        // res.json(movie);
        res.json(normalizeMovie(movie));
      })
      .catch(err => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * 
 * the API to get one genre by name
 * 
 * @param {string} Title returns genre by title
 * @returns {string} genre 
 */

app.get(
  "/movies/genre/:Name",
  passport.authenticate('jwt', { session: false}), 
  (req, res) => {
    Movies.find({ "Genre.Name": req.params.Name })
      .then(movie => {
        // res.json(movie.Genre.Name + ", " + movie.Genre.Description);
        res.json(normalizeMovie(movie));
      })
      .catch(err => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * 
 * the API to get director by name 
 * 
 * @param {string} Name returns movie by title
 * @returns {string} Director 
 */


app.get(
  "/movies/director/:Name",
  passport.authenticate('jwt', { session: false}), 
  (req, res) => {
    Movies.findOne({ "Director.Name": req.params.Name })
      .then(movie => {
        res.json({
          Name: movie.Director.Name,
          Bio: movie.Director.Bio,
          Birth: movie.Director.Birth,
          Death: movie.Director.Death
        });
      })
      .catch(err => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// -------------------------USERS-------------------------------------

// Get all users

/**
 * 
 * the API to get all users
 * 
 * @returns {array} users 
 */

app.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.find()
      .then(users => {
        // res.status(200).json(users);
        res.json(normalizeUser(user));
      })
      .catch(err => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// Get User by Username
/**
 * 
 * the API to get users information
 * 
 * @param {string} Username returns user by username
 * @returns {string} user
 */

app.get(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOne({ Username: req.params.Username })
      .then(user => {
        res.json(normalizeUser(user));
      })
      .catch(err => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });     
  }
);

/**
 * the API to create new user
 * 
 * @param {string} Username - username 
 * @param {string} Password - Password, String, Alphanumeric
 * @param {string} Email - users email
 * @param {date} Birthdy - users birthday date 
 * @returns {object} returns new user to the DataBase
 * 
 */

app.post(
  "/users",
  // [
  //   check("Username", "Username is required").isLength({ min: 5 }),
  //   check(
  //     "Username",
  //     "Username contains non alphanumeric characters - not allowed"
  //   ).isAlphanumeric(),
  //   check("Password", "Password is required")
  //     .not()
  //     .isEmpty(),
  //   check("Email", "Email does not appear to be valid").isEmail()
  // ],
  (req, res) => {
    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.password);
    Users.findOne({ Username: req.body.username }) // Search to see if a user with the requested username already exists
      .then(user => {
        if (user) {
          //If the user is found, send a response that it already exists
          return res.status(400).send(req.body.username + "already exists");
        } else {
          Users.create({
            Username: req.body.username,
            Password: hashedPassword,
            Email: req.body.email,
            Birthday: req.body.birthday
          })
            .then(user => {
              res.json(normalizeUser(user));
            })
            .catch(error => {
              console.error(error);
              res.send(500).send("Error: " + error);
            });
        }
      })
      .catch(error => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

// PUT updates to users info
/**
 * the API to update users info
 * 
 * @param {string} Username - new username 
 * @param {string} Password - new Password, Alphanumeric
 * @param {string} Email - new users email
 * @param {date} Birthdy - new users birthday date  
 * @returns {object} Update  user in the DataBase
 * 
 */

app.put(
  "/users/:id",
  passport.authenticate("jwt", { session: false }),

  (req, res) => {
    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let object = {}

    if (req.body.password) {
      let hashedPassword = Users.hashPassword(req.body.password);
      object.Password = hashedPassword;
    }
    if (req.body.username) {
      object.Username = req.body.username
    }
    if (req.body.email) {
      object.Email = req.body.email
    }
    if (req.body.birthday) {
      object.Birthday = req.body.birthday
    }


    Users.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: object },
      { new: true }, //This line makes sure that the updated document is returned
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(normalizeUser(updatedUser));
        }
      }
    );
  }
);

// POST new movie to fav list
/**
 * 
 * the API to add movie to list of favourites 
 * 
 * @param {string} Usernaem users info
 * @param {string} MovieID movie by title
 * @returns {string} movie to favotite list  
 */

app.post(
  "/users/:Username/movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $push: { FavouriteMovies: req.params.MovieID }
      },
      { new: true }, // This line makes sure that the updated document is returned
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(normalizeUser(updatedUser)); //Why problematic? 
        }
      }
    );
  }
);

/**
 * 
 * the API to delete movie from fav list
 * 
 * @param {string} Usernaem users info
 * @param {string} MovieID movie by title
 * @returns {string} movie to favotite list  
 * 
 */

app.delete(
  "/users/:Username/movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $pull: { FavouriteMovies: req.params.MovieID }
      },
      { new: true }, // This line makes sure that the updated document is returned
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          // res.json(updatedUser);
          res.json(normalizeUser(updatedUser));
        }
      }
    );
  }
);

// DELETE users account

/**
 * API to add remove users account from DataBase 
 * @param {string} Username users username
 * @returns {string} user removed from database 
 */

app.delete(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username })
      .then(user => {
        if (!user) {
          res.status(400).send(req.params.Username + " was not found.");
        } else {
          res.json(normalizeUser(user));
          // res.status(200).send(req.params.Username + " was deleted.");
        }
      })
      .catch(err => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// -------------------------------------------------------------------

//Logs every time you load a page
const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log("Your app is listening on port " + port);
});

//Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

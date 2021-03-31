const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

/**
 * Movie Schema for Data Base
 * 
 * @param {string} Title - Movie title
 * @param {string} Description - Movie description
 * @param {string} Gener.Name - Movies gener name
 * @param {string} Gener.Description - Gener description
 * @param {string} Director.Name - Movies director name
 * @param {string} Director.Bio - Movies Sirectors bio
 * @param {string} Actors - list of actors
 * @param {string} ImagePath - link to the image of the movie
 * @param {boolean} Featured - released or will be.
 * @returns {object} new movie to the data base 
 * 
 */

let movieSchema = mongoose.Schema({
  Title: { type: String, required: true },
  Description: { type: String, required: true },
  Genre: {
    Name: String,
    Description: String
  },
  Director: {
    Name: String,
    Bio: String,
    Birth: String,
    Death: String
  },
  Actors: [String],
  ImagePath: String,
  Featured: Boolean
});

/**
 * User Schema for Data Base
 * 
 * @param {string} Username - User's Username
 * @param {string} Password - User's Password
 * @param {string} Email - User's Email
 * @param {data} Birthday - User's birthday
 * @returns {object} user to the data base 
 * 
 */

let userSchema = mongoose.Schema({
  Username: { type: String, required: true },
  Password: { type: String, required: true },
  Email: { type: String, required: true },
  Birthday: Date,
  FavouriteMovies: [{ type: mongoose.Schema.Types.ObjectId, red: "Movie" }]
});

userSchema.statics.hashPassword = password => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

userSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.Password);
};

let Movie = mongoose.model("Movie", movieSchema);
let User = mongoose.model("User", userSchema);

module.exports.Movie = Movie;
module.exports.User = User;
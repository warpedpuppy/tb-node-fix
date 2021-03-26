module.exports = {
    JWT_SECRET: process.env.JWT_SECRET || 'My_secret',
    DB_CONNECT: process.env.DB_CONNECT || 'mongodb://localhost:27017/myFlixDB',
    PORT: process.env.PORT || 8080
}
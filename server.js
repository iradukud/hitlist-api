const express = require('express')
const app = express()
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')
const cors = require('cors')
const MongoStore = require('connect-mongo')(session)
const flash = require('express-flash')
const logger = require('morgan')
const connectDB = require('./config/database')
const routes = require('./routes/auth')
const missionRoutes = require('./routes/mission')
const taskRoutes = require('./routes/task')

//Use .env file in config folder
require("dotenv").config({ path: "./config/.env" });

// Passport config
require('./config/passport')(passport)

//Connect To Database
connectDB()

//Body Parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

//Logging
app.use(logger("dev"))

// Setup Sessions - stored in MongoDB
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
)

//enables communication with clients
app.use(cors())

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

//Use flash messages for errors, info, ect...
app.use(flash())

//Setup Routes For Which The Server Is Listening
app.use('/auth', routes)
app.use('/mission', missionRoutes)
app.use('/task', taskRoutes)

//Server Running
app.listen(process.env.PORT, () => {
  console.log('Server is running, you better catch it!')
})    
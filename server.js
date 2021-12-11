require('dotenv').config()
const express = require('express')

const app = express()
const ejs = require('ejs')
const mongoose = require('mongoose')
const path = require('path')
const session = require('express-session')
const expressLayout = require('express-ejs-layouts')
const flash = require('express-flash')
const MongoDbStore = require('connect-mongo')


const PORT = process.env.PORT || 3300

// Database connection
const url = 'mongodb://localhost:27017/pizza';
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () => {
   console.log('Database connected...');
}).on('error', function (error) {
   console.log('error is:', error);
});

// session store
// let mongoStore = new MongoDbStore({
//    mongooseConnection: connection,
//    collection: 'sessions'
// })

// sesseion config 
app.use(session({
   secret: process.env.COOKIE_SECRET,
   resave: false,
   store: MongoDbStore.create({mongoUrl:'mongodb://localhost:27017/pizza'}),
   saveUninitialized: false,
   cookie: { maxAge: 1000 * 60 * 24 }

}))

app.use(flash())

//Assets
app.use(express.static('public'))


//Global middleware
app.use((req, res, next) => {
   res.locals.session = req.session
   next()
})
// set template engine
app.use(expressLayout)
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')


app.use(express.json())
require('./routes/web')(app)


app.listen(PORT, () => {
   console.log(`listening on port ${PORT}`)
})
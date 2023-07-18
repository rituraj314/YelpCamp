if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session')
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const app = express();
const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');
const userRoutes = require('./routes/user')
const passport = require('passport');
const LocalStragery = require('passport-local');
const User = require('./models/users');

mongoose.connect('mongodb://localhost:27017/yelp-camp',{
}).then(()=>{
    console.log("Mongo Connected!")
}).catch(err=>{
    console.log(err)
})

app.set('view engine','ejs')
app.set('views', path.join(__dirname,'views'))
app.use(express.urlencoded({extended:true}))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.engine('ejs',ejsMate)

const SessionConfig = {
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true,
        expires: Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
    }
}

app.use(session(SessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStragery(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
//    if((req.originalUrl).includes('/edit')){
//     req.session.returnTo = req.originalUrl;
//    }
//    console.log(req.session);
   res.locals.currentUser = req.user;
   res.locals.success =  req.flash('success');
   res.locals.error = req.flash('error');
   next();
})

app.get('/',(req,res)=>{
    res.render('home');
})

app.use('/', userRoutes);
app.use('/campgrounds',campgrounds)
app.use('/campgrounds/:id/reviews',reviews);

app.all('*',(req,res,next) =>{
    next(new ExpressError("Page Not found",404));
})

app.use((err,req,res,next) => {
    const {statusCode = 404 , message = 'Something went wrong!!'} = err
     res.status(statusCode).render('campgrounds/error',{err});
})

app.listen(3000,()=>{
    console.log("On Port 3000");
})
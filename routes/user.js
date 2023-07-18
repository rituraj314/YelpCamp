const express = require('express')
const router = express.Router();
const ExpressError = require('../utils/ExpressError');
const User = require('../models/users');
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');

router.get('/register',(req,res)=>{
    res.render('users/register');
})

router.post('/register',async(req,res)=>{
   try{ const {username,email,password} = req.body;
    const user = new User({username,email});
    const registeredUser = await User.register(user,password)
    console.log(registeredUser);
    res.redirect('/campgrounds'); 
    }catch(e){
       req.flash('error'.e.message);
       res.redirect('/register')
    }
})

router.get('/login',(req,res)=>{
    res.render('users/login')
})

router.post('/login',passport.authenticate('local',{failureFlash: true, failureRedirect: true}) ,catchAsync((req,res)=>{
    req.flash('success','Welcome Back')
    const redirectUrl = req.session.returnTo || '/campgrounds'; 
    //console.log(req.session);
    //delete req.session.returnTo;
    res.redirect(redirectUrl)
}));

router.get('/logout',(req,res)=>{
    req.logout((err)=>{
        if(err) return next(err);
    });
    req.flash('success','GoodBye');
    res.redirect('/campgrounds')
})

module.exports = router;
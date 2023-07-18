const {campgroundSchema} = require('./schemas')
const ExpressError = require('./utils/ExpressError');
const {reviewSchema} = require('./schemas.js')

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash('error','You must be signed in');
        return res.redirect('/login');
     }
     next();
}

module.exports.validateCampground = (req,res,next) =>{
        const {error} = campgroundSchema.validate(req.body);
        if(error){
           const msg = error.details.map(ele => ele.message).join(',')
           throw new ExpressError(msg,400);
        }
        else {
           next();
        }
}

module.exports.validateReview = (req,res,next) =>{
   const {error} = reviewSchema.validate(req.body);
   if(error){
      const msg = error.details.map(ele => ele.message).join(',')
      throw new ExpressError(msg,400);
   }
   else {
      next();
   }
}
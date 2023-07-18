const Campground = require('../models/campground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const {cloudinary} = require('../cloudinary/index')


module.exports.index =  async(req,res) =>{
const campgrounds = await Campground.find({});
res.render('campgrounds/index',{campgrounds});

}

module.exports.renderNew = (req,res) =>{
        res.render('campgrounds/new');
}

module.exports.createNewCampground = async(req,res) =>{
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campgrounds.location,
        limit: 1
    }).send();
    const camp = new Campground(req.body.campgrounds);
    camp.geometry = geoData.body.features[0].geometry;
    camp.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    camp.author = req.user._id;
    await camp.save();
    req.flash('success','Successfully Created the Campground')
    res.redirect(`campgrounds/${camp._id}`);
}

module.exports.getCampgrounds = async(req,res) =>{
    const camp = await Campground.findById(req.params.id).populate({
        path:'reviews',
        populate:{
            path: 'author'
        }
    }).populate('author');
    if(!camp){
        req.flash('error','Cannot find the campground.')
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show',{camp});
}

module.exports.renderEditCampgoundPage = async(req,res) =>{
    const {id} = req.params;
    const camp = await Campground.findById(id);
   if(!camp.author.equals(req.user._id)){
    req.flash('error','You do not have permission to edit this campground');
    return res.redirect(`/campgrounds/${id}`);
   }
    res.render('campgrounds/edit',{camp})
}

module.exports.editCampground = async(req,res) =>{
    const {id} = req.params;
    const camp = await Campground.findByIdAndUpdate(id,{...req.body.campgrounds});
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    camp.images.push(...imgs);
    await camp.save();
    if(req.body.deleteImages){
        for(let file of req.body.deleteImages){
            await cloudinary.uploader.destroy(file);
            const f = file.trimEnd();
            await camp.updateOne({$pull:{images:{filename: f}}})
        }
    }
    req.flash('success','Successfully Edited the Campground')
    res.redirect(`/campgrounds/${camp._id}`)
}

module.exports.deleteCampgrounds = async(req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){
     req.flash('error','You do not have permission to delete this campground');
     return res.redirect(`/campgrounds/${id}`);
    }
    await Campground.findByIdAndDelete(id);
    req.flash('success','Successfully Deleted the Campground')
    res.redirect('/campgrounds');
}
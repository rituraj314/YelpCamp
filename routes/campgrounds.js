const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds')
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn,validateCampground} = require('../middleware');
const multer  = require('multer')
const {storage} = require('../cloudinary/index')
const upload = multer({ storage })

router.get('/', catchAsync(campgrounds.index));
  
router.get('/new',isLoggedIn,campgrounds.renderNew);
  
router.post('/',isLoggedIn,upload.array('image'),validateCampground,catchAsync(campgrounds.createNewCampground));


router.get('/:id', catchAsync(campgrounds.getCampgrounds));

router.get('/:id/edit',isLoggedIn, catchAsync(campgrounds.renderEditCampgoundPage))

router.put('/:id',isLoggedIn,upload.array('image'),validateCampground, catchAsync(campgrounds.editCampground))

router.delete('/:id',isLoggedIn, catchAsync(campgrounds.deleteCampgrounds))

module.exports = router
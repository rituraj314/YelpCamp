const express = require('express');
const mongoose = require('mongoose');
const app = express()
const cities = require('./cities');
const {places,descriptors} = require('./seedHelper')
const Campground = require('../models/campground')

mongoose.connect('mongodb://localhost:27017/yelp-camp',{
}).then(()=>{
    console.log("Mongo Connected!")
}).catch(err=>{
    console.log(err)
})
const sample =(arr) => arr[Math.floor(Math.random()*arr.length)];

const images = [
    {
        url: 'https://res.cloudinary.com/dhbiouaym/image/upload/v1632636239/YelpCamp/mt7vew46iuelyjperm02.jpg',
        filename: 'YelpCamp/mt7vew46iuelyjperm02',
    },
    {
        url: 'https://res.cloudinary.com/dhbiouaym/image/upload/v1632636244/YelpCamp/trvehxjujs8frbrjrfil.jpg',
        filename: 'YelpCamp/trvehxjujs8frbrjrfil',
    },
    {
        url: 'https://res.cloudinary.com/dhbiouaym/image/upload/v1632636247/YelpCamp/amniou07rihgxtsagsca.jpg',
        filename: 'YelpCamp/amniou07rihgxtsagsca',
    },
    {
        url: 'https://res.cloudinary.com/dhbiouaym/image/upload/v1632636248/YelpCamp/t5xqmk2ijt0o0shdbkkh.jpg',
        filename: 'YelpCamp/t5xqmk2ijt0o0shdbkkh',
    },
    {
        url: 'https://res.cloudinary.com/dhbiouaym/image/upload/v1632636469/YelpCamp/qry2l5ntcxmpstungx9q.jpg',
        filename: 'YelpCamp/qry2l5ntcxmpstungx9q',
    },
    {
        url: 'https://res.cloudinary.com/dhbiouaym/image/upload/v1632636471/YelpCamp/kan7ktxqgynjudblesv8.jpg',
        filename: 'YelpCamp/kan7ktxqgynjudblesv8',
    },
    {
        url: 'https://res.cloudinary.com/dhbiouaym/image/upload/v1632636474/YelpCamp/y5xf7zdzgn5vi444qpsx.jpg',
        filename: 'YelpCamp/y5xf7zdzgn5vi444qpsx',
    },
    {
        url: 'https://res.cloudinary.com/dhbiouaym/image/upload/v1632636476/YelpCamp/qmmxwz5prukysbohozaz.jpg',
        filename: 'YelpCamp/qmmxwz5prukysbohozaz',
    }
]

const Seed = async ()=>{
   await Campground.deleteMany({});
   for(let i = 0; i<20; i++){
     const rand = Math.floor(Math.random()*400);
     const randprice = Math.floor(Math.random()*1000)+1;
     const random8 = Math.floor(Math.random() * 8);
     const camp = new Campground({
        title:`${sample(descriptors)} ${sample(places)}`,
        author:'63bc3eed07f212ad8af582db',
        images: images[random8],
        location:`${cities[rand].city}, ${cities[rand].admin_name}`,
        geometry: {
            type: "Point",
            coordinates: [
                cities[rand].lng,
                cities[rand].lat,
            ]
        },
        description:'This is the description for the camp',
        price: randprice})
     await camp.save();
   } 

}
Seed().then(()=>{
    mongoose.connection.close();
});
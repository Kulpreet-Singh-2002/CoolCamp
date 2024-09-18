const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp_camp');

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            author:'66d770d4b9cb6fe7704ebfb4',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'decription',
            price:random1000,
            geometry:{ 
                type:"Point",
                coordinates:[cities[random1000].longitude,cities[random1000].latitude]
            },
            images: [
                {
                  url: "https://media.istockphoto.com/id/1352945762/vector/no-image-available-like-missing-picture.jpg?s=612x612&w=0&k=20&c=4X-znbt02a8EIdxwDFaxfmKvUhTnLvLMv1i1f3bToog=",
                  filename: 'YelpCamp/wiaequt5erwkizgi2bmk',
                  _id:'66e449b302559a3b152bee8e'
                }
              ]
        })
        await camp.save();
    }
}

seedDB()
.then(() => {
    mongoose.connection.close();
})
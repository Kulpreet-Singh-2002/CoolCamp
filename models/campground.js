const mongoose=require('mongoose');
const Review=require('./review');
const Schema=mongoose.Schema;

const imageSchema=new Schema({
        url:String,
        filename:String
});

imageSchema.virtual('thumbnail').get(function(){
    return this.url.includes('/upload') 
    ? this.url.replace('/upload', '/upload/w_200') 
    : this.url;
})

const opts = { toJSON: { virtuals: true }, toObject: { virtuals: true } };


const CampgroundSchema=new Schema({
    title:String,
    images:[imageSchema],
    geometry: {
        type: {
          type: String, 
          enum: ['Point'], 
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
    },
    price:Number,
    description:String,
    location:String,
    author:{
        type: Schema.Types.ObjectId,
        ref:'User'
    },
    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref:'Review'
        }
    ]
},opts);

CampgroundSchema.virtual('properties.popUpMarkup').get(function() {
    // Escape problematic characters and handle undefined cases
    const safeTitle = this.title ? this.title.replace(/["']/g, match => match === '"' ? '&quot;' : '&#39;') : 'No Title';
    const safeDescription = this.description 
        ? this.description.substring(0, 20).replace(/["']/g, match => match === '"' ? '&quot;' : '&#39;') 
        : 'No Description';

    return `<strong><a href="/campgrounds/${this._id}">${safeTitle}</a></strong><p>${safeDescription}...</p>`;
});


CampgroundSchema.post('findOneAndDelete',async function(doc){
    if(doc){
        await Review.deleteMany({
            _id:{
                $in:doc.reviews
            }
        })
    }
})    

module.exports=mongoose.model('Campground',CampgroundSchema);
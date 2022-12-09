const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'please provide product name'],
        trim: true,
        maxLength :[120, 'Product name should be not more than 120 characters']
    },
    price: {
        type: Number,
        required: [true, 'Please provide product price'],
        maxLength: [5, 'Product price should not be more than 5 digits']
    },
    description :{
        type: String,
        required: [true, 'Please provide product Description']
    },
    photos: [
        {
            id:{
                type:String,
                required:true
            },
            secure_url:{
                type:String,
                required:true
            }
        }
    ],
    category:{
        type: String,
        required: [true, 'Please select category from- short-sleeves, long-sleeves, sweat-shirts, hoodies'],
        enum: {
            values :[
                'shortsleeves',
                'longslevees',
                'sweatshirt',
                'hoodies'
            ],
            message:'Please select category only from- short-sleeves, long-sleeves, sweat-shirts, hoodies'
        }
    },
    brand: {
        type: String,
        required: [true, 'Please add a brand for clothing']
    },
    rating: {
        type: Number,
        default:0
    },
    numberOfReviews: {
        type: Number,
        default:0
    },
    reviews: [{
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true
        },
        name: {
            type: String,
            required: true,
        },
        rating: {
            type:Number,
            required:true
        },
        comment: {
            type:String,
            required:true,
        }
    }],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },

}, {timestamps:true}
)




module.exports = mongoose.model('Product', productSchema)
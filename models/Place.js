const mongoose = require('mongoose');
let User = require('./User')
const placeSchema = new mongoose.Schema({
    title: { type: String, unique: true},
    description: String,
    rating: Number,
    latitude: Number,
    longitude: Number,
    city: String,
    state: String,
    zipcode: String,
    country: String,
    address: String,
    website: String,
    neighborhood: String,
    category: String,
    features: Array,
    tags: Array,
    submitedBy: mongoose.Schema.Types.ObjectId,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
},{ timestamps: true })

const Place = mongoose.model('Place', placeSchema);

module.exports = Place;
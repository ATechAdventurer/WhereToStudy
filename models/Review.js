const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    rating: Number,
    user: mongoose.Schema.Types.ObjectId,
    placeId: mongoose.Schema.Types.ObjectId
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
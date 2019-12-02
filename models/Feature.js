const mongoose = require('mongoose')
const featureSchema = new mongoose.Schema({
    title: {type: String, unique: true},
    question: {type: String},
    displayName: {type: String},
    icon: {type: String},
}, {timestamps: true})

const Feature = mongoose.model('Feature', featureSchema)

module.exports = Feature;
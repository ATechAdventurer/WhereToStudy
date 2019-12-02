const {
    promisify
} = require('util');
const Place = require('../models/Place');
const User = require('../models/User');

/** 
 * POST /ratings/new
 * Adds Place rating
 */

exports.addnewRating = (req, res, next) => {
    let user = req.user._id
    let {
       placeId,
       rating 
    } = req.body
    //Check if logged in
    var currentUser = req.user;
    geo.setAccessToken('pk.eyJ1IjoibWFub3N0ZWVsZSIsImEiOiJjamhtanE1OWswZWFmM2RyeDd3M3pleDdnIn0.Ccam63uwLV2GkhuDt-8DlQ');

    // Geocode an address to coordinates

    geo.geocode('mapbox.places', address, function (err, geoData) {
        console.log(geoData.features[0])
        //Validation TODO
        var place = geoData.features[0];
        var featureList = ["quiet", "outlet", "wifi", "groups", "costs"];
        var features = [];
        //Populate Feature List for DB
        featureList.forEach(feature => {
            if (req.body[feature] !== undefined) {
                features.push(feature)
            }
        })
        console.log(place.context)
        if (place.context.length < 5) {
            Place.create({
                title: striptags(sanitize(title)),
                description: striptags(sanitize(description)),
                rating: striptags(sanitize(rating)),
                address: striptags(sanitize(place.place_name)),
                neigborhood: "",
                zipcode: place.context[0].text,
                city: place.context[1].text,
                state: place.context[2].text,
                country: place.context[3].text,
                website: striptags(sanitize(website)),
                user,
                longitude: place.geometry.coordinates[0],
                latitude: place.geometry.coordinates[1],
                features: features,
                category: striptags(sanitize(category))
            }, function (err) {
                res.redirect("/")
            })
        } else {

            Place.create({
                title,
                description,
                rating,
                address: place.place_name,
                neigborhood: place.context[0].text,
                zipcode: place.context[1].text,
                city: place.context[2].text,
                state: place.context[3].text,
                country: place.context[4].text,
                website,
                user,
                longitude: place.geometry.coordinates[0],
                latitude: place.geometry.coordinates[1],
                features,
                category: category
            }, function (err) {
                res.redirect("/")
            })
        }
    });


}
const {
    promisify
} = require('util');
const Place = require('../models/Place');
const User = require('../models/User');
const Category = require("../models/Category")
const Feature = require('../models/Feature')
const toTitleCase = require('../utils/toTitleCase');
const sanitize = require('mongo-sanitize');
const striptags = require('striptags');
let geo = require('mapbox-geocoding');

/**
 * GET /places
 * Places page.
 */
exports.getPlaces = (req, res) => {
    res.render('places/index', {
        title: 'Places'
    });
};

/** 
 * GET /places/new
 * Add Place page
 */

exports.newPlaces = (req, res) => {
    Category.find({}, "title", function (err, categories) {
        Feature.find({}, "title question displayName", function (err2, features) {
            var cats = []
            var feats = []
            categories.forEach(cat => {
                cats.push(cat.title)
            })

            res.render('places/create', {
                title: "Submit Place",
                categories: cats,
                features
            })
        })
    })
}

/**
 * POST /places/create
 * Create a new local account.
 */
exports.addnewPlaces = (req, res, next) => {
    let user = req.user._id
    let {
        title,
        description,
        rating,
        address,
        website,
        category
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

exports.APIplacesWithOrigin = (req, res, next) => {
    var location = req.params.location.substring(9);
    var newLoc = location.split(",")
    const sortByDistance = require('sort-by-distance')

    Place.find({}, function (err, docs) {

        const opts = {
            yName: 'latitude',
            xName: 'longitude'
        }

        const origin = {
            longitude: newLoc[0],
            latitude: newLoc[1],
        }

        let data = sortByDistance(origin, docs, opts)

        let output = {
            "type": "FeatureCollection",
            "features": []
        }

        data.forEach(place => {
            output.features.push({
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                        place.longitude,
                        place.latitude
                    ]
                },
                "properties": {
                    "id": place._id,
                    "name": place.title,
                    "description": place.description,
                    "address": place.address,
                    "city": place.city,
                    "state": place.state,
                    "country": place.country,
                    "category": place.category,
                    "features": place.features,
                    "rating": place.rating
                }
            })
        });
        res.json(output);
    });


}


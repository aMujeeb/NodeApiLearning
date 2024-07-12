const HttpError = require('../models/http-error');

const DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'Empire State',
        description: 'One of the most famous sky scrapers in the world',
        location: {
            lat: 40.33544,
            lng: -73.4545
        },
        address: 'Main Street, Chicago',
        creator: 'u1'
    }
];

const getPlaceById = (req, res, next) => {
    const placeId = req.params.pid;
    const place = DUMMY_PLACES.find(p => {
        return p.id === placeId
    });//Default JS method 

    if(!place) {
        //if asynchronouse next() else throw
        throw new HttpError('Could Not find place', 404);
    }

    res.json({place}); //JS { place } =====> { place : place}
};

// function getPlaceById() { ...... }
// const getPlaceById = function() { .... }

const getPlacesByUserId = (req, res, next) => {
    const userId = req.params.uid;

    const place = DUMMY_PLACES.find(p => {
        return p.creator === userId;
    });

    if(!place) {
        //if asynchronouse next() else throw
        return next(
            new HttpError('Could Not find place for user Id', 404)
        );
    }

    res.json({ place });
};

//pointing functions as values
exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
const { 
    v1: uuidv1,
    v4: uuidv4,
  } = require('uuid');

const { validationResult } = require('express-validator'); //
const HttpError = require('../models/http-error');

let DUMMY_PLACES = [
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

    const places = DUMMY_PLACES.filter(p => { //Filter will return a new array full of elements. find() will get one record
        return p.creator === userId;
    });

    if(!places || places.length === 0) {
        //if asynchronouse next() else throw
        return next(
            new HttpError('Input Errors', 422)
        );
    }

    res.json({ places });
};

//Handling a post function
const createPlace = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return next(
            new HttpError('Validation errors', 422)
        );
    }

    const {
        title, description, coordinates, address, creator //Object destructuring
    } = req.body;

    const createdPlace = {
        id: uuidv1(), //Providing unique ID with another library
        title, 
        description,
        location: coordinates,
        address,
        creator
    };

    DUMMY_PLACES.push(createdPlace);

    res.status(201).json({place : createdPlace});
};

//Patch or Update function
const updatePlaceById = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return next(
            new HttpError('Validation errors', 422)
        );
    }
    const {
        title, description //Object destructuring
    } = req.body;
    const placeId = req.params.pid;

    const updatedPlace = { ...DUMMY_PLACES.find(p => p.id === placeId) }; //This { ...} operation creates a copy of the object. A reference type.
    const placeIndex = DUMMY_PLACES.findIndex(p => p.id === placeId);
    updatedPlace.title = title;
    updatedPlace.description = description;

    DUMMY_PLACES[placeIndex] = updatedPlace;
    res.status(200).json({place : updatedPlace});
};

//Delete function
const deletePlaceById = (req, res, next) => {
    const placeId = req.params.pid;
    if(!DUMMY_PLACES.find(p => p.id === placeId)) {
        return next(
            new HttpError('Couldnt find a place to delete', 404)
        );
    }
    DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id !== placeId)

    res.status(200).json({message : 'Deleted Place.'});
};

//pointing functions as values
exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlaceById = deletePlaceById;
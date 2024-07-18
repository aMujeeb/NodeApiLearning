const { 
    v1: uuidv1,
    v4: uuidv4,
  } = require('uuid');

const { validationResult } = require('express-validator'); //
const HttpError = require('../models/http-error');
const Place = require('../models/place');

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

const getPlaceById = async (req, res, next) => {
    const placeId = req.params.pid;
    //const place = DUMMY_PLACES.find(p => {
        //return p.id === placeId
    //});//Default JS method 

    //const place = Place.findById(); will not return a promise directly
    let place;

    try {
        place = await Place.findById(placeId);
    } catch (err) {
        return next(
            new HttpError('Somethimg wrong. Could not find the Place', 500)
        );
    }
   
    if(!place) {
        //if asynchronouse next() else throw
        //throw new HttpError('Could Not find place', 404);
        return next(
            new HttpError('Somethimg wrong. Could not find the Place', 500)
        );
    }

    //'place' is Mongoose object. Need to cleanup few attributes

    res.json({ place: place.toObject( {getters: true} ) }); //JS { place } =====> { place : place}
};

// function getPlaceById() { ...... }
// const getPlaceById = function() { .... }

const getPlacesByUserId = async (req, res, next) => {
    const userId = req.params.uid;

    //const places = DUMMY_PLACES.filter(p => { //Filter will return a new array full of elements. find() will get one record
        //return p.creator === userId;
    //});
    let places;

    try {
        places = await Place.find({ creator: userId });
    } catch (err) {
        return next(
            new HttpError('Somethimg wrong. Could not find the Place', 500)
        );
    }

    if(!places || places.length === 0) {
        //if asynchronouse next() else throw
        return next(
            new HttpError('Input Errors', 422)
        );
    }

    res.json({ places : places.map(place => place.toObject( { getters: true } )) });
};

//Handling a post function
const createPlace = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return next(
            new HttpError('Validation errors', 422)
        );
    }

    const {
        title, description, coordinates, address, creator //Object destructuring
    } = req.body;

    //const createdPlace = {
        //id: uuidv1(), //Providing unique ID with another library
        //title, 
        //description,
        //location: coordinates,
        //address,
        //creator
    //};

    const createdPlace = new Place({
        title,
        description,
        address,
        location: coordinates,
        image: 'https://i0.wp.com/picjumbo.com/wp-content/uploads/beautiful-summer-seychelles-beach-with-palms-and-rocks-free-photo.jpeg?h=800&quality=80',
        creator
    });

    //DUMMY_PLACES.push(createdPlace);
    try {
        await createdPlace.save(); // Will create a primary id
    } catch (err) {
        const error = new HttpError(
            'Creating Place failed. Please try again.',
            500
        );
        return next(error);
    }

    res.status(201).json({place : createdPlace});
};

//Patch or Update function
const updatePlaceById = async (req, res, next) => {
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

    //const updatedPlace = { ...DUMMY_PLACES.find(p => p.id === placeId) }; //This { ...} operation creates a copy of the object. A reference type.
    //const placeIndex = DUMMY_PLACES.findIndex(p => p.id === placeId);

    let place;
    try {
        place = await Place.findById(placeId);
    } catch(err) {
        const error = new HttpError(
            'Something went wrong. Cannot update.',
            500
        );
        return next(error);
    }
    place.title = title;
    place.description = description;

    //DUMMY_PLACES[placeIndex] = updatedPlace;
    //Storing updated Object in DB
    try {
        await place.save();
    } catch(err) {
        const error = new HttpError(
            'Something went wrong. Cannot update.',
            500
        );
        return next(error);
    }

    res.status(200).json({place : place.toObject( { getters: true } )});
};

//Delete function
const deletePlaceById = async (req, res, next) => {
    const placeId = req.params.pid;
   // if(!DUMMY_PLACES.find(p => p.id === placeId)) {
       // return next(
            //new HttpError('Couldnt find a place to delete', 404)
        //);
    //}
    //DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id !== placeId)
    console.log(placeId)
    let place;
    try {
        place = await Place.findById(placeId);
    } catch(err) {
        const error = new HttpError(
            'Something went wrong- Find. Cannot delete.',
            500
        );
        return next(error);
    }

    try {
        await place.deleteOne();
    } catch(err) {
        const error = new HttpError(
            'Something went wrong- Remove. Cannot delete.',
            500
        );
        return next(error);
    }

    res.status(200).json({message : 'Deleted Place.'});
};

//pointing functions as values
exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlaceById = deletePlaceById;
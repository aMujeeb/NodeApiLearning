const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const placeRoutes = require('./routes/places-route');
const usersRoutes = require('./routes/users-route');
const HttpError = require('./models/http-error');

const app = express();
const port = 5005;

//Middle wear are passed from top to bottom. POST better to place on top
app.use(bodyParser.json());
//This will automatically add the payload into the body as next() regardless the API call based on endpoint it will be directed to relevent route

app.use('/api/places', placeRoutes); // => /api/places/..... type requests should be forwaded
app.use('/api/users', usersRoutes);

//handle un supported routes
app.use((req, res, next) => {
    const error = new HttpError('Could not find this route..', 404);
    throw error;
});

//Middleware to handle error scenarios
app.use((error, req, res, next) => {
    if(res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || 'An unknown error occured!' }); //The error message client get to display or analyze 
});

//Connecting to mongoose
mongoose
.connect('wewew')
.then(() => {
    //If connection for the Db is successfull we start back end server
    app.listen(port);
})
.catch(() => {
    console.log('Connection failure');
});

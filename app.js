const express = require('express');
const bodyParser = require('body-parser');

const placeRoutes = require('./routes/places-route')

const app = express();
const port = 5005;

app.use('/api/places', placeRoutes); // => /api/places/..... type requests should be forwaded

//Middleware to handle error scenarios
app.use((error, req, res, next) => {
    if(res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || 'An unknown error occured!' }); //The error message client get to display or analyze 
});

app.listen(port);

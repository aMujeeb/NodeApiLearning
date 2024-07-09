const express = require('express');
const bodyParser = require('body-parser');

const placeRoutes = require('./routes/places-route')

const app = express();
const port = 5005;

app.use('/api/places', placeRoutes); // => /api/places/..... type requests should be forwaded

app.listen(port);

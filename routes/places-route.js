const express = require('express');

const router = express.Router();

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

router.get('/:pid', (req, res, next) => {
    const placeId = req.params.pid;
    const place = DUMMY_PLACES.find(p => {
        return p.id === placeId
    });//Default JS method 
    res.json({place}); //JS { place } =====> { place : place}
});

module.exports = router;
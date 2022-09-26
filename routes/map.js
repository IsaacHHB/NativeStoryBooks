const express = require('express');
const { getMap, addStory } = require('../controllers/map');

const router = express.Router();

router
    .route('/')
    .get(getMap)
    .post(addStory);


module.exports = router;
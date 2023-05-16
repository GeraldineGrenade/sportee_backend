var express = require('express');
var router = express.Router();

require('../models/connection');
const Sport = require('../models/sports');

// GET all sports
router.get('/', (req, res) => {
    Sport.find()
      .then(data => data ? res.json({result : true, sports : data}) : res.json({result : false}))
    });

// GET sports according to search
router.get('/:search', (req, res) => {
    Sport.find({name : new RegExp(req.params.search+'+', "gi")})
        .then(data => data ? res.json({result : true, sports : data}) : res.json({result : false}))

    });

module.exports = router;

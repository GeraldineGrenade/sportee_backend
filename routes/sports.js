var express = require('express');
var router = express.Router();

const Sport = require('../models/sports');

// Get all sports
router.get('/', (req, res) => {
    Sport.find()
      .then(data => data ? res.json({result : true, sports : data}) : res.json({result : false}))
    });

// Get sports according to search
router.get('/:search', (req, res) => {
    Sport.find({name : new RegExp(req.params.search+'+', "gi")})
        .then(data => data ? res.json({result : true, sports : data}) : res.json({result : false}))
    });

module.exports = router;

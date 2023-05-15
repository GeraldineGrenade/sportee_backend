const mongoose = require('mongoose');

const sportSchema = mongoose.Schema({
    name: String,
    photo: String,
    icon: String,
});

const Sport = mongoose.model('sports', sportSchema);

module.exports = Sport
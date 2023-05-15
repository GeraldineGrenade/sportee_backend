const mongoose = require ('mongoose');

const badgeSchema = mongoose.Schema [{
    name: String,
    icon: String,
}];

const Badge = mongoose.model('badges', badgeSchema);

module.exports = Badge
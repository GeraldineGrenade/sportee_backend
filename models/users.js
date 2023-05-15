const mongoose =  require('mongoose');


//TABLEAU DE SOUS-DOCUMENTS
const preferenceSchema = mongoose.Schema({

    level: String,
    sport:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Sports'}],
    habitude: [String],
});

const userSchema = mongoose.Schema({
    lastname: String,
    firstname: String,
    email: String,
    password: String,
    phone: Number,
    username: String,
    dateOfBirth: Date,
    avatar: String,
    token: String,
    description: String,
    preference : preferenceSchema,
    badge : [{type: mongoose.Schema.Types.ObjectId, ref: 'Badges'}]
});


const Preference = mongoose.model ('preferences', preferenceSchema);
const User = mongoose.model('users', userSchema);

module.exports = {User, Preference}
const mongoose =  require('mongoose');


//TABLEAU DE SOUS-DOCUMENTS
const preferenceSchema = mongoose.Schema({

    level: String,
    sports:[{ type: mongoose.Schema.Types.ObjectId, ref: 'sports'}],
    habits: [String],
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
    preferences : preferenceSchema,
    badges : [{type: mongoose.Schema.Types.ObjectId, ref: 'badges'}]
});


const Preference = mongoose.model ('preferences', preferenceSchema);
const User = mongoose.model('users', userSchema);

module.exports = {User, Preference}
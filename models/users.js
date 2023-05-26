const mongoose =  require('mongoose');

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
    phone: String,
    username: String,
    dateOfBirth: {type: Date, default : new Date()},
    avatar: String,
    token: String,
    description: {type: String, default: ''},
    preferences : preferenceSchema,
    badges : [{type: mongoose.Schema.Types.ObjectId, ref: 'badges'}]
});


const User = mongoose.model('users', userSchema);

module.exports = User
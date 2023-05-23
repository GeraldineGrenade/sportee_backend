const mongoose = require('mongoose');

//TABLEAU DE SOUS-DOCUMENTS


const messageSchema = mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId, ref: 'users'},
    message:String,
    timestamp: Date,
})

const conversationSchema = mongoose.Schema({
    users :[{type: mongoose.Schema.Types.ObjectId, ref: 'users'}],
    messages: [messageSchema],
});

const placeSchema = mongoose.Schema({
    address: String,
    coords: {latitude: Number, longitude: Number}
});

const participantSchema = mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    isApproved: Boolean,
});


const activitySchema = mongoose.Schema({
    name: String,
    sport: {type: mongoose.Schema.Types.ObjectId, ref: 'sports'},
    description: String,
    place: placeSchema,
    level: String,
    date: Date,
    time: Number,
    nbMaxParticipants: Number,
    conversation: conversationSchema,
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    participants : [participantSchema],
});


const Activity = mongoose.model('activities', activitySchema);
// const Message = mongoose.model('messages', messageSchema)
// const Conversation = mongoose.model('conversations', conversationSchema)

module.exports = Activity;
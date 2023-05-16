const mongoose = require('mongoose');

//TABLEAU DE SOUS-DOCUMENTS
const conversationSchema = mongoose.Schema({
    users :[{type: mongoose.Schema.Types.ObjectId, ref: 'users'}],
    messages: [messageSchema],
});

const messageSchema = mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId, ref: 'users'},
    message:String,
    timestamp: Date,
})

const placeSchema = mongoose.Schema({
    address: String,
    coords: {latitude: Number, longitude: Number}
});

const participantSchema = mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    isApproved: Boolean,
});


const activiteSchema = mongoose.Schema[{
    name: String,
    sport: {type: mongoose.Schema.Types.ObjectId, ref: 'sports'},
    description: String,
    place: placeSchema,
    level: String,
    date: Date,
    time: Date,
    nbMaxParticipants: Number,
    conversation: [[conversationSchema]],
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    participants : [participantSchema],
}];




const Conversation = mongoose.model('conversations', conversationSchema);
const Message = mongoose.model('messages', messageSchema);
const Activity = mongoose.model('activities', activiteSchema);
const Place = mongoose.model('places', placeSchema);
const Participant = mongoose.model('participants', participantSchema);

module.exports = {Activity, Place, Participant, Conversation, Message};
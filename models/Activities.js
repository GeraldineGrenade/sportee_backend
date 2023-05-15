const mongoose = require('mongoose');

//TABLEAU DE SOUS-DOCUMENTS
const conversationSchema = mongoose.Schema({
    user :[{type: mongoose.Schema.Types.ObjectId, ref: 'Users'}],
    message: [messageSchema],
});

const messageSchema = mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId, ref: 'Users'},
    message:String,
    timestamp: Date,
})

const lieuSchema = mongoose.Schema({
    adress: String,
    coord: {latitude: Number, longitude: Number}
});

const participantSchema = mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
    isApproved: Boolean,
});


const activiteSchema = mongoose.Schema[{
    name: String,
    sport: {type: mongoose.Schema.Types.ObjectId, ref: 'Sports'},
    description: String,
    lieu: lieuSchema,
    level: String,
    date: Date,
    Horaire: Date,
    nbMaxParticipant: Number,
    conversation: [[conversationSchema]],
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
    participant : [participantSchema],
}];




const Conversation = mongoose.model('conversations', conversationSchema);
const Message = mongoose.model('messages', messageSchema);
const Activite = mongoose.model('activites', activiteSchema);
const Lieu = mongoose.model('lieux', lieuSchema);
const Participant = mongoose.model('participants', participantSchema);

module.exports = {Activite, Lieu, Participant, Conversation, Message};
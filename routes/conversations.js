var express = require('express')
var router = express.Router()

const Activity = require('../models/Activities');
const Pusher = require("pusher");

const { updateOne } = require('../models/Activities');

const pusher = new Pusher({
    appId: process.env.PUSHER_APPID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.PUSHER_CLUSTER,
    useTLS: true
})
router.put('/join-channel', (req, res) => {
    pusher.trigger('sportee_channel', 'join', {
        status: 'User joined channel'
    })
    res.json({ result: true })
})
router.post('/messages', (req, res) => {
    const message = req.body.message;

    pusher.trigger('sportee_channel', 'new-message', { status: 'new message' })

    res.sendStatus(200)
})
router.delete('/leave-channel', (req, res) => {
    pusher.trigger('sportee_channel', 'leave', {
        status: 'User leaved channel'
    })
    res.json({ result: true })
})
router.put("/:conversationId", (req, res) => {

    const { message, user, timestamp } = req.body
    Activity.findOneAndUpdate(
        { "conversation._id": req.params.conversationId },
        { $push: { "conversation.messages": { message, user, timestamp } } }
    )
        .then((data) => {

            res.json({ result: true })
        })
        .catch((error) => {
            res.json({ result: false, error: error.message })
        })
})

router.get('/getConversation/:id', (req, res) => {
    Activity.findById(req.params.id)
        .populate('conversation.messages')
        .then(data => {
            if (data) {
                res.json({ result: true, messages: data.conversation.messages })
            } else {
                res.json({ result: false })
            }
        })
})

module.exports = router

var express = require('express')
var router = express.Router()

const Pusher = require("pusher")

const pusher = new Pusher({
    appId: process.env.PUSHER_APPID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.PUSHER_CLUSTER,
    useTLS: true
})

router.post('/messages', (req, res) => {
    const message = req.body.message;

    pusher.trigger('chat', 'new-message', { message })

    res.sendStatus(200)
})


// router.post("/message", (req, res) => {
//     const payload = req.body
//     pusher.trigger(req.query.channel, "message", payload)
//     res.send(payload)
// })

// router.post('/message', (req, res) => {
//     pusher.trigger('chat', 'message', req.body)

//     res.json({ result: true })
// })

router.put('/users/:username', (req, res) => {
    pusher.trigger('chat', 'join', {
        username: req.params.username,
    })

    res.json({ result: true })
})

module.exports = router
// pusher.trigger("my-channel", "my-event", {
//     message: "hello world"
// })
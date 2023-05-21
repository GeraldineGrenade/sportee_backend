var express = require('express');
var router = express.Router();

const Activity = require('../models/Activities');

//POST NEW ACTIVITY
router.post ('/', async (req, res) => {
    try {
        const { name, sport, description, place, level, date, time, nbMaxParticipants, conversation, user, participants } = req.body

        const activity = new Activity({
            name,
            sport,
            description,
            place,
            level,
            date,
            time,
            nbMaxParticipants,
            conversation,
            user,
            participants
        })
        console.log(activity)
        await activity.save()

        res.json({ message: 'L\'activité a été créée avec succès'})
    }catch (error) {
        res.json({error})
    }
});

// GET ALL ACTIVITIES
router.get('/', async (req, res) => {
    try {
        const activities = await Activity.find()
        .populate('user')
        .populate('sport')
        // .populate('participants.user')
        // .populate('conversation.users')
        // .populate('conversation.messages.user')
        res.json({activities});
    } catch (error) {
        res.json({ error });
    }
});


module.exports = router;
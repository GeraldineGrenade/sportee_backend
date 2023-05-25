var express = require('express');
var router = express.Router();

const Activity = require('../models/Activities');
const User = require('../models/users')

//POST NEW ACTIVITY
router.post('/', async (req, res) => {
    try {
        const { name, sport, description, place, level, date, time, nbMaxParticipants, userToken } = req.body


        const user = await User.findOne({ token: userToken })
        const userId = user._id


        const activity = new Activity({
            name,
            sport,
            description,
            place,
            level,
            date,
            time,
            nbMaxParticipants,
            conversation: {
                users: [userId],
                messages: []
            },
            user: userId,
            participants: []
        })

        const savedActivity = await activity.save()

        res.json({ message: 'L\'activité a été créée avec succès', activity: savedActivity })
    } catch (error) {
        res.json({ error })
    }


});

//GET CONVERSATION BY ID
router.get('/getConversation/:id', (req, res) => {
    Activity.findById(req.params.id)
        .then(data => {
            console.log(data.conversation._id);
            res.json({ roomId: data.conversation._id });
        })
        .catch(error => {
            res.json({ error: 'Une erreur s\'est produite lors de la récupération de la conversation' });
        });
});

// GET ALL ACTIVITIES
router.get('/', async (req, res) => {
    try {
        const activities = await Activity.find()
            // .populate('user')
            .populate('sport')
        // .populate('participants.user')
        // .populate('conversation.users')
        // .populate('conversation.messages.user')
        res.json({ activities });
    } catch (error) {
        res.json({ error });
    }
});


//Get activity details by ID (without conversation details)
router.get('/getActivity/:id', (req, res) => {
    Activity.findById(req.params.id)
        .populate('user')
        .populate('sport')
        .populate('participants.user')
        .then(data => {
            if (data) {
                const { _id, name, sport, description, place, level, date, time, nbMaxParticipants, user, participants } = data
                res.json({ result: true, activity: { _id, name, sport, description, place, level, date, time, nbMaxParticipants, user, participants } })
            } else {
                res.json({ result: false })
            }
        })
});

//Get list of participants for one activity
router.get('/getParticipants/:activityId', (req, res) => {
    Activity.findById(req.params.activityId)
        .populate('participants.user')
        .then(data => {
            if (data) {
                res.json({ result: true, participants: data.participants })
            } else {
                res.json({ result: false })
            }
        })
});

//Add new user in an activity's participants list 
router.put("/:activityId/:userId", (req, res) => {

    Activity.updateOne({ _id: req.params.activityId }, { $push: { participants: { user: req.params.userId, isApproved: false } } })
        .then(() => {
            res.json({ result: true });
        });
})

//Accept the participation request of a user
router.put('/acceptParticipation/:activityId/:participantId', async (req, res) => {
    const activity = await Activity.findOne({ _id: req.params.activityId })

    const validatedParticipants = activity.participants.map(e => {
        if (String(e._id).match(new RegExp(req.params.participantId))) {
            return { _id: e._id, user: e.user, isApproved: true }
        } else {
            return e
        }
    })

    await Activity.updateOne({ _id: req.params.activityId }, { participants: validatedParticipants })
    const participants = await Activity.findById(req.params.activityId)

    res.json({ result: true, participants });

})

//Refuse the participation request of a user
router.put('/refuseParticipation/:activityId/:participantId', (req, res) => {
    Activity.updateOne(
        { _id: req.params.activityId }, 
        { $pull: { participants: {_id: req.params.participantId} } }
    )
        .then(data => {
            res.json({ result: true, data });
        })
        .catch(err => console.error(err))
})


//Find all activities created by user
router.get('/getActivitiesByUser/', (req, res) => {
    let userId
    User.findOne({ token: req.query.token })
        .then(data => {
            userId = data._id
            if (data) {
                Activity.find({ user: userId })
                    .populate('sport')
                    .populate('user')
                    .then(data => {
                        if (data) {
                            let dataSet = data.map(e => {
                                return {
                                    activityId: e._id,
                                    name: e.name,
                                    sport: e.sport,
                                    date: e.date,
                                    time: e.time,
                                    user: { username: e.user.username, avatar: e.user.avatar, token: e.user.token },
                                }
                            })

                            res.json({ result: true, activities: dataSet })
                        } else {
                            res.json({ result: false, message: 'no activities found' })
                        }
                    })
            } else {
                res.json({ result: false, message: 'user not found' })
            }
        })
        .catch(err => console.error(err))
})

//Find all activities in which a user is participating
router.get('/getActivitiesOfUser/', (req, res) => {
    let userId
    User.findOne({ token: req.query.token })
        .then(data => {
            userId = data._id
            if (data) {
                Activity.find({ 'participants': { $elemMatch: { user: userId, isApproved: true } } })
                    .populate('sport')
                    .populate('user')
                    .then(data => {
                        console.log(data)
                        if (data) {
                            let dataSet = data.map(e => {
                                return {
                                    activityId: e._id,
                                    name: e.name,
                                    sport: e.sport,
                                    date: e.date,
                                    time: e.time,
                                    user: { username: e.user.username, avatar: e.user.avatar, token: e.user.token },
                                    conversationId: e.conversation._id,
                                }
                            })

                            res.json({ result: true, activities: dataSet })
                        } else {
                            res.json({ result: false, message: 'no activities found' })
                        }
                    })
            } else {
                res.json({ result: false, message: 'user not found' })
            }
        })
        .catch(err => console.error(err))

});





module.exports = router;


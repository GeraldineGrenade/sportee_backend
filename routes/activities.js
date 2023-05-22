var express = require('express');
var router = express.Router();

const Activity = require('../models/Activities');
const User = require('../models/users')
//POST NEW ACTIVITY
router.post('/', async (req, res) => {
    try {
        const { name, sport, description, place, level, date, time, nbMaxParticipants, userToken } = req.body
  const user = await User.findOne({ token: userToken})
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
            conversation : {
        users: [userId], 
        messages: []
      },
            user: userId,
            participants : []
        })
        
        const savedActivity = await activity.save()

        res.json({ message: 'L\'activité a été créée avec succès', activity: savedActivity })
    } catch (error) {
        res.json({ error })
    }
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
                res.json({ result: true, activity: { _id, name, sport, description, place, level, date, time, nbMaxParticipants, user, participants }}) 
            } else {
                res.json({ result: false })
            }
        })
});


//Add new user participant at the Activity 
router.put("/:activityId/:userId", (req, res) =>{

   Activity.updateOne({_id : req.params.activityId}, {$push: {participants: {user: req.params.userId, isApproved: false}}}).then(() =>{
    //  Activity.find().then(AddedNewParticipant => {
       res.json({ result: true });
     });
   })
 //})


module.exports = router;


    // Activity.findOne({_id : req.params.id}).then((data) => {
    // currentNbrparticipant = data.nbMaxParticipants  
    // }).then(() => {
    //   Activity.updateOne({_id : req.params.activityId}, {$push: {friends: {firstName: "Harry", lastName: "Potter"}}}).then(() =>{
    //     Activity.find().then(AddedNewParticipant => {
    //       res.json({ result: true, AddedNewParticipant});
    //     })
    // })
    //   })
    // })
var express = require('express');
var router = express.Router();

const Activity = require('../models/Activities');
const User = require('../models/users')
// const Conversation = require ('../models/Activities')
// const Message = require('../models/Activities')
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
       res.json({ result: true });
     });
   })

//Find all activities in which a user is participating
router.get('/getActivitiesOfUser/:userToken', (req, res) => {
    res.json({result : ok})

    User.findOne({ token: userToken})
    .then(data => {
        if(data) {
            Activity.find({ participants : { user : req.params.userId, isApproved: true }})
            .then(data => {
                if(data) {
                    res.json({result : true, activities : data})    
                } else {
                res.json({result : false, message : 'no activities found'})
                }
            })
        } else {
            res.json({result : false, message : 'user not found'})
        }
    })
    // 
});


// router.put("/:activityId/:userId", (req, res) =>{

//    Activity.updateOne(
//      {_id : req.params.activityId},
//      {$push: {conversation: {user: req.params.userId, conversation}}}).then(() =>{
//        res.json({ result: true });
//      });
//    })

// router.put("/:activityId/:userId", (req, res)=> {
//     const {users, messages } = new Conversation({
//         users,
//         messages: []
//     });

//     newConversation
//         .save()
//         .then((conversation)=> {
            
//       messages.forEach((messageData) => {
//         const newMessage = new Message({
//             user: messageData.user,
//             message: messageData.message,
//             timestamp: messageData.timestamp,
//         });
//         conversation.messages.push(newMessage)
                
//         });
//         return conversation.save();
//         })
//         .then((savedConversation) => {
//             res.json({result: true, conversation: savedConversation})
//         })
//         .catch((error) => {
//             res.json({error:'Erreur lors de la création de la conversation'})
//         })
// })


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
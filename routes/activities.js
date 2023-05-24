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

//{
//     "_id": "646b8b556fcac6675b6a8546",
//     "name": "My awesome event",
//     "sport": {
//       "_id": "646391600efb12e60cbd26a9",
//       "name": "Cyclisme",
//       "icon": "https://res.cloudinary.com/dsd7uux0v/image/upload/v1684246195/sportee/bicycle_ikt0vl.png",
//       "photo": "https://res.cloudinary.com/dube2vhtq/image/upload/v1684682688/cyclisme_kcgfpu.jpg"
//     },
//     "description": "Incididunt veniam amet sint officia duis amet dolor et occaecat.",
//     "place": {
//       "coords": {
//         "latitude": 47.3215806,
//         "longitude": 5.0414701
//       },
//       "address": "21000 Dijon, France",
//       "_id": "646b8b556fcac6675b6a8547"
//     },
//     "level": "Sportif du dimanche",
//     "date": "2023-06-02T02:16:41.084Z",
//     "time": 1,
//     "nbMaxParticipants": 6,
//     "conversation": {
//       "users": [
//         "64662968107a0fa2af912a63",
//         "646792f6dea8baa635ef57f5",
//         "64679415f1924a00483f370c",
//         "646794e2dea8baa635ef581b"
//       ],
//       "messages": [
//         {
//           "user": "64679415f1924a00483f370c",
//           "message": "Voluptate nostrud tempor tempor quis dolor id sit nulla adipisicing deserunt cillum dolore duis sit.",
//           "timestamp": "2023-05-23T18:33:41.085Z",
//           "_id": "646b8b556fcac6675b6a854b"
//         },
//         {
//           "user": "646792f6dea8baa635ef57f5",
//           "message": "Proident aute eiusmod in cupidatat veniam enim aute tempor eu incididunt.",
//           "timestamp": "2023-05-23T18:33:41.086Z",
//           "_id": "646b8b556fcac6675b6a8564"
//         }
//       ],
//       "_id": "646b8b556fcac6675b6a8548"
//     },
//     "user": "646794e2dea8baa635ef581b",
//     "participants": [
//       {
//         "user": "646792f6dea8baa635ef57f5",
//         "isApproved": false,
//         "_id": "646b8b556fcac6675b6a8566"
//       },
//       {
//         "user": "64679415f1924a00483f370c",
//         "isApproved": true,
//         "_id": "646b8b556fcac6675b6a8567"
//       }
//     ],
//     "__v": 0
//   },


//Find all activities in which a user is participating
router.get('/getActivitiesOfUser/:userToken', (req, res) => {
    let userId
    User.findOne({ token: req.params.userToken})
    .then(data => {
        userId = data._id
        if(data) {
            Activity.find({ 'participants' : { $elemMatch: {user: userId, isApproved: true} }})
            .populate('sport')
            .populate('user')
            .then(data => {
                if(data) {
                    let dataSet = data.map(e => {
                        return {
                            activityId : e._id,
                            name : e.name,
                            sport : e.sport,
                            date : e.date,
                            time : e.time, 
                            user : { username : e.user.username, avatar : e.user.avatar, token : e.user.token },
                            conversationId : e.conversation._id,
                        }
                    })

                    res.json({result : true, activities : dataSet})    
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
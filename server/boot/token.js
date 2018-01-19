'use strict';

const AccessToken = require('twilio').jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;

module.exports = function(app) {

  const generateAccessToken = function (identity, room) {
    // Create an Access Token
    const accessToken = new AccessToken(
      process.env.ACCOUNT_SID,
      process.env.API_KEY_SID,
      process.env.API_KEY_SECRET,
      { ttl: 3600 }
    );

    // Set the Identity of this token
    accessToken.identity = identity;

    // Grant access to Video
    const videoGrant = new VideoGrant();
    videoGrant.room = room;
    accessToken.addGrant(videoGrant);

    // Serialize the token as a JWT and return it
    return(accessToken.toJwt());

  }

  app.post('/token/:accessCode', function(req,res)
  {
    let participantsList = [] ;

    const query = {
      where: { accessCode: req.params.accessCode }
    }

    app.models.Participant.findOne(query, function (err, participant) {
      if (err || !participant) {
        return res.send(276);
      }

      participant.meeting(function (err, meeting) {
        
          meeting.participants(null, function(err, participants){

          participants.map(function(p){
            if(participant.name !== p.name)
              participantsList.push({
                name: p.name, 
                phoneNumber: p.phoneNumber, 
                role: p.role 
              })
          })

          const roomInfo = {
            'token': generateAccessToken(participant.name, meeting.roomId),
            'participantInfo': {
              'room': meeting.roomId,
              'role': participant.role,
              'title': meeting.name,
              'name': participant.name,
              'phoneNumber': participant.phoneNumber,
              'epochTime': (new Date).getTime()
            },
            'participantsList':  participantsList
          }
        
          res.json(roomInfo)

        });
        
      });

    });

  });

};

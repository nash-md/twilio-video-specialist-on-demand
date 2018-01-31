'use strict';
var crypto = require('crypto');
var app = require('../../server/server');
var loopback = require('loopback');

const Participant = app.models.Participant;
const Meeting = app.models.Meeting;

module.exports = function (Meetings) {
   // Meetings.validatesUniquenessOf('name');

    Meetings.observe('before save', function (ctx, next) {
        next();
    });

    Meetings.remoteMethod('createWithParticipants', {
        accepts: { arg: 'data', type: 'object', http: { source: 'body' } },
        returns: { arg: 'data', type: 'object', root: true },
        http: { path: '/create-with-participants', verb: 'post' }
    });

    Meetings.createWithParticipants = function (body, cb) {
      const Participant = app.models.Participant;

      body.roomId = crypto.randomBytes(Math.ceil(5)).toString('hex').substr(0,5);
        
      Meetings.create(body, function (err, meeting) {

        for(let participant of body.participants) {    
          participant.accessCode = crypto.randomBytes(Math.ceil(4)).toString('hex').substr(0,5);
          meeting.participants.create(participant)
        };
        
        cb(null, {});

      });

    }
};

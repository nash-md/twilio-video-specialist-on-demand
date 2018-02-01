'use strict';

const authy = require('authy')(process.env.ACCOUNT_SECURITY_API_KEY);

const client = require('twilio')(
  process.env.API_KEY_SID,
  process.env.API_KEY_SECRET,
  { accountSid: process.env.ACCOUNT_SID }
);

module.exports = function(Participant) {
  Participant.observe('after save', function(ctx, next) {
    if (ctx.instance) {
      console.log('Saved %s %s', ctx.Model.modelName, ctx.instance.phoneNumber);

      ctx.instance.meeting(function(err, meeting) {
        const message = `You have a new meeting. Click Here to Join: ${
          process.env.BASE_URL
        }/join/${ctx.instance.accessCode}"`;
        console.log({
          body: message,
          to: ctx.instance.phoneNumber,
          from: process.env.TWILIO_NUMBER,
        });
        client.messages
          .create({
            body: message,
            to: ctx.instance.phoneNumber,
            from: process.env.TWILIO_NUMBER,
          })
          .then(message => {
            console.log(message.sid);
            next();
          })
          .catch(error => {
            console.log(error);
          });
      });
    }
  });

  Participant.remoteMethod('requestOtp', {
    accepts: { arg: 'body', type: 'object', http: { source: 'body' } },
    returns: { arg: 'otp', type: 'object', root: true },
    http: { path: '/request-otp', verb: 'post' },
  });

  Participant.requestOtp = function(body, cb) {
    const query = {
      where: { accessCode: body.accessCode },
    };

    Participant.findOne(query, function(err, participant) {
      if (participant) {

        authy.phones()
          .verification_start(participant.phoneNumber, participant.countryCode, { via: 'sms'}, function(err, res) {

            if (err) {
              console.log(err);
              return cb(err);
            } else {
              console.log('Phone information', res);
              cb(null);
            }
            
        });
      }
    });
  };

  Participant.remoteMethod('validateOtp', {
    accepts: { arg: 'body', type: 'object', http: { source: 'body' } },
    http: { path: '/validate-otp', verb: 'post' },
    returns: { arg: 'object', root: true },
  });

  Participant.validateOtp = function(body, cb) {
    const query = {
      where: { accessCode: body.accessCode },
    };

    Participant.findOne(query, function(err, participant) {
      if (!participant) {
        const error = new Error('participant not found');
        error.status = 404;

        return cb(error);
      } else {

        authy.phones()
          .verification_check(participant.phoneNumber, participant.countryCode, body.otp, function(err, res) {

            if (err) {
              const error = new Error('invalid code');
              error.status = 403;

              return cb(error);
            } else {
              return cb(null);
            }
            
        });
      }
    });
  };
};

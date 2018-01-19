'use strict';

module.exports = function(app) {

   app.get('/join/:accessCode',function(req,res) {    
      const path = require('path');
      res.sendFile(path.resolve('client/join.html'));
   })

   app.get('/room/:accessCode',function(req,res){
      const path = require('path');
      res.sendFile(path.resolve('client/room.html'));
   })   

};

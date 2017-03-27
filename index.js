'use strict';
var schedule = require('node-schedule');
var google = require('googleapis');
var admin = require("firebase-admin");
var serviceAccount = require("./firebase_secret.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://deploy-vr.firebaseio.com"
});

var ref = admin.database().ref();

var leadsNumber = ref.child('leadsNumber');




var key = require('./service_account.json');  

var jwtClient = new google.auth.JWT(
  key.client_email,
  null,
  key.private_key,
  ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/spreadsheets.readonly'],
  null
);


jwtClient.authorize(function (err, tokens) {
  if (err) {
    console.log(err);
    return;
  }
var j = schedule.scheduleJob('*/3 * * * * *', function(){


  console.log('Atualizando DB');

  var sheets = google.sheets('v4');
  sheets.spreadsheets.values.get({
    auth: jwtClient,
    spreadsheetId: '1q0g9NJerJObnAuFr6dceK-9ztjOofEMH-_oLGonfKN8',
    range: 'LEADS',
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var rows = response.values; 
    if (rows.length == 0) {
      console.log('No data found.');
    } else {
      for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
       
      }

      var leadsCounter = rows.length;


      leadsNumber.set({
				leadsCounter
			  })


      console.log(rows.length);
    }
  });


  
});


});
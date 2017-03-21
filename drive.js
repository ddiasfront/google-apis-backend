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
  ['https://www.googleapis.com/auth/activity', 'https://www.googleapis.com/auth/spreadsheets.readonly'],
  null
);


jwtClient.authorize(function (err, tokens) {
  if (err) {
    console.log(err);
    return;
  }



 var service = google.appsactivity('v1');
  service.activities.list({
    auth: jwtClient,
    source: 'drive.google.com',
    'drive.fileId': '1eiBAPoyCB1VnrNqM4LzdPeQ6XH09N70-ZboAKOFpGak',
    pageSize: 10
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var activities = response.activities;
    if (activities.length == 0) {
      console.log('No activity.');
    } else {
      console.log('Recent activity:');
      for (var i = 0; i < activities.length; i++) {
        var activity = activities[i];
        var event = activity.combinedEvent;
        var user = event.user;
        var target = event.target;
        if (user == null || target == null) {
          continue;
        } else {
          var time = new Date(Number(event.eventTimeMillis));
          console.log('%s: %s, %s, %s (%s)', time, user.name,
                event.primaryEventType, target.name, target.mimeType);
        }
      }
    }
  });

  
});



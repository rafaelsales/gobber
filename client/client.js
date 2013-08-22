chatStream = new Meteor.Stream('chat');
var myName = '';

var user = function() {
  return Users.findOne(Session.get('userId'));
};

Template.join.show = function() {
  return !user();
};

Template.join.users = function() {
	return Users.find();
};

Template.join.events({
	'click button#join': function() {
		myName = $('#lobby input#name').val().trim();

		GoofedTTS.speak('Welcome ' + myName);

		chatStream.emit('message', myName + ' has entered the room.');
		Meteor.call('joinRoom', myName, function(error, userId) {
			Session.set('userId', userId);
		});
	}
});

Template.dashboard.show = function() {
	return user();
};

Template.dashboard.users = function() {
	return Users.find();
};

Template.dashboard.events({
	'click button#send': function() {
		var message = $('#dashboard input#message').val().trim();
		console.log('Sending message: ' + message);
		if (message.length)
			chatStream.emit('message', myName + ' says: ' + message);
	}
});

chatStream.on('message', function(message) {
	console.log('Message received: ' + message);
	GoofedTTS.speak(message);
});

Meteor.startup(function () {
  // send keep alives so the server knows when I leave the room
  Meteor.setInterval(function() {
    if (Meteor.status().connected) {
      Meteor.call('keepalive', Session.get('userId'));
    }
  }, 20 * 1000);
});
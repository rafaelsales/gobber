const SEND_TO_ALL_ID = '_all_';

chatStream = new Meteor.Stream('chat');

var me = function() {
	return Session.get('me');
};

var user = function() {
  return me() ? Users.findOne(me().id) : null;
};

Template.join.show = function() {
  return !user();
};

Template.join.users = function() {
	return Users.find();
};

Template.join.events({
	'click button#join': function() {
		var name = $('#lobby input#name').val().trim();

		Meteor.call('joinRoom', name, function(error, userId) {
			console.log('My id is: ' + userId);
			Session.set('me', { id: userId, name: name });
			chatStream.emit('join', name);

			GoofedTTS.speak('Welcome ' + name);
		});
	}
});

Template.dashboard.show = function() {
	return user();
};

Template.dashboard.users = function() {
	return Users.find({_id: { $ne: me().id }});
};

Template.dashboard.me = function() {
	return me();
}

Template.dashboard.events({
	'click button#send': function() {
		var message = $('#dashboard input#message').val().trim();
		var sendToAll = $('#dashboard #sendToAll').is(':checked');

		if (sendToAll) {
			var receivers = SEND_TO_ALL_ID;
		} else {
			var receivers = $('#dashboard :checkbox[name=target]:checked')
											  .map(function() { return $(this).val(); }).toArray();
		}

		console.log('[Sending message] to: [' + receivers + ']; message: ' + message);

		if (message.length) {
			chatStream.emit('message', { from: me().name, to: receivers, message: message });
		}
	}
});

Template.dashboard.rendered = function() {
	UI.synchonizeAllSelected(false);
};

chatStream.on('message', function(msgObj) {
	if (msgObj.to == SEND_TO_ALL_ID || $.inArray(me().id, msgObj.to) != -1) {
		var message = msgObj.from + ' says: ' + msgObj.message;
		console.log('[Message received] ' + message);
		GoofedTTS.speak(message);
	}
});

chatStream.on('join', function(name) {
	console.log('[Person joined] ' + name);
	GoofedTTS.speak(name + ' has entered the room');
});

Meteor.startup(function () {
  // send keep alives so the server knows when I leave the room
  Meteor.setInterval(function() {
    if (Meteor.status().connected) {
      Meteor.call('keepalive', me().id);
    }
  }, 20 * 1000);
});
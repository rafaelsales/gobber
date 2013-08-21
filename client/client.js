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
		var name = $('#lobby input#name').val().trim();
		Meteor.call('joinRoom', name, function(error, userId) {
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

Meteor.startup(function () {
  // send keep alives so the server knows when I leave the room
  Meteor.setInterval(function() {
    if (Meteor.status().connected) {
      Meteor.call('keepalive', Session.get('userId'));
    }
  }, 20 * 1000);
});
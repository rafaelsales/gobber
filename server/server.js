chatStream = new Meteor.Stream('chat');

chatStream.permissions.write(function() {
  return true;
});

chatStream.permissions.read(function() {
  return true;
});

Meteor.methods({
  joinRoom: function(name) {
		var userId = Users.insert({ name: name,
																last_keepalive: new Date().getTime() });

		return userId;
  },
  keepalive: function(user_id) {
    check(user_id, String);

    Users.update({ _id: user_id },
                 { $set: { last_keepalive: new Date().getTime() }});
  }
});

Meteor.setInterval(function () {
  var now = new Date().getTime();
  var idle_threshold = now - 60 * 1000; // 1 minute

  Users.remove({last_keepalive: { $lt: idle_threshold }});
}, 30 * 1000);
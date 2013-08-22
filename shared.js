Users = new Meteor.Collection('users');

if (Meteor.isServer) {
  Meteor.publish('Users', function() {
    return Users.find();
  });
}
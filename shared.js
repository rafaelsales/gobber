Offices = new Meteor.Collection('offices');

if (Meteor.isServer) {
  // publish all offices
  Meteor.publish('offices', function () {
  return Offices.find();
});

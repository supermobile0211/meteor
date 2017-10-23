
Meteor.publish('notifications', () => {
    return Orders.find({});
});

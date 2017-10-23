Meteor.publish('userData', function() {
    if (!this.userId) return null;
    //if (Roles.userIsInRole(this.userId, 'admin')) {
        return Meteor.users.find();
    //} else {
    //    return Meteor.users.find(this.userId);
    //}
});

Meteor.users.allow({
    insert: function (userId, doc) {
        return true;
    },
    remove: function (userId, doc) {
        return true;
    },
    update: function (userId, doc) {
        return true;
    }
});

Notification = new Meteor.Collection('notifications');

NotificationsSchema = new SimpleSchema({
    createdAt: {
        type: Date,
        label: "Notification creation Date",
        autoValue: function() {
            return new Date()
        }
    },
    type: {
        type: String,
        label: 'Notification type vendor or affiliate'

    },
    sender: {
        type: String,
        label: 'Notification sender Id'
    },
    receiver: {
        type: String,
        label: 'Notification receiver Id'
    },
    unread: {
        type: Boolean,
        label: "Notification unread?",
        autoValue: function() {
            return true
        }
    }
});

Notification.attachSchema( NotificationsSchema );

Notification.allow({
    insert: function (userId) {
        return userId;
    },
    remove: function (userId) {
        return userId;
    },
    update: function (userId) {
        return userId;
    }
});
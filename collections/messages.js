Messages = new Meteor.Collection('messages');

MessagesSchema = new SimpleSchema({
    content: {
        type: String,
        optional: true,
        label: "Message Content"
    },
    sender: {
        type: String,
        label: "sender Id"
    },
    receiver: {
        type: String,
        label: "receiver Id"
    },
    ticket: {
        type: String,
        label: "receiver Id"
    },
    TimeStamp:{
        type: Date,
        label: "message creation Date",
        autoValue: function() {
            return new Date()
        }
    }
});

Messages.attachSchema( MessagesSchema );


Messages.allow({
    remove: function (userId) {
        return userId;
    }
});
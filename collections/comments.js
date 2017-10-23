Comments = new Meteor.Collection('comments');

CommentsSchema = new SimpleSchema({
    content: {
        type: String,
        optional: true,
        label: "Comment Content"
    },
    sender: {
        type: String,
        label: "sender Id"
    },
    refId: {
        type: String,
        label: 'Comment is related to'
    },
    createdAt:{
        type: Date,
        label: "comment creation Date",
        autoValue: function() {
            return new Date()
        }
    }
});

Comments.attachSchema( CommentsSchema );


Comments.allow({
    remove: function (userId) {
        return userId;
    }
});
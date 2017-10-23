Logs = new Meteor.Collection('logs');

LogsSchema = new SimpleSchema({
    logDetails: {
        type: [Object],
        optional: true,
        blackbox: true,
        label: 'logs Translations',
        defaultValue: []
    },
    transactionId: {
        type: String,
        label: 'transaction Id',
        optional: true
    },
    orderId: {
        type: String,
        label: 'related Order ID',
        optional: true
    }
});

Logs.attachSchema( LogsSchema );

Logs.allow({
    remove: function (userId) {
        return userId;
    }
});
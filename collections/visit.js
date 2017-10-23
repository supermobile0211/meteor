Visit = new Meteor.Collection('visit');

VisitSchema = new SimpleSchema({
    createdAt: {
        type: Date,
        label: "Visit Time",
        defaultValue: new Date()
    },
    origin: {
        type: String,
        label: "Visitor Origin"
    },
    landing: {
        type: String,
        label: "Visit Landing Page"
    },
    country: {
        type: String,
        label: "Visitor Country Time"
    },
    user: {
        type: String,
        label: "Visitor"
    },
    vendor: {
        type: String,
        label: "Visit Vendor"
    }
});

Visit.attachSchema( VisitSchema );


Visit.allow({
    remove: function (userId) {
        return userId;
    },
    insert: function (userId) {
        return userId;
    }
});
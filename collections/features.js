Features = new Meteor.Collection('features');

FeaturesSchema = new SimpleSchema({
    translation: {
        type: Object,
        optional: true,
        blackbox: true,
        label: 'Features Translations'
    }
});

Features.attachSchema( FeaturesSchema );

Features.allow({
    update: function (userId) {
        return userId;
    },
    insert: function (userId) {
        return userId;
    }
});
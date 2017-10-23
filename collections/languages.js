Languages = new Meteor.Collection('languages');
LangugesSchema = new SimpleSchema({
    name: {
        type: String,
        label: 'Language Name',
        optional: true
    },
    flag: {
        type: String,
        label: 'Flag of Language Country',
        optional: true
    },
    country: {
        type: String,
        label: 'Country of Language',
        optional: true
    },
    isoCode: {
        type: String,
        label: 'Language ISO Code',
        optional: true
    },
    languageCode: {
        type: String,
        label: 'Language Code',
        optional: true
    },
    dateFormat: {
        type: String,
        label: 'Language Date Format',
        optional: true
    },
    timeFormat: {
        type: String,
        label: 'Language Time Format',
        optional: true
    },
    status: {
        type: Boolean,
        label: 'Language Status',
        optional: true
    },
    direction: {
        type: Boolean,
        label: 'Language Writing Direction',
        optional: true
    },
    action: {
        type: String,
        optional: true
    }
});
Languages.attachSchema(LangugesSchema);

Languages.allow({
    insert: function (userId) {
        return userId;
    },
    update: function (userId) {
        return userId;
    },
    remove: function (userId) {
        return userId;
    }
});
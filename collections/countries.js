Countries = new Meteor.Collection('countries');

CountriesSchema = new SimpleSchema({
    name: {
        type: String,
        label: 'Country Name',
        optional: true
    },
    isoCode: {
        type: String,
        label: 'Country ISO Code',
        optional: true
    },
    digitalIso: {
        type: String,
        label: 'Country digital ISO',
        optional: true
    },
    prefix: {
        type: String,
        label: 'Country Phone prefix',
        optional: true
    },
    area: {
        type: String,
        label: 'area of Country',
        optional: true
    },
    status: {
        type: Boolean,
        label: 'Country Status',
        optional: true
    },
    risk: {
        type: Boolean,
        label: 'Risk factor',
        optional: true,
        defaultValue: false
    },
    flag: {
        type: String,
        label: 'Country Name',
        optional: true
    }

});

Countries.attachSchema( CountriesSchema );

Countries.allow({
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

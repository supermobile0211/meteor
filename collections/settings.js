Settings = new Meteor.Collection('settings');

SettingsSchema = new SimpleSchema({
    miscellaneous: {
        type: Object,
        optional: true,
        label: 'Miscellaneous settings',
        blackbox: true
    },

    riskFactors: {
        type: Object,
        optional: true,
        label: 'Risk Factors scores settings',
        blackbox: true
    },

    reviews: {
        type: Object,
        optional: true,
        label: 'Reviews setting',
        blackbox: true
    },

    paymentStatus: {
        type: [Object],
        optional: true,
        label: 'vendor payment setting',
        blackbox: true
    },

    criteria: {
        type: [Object],
        label: 'Criteria setting',
        optional: true,
        blackbox: true
    },

    pictures: {
        type: [Object],
        label: 'Pictures setting',
        optional: true,
        blackbox: true
    },

    pic: {
        type: Object,
        label: 'Logo setting',
        optional: true,
        blackbox: true
    },
    orders: {
        type: [Object],
        label: 'Orders setting',
        optional: true,
        blackbox: true
    },
    ordersSettings: {
        type: Object,
        optional: true,
        blackbox: true
    },
    categories: {
        label: 'Categories setting',
        type: [Object],
        optional: true,
        blackbox: true
    },
    searchEngine: {
        label: 'Search Engine setting',
        type: Object,
        optional: true,
        blackbox: true
    }
});

Settings.attachSchema( SettingsSchema );

Settings.allow({
    insert: function (userId) {
        return userId;
    },
    update: function (userId) {
        return userId;
    }
});
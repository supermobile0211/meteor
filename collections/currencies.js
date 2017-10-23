Currencies = new Meteor.Collection('currencies');

CurrenciesSchema = new SimpleSchema({
    name: {
        type: String,
        label: 'Currency Name',
        optional: true
    },
    isoCode: {
        type: String,
        label: 'Currency ISO Code',
        optional: true
    },
    digitalIso: {
        type: String,
        label: 'Currency Digital ISO',
        optional: true
    },
    symbol: {
        type: String,
        label: 'Currency Symbol',
        optional: true
    },
    changeRate: {
        type: String,
        label: 'Currency Exchange rate',
        optional: true
    },
    status: {
        type: Boolean,
        label: 'Currency Status',
        optional: true
    },
    action: {
        type: String,
        optional: true
    }
});

Currencies.attachSchema( CurrenciesSchema );

Currencies.allow({
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

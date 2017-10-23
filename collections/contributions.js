Contributions = new Meteor.Collection('contributions');

ContributionsSchema = new SimpleSchema({
    translation: {
        type: [Object],
        optional: true,
        blackbox: true,
        label: 'Contribution Translations'
    },
    type: {
        type: String,
        label: 'Contribution Type',
        optional: true
    },
    category: {
        type: [String],
        label: 'Contribution Associate with Category'
    },
    attributes:{
        type: Object,
        optional: true,
        blackbox: true,
        label: 'Contribution attributes'
    },
    values:{
        type: Array,
        optional: true
    },
    'values.$':{
        type: String,
        optional: true
    },
    skills: {
        type: [Object],
        label: 'Contribution Skills',
        optional: true,
        blackbox: true
    },
    features: {
        type: [Object],
        label: 'Contribution Features',
        optional: true,
        blackbox: true
    },
    "images": {
        type: [String],
        label: 'Contribution Images',
        optional: true
    },
    product: {
        type: String,
        label: "product Id related to Contribution"
    },
    user: {
        label: 'Contributor',
        type: String
    },
    status: {
        type: String,
        //allowedValues: ['pending', 'validated', 'declined'],
        label: 'Contribution status',
        optional: true
    },
    language: {
        type: String,
        label: 'Contribution language'
    },
    createdAt: {
        type: Date,
        label: 'Contribution Creation Time',
        defaultValue: new Date()
    }
});

Contributions.attachSchema( ContributionsSchema );

Contributions.allow({
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
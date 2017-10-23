Rules = new Meteor.Collection('rules');

RulesSchema = new SimpleSchema({
    name: {
        type: [String]
    },
    status: {
        type: Boolean
    }
});

Rules.attachSchema( RulesSchema );
Test = new Meteor.Collection('test');

TestSchema = new SimpleSchema({
    keys: {
        type: Object,
        blackbox: true
    }
});

Test.attachSchema( TestSchema );
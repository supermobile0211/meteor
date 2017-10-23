Attributes = new Meteor.Collection('attributes');

AttributesSchema = new SimpleSchema({
    attributes: {
        type: Object,
        blackbox: true
    }
});

Attributes.attachSchema( AttributesSchema );
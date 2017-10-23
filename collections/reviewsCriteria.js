ReviewsCriteria = new Meteor.Collection('reviewsCriteria');

ReviewsCriteriaSchema = new SimpleSchema({
    criteria: {
        type: Array
    },
    'criteria.$': {
        type: String
    }
});

ReviewsCriteria.attachSchema( ReviewsCriteriaSchema );
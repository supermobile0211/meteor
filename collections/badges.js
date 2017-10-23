Badges = new Meteor.Collection('badges');

BadgesSchema = new SimpleSchema({
    status: {
        type: Boolean,
        label: 'Status',
        optional: true
    },

    translation: {
        type: [Object],
        optional: true,
        blackbox: true,
        label: 'Badges Translations'
    },
     levels: {
        type: [Object],
        label: 'levels',
         optional : true,
         blackbox: true
    },
    showONFO: {
        type: Boolean,
        label: 'Show on FO'
    },
    rulesUsed : {
        type : [String],
        label : "Rules Used"
    }
});

Badges.attachSchema(BadgesSchema);


Skills = new Meteor.Collection('skills');

SkillsSchema = new SimpleSchema({
    translation: {
        type: Object,
        optional: true,
        label: 'Skills Translations',
        blackbox: true
    }
});

Skills.attachSchema( SkillsSchema );
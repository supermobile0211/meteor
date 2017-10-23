Pages = new Meteor.Collection('pages');

PagesSchema = new SimpleSchema({
    translation: {
        type: [Object],
        optional: true,
        blackbox: true,
        label: 'CMS Categories Translations'
    },
    pages: {
        type: [Object],
        label: 'CMS Pages',
        optional: true,
        blackbox: true,
        defaultValue: []
    },

    tags: {
        type: Object,
        optional: true,
        label: 'CMS Tags',
        blackbox: true
    },
    parent: {
        type: String,
        label: 'CMS Category Parent',
        optional: true
    },
    Url: {
        type: String,
        label: 'CMS Category Url',
        optional: true
    },
    status: {
        type: Boolean,
        label: 'CMS Category Status',
        optional: true
    }
});

Pages.attachSchema( PagesSchema );

Pages.allow({
    insert: function (userId) {
        return userId;
    },
    update: function (userId) {
        return userId;
    }
});
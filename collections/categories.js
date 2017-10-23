Categories = new Meteor.Collection('categories');

CategoriesSchema = new SimpleSchema({
    translation: {
        type: [Object],
        optional: true,
        blackbox: true,
        label: 'Category Translations'
    },
    source: {
        type: String,
        label: 'Category Source Language',
        optional: true
    },
    parent: {
        type: String,
        label: 'Category Parent',
        optional: true
    },
    commission: {
        type: String,
        label: 'Category Commission',
        optional: true
    },
    inheritedCommission: {
        type: String,
        label: 'Inherited Commission',
        optional: true
    },
    published: {
        type: Boolean,
        label: 'Category Published or Not',
        optional: true
    },
    autoPublish: {
        type: Boolean,
        label: 'Category AutoPublish?'
    },
    mayContainProduct: {
        type: Boolean,
        label: 'Category may Contain Products'
    },
    status: {
        type: Boolean,
        label: 'Category Status',
        optional:true
    }
});

Categories.attachSchema( CategoriesSchema );

Categories.allow({
    insert: function (userId) {
        return userId;
    },
    update: function (userId) {
        return userId;
    }
});
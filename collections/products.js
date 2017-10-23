Products = new Meteor.Collection('products');

ProductsSchema = new SimpleSchema({
    translation: {
        type: [Object],
        optional: true,
        blackbox: true,
        label: 'Product Translations'
    },
    offersCount: {
        type: Number,
        label: 'Product Offer\'s Count',
        optional: true
    },
    source: {
        type: String,
        label: 'Product Source Language',
        optional: true
    },
    status: {
        type: Boolean,
        label: 'Product status',
        optional: true
    },
    user: {
        type: String,
        label: 'Product Owner',
        optional: true
    },
    type: {
        type: String,
        label: 'Product Type',
        optional: true
    },
    avgOffer: {
        type: Number,
        label: 'Average Offer',
        optional: true
    },
    bestOffer: {
        type: Number,
        label: 'Best Offer',
        optional: true
    },
    commission: {
        type: String,
        label: 'Commission',
        optional: true
    },
    inheritedCommission: {
        type: String,
        optional: true
    },
    published: {
        type: Boolean,
        label: 'Product Published or Not',
        optional: true
    },
    category: {
        type: [String],
        label: 'Product Associate with Category'
    },
    combinations: {
        type: [Object],
        label: 'Product Combinations',
        optional: true,
        blackbox: true
    },
    attributes:{
        type: Object,
        label: 'Product attributes',
        optional: true,
        blackbox: true
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
        label: 'Product Skills',
        optional: true,
        blackbox: true
    },
    features: {
        type: [Object],
        label: 'Product Features',
        optional: true,
        blackbox: true
    },
    uin: {
        type: String,
        label: 'Product UIN',
        optional: true
    },
    gtin: {
        type: [String],
        label: 'Product GTIN',
        optional:true
    },
    images: {
        type: [String],
        label: 'Product Images',
        optional: true
    },
    mapProducts: {
        type: [String],
        label: 'Products map with that Product',
        optional: true,
        defaultValue: []
    },
    contributions: {
        type: [String],
        label: 'Product Contributions',
        optional: true,
        defaultValue: []
    },
    views: {
        type: Number,
        label: 'Product views',
        defaultValue: 0
    },
    isMapped: {
        type: Boolean,
        label: 'Product is Mapped?',
        optional: true,
        defaultValue: false
    },
    createdAt: {
        type: Date,
        label: 'Product creation Time',
        defaultValue: new Date()
    },
    defaultCategory : {
        type : String,
        optional : true
    },
    subscribers: {
        type: [String],
        label: 'Products subscribers',
        optional: true,
        defaultValue: []
    },

    weight: {
        type: Number,
        label: 'Weight of Product',
        optional: true
    }
});

Products.attachSchema( ProductsSchema );

Products.attachSchema( ProductsSchema );

Products.allow({
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

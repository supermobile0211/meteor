Offers = new Meteor.Collection('offers');

OffersSchema = new SimpleSchema({
    translation: {
        type: Object,
        optional: true,
        blackbox: true,
        label: "Offer Translation"
    },
    product: {
        type: String,
        label: "product Id"
    },

    location:{
        type: Object,
        label: 'User verified Location',
        optional: true
    },
    //location with 2d index
    'location.lat':{
        type: Number,
        decimal: true,
        label: 'User verified Location latitude',
        optional: true
    },

    'location.lon':{
        type: Number,
        decimal: true,
        label: 'User verified Location longitude',
        optional: true
    },

    combId:{
        type: Number,
        label: 'combination Id',
        optional: true
    },

    vendor: {
        type: String,
        label: "vendor Id"
    },
    vendorName: {
        type: String,
        label: "vendor Name",
        optional: true
    },

    price: {
        type: Number,
        decimal: true,
        label: 'Offer Price'
    },
    quantity: {
        type: Number,
        label: 'Offer Quantity',
        optional: true
    },
    stock: {
        type: Number,
        label: 'Offer items Stock',
        optional: true
    },
    inStock: {
        type: Boolean,
        label: 'Offer item in Stock?',
        optional: true
    },
    main: {
        type: Boolean,
        label: 'main offer for vendor',
        optional: true
    },
    status: {
        type: Boolean,
        label: 'Offer Status',
        optional: true
    },
    alignToOffer: {
        type: Boolean,
        label: 'Automate Offer Average',
        optional: true
    },
    avgOffer: {
        type: Number,
        decimal: true,
        label: 'Average Offer',
        optional: true
    },
    bestOffer: {
        type: Number,
        label: 'Best Offer',
        decimal: true,
        optional: true
    },
    allowOrder: {
        type: Boolean,
        defaultValue: false,
        label: 'allow order when out of Stock',
        optional: true
    },
    shipping: {
        type: Array,
        optional: true,
        label: "Offer shipping Methods"
    },
    'shipping.$': {
        type: String
    },
    delayDays: {
        type: Number,
        label: "delivery deadline",
        optional: true
    },

    validation: {
        type: Date,
        label: "days till offer's Valid",
        optional: true
    },

    packageWidth: {
        type: Number,
        label: 'Carrier Package Width',
        optional: true
    },
    packageHeight: {
        type: Number,
        label: 'Carrier Package Height',
        optional: true
    },
    packageDepth: {
        type: Number,
        label: 'Carrier Package Depth',
        optional: true
    },
    packageWeight: {
        type: Number,
        label: 'Carrier Package Weight',
        optional: true
    }
});

Offers.attachSchema( OffersSchema );


Offers.allow({
    remove: function (userId) {
        return userId;
    }
});
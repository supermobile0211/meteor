Carrier = new Meteor.Collection('carrier');

CarrierSchema = new SimpleSchema({
    name: {
        type: String,
        label: "Carrier name"
    },
    time: {
        type: String,
        label: "transit time"
    },
    images: {
        type: [String],
        label: "Carrier Logos"
    },
    trackingUrl: {
        type: String,
        label: 'Carrier tracking Url',
        optional: true
    },
    ranges : {
        type: [Object],
        blackbox : true,
        label: 'Carrier available ranges'
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
    },
    position: {
        type: Number,
        label: 'Carrier Package Weight',
        optional: true
    },
    status: {
        type: Boolean,
        label: 'Carrier Status',
        optional: true
    },
    freeShipping: {
        type: Boolean,
        label: 'Carrier Shipping is Free?',
        optional: true
    },
    isAllMarked : {
        type : Boolean,
        label : 'Countries all marked',
        optional : true
    },

    vendorId: {
        type: String,
        label: "Vendor Id"
    }
});

Carrier.attachSchema( CarrierSchema );

Carrier.allow({
    remove: function (userId) {
        return userId;
    }
});
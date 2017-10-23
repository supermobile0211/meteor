Shipping = new Meteor.Collection('shipping');

ShippingSchema = new SimpleSchema({
    handLinkCharges: {
        type: Number,
        label: "name"
    },
    shipping$: {
        type: Number,
        label: "transit time",
        optional: true
    },
    shippingKg: {
        type: Number,
        label: "transit time",
        decimal: true,
        optional: true
    }
});

Shipping.attachSchema( ShippingSchema );
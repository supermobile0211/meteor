
Payments = new Meteor.Collection('payments');

PaymentSchema = new SimpleSchema({
    createdAt: {
        type: Date,
        label: "Payment creation Date",
        autoValue: function() {
            return new Date()
        }
    },
    receiverId: {
        type: String,
        label: 'Vendor or affiliate Id'
    },

    displayed: {
        type: Boolean,
        optional: true,
        defaultValue: false
    },

    type: {
        type: String,
        label: 'Vendor or affiliate type',
        optional: true,
        defaultValue: 'vendor'
    },
    details: {
        type: String,
        label: 'transaction Details',
        optional: true,
        defaultValue: 'Commission'
    },
    invoices: {
        type: [String],
        label: 'payment Invoices',
        optional: true,
        defaultValue: []
    },
    company: {
        type: String,
        optional: true
    },
    title: {
        type: String,
        label: 'title',
        optional: true,
        defaultValue: 'Mr.'
    },
    firstName: {
        type: String,
        label: 'vendor/affiliate first name',
        optional: true
    },
    name: {
        type: String,
        optional: true
    },
    sales: {
        type: Number,
        optional: true
    },
    deliveryCountry: {
        type: String,
        label: 'Country where order will be delivered'
    },
    orderId: {
        type: String,
        label: 'order ID in payments'
    },
    status: {
        type: String,
        label: 'Status of Payment'
    },
    amount: {
        type: Number,
        decimal: true,
        label: 'order commission',
        optional: true
    },
    shipping: {
        type: Number,
        decimal: true,
        label: 'shipping commission',
        optional: true
    },
    total: {
        type: Number,
        decimal: true,
        label: 'total commission',
        optional: true
    },
    history: {
        type: [Object],
        defaultValue: [],
        blackbox: true,
        label: 'Payment history'
    }

});

Payments.attachSchema( PaymentSchema );

Payments.allow({
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
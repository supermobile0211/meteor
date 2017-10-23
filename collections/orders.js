Orders = new Meteor.Collection('orders');

OrdersSchema = new SimpleSchema({
    createdAt: {
        type: Date,
        label: "Order creation Date",
        autoValue: function() {
            return new Date()
        }
    },
    invoiceClaimed: {
        type: Boolean,
        label: "Order invoiced claimed",
        defaultValue: false,
        optional: true
    },
    claimedAt: {
        type: Date,
        optional: true,
        label: "invoice claim Date"
    },
    riskScore: {
        type: Number,
        label: 'Order calculated risk score'
    },
    riskFactors: {
        type: Object,
        blackbox: true,
        optional: true,
        label: 'Order risk Factors Details'
    },
    title: {
        type: String,
        label: 'Order title',
        optional: true
    },
    vendorId: {
        type: String,
        label: 'Vendor Id',
        optional: true
    },
    affiliateId: {
        type: String,
        label: 'affiliate Id',
        optional: true
    },
    user: {
        type: String,
        label: 'User which orders',
        optional: true
    },
    nameTitle:{
        type: String,
        optional: true
    },
    details:{
        type: [Object],
        blackbox: true,
        label: 'Order details',
        optional: true
    },
    name: {
        type: String,
        optional: true
    },
    invoices: {
        type: [Object],
        label: 'order Invoices',
        blackbox: true,
        optional: true,
        defaultValue: []
    },
    isPaid: {
        type: Boolean,
        label: 'order isPaid',
        defaultValue: false
    },
    shippingAddress: {
        type: Number,
        optional: true
    },
    billingAddress: {
        type: Number,
        optional: true
    },
    firstName: {
        type: String,
        label: 'customer first name who created the order',
        optional: true
    },
    ip: {
        type: String,
        label: 'IP address from where order created',
        optional: true
    },
    deliveryCountry: {
        type: String,
        label: 'Country where order will be delivered'
    },
    vendor: {
        type: String,
        label: "vendor's reference"
    },
    totalPrice: {
        type: Number,
        label: 'final price'
    },
    grossPrice: {
        type: Number,
        decimal: true,
        label: 'calculated price',
        optional: true
    },
    commission: {
        type: Number,
        decimal: true,
        label: 'order commission'
    },
    affiliateCommission: {
        type: Number,
        decimal: true,
        label: 'affiliate commission',
        optional: true
    },
    paidToVendor: {
        type: Number,
        label: 'Amount Paid To Vendor',
        optional: true
    },
    checkPaidToVendor: {
        type: Boolean,
        label: 'check Paid to Vendor',
        autoValue: function() {
            return true;
        }
    },
    status: {
        type: String,
        label: 'order Status',
        optional: true
    },
    itemRelated: {
        type: Number,
        label: 'Item related',
        optional: true
    },
    action: {
        type: String,
        label: 'Order action'
    },
    orderRef: {
        type: String,
        label: 'Order Reference',
        optional: true
    },
    review:{
        type: String,
        label: 'Order review',
        optional: true
    },
    deliveryDay: {
        type: Number,
        label: 'order delivery Day',
        optional: true
    },
    payType: {
        label: 'Order payType',
        type: String,
        optional: true
    },
    transactionalDetails:{
        type: String,
        optional: true
    },
    company: {
        type: String,
        optional: true
    },
    cancelMessage: {
        type: String,
        optional: true
    },
    cancelDate: {
        type: Date,
        optional: true
    },
    sentByMail: {
        type: Boolean,
        optional: true
    },
    displayed: {
        type: Boolean,
        optional: true,
        defaultValue: false
    },
    responded: {
        type: Boolean,
        defaultValue: false
    },
    '3dSecure': {
        type: Boolean,
        label: 'payment 3D secure?',
        optional: true
    },
    carriers: {
        type: [Object],
        defaultValue: [],
        blackbox: true,
        optional: true
    },
    history: {
        type: [Object],
        blackbox: true
    },
    settings: {
        type: Object,
        blackbox: true,
        optional: true,
        label: 'Order calculation Details'
    }

});

Orders.attachSchema( OrdersSchema );

Orders.allow({
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
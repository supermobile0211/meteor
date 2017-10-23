Earnings = new Meteor.Collection('earnings');

EarningsSchema = new SimpleSchema({
    amount: {
        type: Number,
        label: "earning total",
        decimal: true,
        defaultValue: 0
    },
    orders: {
        type: [String],
        label: "related Orders",
        defaultValue: []
    },
    status: {
        type: String,
        label: 'Earning Status',
        optional: true,
        defaultValue: 'Pending'
    },

    receiverId: {
        type: String,
        label: "receiver Id"
    },
    type: {
        type: String,
        label: "receiver role",
        optional: true
    },
    sales: {
        type: Number,
        label: "Number of sales",
        optional: true,
        defaultValue: 0
    },
    company: {
        type: String,
        label: "Company Name",
        optional: true
    },
    title: {
        type: String,
        label: "owner title",
        optional: true
    },
    name: {
        type: String,
        label: "owner name",
        optional: true
    },
    firstName: {
        type: String,
        label: "owner first name",
        optional: true
    },
    deliveryCountry: {
        type: String,
        label: "company's country",
        optional: true
    },
    createdAt: {
        type: Date,
        label: "Payment creation Date",
        autoValue: function() {
            return new Date()
        }
    },
    paid: {
        type: String,
        label: 'title',
        optional: true,
        defaultValue: 'Mr.'
    },
    details: {
        type: String,
        label: 'transaction Details',
        optional: true,
        defaultValue: 'Earning Added'
    },
    history: {
        type: [Object],
        defaultValue: [],
        blackbox: true,
        label: 'Earning history'
    }
});

Earnings.attachSchema( EarningsSchema );

Earnings.allow({
    remove: function (userId) {
        return userId;
    }
});
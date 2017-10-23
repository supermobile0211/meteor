Tickets = new Meteor.Collection('tickets');

TicketsSchema = new SimpleSchema({
    createdAt: {
        type: Date,
        label: "Ticket creation Date",
        autoValue: function() {
            return new Date()
        }
    },
    title: {
        type: String,
        label: 'Ticket title',
        optional: true
    },
    language: {
        type: String,
        label: 'Ticket language',
        optional: true
    },
    user: {
        type: String,
        label: 'User Created Ticket',
        optional: true
    },
    employee: {
        type: String,
        label: 'Employee Who Deal Ticket',
        optional: true
    },
    status: {
        type: String,
        label: 'Ticket Status',
        optional: true
    },
    messages: {
        type: [Object],
        label: 'Ticket Message',
        optional: true
    },
    sector: {
        type: String,
        label: 'Ticket Sector',
        optional: true
    },
    updatedAt: {
        type: Date,
        autoValue: function() {
            if (this.isInsert) {
                return new Date();
            }
            else if(this.isUpdate) {
                return new Date();
            }
        }
    }
});

Tickets.attachSchema( TicketsSchema );

Tickets.allow({
    insert: function (userId) {
        return userId;
    },
    update: function (userId) {
        return userId;
    }
});
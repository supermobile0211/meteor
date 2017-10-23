Meteor.methods({
    removeTicket: (ids) => {
        check(ids, Array);
        _.each(ids, function(id) {
            Tickets.remove(id);
        })
    },

    updateTicketStatus: function(id, status) {
        check(id, String);
        check(status, String);
        if (!this.userId) {
            throw Meteor.Error(403, 'Access denied');
        }
        var update = {
            $set: {
                status: status
            }
        };

        Tickets.update({_id: id}, update);
    },

    updateBulkTicketStatus: function(params) {
        if (!this.userId) {
            throw Meteor.Error(403, 'Access denied');
        }
        check(params, {
            id: [String],
            status: Boolean
        });

        var update = {$set: {status: params.status}};

        Tickets.update({_id: {$in: params.id}}, update, {multi:true})}
});
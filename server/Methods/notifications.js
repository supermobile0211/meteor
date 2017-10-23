Meteor.methods({
    createNotification: (params) => {
        check(params, {
            sender : String,
            orderId : String,
            receiver : String,
            type : String
        });
        Orders.update({
            _id: params.orderId
        }, {
            $set: {
                invoiceClaimed: true,
                claimedAt: new Date()
            }
        });
        Notification.insert(params);
    }
});
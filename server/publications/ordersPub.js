
Meteor.publish('orders', () => {
    //limiting publication to prevent all data goes to client
    return Orders.find({
        displayed: true
    },{
        limit:50
    });
});

Meteor.publish('myOrders', function(){
    return Orders.find({
        displayed: true
    },{vendorId: this.userId});
});

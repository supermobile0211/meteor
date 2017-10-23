Meteor.methods({
    removeCarrier : function(id){
        check(id, String);
        Carrier.remove(id);
    },

    updateTrackingNo: ( id, index, trackingNumber )=> {
        var update = {
            $set: {}
        };
        var position = "carriers." + index + ".trackingUrl";
        update.$set[position] = trackingNumber;
        Orders.update({_id: id}, update);
    }
});

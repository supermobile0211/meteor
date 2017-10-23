
Meteor.methods({
    vendorToolsUpdate: function(id, params){
        check(id, String);
        check(params, Object);
        let update = {
            $set: {}
        };
        //delete offer id
        delete params._id;
        for(let key in params){
            update.$set[key] = params[key];
        }

        Offers.update({_id: id}, update);
    }
});
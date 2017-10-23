/***** create new at first and or add new to attributes collections ******/
Meteor.methods({
    createAttribute: function(params, id) {
        check(params, Object);
        var update = {$set: {
            attributes: params.attributes
        }};
        //return params.id? Attributes.update({_id: params.id}, update) : (id = Attributes.insert({attributes: params.attributes}));
        return  Attributes.update({}, update, {upsert: true})
    }
});
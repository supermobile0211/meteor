Meteor.methods({
    justTest: function(keys){
        check(keys, Object);
        Test.insert(keys)

    },
    updateAddress: function(index, params){
        check(index, String);
        check(params, {
            name: Match.Optional(String),
            firstName: Match.Optional(String),
            country: Match.Optional(String),
            din:Match.Optional(String),
            company: Match.Optional(String),
            tva: Match.Optional(String),
            address: Match.Optional(String),
            additionalAddress: Match.Optional(String),
            zipCode: Match.Optional(String),
            city: Match.Optional(String),
            phoneNumber: Match.Optional(String),
            phoneCountry: Match.Optional(String)
        });
        var update = {
            $set: {}
        };
        update.$set['profile.address.'+ index] = params;
        Meteor.users.update({_id: Meteor.userId()}, update);
    },

    addProfileAddress: (params)=>{
        check(params, {
            name: Match.Optional(String),
            firstName: Match.Optional(String),
            country: Match.Optional(String),
            din: Match.Optional(String),
            company: Match.Optional(String),
            tva: Match.Optional(String),
            address: Match.Optional(String),
            additionalAddress: Match.Optional(String),
            zipCode: Match.Optional(String),
            city: Match.Optional(String),
            phoneNumber: Match.Optional(String),
            phoneCountry: Match.Optional(String)
        });

        var update = {
            $push: {}
        };

        update.$push['profile.address'] = params;

        Meteor.users.update({_id: Meteor.userId()}, update);
    }
});
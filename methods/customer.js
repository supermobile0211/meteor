Meteor.methods({
    updateCustomerInformation : (id, params)=>{
        check(id, String);
        check(params, {
            title: Match.Optional(String),
            firstName:  Match.Optional(String),
            lastName:  Match.Optional(String),
            dob: Match.Optional(String),
            newsLetter: Match.Optional(Boolean),
            partnersNews: Match.Optional(Boolean)
        });

        var update = {
            $set: {}
        };

        for( var key in params ){
            update.$set['profile.' + key] = params[key];
        }

        Meteor.users.update(
            { _id: id },  update
        )
    }
});



Meteor.methods({
    updateEmail: function( digest, email ){
        check(digest, String);
        check(email, String);
        if( Meteor.isServer ){
            if ( Meteor.userId() ) {
                var user = Meteor.user();
                var password = {digest: digest, algorithm: 'sha-256'};
                var result = Accounts._checkPassword(user, password);
                if(result.error != null){
                    throw new Meteor.Error( 500, 'current Password is wrong' );
                }
                else{
                    Meteor.users.update({
                        _id: Meteor.userId()
                    },{
                        $set:{
                            'emails.0.address': email
                        }
                    })
                }
            }
        }
    },
    accountHandler: function( digest, accountType){
        check(digest, String);
        check(accountType, String);
        if( Meteor.isServer ){
            if ( Meteor.userId() ) {
                var user = Meteor.user();
                var password = {digest: digest, algorithm: 'sha-256'};
                var result = Accounts._checkPassword(user, password);
                if(result.error != null){
                    throw new Meteor.Error( 500, 'current Password is wrong' );
                }
                else{
                   var update = {
                        $set: {
                        }
                    };

                    update.$set["settings." + accountType] = true;
                    Meteor.users.update({
                        _id: Meteor.userId()
                    }, update)
                }
            }
        }
    },

    updateUser: function(params) {
        if (!Meteor.userId()) {
            throw Meteor.Error(403, 'Access denied');
        }

        var update = {
            $set: {}
        };

        for(var keys in params){
            update.$set['profile.' + keys] = params[keys];
        }
        if(typeof params.location == 'object'){
            update.$set['profile.address.0.location.lat'] = parseFloat(params.location.lat);
            update.$set['profile.address.0.location.lon'] = parseFloat(params.location.lon)
        }
        Meteor.users.update({_id: Meteor.userId()}, update);
    }
});
Meteor.methods({
   registerUser : (params)=>{
       if (Meteor.userId()) {
           throw new Meteor.Error(403);
       }
       check(params, {
           name: String,
           email: String,
           password: String
       });
       var args = {
           username: params.name,
           email: params.email,
           password: params.password,
           profile: {
               role: 'customer'
           }
       };
       Accounts.createUser(args);
   },

    getLocalUsers: (bound) => {
        //TODO extend query with role because we need only vendors.
        return Meteor.users.find({
            'profile.address.0.location': {
                '$geoWithin':  {
                    '$box': bound
                }
            }
        }).fetch();
    },

    updateIps: (ip) => {

        Meteor.users.update(
            {
                _id: Meteor.userId()
            },
            {
                $push:{
                    'profile.recentIps': {
                        $each: [ {
                            ip: ip.ip,
                            country: ip.country_name
                        }],
                        $position: 0
                    }
                }
            }
        );

        //Note: $pop with -1 didn't work as expected that's why we use $position above.
        return Meteor.users.update({
            _id: Meteor.userId(),
            "profile.recentIps.3": {
                $exists: 1
            }
        }, {
            $pop:{
                "profile.recentIps": 1
            }
        });
    }
});
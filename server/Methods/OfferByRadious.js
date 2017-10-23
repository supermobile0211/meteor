
Meteor.methods({
    offersByRadius: (coords, maxDistance) => {
        return Meteor.users.find({
            'profile.address.location': {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: coords
                    },
                    //for km distance
                    $maxDistance: maxDistance * 100
                }
            }}).fetch();
    }
});
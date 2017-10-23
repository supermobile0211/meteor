
Meteor.methods({
    removeOffer: function( id ){
        check(id, String);
        return Offers.remove(id);
    },
    avgOffer: function ( id ) {
        check( id, String );
        if(Meteor.isServer){
            return Offers.aggregate(
                [
                    {
                        $match:
                        {
                            status: true,
                            _id: {
                            $nin:[id]
                        }
                        }
                    },
                    {
                        $group:
                        {
                            _id: "$product",
                            priceAlign: { $avg: "$price" }
                        }
                    }
                ]
            )
        }
    },

    avgCombination: function ( productId, combId, id) {
        check(id, String);
        check(productId, String);
        check(combId, Match.Optional(Match.OneOf(String, Number)));
        return Offers.aggregate(
            [
                {
                    $match: {
                        product: productId,
                        status: true,
                        alignToOffer: false,
                        combId: Number(combId),
                        _id: {
                            $nin: [id]
                        }
                    }
                },
                {
                    $group: {
                        _id: "$product",
                        priceAlign: {
                            $avg: "$price"
                        },
                        minPrice: {
                            $min: "$price"
                        }
                    }
                }
            ]
        );
    },

    minOffer: function(productId){
        check(productId, String);
        return Offers.aggregate(
            [{
                $match:{
                    product: productId
                }
            },
                {
                    $group:
                    {
                        _id: {},
                        minPrice: {
                            $min: "$price"
                        }
                    }
                }
            ]
        );
    },

    minCombinationOffer: function(productId, combId){
        check(productId, String);
        check(combId, Match.OneOf(String, Number));
        return Offers.aggregate(
            [{
                $match:{
                    product: productId,
                    combId: combId
                }
            },
                {
                    $group:
                    {
                        _id: {},
                        minPrice: { $min: "$price" }
                    }
                }
            ]
        );
    }
});

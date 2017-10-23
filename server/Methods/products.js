
Meteor.methods({
    updateAttr: function(arrayParams, params){
        check(arrayParams, Match.Optional(Array));
        check(params, Object);

        let insertV = {
            $set: {
                ['attributes.'+ params.language +'.' + arrayParams[0].index]: {color: arrayParams[0].newValue}
            }
        };
        Contributions.insert(insertV);
    },
    getFeatureGroup: function( id ){
        return Products.aggregate([
            {$match:{category: id}},
            {
                $unwind: '$features'
            },
            {$match:{'features.language':'en'}},
            {
                $unwind: '$features.values'
            },
            {
                $unwind: '$features.values.values'
            },
            {
                $group: {
                    _id: "$features.values.name",
                    values: {$addToSet: '$features.values.values'}
                }
            }
        ])
    },

    ProductsCount: function (filter, search) {
        check(filter, Object);
        check(search, String);
        if( search ){
            let text = `(.*)${ search }`,
                queryText = new RegExp(search, 'i');
            var txtQuery =
                [ { 'translation.name': { $regex: queryText } },
                    { 'translation.description': { $regex: queryText } }
                ]
        }
        filter && txtQuery && (filter.$or = txtQuery);
        return Products.find(filter).count()
    }
});
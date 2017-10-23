Meteor.methods({
    searchProducts: ( word, lang ) =>{
        check(word, String);
        check(lang, String);
        return Products.find(
            {
                $text: {
                    $search: word,
                    $language: lang
                }
            },
            // `fields` is where we can add MongoDB projections. Here we're causing
            // each document published to include a property named `score`, which
            // contains the document's search rank, a numerical value, with more
            // relevant documents having a higher score.
            {
                score: {
                    $meta: "textScore"
                }
            },
            // This indicates that we wish the publication to be sorted by the
            // `score` property specified in the projection fields above.
            {
                sort: {
                    score: {
                        $meta: "textScore"
                    }
                }
            }).fetch();
    },

    searchProducts1: (word, lang) => {
        if(word){
            let text = `(.*)${word}`,
                queryText = new RegExp(text, 'i');
            return Products.find({ $or: [ { 'translation.name': { $regex: queryText } }, { 'translation.description': { $regex: queryText } } ] },  { limit: 10 }).fetch();
        }
    },

    updateIndexes: ( c, p ) =>{
        check(c, Match.OneOf([Object], Object));
        check(p, Match.OneOf([Object], Object));
        if( Meteor.isServer ){
            var productUpdate = {},
                productWeights = {},
                pFlag  = false,
                cFlag = false;
            Products._dropIndex('*');
            Categories._dropIndex('*');
            for ( var key in p ){
                pFlag = true;
                productUpdate[key] = 'text';
                productWeights[key] = p[key];
            }
            if( pFlag ){
                Products._ensureIndex(
                    productUpdate,
                    {
                        weights: productWeights,
                        name:"productsIndex"
                    }
                );
            }
            if( c.name > 0 ){
                Categories._ensureIndex(
                    {
                        'translation.name': 'text'
                    },
                    {
                        weights: {
                            'translation.name': c.name
                        },
                        name: 'CategoryIndex'
                    }
                );
            }
        }
    }
});

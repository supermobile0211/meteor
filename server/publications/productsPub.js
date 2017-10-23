
Meteor.publish('productsWithSkip', (skip, sort, catId, search)=>{
    var options;
    if (skip < 0) {
        skip = 0;
    }
    options = {};
    var query = {};
    if( search ){
        let text = `(.*)${ search }`,
            queryText = new RegExp(search, 'i');
        query = {
                $or: [ { 'translation.name': { $regex: queryText } },
                    { 'translation.description': { $regex: queryText } }
                ]
            };
    }
    options.skip = skip;
    sort && (options.sort = sort);
    catId && (query.category = catId);
    return Products.find(query, options);
});

Meteor.publish('productPubsSubscribe', function(skip, limit, sort){
    var options;
    if (skip < 0) {
        skip = 0;
    }
    options = {};
    options.skip = skip;
    options.limit = limit;
    if (options.limit > 100) {
        options.limit = 12;
    }
    sort && (options.sort = sort);
    return Products.find({subscribers: this.userId}, options);
});

//publish total products for root routes
Meteor.publish('products', ()=> {
    //limiting publication to prevent all data goes to client
    return Products.find({},{limit:50});
});

Meteor.publish('allProducts', ()=> {
    //sending all products for total count
    return Products.find({});
});

//publish single product.
Meteor.publish('activeProduct', (query)=> {
    //limiting publication to prevent all data goes to client
    return Products.find(query);
});


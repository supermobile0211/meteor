
Meteor.publish('suggestedProducts', ()=>{
    //limiting publication to prevent all data goes to client
    return SuggestedProducts.find({},{limit:50});
});
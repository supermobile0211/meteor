
Meteor.publish('currencies', ()=>{
    return Currencies.find({});
});
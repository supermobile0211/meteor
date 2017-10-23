
Meteor.publish('carrier', ()=> {
    return Carrier.find({});
});
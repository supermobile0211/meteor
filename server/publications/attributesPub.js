
Meteor.publish('attributes', ()=> {
    return Attributes.find({});
});
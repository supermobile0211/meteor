
Meteor.publish('countries', ()=>{
    return Countries.find({});
});

Meteor.publish('features', ()=>{
    return Features.find({});
});
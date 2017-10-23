
Meteor.publish('skills', ()=>{
    return Skills.find({});
});
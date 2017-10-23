
Meteor.publish('contributions', ()=>{
    return Contributions.find({});
});
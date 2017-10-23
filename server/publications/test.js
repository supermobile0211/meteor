
Meteor.publish('test', ()=> {
    return Test.find({});
});
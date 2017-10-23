
Meteor.publish('logs', ()=> {
    return Logs.find({});
});

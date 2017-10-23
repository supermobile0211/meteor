
Meteor.publish('comments', ()=> {
    return Comments.find();
});
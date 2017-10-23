
Meteor.methods({
    sendMessage: function(params){
    check(params, Object);
    Messages.insert(params);
}
});
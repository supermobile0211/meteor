
Meteor.publish('messages', ()=> {
    //limiting publication to prevent all data goes to client
    return Messages.find({},{limit:50});
});



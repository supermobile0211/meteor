
if(Meteor.isServer){
    Meteor.publish('tickets', ()=> {
        //limiting publication to prevent all data goes to client
        return Tickets.find({},{limit:50});
    });
}


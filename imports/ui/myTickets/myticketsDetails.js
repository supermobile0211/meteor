import { Meteor } from 'meteor/meteor';

Template.myTicketsDetails.onCreated(()=>{


});

Template.myTicketsDetails.onRendered(()=>{
    data = Tickets.findOne({_id: FlowRouter.current().params._id});
    currentUserMessages = Messages.find({ticket: FlowRouter.current().params._id});

    Session.set('currentTicket', this.data);
});

Template.myTicketsDetails.helpers({
   editTitle:()=> {
       var ticket = Tickets.findOne({
               _id : FlowRouter.current().params._id
       });
       return 'Ticket #'+ticket._id +' : '+ ticket.status
   },

    currentTicket: ()=>{
        return Tickets.findOne({
            _id: FlowRouter.current().params._id
        })
    },
    messages: ()=> {
        return Messages.find({
            ticket: FlowRouter.current().params._id
        },{
            sort:{
               TimeStamp: -1
           }
       })
   },

    checkIndex: (data)=>{
        var ticket = Tickets.findOne({
            _id: FlowRouter.current().params._id
        });
        return data.receiver == ticket.user
    },

    sender: (sender)=>{
        var user =  Meteor.users.findOne({
            _id: sender.sender
        });


        return user.username;
        //return senderMessage.username;
    },

    appName: ()=>{
        return Meteor.App.NAME
    }
});

Template.myTicketsDetails.events({
    'click #closeTicket': () =>{
        updateStatus('closed')
    },

    'click #sendMessage': (e, t) =>{
        e.preventDefault();
        var content  = t.$('#messageContent').val();
        sendMessage(content)
    }
});

function updateStatus(status){
    Meteor.call('updateTicketStatus', FlowRouter.current().params._id, status, function(err, res){
        if (err) {
            swal("Error", err.message, "error");
            return;
        }
        swal("Success", "Ticket status successfully updated", "success");
    })
}

function sendMessage(content){
    var params = {
        ticket: FlowRouter.current().params._id,
        sender: Meteor.userId(),
        receiver: Session.get('currentTicket').user,
        content: content
    };
    Meteor.call('sendMessage', params, function(err, res){
        if (err) {
            swal("Error", err.message, "error");
        }
    })
}


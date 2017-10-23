Template.vendorTransportTab.onRendered(()=> {

});

Template.vendorTransportTab.helpers({
    vendorTransport: function(){
       return Carrier.find({vendorId: Meteor.userId()});
    }
});

Template.vendorTransportTab.events({
    'click #removeButton': function(e, t){
        Meteor.call('removeCarrier', this._id);
    }
});
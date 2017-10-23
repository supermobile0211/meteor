Template.customerAddressesTab.onRendered(()=>{

});

Template.customerAddressesTab.helpers({
    addresses: function(){
       return Meteor.user() && Meteor.user().profile && Meteor.user().profile.address
    },

    customAddress: function(index){
       return '/customerAddressesDetails/' + index || 0;
    }
});

Template.customerAddressesTab.events({
    'click #remove': function( e, t ) {
        var index = e.currentTarget.value;
        Meteor.call('removeAddressByIndex', index, function (err) {
            if(err){
                swal({
                    title: "Failed!",
                    text: err.message,
                    type: "error"
                })
            }
            swal("You have successfully removed");
        });
    }
});

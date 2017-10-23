Template.customerAlertsTab.onRendered(()=> {

});

Template.customerAlertsTab.helpers({
    subscribedProducts: function() {
       return Products.find({
           subscribers: Meteor.userId()
       })
   }
});

Template.customerAlertsTab.events({
    'click #deleteBtn': function(e, t){
        e.preventDefault();
        var id = this._id;
        swal({
            title: "Are you sure?",
            text: "This product will be unSubscribed",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, remove it!",
            closeOnConfirm: false
        }, function () {
            Meteor.call('unsubscribeProduct', id, function(err) {
                if (err) {
                    swal({
                        title: "Failed!",
                        text: err.message,
                        type: "error"
                    });
                    return;
                }
                Session.set('selectedCategories', []);
                swal("Removed!", "The Product is now unsubscribed.", "success");
            });
        });
    }
});



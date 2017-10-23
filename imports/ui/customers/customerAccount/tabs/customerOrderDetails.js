
Template.customerOrderDetails.onRendered(function (){
    this.$('[data-toggle="tooltip"]').tooltip();
    Session.set('orderData', Orders.findOne({_id: FlowRouter.current().params.id}));
});

Template.customerOrderDetails.helpers({

    pendingStatus: ()=> currentOrder() && currentOrder().status != 'Pending',

    title: ()=> 'Order details: #' + FlowRouter.current().params.id,

    vendorPlace: ()=> {
     var id = currentOrder() && currentOrder().vendorId;
     return Meteor.users.findOne({_id: id});
    },

    customerPlace: ()=> {
        var customer = Meteor.users.findOne({_id: currentOrder() && currentOrder().user});
        return customer && customer.profile.address[0];
    },

    shippingAddress: () => {
        var customer = Meteor.users.findOne({_id: currentOrder() && currentOrder().user});
        return customer && customer.profile.address[currentOrder().shippingAddress]
    },
    billingAddress: () => {
        var customer = Meteor.users.findOne({_id: currentOrder() && currentOrder().user});
        return customer && customer.profile.address[currentOrder().billingAddress]
    },

    Customer: ()=> currentOrder() && Meteor.users.findOne({_id: currentOrder().user}),

    orderStatus: ()=> currentOrder() && currentOrder().status.toLowerCase(),

    Order: ()=> currentOrder(),

    carrierName: ( id ) => {
        var carrier = Carrier.findOne({
            _id: id
        });
        return carrier && carrier.name
    },

    carriers: ()=> currentOrder() && currentOrder().carriers,

    carrierPrice: ( price )=> {
        if( price > 0 ){
            return price
        }
        else{
            return 'Free'
        }
    },

    canceled: ()=> currentOrder() && currentOrder().status == 'Canceled',

    Vendor: ()=> currentOrder() && Meteor.users.findOne({_id: currentOrder().vendorId})

});

Template.customerOrderDetails.events({
   'click #claim': ( e, t ) => {
       var params = {
           sender: Meteor.userId(),
           receiver : currentOrder().vendorId,
           orderId: FlowRouter.current().params.id,
           type: 'vendor'
       };
       Meteor.call('createNotification', params, function(err, res){
       })
   },

    'click .addressType': ( e ) => {
        //trigger resize event to load google map in modal correctly
        triggerResize();
        var currentAddress;
        if(e.target.attributes && e.target.attributes.addressType){
            Session.set('addressType', e.target.attributes.addressType.value )
        }
        if(currentOrder() && Session.get('addressType') == 'Shipping address'){
            currentAddress =Meteor.users.findOne({
                _id: currentOrder().user
            }).profile.address[currentOrder().shippingAddress]
        }
        else{
            currentAddress =Meteor.users.findOne({
                _id: currentOrder().user
            }).profile.address[currentOrder().billingAddress]
        }
        Session.set('currentAddress', currentAddress)
    },

    'click #cancelOrder': ( e, t ) => {
        var params= {
            id: FlowRouter.current().params.id,
            message: t.$('#textarea').val()
        };
        Meteor.call('cancelOrder', params, function(err, res){
            if(err){
                toastr.error(err.message)
            }
            else{
                toastr.warning('you canceled the order successfully')
            }
        })
    }
});


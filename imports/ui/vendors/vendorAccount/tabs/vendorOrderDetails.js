
Template.vendorOrderDetails.onRendered(()=> {
    let order = currentOrder();
    if(order){
        let user = Meteor.users.findOne({_id: order.user});
        Session.set('filterOrders', order.status);
        Session.set('currOrder', order);
        Session.set('orderUser', user);
    }
    Session.set('totalPrice', []);
    Session.set('shippingTotal', 0);
    Session.set('progressBar', false);
    Session.set('uploadingProgress', 0);


    var payment = Payments.findOne({
        orderId: currentOrder()._id,
        receiverId: currentOrder().vendorId
    });
    if(payment){
        Session.set('paymentId', payment._id);
        Session.set('paymentStatus', payment.status);
    }

    var $inputImage = this.$("#inputImage");

    Meteor.setTimeout(() => {
        $("[data-toggle=tooltip]").tooltip();
    }, 1000);

});


Template.vendorOrderDetails.events({

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


    'click #generate-PDF': function(){

        Meteor.call('generatePDF', Session.get('currOrder'), Session.get('orderUser'), function(err, res){
            if(err){
                console.log(err)
            }
            else{
                window.open("data:application/pdf;base64, " + res);
            }

        })
    },

    'click .trackingNo': (e) => {
        Session.set('trackingIndex', e.currentTarget.attributes.index.value);
    },

    'click #saveTracking': (e, t) => {
        var trackingNumber = t.$('#trackingNumber').val();
        if( trackingNumber ){
            Meteor.call('updateTrackingNo', currentOrder()._id, Number(Session.get('trackingIndex')), trackingNumber, function(err, res){
                if(err){
                    toastr.error('We are sorry but something went wrong.');
                }
                toastr.success('Tracking Number updated successfully.');
                t.$('#editShippingNbModal').modal('hide');
            })
        }
    },

    'click .order-status': (e) => {
        var status = e.currentTarget.attributes.status.value;
        if( status == 'Completed' && !currentOrder().invoices.length){
            toastr.error('You have to add invoice before order completed');
            return;
        }
        if( status == 'Cancelled' && currentOrder().status == 'Completed'){
            toastr.error('Your request for Cancellation Order has been sent');
            return;
        }
        //check is order completed and then cencel
        var completed = _.findIndex(currentOrder().history, function(obj){
            return obj.status == 'Completed'
        });
        if( completed != -1 ){
            toastr.error('Please wait your Cancellation request is still processing.');
            return;
        }


        Meteor.call('updateOrderStatus', currentOrder()._id, status, currentOrder().vendorId, (err, res) => {
            if(err){
                toastr.error('We are sorry but something went wrong.');
            }
            toastr.success('Order updated successfully.');
        });
        Session.set('filterOrders', e.currentTarget.attributes.status.value);
    },

    'click .deleteInvoice': ( e ) => {
        Meteor.call('deleteInvoice', currentOrder()._id, function(err, res){
            if(err){
                toastr.error('We are sorry but something went wrong.');
            }
            else{
                toastr.success('The Invoice is deleted Successfully');
            }
        });
    },

    /********** Upload Invoice **********/
    //'click #uploadInvoice': function(event){
    'change #inputInvoice': function(event){
        var file = $('#inputInvoice').prop('files')[0];
        //check invoice already exists
        if( currentOrder().invoices.length){
            toastr.error('Please remove the old Invoice to upload new Invoice');
            return;
        }

        var ext = event.target.value.match(/\.(.+)$/)[1];
        switch(ext)
        {
            case 'pdf':
            case 'doc':
            case 'docx':
            case 'xls':
            case 'txt':
            case 'rtf':
                break;
            default:
                toastr.error('that type of file not allowed');
                event.target='';
                return;
        }
        Session.set('invoiceFrom', 'vendor');
        event.preventDefault();
        if(!file){
            toastr.error('you must select a file to upload');
            return;
        }
        uploadInvoice(FlowRouter.current().params.id, true, function (error, res) {
            Session.set('inProgress', false);
            if (error) {
                swal("Error", error, "error");
            }
            else {
                Orders.update(FlowRouter.current().params.id, {
                    $push: {
                        invoices: {
                            fileName: res.fileName,
                            url: res.downloadUrl
                        }
                    }
                });
                swal("Success", "Invoice Uploaded", "success");
            }
        });
    }
});


Template.vendorOrderDetails.helpers({

    showTimeDetails: function(){
        var payment = Payments.findOne({
            orderId: currentOrder()._id,
            receiverId: currentOrder().vendorId
        });
        return payment && !(payment.status == "Eligible");
    },

    paymentStatus: function() {
        return  Session.get('paymentStatus');
    },

    title: () => {
      return `Vendor sale: # ${FlowRouter.current().params.id}`
    },

    vendorPlace: () => {
        var id = currentOrder() && currentOrder().vendorId;
        return Meteor.users.findOne({_id: id});
    },

    commissionInfo: (key) => {
        let id = FlowRouter.current().params.id,
        commissionObj = Payments.findOne({orderId: id});
        if(commissionObj) return commissionObj[key];
    },

    shippingCommission(total){
        return currentOrder() && calculatePercentages(total, currentOrder()._id).shippingCommission
    },

    customerPlace: () => {
        var customer = Meteor.users.findOne({_id: currentOrder() && currentOrder().user});
        return customer && customer.profile.address[0];
    },

    Customer: ()=> currentOrder() && Meteor.users.findOne({_id: currentOrder().user}),

    vendorPayment: (key) => {

        let vendorPaymentObj = Payments.findOne({orderId: FlowRouter.current().params.id});
        if(vendorPaymentObj) return key ? vendorPaymentObj[key] : vendorPaymentObj;
    },

    pendingStatus: ()=> currentOrder() && currentOrder().status == 'Pending',

    PriceTotal: () => {
        let ordersArray = Session.get('totalPrice') || [];
        if(ordersArray.length){
            let numbers = ordersArray.map(ele => ele.totalPrice);
            var productsTotal = numbers.reduce((old, cur) => old + cur );
            Session.set('productsTotal', productsTotal);
            return productsTotal
        }
        else return '';

    },

    selectedStatus: () => {
        return Session.get('filterOrders');
    },
    orderCompleted: () => {
        var status = currentOrder() && currentOrder().status;
        return (status == 'Pending' || status == 'Processing');
    },
    currentFile: () => {
      return Session.get('uploadingProgress') ? 'uploading' : 'No current File';
    },
    progress: function () {
        return Math.round(Session.get('uploadingProgress'));
    },
    progressBar: function() {
        return Session.get('progressBar');
    },
    Invoices: function(){
        return currentOrder() && currentOrder().invoices;
    },
    Order: () => {
      return currentOrder();
    },

    shippingAddress: () => {
        var customer = Meteor.users.findOne({_id: currentOrder() && currentOrder().user});
        return customer && customer.profile.address[currentOrder().shippingAddress]
    },
    billingAddress: () => {
        var customer = Meteor.users.findOne({_id: currentOrder() && currentOrder().user});
        return customer && customer.profile.address[currentOrder().billingAddress]
    },

    checkStatus: (status) => currentOrder() && currentOrder().status == status,

    Carriers: function(){
        return currentOrder() && currentOrder().carriers;
    },

    paymentProcessing: () => {
        let vendorPaymentObj = Payments.findOne({orderId: FlowRouter.current().params.id});
        return vendorPaymentObj && (vendorPaymentObj.status == 'Processing' || vendorPaymentObj.status == 'Paid');
    },

    paymentCompleted: () => {
        let vendorPaymentObj = Payments.findOne({orderId: FlowRouter.current().params.id});
        return vendorPaymentObj && vendorPaymentObj.status == 'Paid'
    },

    LastPaymentHistory: function() {
        let _id, obj;
        _id = Session.get('paymentId');
        obj = Payments.findOne({_id});
        if(obj) return obj.history[0];
    },

    carrierName: (id) => {
        var carrier = Carrier.findOne({
            _id: id
        });
        return carrier && carrier.name
    },
    shippingTotal: () => {
        calculateShippingTotal();
        return currentOrder() &&  currentOrder().carriers[0].price;
    },

    lastOrderHistory: () => currentOrder() && currentOrder().history[currentOrder().history.length - 1].updatedAt,

    dueAmount: () => currentOrder() && currentOrder().grossPrice - currentOrder().commission,

    paymentDetails: (status) => {
        if(!status) return;
        let paymentStatus = status.toLowerCase();
        switch (paymentStatus){
            case 'pending':{
                return 'Pending';
            }
            case 'added':{
                return 'Added in VEA'
            }
            case 'eligible':{
                return 'Eligible for next Payment'
            }
            case 'processing':{
                return 'Payment is Processing'
            }
            case 'paid':{
                return 'Payment is done';
            }
            default : return _.capitalize(paymentStatus)
        }
    }

});

calculateShippingTotal = () => {
    var orders = Orders.find().fetch();
    if(orders && orders.length){
        var total = orders.map(obj => obj.carriers[0].price).reduce((a, b) => a + b);
        Session.set('shippingTotal', total)
    }
};
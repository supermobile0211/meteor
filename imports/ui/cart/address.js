
function updateProfileAddress(params){
    Meteor.call('addProfileAddress', params,  (err) => {
        if( err ){
            swal("Error", err.message, "error");
        }
        swal("Published!", "The Address is successfully updated.", "success");
        Session.set('validate', true);
    });
}

Template.address.onRendered (function() {

    Session.set('step', 1);

    Meteor.setTimeout(()=>{
        if(Meteor.user().profile.address.length){
            Session.set('validate', true);

        }else{
            Session.set('validate', false);
        }
    }, 1000);

    let _self = this;
    this.$('#form, #popupForm').each(function() {
        $(this).validate({
            rules: {
                name: {
                    required: true
                },
                firstName: {
                    required: true
                },
                address: {
                    required: true
                },
                zipCode: {
                    required: true
                },
                city: {
                    required: true
                }
            },

            invalidHandler: (event, validator) => {
                swal({
                    title: "Failed!",
                    text: 'please check form fields',
                    type: "error"
                });
            },

            submitHandler: (handler, event) => {
                event.preventDefault();
                var params =  {
                    name : $(handler).find('input[name="name"]').val(),
                    firstName : $(handler).find('input[name="firstName"]').val(),
                    country : Session.get('currentEditCountry'),
                    din : $(handler).find('input[name="din"]').val(),
                    company : $(handler).find('input[name="company"]').val(),
                    tva : $(handler).find('input[name="tva"]').val(),
                    address : $(handler).find('input[name="address"]').val(),
                    additionalAddress : $(handler).find('input[name="additionalAddress"]').val(),
                    zipCode : $(handler).find('input[name="zipCode"]').val(),
                    city : $(handler).find('input[name="city"]').val(),
                    phoneNumber : Session.get('phone')
                };
                updateProfileAddress(params);
                if(_self.$('#popupForm').data('modal-form')){
                    _self.$('#addNewAddressModal').modal('hide');
                }
            }

        });
    });
});

Template.address.events ({

    'click #save': function(){
        if(Session.get('validate') && Meteor.user().profile.address.length){
            Session.set('step', Session.get('step') + 1);
        }
    },

    'change #selectDelivery': (e, t)=>{
        Session.setPersistent('currentEditAddDelivery', e.currentTarget.value);
    },

    'change #selectBilling': (e, t) => {
        Session.setPersistent('currentEditAddBilling', e.currentTarget.value);
    },

    'click #previous-step1': function(evt, temp){
        Session.set('step', Session.get('step') - 1);
    }
});

Template.address.helpers ({

    address_pro : function(){
        return Meteor.user() && !Meteor.user().profile.address.length
    },

    saveAddress: function(){
        return Meteor.user() && !Meteor.user().profile.address.length
    },

    address_billing: ()=>{
        return Meteor.user() && Meteor.user().profile && Meteor.user().profile.address
    },

    address_delivery: ()=>{
        return Meteor.user() && Meteor.user().profile && Meteor.user().profile.address
    },

    selected_delivery_index: ()=>{
        return Session.get('currentEditAddDelivery');
    },

    selected_billing_index: ()=>{
        return Session.get('currentEditAddBilling');
    },

    dynamic_address_delivery: ()=>{
        return Meteor.user() && Meteor.user().profile && Meteor.user().profile.address && Meteor.user().profile.address[Session.get('currentEditAddDelivery')];
    },

    dynamic_address_Billing: ()=>{
        return Meteor.user() && Meteor.user().profile && Meteor.user().profile.address && Meteor.user().profile.address[Session.get('currentEditAddBilling')];
    }

});
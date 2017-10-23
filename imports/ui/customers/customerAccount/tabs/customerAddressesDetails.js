Template.customerAddressesDetails.onCreated(()=>{

});

Template.customerAddressesDetails.onRendered(function() {
    Session.set('invalidNumber', false);
    var index = FlowRouter.current().params.index;
    if( index && Meteor.user() && Meteor.user().profile.address[index]){
        Session.set('currentAddress', Meteor.user().profile.address[index]);
        this.$("#phoneNumber").intlTelInput("setCountry", Session.get('currentAddress').phoneCountry || 'fr');
        //this.$("#phoneNumber").intlTelInput("setNumber", Session.get('currentAddress').phoneNumber);
    }
    else{
        Session.set('currentAddress', false);
    }
    this.$('#customerAddDetail').validate({
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
            },
            phone: {
                required: true
            },
            country: {
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
            //let phoneIsoCode = $("#phoneNumber").intlTelInput("getSelectedCountryData").iso2;
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
                phoneNumber : Session.get('phone'),
                phoneCountry : Session.get('phoneIso')
            };

                Meteor.call('updateAddress', FlowRouter.current().params.index, params, function (err) {
                    if(err){
                        swal("Error", err.message, "error");
                    }
                    swal("Published!", "The Address is successfully updated.", "success");
                    history.back();
                    //FlowRouter.go('customerAddresses');
                });
        }
    });
});

Template.customerAddressesDetails.helpers({
    validNumber: function(){
        return Session.get('invalidNumber');
    },
    user_data: ()=>{
        return Meteor.user().profile.address && Meteor.user().profile.address[FlowRouter.current().params.index];
    }
});

Template.customerAddressesDetails.events({
    'keyup #phoneNumber': function(e, t){
        let telInput = $(e.target);
        telInput.removeClass("text-danger");
        if ( telInput.val().trim() ) {
            if (telInput.intlTelInput("isValidNumber")) {
                Session.set('invalidNumber', false);
                Session.set('phoneIso', t.$("#phoneNumber").intlTelInput("getSelectedCountryData").iso2);
                Session.set('phone', t.$('input[name="phone"]').val());
                telInput.removeClass("text-danger");
            } else {
                Session.set('invalidNumber', true);
                telInput.addClass("error");
                telInput.addClass("text-danger");
            }
        }
    }
});
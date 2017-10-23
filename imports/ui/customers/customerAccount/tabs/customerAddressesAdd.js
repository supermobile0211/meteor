
Template.customerAddressesAdd.onRendered(function(){

    Session.set('invalidNumber', false);
    Session.set('currentAddress', false);

    this.$("#phoneNumber").intlTelInput("setCountry", Session.get('currentAddress').phoneCountry || 'fr');
    let _self = this;
    this.$('#customerAdd').validate({
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
            event.preventDefault();
            var params =  {
                name : $(handler).find('input[name="name"]').val(),
                firstName : $(handler).find('input[name="firstName"]').val(),
                country : Session.get('currentEditCountry') || 'France',
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
            Meteor.call('addProfileAddress', params,  (err)=>{
                if(err){
                    swal("Error", err.message, "error");
                }
                swal("Published!", "The Address is successfully updated.", "success");

            });
            FlowRouter.go('customerAddresses');
        }
    });
});

Template.customerAddressesAdd.events({
    'keyup #phoneNumber': function(e, t){
        let telInput = $(e.target);
        telInput.removeClass("text-danger");
        if ($.trim(telInput.val())) {
            if (telInput.intlTelInput("isValidNumber")) {
                Session.set('invalidNumber', false);
                Session.set('phoneIso', $("#phoneNumber").intlTelInput("getSelectedCountryData").iso2);
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

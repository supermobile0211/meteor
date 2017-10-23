
Template.customerInformations.onCreated(()=>{

});

Template.customerInformations.onRendered(function(){
    Session.set('changeEmail', false);
    Session.set('changePassword', false);

    this.$('input[name="birthday"]').datepicker({
        startView: 2,
        todayBtn: "linked",
        keyboardNavigation: false,
        forceParse: false,
        autoclose: true
    });

    this.$('#form').validate({
        rules: {
            firstName: {
                required: true
            },
            lastName: {
                required: true
            }
        },
        messages: {
            firstName: {
                required: "Please enter first name"
            },
            lastName: {
                required: "Please enter last name"
            }
        },
        invalidHandler: function(event, validator) {
           swal({
               title: "Failed!",
               text: 'please check form fields',
               type: "error"
           });
        },

        submitHandler: function(event, handler){
            var title = $("[name='gender']:checked").val(),
                firstName = $('#firstName').val(),
                lastName = $('#lastName').val(),
                dob = $('#dob').val(),
                newsLetter = $('#userAllowNewsletter').is(':checked'),
                partnersNews = $('#userAllowOptin').is(':checked');


            var params = {title, firstName, lastName, dob, newsLetter, partnersNews};


            Meteor.call('updateCustomerInformation', Meteor.userId(), params, function(error, succes){
                if (error) {
                    swal({
                        title: "Failed!",
                        text: error.message,
                        type: "error"
                    });
                    return;
                }
                swal("Published!", "Your Information updated.", "success");
            });
        }
});
});


Template.customerInformations.helpers({

    currentUser : currentUser,

    isGender : ((gender)=>{
        return gender == currentUser().profile.title;
    }),

    emailChanged: function(){
        return Session.get("changeEmail")
    },

    passwordChanged: function(){
        return Session.get("changePassword")
    },

    enableEmail: function () {
      return !Session.get('changeEmailBtn')
    },

    enablePassword: function () {
      return !Session.get('changePasswordBtn')
    }

});



Template.customerInformations.events({

    'click #cancelEmail': function( e, t ){
        var oldEmail = Meteor.user().emails[0] && Meteor.user().emails[0].address;
        Session.set('changeEmail', false);
        t.$('#email').val(oldEmail);
    },

    'click #cancelPassword': function( e, t ){
        Session.set('changePassword', false);
        t.$('#password').val('');
    },

    'click #updateEmail': function( e, t ){
        e.preventDefault();
        var currentEmail = t.$('#email').val();
        if(Meteor.user().emails[0].address === currentEmail){
            swal("Warning!", "Please try different email!", "error");
            Session.set('changeEmail', false);
            return;
        }
        var currentPassword = t.$('#cPassword').val();
        var digest = Package.sha.SHA256(currentPassword);
        Meteor.call('updateEmail', digest, t.$('#email').val(), function(err, res){
            if (err) {
                var oldEmail = Meteor.user().emails[0] && Meteor.user().emails[0].address;
                Session.set('changeEmail', false);
                t.$('#email').val(oldEmail);
                    swal("Failed!", "Current password Wrong", "error");
            }
            else {
                swal("Published!", "Email changed Successfully!", "success");
            }
        })
    },

    'click #updatePassword': function( e, t ){
        var oldPassword = t.$('#currentPassword').val();
        var newPassword = t.$('#password').val();
        Accounts.changePassword(oldPassword, newPassword, function (err) {
            if (err) {
                if (err.error === 403) {
                    Session.set('changePassword', false);
                    t.$('#password').val('');
                    swal("Failed!", "Current password Wrong", "error");
                } else {
                    swal("Failed!", "We are sorry but something went wrong.", "error");
                }
            }
            else {
                swal("Published!", "Password changed Successfully!", "success");
            }
        });
    },

    'keypress #email': function(){
        Session.set('changeEmail', true)
    },

    'keypress #password': function(){
        Session.set('changePassword', true)
    },

    'keyup #currentPassword, keyup #confirmPassword, keyup #password': function( e, t ){
        if ( t.$('#password').val() ==  t.$('#confirmPassword').val()){
            if( t.$('#currentPassword').val() && t.$('#currentPassword').val().length > 2){
                Session.set('changePasswordBtn', true)
            }
            else{
                Session.set('changePasswordBtn', false)
            }
        }
        else{
            Session.set('changePasswordBtn', false)
        }
    },

    'keyup #email, keyup #confirmEmail, keyup #cPassword': function( e, t ){
        if ( t.$('#email').val() ==  t.$('#confirmEmail').val()){
            if( t.$('#cPassword').val() && t.$('#cPassword').val().length > 2 ){
                Session.set('changeEmailBtn', true)
            }
            else{
                Session.set('changeEmailBtn', false)
            }
        }
        else{
            Session.set('changeEmailBtn', false)
        }
    }

});

var currentUser = (()=>{
    return Meteor.user();
});



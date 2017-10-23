Template.forgotPassword.onRendered(()=> {
    $('body').addClass('gray-bg');
});

/********** Template Events **********/
Template.forgotPassword.events({
    'submit form': function( e, t ) {
        e.preventDefault();
        var email = t.find("[name='email']").value;
        Accounts.forgotPassword({email: email}, function(err) {
            if (err) {
                if (err.error === 403) {
                    toastr.error('Invalid email');
                } else {
                    toastr.error('We are sorry but something went wrong.');
                }
            }
            else {
                toastr.success('Email Sent. Check your mailbox!');
                FlowRouter.go('login');
            }
        });
    }
});

Template.forgotPassword.destroyed = function(){

    // Remove special color for current layout
    $('body').removeClass('gray-bg');
};
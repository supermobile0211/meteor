

Template.resetPassword.onRendered(()=> {
    $('body').addClass('gray-bg');
});

/********** Template Events **********/
Template.resetPassword.events({
    'submit form': function( e, t ) {
        e.preventDefault();
        var password = t.find("[name='newPassword']").value;
        var confirm = t.find("[name='confirmPassword']").value;
        var token = FlowRouter.current().params.token;
        if(password != confirm){
            toastr.error('new password match failed');
            return;
        }
        Accounts.resetPassword(token, password, function (err) {
            if (err) {
                if (err.error === 403) {
                    toastr.error('Token expired');
                } else {
                    toastr.success('We are sorry but something went wrong.');
                }
            }
            else {
                toastr.success('Password reset Successfully!');
                FlowRouter.go('login');
            }
        })
    }
});

Template.resetPassword.destroyed = function(){

    // Remove special color for current layout
    $('body').removeClass('gray-bg');
};
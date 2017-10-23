/********** Template Events **********/
Template.changePassword.events({
    'submit form': function( e, t ) {
        e.preventDefault();
        var oldPassword = t.find("[name='oldPassword']").value;
        var newPassword = t.find("[name='newPassword']").value;
        var confirmPassword = t.find("[name='confirmPassword']").value;
        if(newPassword != confirmPassword){
            toastr.error('new password match failed');
            return;
        }
        Accounts.changePassword(oldPassword, newPassword, function (err) {
            if (err) {
                if (err.error === 403) {
                    toastr.error('Current password Wrong');
                } else {
                    toastr.error('We are sorry but something went wrong.');
                }
                return;
            }
            else {
                toastr.success('Password changed Successfully!');
                FlowRouter.go('login');
            }
        });
    }
});
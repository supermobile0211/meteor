Template.register.onRendered(()=> {
	$('body').addClass('gray-bg');
});

/********** Template Events **********/
Template.register.events({
	'submit form': function( e, t ) {
		e.preventDefault();
		if ( t.$('#termsAccepted').prop('checked') ) {
			var name = t.$('#userName').val();
			var email = t.$('#userEmail').val();
			var password = t.$('#userPassword').val();
			var args = {
				email: email,
				password: password,
				name: name
			};
			Meteor.call('registerUser', args, function (err) {
				if (err) {
					toastr.error(err.message);
					return;
				}
				toastr.success('Account Created. you can login with you credentials!');
				FlowRouter.go('login');
			});
		} else {
			toastr.error('You must accept terms of service!');
		}
	}
});

Template.register.destroyed = function(){

	// Remove special color for current layout
	$('body').removeClass('gray-bg');
};
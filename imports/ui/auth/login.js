import { Template } from 'meteor/templating';

import './login.html'

Template.login.onRendered(function() {
    this.$('body').addClass('gray-bg');
});

Template.login.helpers({

});

Template.login.events({
    'submit .login': ( e, t )=> {
        e.preventDefault();
        var email = t.find("[name='email']").value;
        var password = t.find("[name='password']").value;
        Meteor.loginWithPassword(email, password, (err)=> {
            if (err) {
                if (err.error === 403) {
                    toastr.error('Invalid email or password');
                } else {
                    toastr.error('We are sorry but something went wrong.');
                }
                return;
            }

            //for update recentIp array.
            getUserLocation(true);

            toastr.success('login Successfully!');
            Meteor.users.update({
                _id: Meteor.userId()
            },{
                $set: {
                    lastLogin: new Date()
                }
            });
            FlowRouter.go('dashboard1')
        });
    },

    'submit .sign-up-form': ( e, t )=> {
        e.preventDefault();
        var name = t.$('#userName').val(),
            email = t.$('#email').val(),
            password = t.$('#password').val(),
            confirmPassword = t.$('#confirmPassword').val();
        if ( password != confirmPassword  ) {
            toastr.error('Password match failed');
            return;
        }
        var args = {
            email: email,
            password: password,
            name: name
        };
        Meteor.call('registerUser', args,  (err)=> {
            if (err) {
                toastr.error(err.message);
                return;
            }
            t.$('#userName').val("");
            t.$('#email').val("");
            t.$('#password').val("");
            t.$('#confirmPassword').val("");
            toastr.success(' Account Created. you can login with you credentials! ');
        });
    },

    'click .facebook': ()=> {
        Meteor.loginWithFacebook({
            requestPermissions: ['user_friends', 'public_profile', 'email']
        }, (err) => {
            if (err) {
            console.log(err)
        } else {
            toastr.success('login Successfully!');
            FlowRouter.go('/');
        }
    });
    },

    'click .twitter' : ()=>{
        Meteor.loginWithTwitter({
            requestPermissions: ['user_friends', 'public_profile', 'email']
        }, (err) => {
            if (err) {
            //console.log(err)
        } else {
            toastr.success('login Successfully!');
            FlowRouter.go('/');
        }
    });
    },

    'click .google' : ()=>{
        Meteor.loginWithGoogle({
            requestPermissions: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile']
        }, (err) => {
            if (err) {
            //console.log(err)
        } else {
            toastr.success('login Successfully!');
            FlowRouter.go('/');
        }
    });
    },

    'click .linkedin' : ()=>{
        Meteor.loginWithLinkedin({
            requestPermissions: ['r_basicprofile', 'r_emailaddress']
        }, (err) => {
            if (err) {
            //console.log(err)
        } else {
            toastr.success('login Successfully!');
            FlowRouter.go('/');
        }
    });
    },

    'click .windows' : ()=>{
        Meteor.loginWithMicrosoft({
            requestOfflineToken: true,
            requestPermissions: ['wl.emails'] // Permission scopes are found here: https://msdn.microsoft.com/en-us/library/hh243648.aspx
        }, (error)=> {
            if (error) {
            }
            else {
                toastr.success('login Successfully!');
                FlowRouter.go('/');
            }
        });
    },

    'click .instagram' : ()=>{
        Meteor.loginWithInstagram( (err)=> {
            if (err) {
                console.log('login failed', err);
            } else {
                toastr.success('login Successfully!');
                FlowRouter.go('/');
            }
        });
    }

});

Template.login.onRendered (()=>{

});

Template.login.onDestroyed( function(){
    // Remove special color for current layout
    $('body').removeClass('gray-bg');
});
import { Template } from 'meteor/templating';

import './navigation.html'
Template.navigation.onRendered(function() {

    // Initialize metisMenu
    this.$('#side-menu').metisMenu();

});

// Used only on OffCanvas layout
Template.navigation.events({

    'click .close-canvas-menu' : function(){
        $('body').toggleClass("mini-navbar");
    },

    'click #logout': function() {
        Meteor.logout();
        Session.clearPersistent();
        Session.setPersistent('userOffer', []);
        FlowRouter.go('login');
    }

});

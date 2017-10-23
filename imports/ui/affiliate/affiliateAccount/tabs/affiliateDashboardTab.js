Template.affiliateDashboardTab.onRendered(function() {

    Session.set('generatedUrl', Meteor.absoluteUrl() + `?af=${Meteor.userId()}`);
    // Popover demo
    this.$("[data-toggle=popover]").popover({
        trigger: "focus"
    });

    // Tooltips demo
    this.$("[data-toggle=tooltip]").tooltip();
});

Template.affiliateDashboardTab.helpers({
    affiliate: function() {
        return Meteor.user();
    },
    products: function() {
        return Products.find({},{limit: 5});
    },
    webSiteUrl: () => {
        return Meteor.absoluteUrl();
    },
    generatedUrl: ()=> Session.get('generatedUrl'),

    affiliateId: function(){
        return `?af=${Meteor.userId()}`
    }
});

Template.affiliateDashboardTab.events({
    'keyup #generateUrl':function( e ){
        Session.set('generatedUrl', generateAffiliateUrl(e.target.value))
    }
});


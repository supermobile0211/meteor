Template.profile.onRendered(function() {

    // Set options for peity charts
    this.$(".line").peity("line",{
        fill: '#1ab394',
        stroke:'#169c81'
    });

    this.$(".bar").peity("bar", {
        fill: ["#1ab394", "#d7d7d7"]
    })

});

Template.profile.helpers({
    profileName: function() {
       return Meteor.user();
    }
});
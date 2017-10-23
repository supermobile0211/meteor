var params = {};

Template.customerSettingsTab.onRendered(function() {

    Session.set('desactivateMyAccount', false);
    Session.set('deleteMyAccount', false);


    this.$('#currentCurrency')[0].value = Meteor.user() && Meteor.user().settings.currency;

    var config = {
        '.chosen-select'           : {},
        '.chosen-select-deselect'  : {allow_single_deselect:true},
        '.chosen-select-no-single' : {disable_search_threshold:10},
        '.chosen-select-no-results': {no_results_text:'Oops, nothing found!'},
        '.chosen-select-width'     : {width:"95%"}
    }
    for (var selector in config) {
        this.$(selector).chosen(config[selector]);
    }

});

Template.customerSettingsTab.helpers({

   settings: ()=>{
       return Meteor.user() && Meteor.user().settings;
   },

    deleteMyAccount: function(){
        return Session.get("deleteMyAccount")
    },

    desactivateMyAccount: function(){
        return Session.get('desactivateMyAccount');
    },

    enablePassword: function () {
        return !Session.get('changePasswordBtn')
    },
    enablePassword1: function () {
        return !Session.get('changePasswordBtn1')
    }
});


Template.customerSettingsTab.events({
    //'click #confirmBtn' : (e, t) =>{
    //   var val = t.$("#currentPassword").val();
    //   //console.log('account deleted', val);
    //},
    'click #desactivateMyAccount': ()=>{
        Session.set('desactivateMyAccount', true)
    },
    'click #confirmBtn1' : (e, t) =>{
        e.preventDefault();
        var currentPassword1 = t.$('#currentPassword1').val();
        var digest = Package.sha.SHA256(currentPassword1);
        Meteor.call('accountHandler', digest, 'deactivateMyAccount', (err, res)=>{
            if (err) {
                Session.set('desactivateMyAccount', false);
                swal("Failed!", "Current password Wrong", "error");
            }
            else {
                swal("Success", "Account Deactivated Successfully!", "warning");

            }
            Session.set('deactivateMyAccount', false);
        });
    },
    'change #example1' : function(e, t){
        var val = t.$('#example1').is(':checked');
        userSettingUpdate({
            email: val
        });
    },
    'change #example2' : function(e, t){
        var val = t.$('#example2').is(':checked');
        userSettingUpdate({
            push: val
        });

    },
    'change #example3' : function(e, t){
        var val = t.$('#example3').is(':checked');
        userSettingUpdate({
            web: val
        });
    },
    'change input[name=radioInline]': (e, t) =>{
        var type = t.find("[name='radioInline']:checked").value;
        //console.log('RadioSelected Units', type);
        userSettingUpdate({
            unit: type
        });
    },

    'click #deactivate': function( e, t ){
        Session.set('desactivateMyAccount', false);
    },

    'click #deleteAccount': function( e, t ){
        Session.set('deleteMyAccount', false);
    },

    'change #currentCurrency': (e, t)=>{
        var currency =  e.currentTarget.value;
        userSettingUpdate({
            currency
        });
    },

    'click #selectLang': (e, t) =>{
        userSettingUpdate({
            language: Session.get('currentEditLang')
        });
    },

    'click #deleteMyAccount': function(){
        Session.set('deleteMyAccount', true)
    },

    'click #activateMyAccount': function() {
        userSettingUpdate({
            activate: true
        });
    },

    'click #confirmBtn': (e,t)=>{
        e.preventDefault();
        var currentPassword = t.$('#currentPassword').val();
        var digest = Package.sha.SHA256(currentPassword);
        Meteor.call('accountHandler', digest, 'deleteMyAccount', (err, res)=>{
            if (err) {
                Session.set('deleteMyAccount', false);
                swal("Failed!", "Current password Wrong", "error");
            }
            else {
                swal("Success!", "Account Delete Successfully!", "success");

            }
            Session.set('deleteMyAccount', false);
        });
    },
    'keyup #currentPassword': function( e, t ){
        if ( t.$('#currentPassword').val() ){
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
    'keyup #currentPassword1': function( e, t ){
        if ( t.$('#currentPassword1').val() ){
            if( t.$('#currentPassword1').val() && t.$('#currentPassword1').val().length > 2){
                Session.set('changePasswordBtn1', true)
            }
            else{
                Session.set('changePasswordBtn1', false)
            }
        }
        else{
            Session.set('changePasswordBtn', false)
        }
    }
});

function userSettingUpdate(params){
    Meteor.call('userSetting', params, (err)=>{
        if (err) {
            toastr.error(err);
        }
        else {
            toastr.success("Settings Updated successfully.");
        }
    });
}


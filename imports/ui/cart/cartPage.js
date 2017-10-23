Template.cartPage.onRendered (() => {
    Session.setPersistent('currentEditAddDelivery', 0);
    Session.setPersistent('currentEditAddBilling', 0);
    Session.set('step', 1);
    Session.set('currentEditCountry', 'France');
    Session.set('phone', 'France(+33)');
});

Template.cartPage.helpers({
    currentStep: (tab) => {
        return tab == Session.get('step');
    },

    isEmpty: function(){
        if(Session.get('isProcessing')){
            return true;
        }
        return Session.get('userOffer') && Session.get('userOffer').length;
    },


    classes : function(tab){
        var tabClasses;
        var currentTab = Session.get('step');
        switch(tab) {
            case 1:
                tabClasses =  (currentTab == 1) ? 'current' : 'success';
                break;
            case 2:
                tabClasses =  (currentTab == 1) ? 'disabled' : (currentTab == 2) ? 'current' : 'success' ;
                break;
            default:
                tabClasses =  (currentTab == 1 || currentTab == 2) ? 'disabled' :  'current'  ;
        }
        return tabClasses;
    }

});

Template.affiliateCreateBannerTab.onRendered(function() {

    // Popover demo
    this.$("[data-toggle=popover]").popover({
        trigger: "focus"
    });

    // Tooltips demo
    this.$("[data-toggle=tooltip]").tooltip();


    new Clipboard('.btn');

    
});



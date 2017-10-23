
Template.asAffiliateBestSalesTab.onRendered(function() {


    // DatePicker
    this.$('input[name="daterange"]').daterangepicker();

    this.$('input[name="birthday"]').datepicker({
        startView: 2,
        todayBtn: "linked",
        keyboardNavigation: false,
        forceParse: false,
        autoclose: true
    });


});

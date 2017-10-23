Template.cmsDocPageViewer.onRendered(function() {
    // Initialize fooTable
    this.$('.footable').footable();
});



Template.cmsDocPageViewer.events({


    // Toggle product list Grid/List
    'click .content_sortPagiBar .viewResultsStyle' : function(e, t){
        t.$('.content_sortPagiBar .viewResultsStyle button').toggleClass('active');

        t.$('.productList').toggleClass('list');
        t.$('.productList').toggleClass('grid');

        t.$('.productList .productListItem').removeClass('col-lg-3 col-md-4 col-sm-6 col-sm-12');
        t.$('.productList.grid .productListItem').addClass('productListItem col-lg-3 col-md-4 col-sm-6');
        t.$('.productList.list .productListItem').addClass('productListItem col-sm-12');

        t.$('.productList .productListItem .left-col').removeClass('col-sm-12 col-lg-2 col-sm-3 ');
        t.$('.productList.grid .productListItem .left-col').addClass('col-sm-12');
        t.$('.productList.list .productListItem .left-col').addClass('col-lg-2 col-sm-3');

        t.$('.productList .productListItem .text-col').removeClass('col-lg-10 col-sm-9 col-sm-12 floatingContent ');
        t.$('.productList.grid .productListItem .text-col').addClass('col-sm-12 floatingContent ');
        t.$('.productList.list .productListItem .text-col').addClass('col-lg-10 col-sm-9');

        t.$('.productList .productListItem .center-col').removeClass('col-sm-12 col-lg-8');
        t.$('.productList.grid .productListItem .center-col').addClass('col-sm-12');
        t.$('.productList.list .productListItem .center-col').addClass('col-sm-12 col-lg-8');

        t.$('.productList .productListItem .right-col').removeClass('col-sm-12 col-lg-4 text-center');
        t.$('.productList.grid .productListItem .right-col').addClass('col-sm-12 text-center');
        t.$('.productList.list .productListItem .right-col').addClass('col-sm-12 col-lg-4 text-center');

    },



    // Toggle page filter for mobile
    'click .showFiltersButton' : function(){
        $('.filtersResults').toggleClass('animated fadeInDown hidden-xs');
                   

    }        

});




/********** Template Rendered **********/
Template.topNavbar.onRendered(function(){
        // Initialize slimscroll
    //$('.subMenuHTMLContent').slimScroll({
    //    height: '100%',
    //    railOpacity: 0.4,
    //    wheelStep: 10
    //});

    Session.set('cart', false);
    setDefaultCategory();

    var elem_2 = document.querySelector('.js-switch');
    new Switchery(elem_2, { color: '#ED5565' });

    // FIXED TOP NAVBAR OPTION
    // Uncomment this if you want to have fixed top navbar
    // $('body').addClass('fixed-nav');
    // $(".navbar-static-top").removeClass('navbar-static-top').addClass('navbar-fixed-top');

      // $('.dropdown-submenu a.subDropdown').on("click", function(e){
      //   $(this).next('ul').toggle();
      //   e.stopPropagation();
      //   e.preventDefault();
      // });

});

/********** Template helpers **********/
Template.topNavbar.helpers({
    searchKeyWord: function(){
        return ('search=' + (this.name || this.translation[0].name))
    },


    cart: cartProductLength,
    isEmpty: function(){
        return !Session.get('cart')
    },

    searchResult: (res) => {
        let searchText = Session.get('textSearchVal');
        if(searchText.length){
            let matched = res.slice(0, searchText.length),
            unMatched = res.slice(searchText.length);
            return matched == searchText ? `${matched}<strong>${unMatched}</strong>` : `<strong>${res}</strong>`
        }
    },

    text_search: () => {
        return Session.get('textSearch');
    },

    searchResultCategories: () => {
        return Session.get('searchResultCategoriesWithNames');
    },

    categoryName: function(index){

        let temp, catName,
        cat = Session.get('searchResultCategoriesWithNames');
        if( cat.length ) {
            temp =  Categories.findOne({
                _id: cat[index] && cat[index].cat
            });

            catName = temp && temp.translation[0] && temp.translation[0].name;
            return catName;
        }
    },

    categories: function() {
        return Categories.find();
    }
});

/********** Template Events **********/
Template.topNavbar.events({

    'click .searchKeyword': (e, t)=>{
        Session.set('searchKeyWord', t.$('#top-search').val());
    },
    'keypress #top-search': function(e, t){
        if( e.which == 13 ){
            e.preventDefault();
            Session.set('searchKeyWord', t.$('#top-search').val());
            var results = Session.get('textSearch');
            if (results && results.length){
                FlowRouter.go('/search/' + results[0].category + '?search=' + t.$('#top-search').val())
            }
            else{
                FlowRouter.go('/search/' + Session.get('defaultCat')._id + '?search=' + t.$('#top-search').val())
            }
        }
    },

    'mouseenter .SearchForm': function(event, instance){
        let textSearch = Session.get('textSearch');
        if(textSearch && textSearch.length) instance.$('.autosuggestion').show();
    },

    'mouseleave .SearchForm': function(event, instance){
        instance.$('.autosuggestion').hide();
    },

    // Toggle left navigation
    'click #navbar-minimalize': function(event){

        event.preventDefault();

        // Toggle special class
        $("body").toggleClass("mini-navbar");

        // Enable smoothly hide/show menu
        if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {
            // Hide menu in order to smoothly turn on when maximize menu
            $('#side-menu').hide();
            // For smoothly turn on menu
            setTimeout(
                function () {
                    $('#side-menu').fadeIn(400);
                }, 200);
        } else if ($('body').hasClass('fixed-sidebar')) {
            $('#side-menu').hide();
            setTimeout(
                function () {
                    $('#side-menu').fadeIn(400);
                }, 200);
        } else {
            // Remove all inline style from jquery fadeIn function to reset menu state
            $('#side-menu').removeAttr('style');
        }
    },

    // Toggle right sidebar
    'click .right-sidebar-toggle': function(){
        $('#right-sidebar').toggleClass('sidebar-open');
    },


    'click .mobilSearchBtn' : function(){
        $('.topNavbar .SearchForm').toggleClass('slideInDown slideInTop hidden-xs hidden-sm');
    },

    'click .categories' : function(e){
        Session.set('currentCatId', e.currentTarget.attributes.category.value)
    },


    'click #logout': function() {
        Meteor.logout();
        FlowRouter.go('login');
    },

    'keyup  #top-search': function(event, instance){
        Session.set('textSearchVal', event.target.value);
        Meteor.call('searchProducts1', event.target.value, 'en', function( error, resp ){
            if( error ){
                //console.log('error', error);
            }
            else {
                let searchResultCategories = [],    //for checking category is already exists or not.
                    searchResultCategoriesWithNames = []; //hold category id and suggested product name for display.
                resp && resp.forEach( ( obj ) => {
                    return obj.category.forEach( ( cat ) => {
                        if( !searchResultCategories.includes( cat ) ) {
                            searchResultCategories.push( cat );
                            searchResultCategoriesWithNames.push( { cat, name: getTranslation( obj.translation, 'name' ) } );
                        }
                    })
                });
                //Show dropdown if result exist
                resp && resp.length ? instance.$('.autosuggestion').show() : instance.$('.autosuggestion').hide();
                //Set session
                Session.set('textSearch', resp);
                Session.set('searchResultCategoriesWithNames', searchResultCategoriesWithNames);

            }
        });
    }
});

Template.topNavbar.onDestroyed(()=>{
    //this.$(".subMenuHTMLContent").getNiceScroll().remove();
    $('#top-search').val(FlowRouter.getQueryParam('search'));
});

function setDefaultCategory(){
    Meteor.setTimeout(()=> {
        Session.set('defaultCat', getDefaultCategory());
    }, 1000)
}



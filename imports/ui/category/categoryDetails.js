/********** global variable  **********/
var expandButtonJustClicked = false;
var activeFilters = [];
var array = [];
var applyFilters = [];
var currentLanguage = Session.get('currentEditLang') || 'en';
Session.set('sortFilter',{});
Session.set('maxPrice', 100);
Session.set('topCategory', false);
Template.categoryDetails.onCreated(function() {
    let _self = this;
    $('.pac-container').remove();
    Meteor.setTimeout(() => {
        //get recent location.
        let recentUrls = Meteor.user().profile.recentUrls,
        //add custom field in auto-complete.
        fields = [
            {
                html: `<div id="search-area" class="pac-item areasearch"><span class="pac-icon pac-icon-areas"></span><span class="pac-item-query"><span class="pac-matched"></span><strong>Search in the world</strong></span> <span></span></div>`,
                id: 'search-area'
            },
            {
                html: `<div id="user-location" class="pac-item areasearch" ><span class="pac-icon pac-icon-marker"></span><span class="pac-item-query"><span class="pac-matched"></span><strong>Locate me</strong></span> <span></span></div>`,
                id: 'user-location',
                parameter: undefined
            }
        ];

        if( recentUrls.length ){
            fields.push({html: `<div id="areasearch" class="recent-visited pac-item areasearch" style="padding: 0;"><label style="background: #ccc; text-align: center; font-weight: normal; margin-bottom: 0; min-width: 100%; color: black;">last location</label></div>`});
            for(let i = 0; i < recentUrls.length; i++){
                fields.push(elementObj(recentUrls[i], i));
                if(i == 1)  break;
            }
        }

        fields.push({html: `<div id="areasearch" class="recent-visited pac-item areasearch" style="padding: 0;"><label style="background: #ccc; text-align: center; font-weight: normal; margin-bottom: 0; min-width: 100%; color: black;">$google content suggestion</label></div>`});
        addRecentUrls(fields)

    }, 8000);

});

Template.categoryDetails.onRendered(function() {
    let _self = this;
    getMax();
    Session.set('coords', false);
    Session.set('maxDistance', false);
    Session.set('selectedAddress', false);
    Session.set('locationFilter', false);
    Session.set('currentCatId', FlowRouter.current().params.id);
    Session.set('topCategory', FlowRouter.current().params.id);
    Session.set('availableFeatures', []);

    updateView();


    //autocomplete filter
    _self.autorun(function () {
        if (GoogleMaps.loaded()) {
            _self.$("#geolocation-autocomplete").geocomplete()
                .bind("geocode:result", function (event, result) {
                    if (result.formatted_address.match('Search ')){
                        callMapSubmit();
                        return;
                    }
                    Session.set('selectedAddress', result.formatted_address.split(",")[0]);
                    _self.$('#geolocation-autocomplete').val(Session.get('selectedAddress'));
                    //collect data for location obj.
                    let formatted_address = result.formatted_address,
                        lat = result.geometry.location.lat(),
                        lng = result.geometry.location.lng(),
                        recentLocation = {formatted_address, lat, lng};
                    //update user's recentUrls array.
                    Meteor.users.update({
                        _id: Meteor.userId()
                    }, {
                        $push: {
                            'profile.recentUrls': {
                                $each: [ recentLocation ],
                                $position: 0
                            }
                        }
                    });
                    var coords = [lng, lat];
                    Session.set('coords', coords);

                    Meteor.call('offersByRadius', coords, 10000, (err, res)=>{
                       Session.set('locationFilter', true);
                       Session.set('vendors', _.uniq(_.map(res, '_id')));
                    });
                    let recentUrls = Meteor.user().profile.recentUrls, fields = [];
                    if( recentUrls.length ){
                        fields.push({html: `<div id="areasearch" class="recent-visited pac-item areasearch" style="padding: 0;"><label style="background: #ccc; text-align: center; font-weight: normal; margin-bottom: 0; min-width: 100%; color: black;">last location</label></div>`});
                        for(let i = 0; i < recentUrls.length; i++){
                            fields.push(elementObj(recentUrls[i], i));
                            if(i == 1)  break;
                        }
                    }

                    fields.push({html: `<div id="areasearch" class="recent-visited pac-item areasearch" style="padding: 0;"><label style="background: #ccc; text-align: center; font-weight: normal; margin-bottom: 0; min-width: 100%; color: black;">$google content suggestion</label></div>`});
                    addAfterLocateMe(fields)
                });
        }
    });

    // Initialize fooTable
    _self.$('.footable').footable();

    _self.$("#priceFilters").ionRangeSlider({
        min: 0,
        max: Session.get('maxPrice'),
        type: 'double',
        prefix: "$",
        maxPostfix: "+",
        prettify: false,
        hasGrid: true,
        onFinish : function (data) {
            Session.set('hasFilters', true);
            Session.set('priceFilter', true);
            var obj = {};
            obj['bestOffer'] = {$gte: data.from ,$lte: data.to};
            var objFront = {filterName: 'price', filterValue: data.from + '$ - '+data.to + '$'};
            var filtersActive = activeFilters.map(function(x){return x.filterName});

            // if active filters have not current filter (For frontEnd)
            if(!filtersActive.includes(objFront.filterName)){
                activeFilters.push(objFront);
                applyFilters.push(obj);
            }
            else{
                activeFilters.splice(filtersActive.indexOf(objFront.filterName), 1);
                applyFilters.splice(filtersActive.indexOf(objFront.filterName), 1);
                activeFilters.push(objFront);
                applyFilters.push(obj);
            }

            Session.set('filterName', 'price'); //check for each active class for helper
            Session.set('activeFilters', activeFilters); //for active filters box
            Session.set('priceRangeFilter', applyFilters); //applying filters

        }
    });
    _self.$("#locationFilters").ionRangeSlider({
        min: 0,
        from_fixed: true,
        max: 10000,
        type: 'double',
        postfix: "km",
        prettify: false,
        hasGrid: true,
        onFinish : function (data) {
            if( Session.get('coords') ){
                Meteor.call('offersByRadius', Session.get('coords') || 1, Number(data.to), (err, res)=>{
                    Session.set('vendors', _.uniq(_.map(res, '_id')));
                });
                Session.set('hasFilters', true);
                Session.set('locationFilter', true);
                var obj = {};
                var objFront = {filterName: 'location', filterValue: data.to + 'km'};
                var filtersActive = activeFilters.map(function(x){return x.filterName});

                // if active filters have not current filter (For frontEnd)
                if(!filtersActive.includes(objFront.filterName)){
                    activeFilters.push(objFront);
                    applyFilters.push(obj);
                }
                else{
                    activeFilters.splice(filtersActive.indexOf(objFront.filterName), 1);
                    applyFilters.splice(filtersActive.indexOf(objFront.filterName), 1);
                    activeFilters.push(objFront);
                }

                Session.set('filterName', 'location'); //check for each active class for helper
                Session.set('activeFilters', activeFilters); //for active filters box
            }
        }
    });

    //clear filters on start
    Session.set('applyFilters',[]);
    Session.set('activeFilters',[]);
    Session.set('hasFilters', false);
    Session.set('locationFilter', false);
    Session.set('priceFilter', false);

    _self.$('.catalogTable').treetable({ expandable: true, indent: 0 });
    // Highlight selected row
    _self.$(".catalogTable tbody").on("mousedown", "tr", function() {
        _self.$(".selected").not(this).removeClass("selected");
        _self.$(this).toggleClass("selected");
    });

});



Template.categoryDetails.events({
    'keyup #geolocation-autocomplete': function(e, t){
        if( e.which == 13 ){
            //e.stopImmediatePropagation();
            callMapSubmit(t);
        }
        else{
            if(e.target.value.match('Search ')){
                t.$('#geolocation-autocomplete').val('');
            }
            else{
                Session.set('oldVal', e.target.value);
            }
        }
    },
    'click .closeIcon':function( e, t ){

        var activeFilters = Session.get('activeFilters');
        var applyFilters = Session.get('applyFilters');
        var filterName = e.currentTarget.attributes.fName.value;
        var filterValue = e.target.attributes.fValue.value;
        var index = _.findIndex(applyFilters, function(filter){
            return filter[filterName] == filterValue
        });
        if( filterName != 'type') {
            applyFilters.forEach(function (filter, index){
                if ( filter && filter["features.values"] && filter["features.values"].$elemMatch ){
                    //if condition match with custom filter
                    if ( filter["features.values"].$elemMatch && filter["features.values"].$elemMatch.name == filterName ){
                        var nestedFilter = filter["features.values"].$elemMatch;
                        if( nestedFilter.values && nestedFilter.values.$in ){
                            if( nestedFilter.values.$in[0] == filterValue ){
                                applyFilters.splice(index, 1);
                            }
                        }
                    }
                }
            })
        }

        if( index !== -1 ){
            applyFilters.splice(index, 1);
        }
        Session.set('applyFilters', applyFilters);
        var index1 = _.findIndex(activeFilters, function(filter){
            return filter.filterName == filterName && filter.filterValue == filterValue
        });
        if( index1 !== -1 ){
            activeFilters.splice(index1, 1);
            Session.set('activeFilters', activeFilters)
        }
    },

    'focus #geolocation-autocomplete': function(e, t){

        let ele = $('#geolocation-autocomplete'),
            elePosition = ele.offset(),
            top = (elePosition.top + ele.outerHeight()) + 'px',
            left = elePosition.left + 'px';
        $('.pac-container').css({display: '', position: 'absolute', left, top, width: '136px'});
    },

    'click .view-type': function(e, t){
        let val = e.target.attributes.view.value;
        let productList = t.$('.productList');
        Session.set('viewType', val);
        productList.removeClass('list grid');
        productList.addClass(val);
        Meteor.users.update({_id: Meteor.userId()}, {$set:{'settings.view': val}})
    },

    'click #previous':( e )=> {
        e.preventDefault();
        var Pages = Session.get('navPages');
        var currentPage = Number(FlowRouter.getQueryParam('page')) || 1;
        var limit = Number(FlowRouter.getQueryParam('limit')) || 12;
        if(currentPage && currentPage != 1){
            FlowRouter.setQueryParams({page: currentPage - 1});
        }
        if( Pages[Pages.length - 1] > 4 ){
            Pages.unshift(Pages[0] - 1);
            Pages.pop();
            Session.set('navPages', Pages);
        }
    },

    'click #next':( e )=> {
        e.preventDefault();
        var Pages = Session.get('navPages');
        var currentPage = Number(FlowRouter.getQueryParam('page')) || 1;
        var limit = Number(FlowRouter.getQueryParam('limit')) || 12;
        currentPage = currentPage || 1;
        if( currentPage * limit  < Session.get('searchCount') ){
            FlowRouter.setQueryParams({page: currentPage + 1});
        }
        if( ((Pages[Pages.length - 1]) * limit) < Session.get('searchCount') ){
            Pages.push(Pages[Pages.length - 1] + 1);
            Pages.shift();
            Session.set('navPages', Pages);
        }

    },

    'change #selectProductPage':( e )=>{
        var limit = e.target.value;
        FlowRouter.setQueryParams({page: 1});
        FlowRouter.setQueryParams({limit: limit});
        updateView()

    },

    'change #selectProductSort': function( e, t ) {
        var d = t.$('#selectProductSort');
        var prodId = d[0].selectedOptions[0].value;
        FlowRouter.setQueryParams({page: 1});
        switch(prodId){
            case "price:asc":
                FlowRouter.setQueryParams({sort: 'bestOffer'});
                FlowRouter.setQueryParams({doReverse: false});
                Session.set('sortClient', 'priceAsc');
                Session.set('sortFilter',{bestOffer: 1});
                break;
            case "price:desc":
                FlowRouter.setQueryParams({sort: 'bestOffer'});
                FlowRouter.setQueryParams({doReverse: true});
                Session.set('sortClient', 'priceDesc');
                Session.set('sortFilter',{bestOffer: -1});
                break;
            case "name:asc":
                FlowRouter.setQueryParams({sort: 'translation.name'});
                FlowRouter.setQueryParams({doReverse: false});
                Session.set('sortClient', 'nameAsc');
                Session.set('sortFilter',{'translation.name': 1});
                break;
            case "name:desc":
                FlowRouter.setQueryParams({sort: 'translation.name'});
                FlowRouter.setQueryParams({doReverse: true});
                Session.set('sortClient', 'nameDesc');
                Session.set('sortFilter',{'translation.name': -1});

                var t ="b";
                break;
            case "popularity":
                FlowRouter.setQueryParams({sort: 'views'});
                FlowRouter.setQueryParams({doReverse: true});
                Session.set('sortClient', 'popularity');
                Session.set('sortFilter',{views: -1});
                break;
            case "new":
                FlowRouter.setQueryParams({sort: 'createdAt'});
                FlowRouter.setQueryParams({doReverse: true});
                Session.set('sortClient', 'new');
                Session.set('sortFilter',{createdAt: -1});
                break;
        }
        updateView();

    },

    'click .activeFilter': function( e ){
        Session.set('hasFilters', true);
        activeFilters = Session.get('activeFilters') || activeFilters;
        applyFilters = Session.get('applyFilters') || applyFilters;
        var objFront = {filterName: e.target.attributes.filterName.value, filterValue: e.target.text};
        var objBack = {};
        var objKey = (e.target.attributes.filterName.value).toLowerCase();
        objBack[objKey] = e.target.text;
        var filtersActive = activeFilters.map(function(x){return x.filterValue});
        var filtersActive2 = activeFilters.map(function(x){return x.filterName});

        // if active filters have not current filter (For frontEnd)
        var searchObj = {
            filterName: e.target.attributes.filterName.value,
            filterValue: e.target.text
        };
        var beforeExists = -1;
        _.each(activeFilters, function(data, i) {
            if (_.isEqual(data, searchObj)) {
                beforeExists = i;
                return;
            }
        });
        if( beforeExists == -1 ){
            activeFilters.push(objFront);
        }
        // if active filters have not current filter (For backEnd)
        var oldIndex = _.findIndex(applyFilters, function(filter){
            return filter[objKey] == e.target.text
        });
        if( objKey == 'type' && oldIndex == -1){
            applyFilters.push(objBack);
        }
        else if( objKey != 'type' && objKey != 'price' ){
            if( beforeExists == -1 ){
                var obj = {};
                var obj2 = {};
                obj2['name'] = objKey;
                obj2['values'] = {$in: [objFront.filterValue]};
                obj['features.values'] = { $elemMatch : obj2};
                applyFilters.push(obj);
            }
        }
        Session.set('filterName', e.target.text); //check for each active class for helper
        Session.set('activeFilters', activeFilters); //for active filters box
        Session.set('applyFilters', applyFilters); //applying filters
    },
    'click .removeBtn': function( e ){
        if( e.target.attributes.filterName){
            if (e.target.attributes.filterName.value == 'price'){
                Session.set('priceFilter', false);
            }
            else if (e.target.attributes.filterName.value == 'location'){
                Session.set('locationFilter', false);
            }
        }

        //removing filter for frontEnd
        activeFilters = Session.get('activeFilters');
        activeFilters.splice(e.target.attributes.index.value, 1);
        Session.set('activeFilters', activeFilters);

        //removing filter for backEnd
        applyFilters = Session.get('applyFilters');
        applyFilters.splice(e.target.attributes.index.value, 1);
        if( applyFilters.length ){
            Session.set('applyFilters', applyFilters);
        }
        else{
            Session.set('applyFilters', []);
        }
        (Session.get('activeFilters') && Session.get('activeFilters').length) || Session.set('hasFilters', false);

    },

    'click #changePage':(e) =>{
        e.preventDefault();
        var page = e.currentTarget.name;
        FlowRouter.setQueryParams({page: page});

        updateView()
    },

    'click #expandButton': function( e ) {
        if(this._id){
            var id = this._id;
        }
        else{
            var id = this.id;
        }
        getMax();
        Meteor.call('getFeatureGroup', id, function(err, res){
            Session.set('availableFeatures', res)
        })
    },


    // Toggle product list Grid/List
    'click .content_sortPagiBar .viewResultsStyle' : function(){
        updateView()
    },



    // Toggle page filter for mobile laptop
    'click .showFiltersButton' : function(e, t){
        t.$('.filtersResults').toggleClass('animated fadeInDown hidden-xs');
    }

});

Template.categoryDetails.helpers({

    selectedLocation: ()=> Session.get('selectedAddress'),

    pageNavigation:()=> {
        return Session.get('navPages');
    },
    searchKeyWord: ()=> {
        $('#top-search').val(FlowRouter.getQueryParam('search'));
        return Session.get('searchKeyWord')
    },

    totalCount: ()=> {
        getProductsCount();
        updateNavigation();
        //update price max value too
        getMax();
        return Session.get('searchCount')
    },

    start: ()=> {
        var start = FlowRouter.getQueryParam('page') || 1;
        var limit = FlowRouter.getQueryParam('limit') || 12;
        start = (start * limit + 1) - limit;
        return start
    },
    limit: ()=> {
        var start = FlowRouter.getQueryParam('page') || 1;
        var limit = FlowRouter.getQueryParam('limit') || 12;
        return Products.find().count() < limit  ? (limit * start) - (limit - Products.find().count()) : limit * start
    },

    categoryListings:()=> {
        return getCategories([Session.get('currentCatId')]);
    },

    hasFilters:()=>{
        return Session.get('hasFilters')
    },

    addActiveClass: (val) => {
        let viewType = Session.get('viewType');
        return val == viewType ? 'active' : '';
    },

    isTop: ( index ) =>{
        return Number(index) == 0
    },


    catName: function( id ){
        var a = Categories.find({
            '_id': id
        }).fetch();
        return getTranslation(a[0].translation, 'name');
    },
    category: () => {
        return Categories.findOne({
            _id: Session.get('currentCatId')
        })
    },
    products: ()=>{

        return Products.find({
            category: Session.get('currentCatId')
        })
    },
    test: ()=>{
        var a;
        if(Session.get('productFilter')){
            a = Session.get('productFilter');
        }
        else{
            a = {
                category: Session.get('currentCatId')
            };
        }
        var b =  Session.get('searchFilter');
        if( b ){
            a[Object.keys(b)[0]] = b[Object.keys(b)];
        }
        var c = Session.get('applyFilters');
        if( c && c.length ){
            //get filter types if available in filters
            var types = _.filter(c, function(obj){
                return obj['type']
            });
            //then remove it from current available values
            c = _.filter(c, function(obj){
                return !obj['type']
            });
            c.length && (a['$and'] = c);
            c.length || delete a.$and;
            types.length && (a['$or'] = types);
            types.length || delete a['$or']
        }
        else{
            a['$and'] && delete a.$and;
            a['$or'] && delete a.$or

        }
        var priceRange = Session.get('priceRangeFilter');
        if( priceRange && Session.get('priceFilter') ){
            var priceIndex = _.findIndex(priceRange, 'bestOffer');
            a['bestOffer'] = priceRange[priceIndex].bestOffer
        }
        else {
            a['bestOffer'] && delete a['bestOffer'];
        }

        var locationFilter = Session.get('locationFilter');
        if ( locationFilter ){
            if( Session.get('vendors') && Session.get('vendors').length ){
                a['user'] = {$in: Session.get('vendors')};
            }
            else{
                if(Session.get('vendors') && Session.get('vendors').length == 0){
                    a['user'] = false;
                }

            }
        }
        else{
            a['user'] && delete a['user'];
        }
        Session.set('countFilter', a);
        return Products.find(a, {
            sort : Session.get('sortFilter'),
            limit: Session.get('limit')
        }).fetch();
    },
    categories: function() {
        return Categories.find({
            _id: Session.get('topCategory')
        });
    },

    availableFeatures: function(){
        return Session.get('availableFeatures');
    },
    filterActive:function(name, value){
        return _.some(Session.get('activeFilters'), function( el ) {
            return el.filterName == [name] && el.filterValue == value;
        } );
    },
    activeClass: function(name, value){
        var activeFilter = _.some(Session.get('activeFilters'), function( el ) {
            return el.filterName == [name] && el.filterValue == value;
        } );
        if( activeFilter ){
            return 'active'
        }
    },
    activePage: function(num){
        if((FlowRouter.getQueryParam('page') || 1) == num){
            return 'currentPage'
        }
    },
    features: function() {
        var currentLanguage = Session.get('currentEditLang') || 'en';
        var selectionChoices = Features.find({}).fetch();
        if(selectionChoices && selectionChoices[0]){
            Session.set('features', selectionChoices[0].translation[currentLanguage]);
            return selectionChoices[0] && selectionChoices[0].translation[currentLanguage];
        }

    },
    name: function() {
        return this.translation[Object.keys(this.translation)[0]].name;
    },
    isActive: function(){
        if(Session.get('filterName') == this.name)
            return Session.get('isActive');
    },
    activeFilters: function(){
        return Session.get('activeFilters');
    }
});


function updateView(){
    setTimeout(function(){
        let viewType;
        if(Session.get('viewType')){
             viewType = Session.get('viewType');
        }
        else{
            let user = Meteor.user();
            viewType = user && user.hasOwnProperty('settings') && user.settings.hasOwnProperty('view') ? user.settings.view : 'grid';
            Session.set('viewType', viewType);
        }


        $('.productList').removeClass('list grid');
        $('.productList').addClass(viewType);

        $('.productList .productListItem').removeClass('col-lg-3 col-md-4 col-sm-6 col-sm-12');
        $('.productList.grid .productListItem').addClass('productListItem col-lg-3 col-md-4 col-sm-6');
        $('.productList.list .productListItem').addClass('productListItem col-sm-12');

        $('.productList .productListItem .left-col').removeClass('col-sm-12 col-lg-2 col-sm-3 ');
        $('.productList.grid .productListItem .left-col').addClass('col-sm-12');
        $('.productList.list .productListItem .left-col').addClass('col-lg-2 col-sm-3');

        $('.productList .productListItem .text-col').removeClass('col-lg-10 col-sm-9 col-sm-12 floatingContent ');
        $('.productList.grid .productListItem .text-col').addClass('col-sm-12 floatingContent ');
        $('.productList.list .productListItem .text-col').addClass('col-lg-10 col-sm-9');

        $('.productList .productListItem .center-col').removeClass('col-sm-12 col-lg-8');
        $('.productList.grid .productListItem .center-col').addClass('col-sm-12');
        $('.productList.list .productListItem .center-col').addClass('col-sm-12 col-lg-8');

        $('.productList .productListItem .right-col').removeClass('col-sm-12 col-lg-4 text-center');
        $('.productList.grid .productListItem .right-col').addClass('col-sm-12 text-center');
        $('.productList.list .productListItem .right-col').addClass('col-sm-12 col-lg-4 text-center');
    }, 200);
}

function getMax(){
    let products = Products.find(Session.get('countFilter')).fetch();
    if( products.length ){

        var prices = _.map(products, 'bestOffer');
        var maxPrice = _.max(prices);
        Session.set('maxPrice', maxPrice);
        var slider = $("#priceFilters").data("ionRangeSlider");
        slider && slider.update({
            max: Session.get('maxPrice')
        });
    }
}


function currentLocation(obj){
    if(obj){
        Session.set('selectedAddress', obj.formatted_address.split(",")[0]);
        if( !Session.get('coords')){
            $('#geolocation-autocomplete').val(Session.get('selectedAddress'));
        }
        Session.set('coords', [obj.lng, obj.lat]);
    }

    return function(){
        if (!obj && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                let geocoder = new google.maps.Geocoder,
                    latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                geocoder.geocode({'location': latLng}, function(results, status) {
                    if (status === 'OK') {
                        if (results[1]) {
                            manuallySetAutocompleteValue(results[1].formatted_address)
                        } else {
                            window.alert('No results found');
                        }
                    } else {
                        window.alert('Geocoder failed due to: ' + status);
                    }
                });
            });
        }
        else{
            manuallySetAutocompleteValue(obj.formatted_address)
        }
    }

}

function manuallySetAutocompleteValue(value){
    $('#geolocation-autocomplete').val(value)
}

function addRecentUrls(arr){
    //remove old places.
    $('.recent-visited').remove();

    Meteor.setTimeout( () => {
        arr.forEach((obj) => {
            $(".pac-container").append(obj.html);
            if(obj.hasOwnProperty('id') && obj.id == 'search-area') $('#' + obj.id).on('mousedown', function(){ $('#geolocation-autocomplete').val('') } );
            else if(obj.hasOwnProperty('id')) $('#' + obj.id).on('mousedown', currentLocation(obj.parameter))
        });
    }, 1000);
}
function addAfterLocateMe(arr){
    //remove old places.
    $('.recent-visited').remove();

    Meteor.setTimeout( () => {
        arr.forEach((obj) => {
            $(obj.html).insertAfter('#user-location');
            if(obj.hasOwnProperty('id') && obj.id == 'search-area') $('#' + obj.id).on('mousedown', function(){ $('#geolocation-autocomplete').val('') } );
            else if(obj.hasOwnProperty('id')) $('#' + obj.id).on('mousedown', currentLocation(obj.parameter))
        });
    }, 1000);
}

function elementObj(obj, i){
    return {
        html: `<div id="most-recent${i}" class="recent-visited pac-item areasearch" ><span class="pac-icon pac-icon-marker"></span><span class="pac-item-query"><span class="pac-matched"></span><strong>${obj.formatted_address}</strong></span> <span></span></div>`,
        id: `most-recent${i}`,
        parameter: obj
    }
}

function sortingClient(array, sort){
    if(array){
        switch (sort) {
            case 'priceAsc':
            {
                array = array.sort(function (a, b) {
                    return (a.bestOffer) - (b.bestOffer);
                });
                break;
            }
            case 'priceDesc':
            {
                array = array.sort(function (a, b) {
                    return (b.bestOffer) - (a.bestOffer);
                });
                break;
            }
            case 'nameAsc':
            {
                array = array.sort(function (a, b) {
                    return (a.translation[0].name.toLowerCase()) - (b.translation[0].name.toLowerCase());
                });
                break;
            }
            case 'nameDesc':
            {
                array = array.sort(function (a, b) {
                    return (b.translation[0].name.toLowerCase()) - (a.translation[0].name.toLowerCase());
                });
                break;
            }
            case 'popularity':
            {
                array = array.sort(function (a, b) {
                    return new Date(b.views) - new Date(a.views);
                });
                break;
            }
            case 'new':
            {
                array = array.sort(function (a, b) {
                    return new Date(b.createdAt) - new Date(a.createdAt);
                });
                break;
            }
        }
    }
    return array
}

function callMapSubmit(t){
    Session.set('selectedAddress', Session.get('oldVal'));
    $('#geolocation-autocomplete').val(Session.get('oldVal'));
    $('#geolocation-autocomplete').trigger("geocode");
}

function getProductsCount(){
    Meteor.call('ProductsCount', Session.get('countFilter') || {}, Session.get('searchKeyWord'), function(err, res){
        res && Session.set('searchCount', res);
        err && Session.set('searchCount', 0);
    })
}

function updateNavigation(){
    var Pages = [1];
    var limit = Number(FlowRouter.getQueryParam('limit')) || 12;
    var nav = Session.get('searchCount') / limit;
    nav = Math.ceil(nav);
    if( nav > 3 ){
        Pages = [1, 2, 3, 4];
    }
    else if( nav > 2 ){
        Pages = [1, 2, 3];
    }
    else if( nav > 1 ){
        Pages = [1, 2];
    }
    Session.set('navPages', Pages);
}
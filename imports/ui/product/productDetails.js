import InfoBox from './../../infobox.js'

var attr_id, getAttrId;


Template.productDetails.onRendered(function() {
                let _self = this;
                // Set height for left side container
               var winW = $(window).width();

               if (winW < 1200) {
             
                 // $('.productDetails .productContainerDetails').css('overflow', 'inherit');

                 _self.$( ".mapOffersContainerSmdevice" ).prependTo( ".productDetails" );


               } else {
                    productContainerDetailsHeight = $(window).height() - $('.topHeader').height();
                    _self.$('.productDetails .productContainerDetails').css('max-height', productContainerDetailsHeight);
                    _self.$('.productDetails .mapSmDeviceHeightSet').css('max-height', productContainerDetailsHeight);
                    _self.$( ".mapOffersContainerSmdevice" ).appendTo( ".productDetails" );

               }

                $(window).resize(function() {
                    var productContainerDetailsHeight = $(window).height() - $('.topHeader').height();
                                   

                   var winW = $(window).width();

                   if (winW < 1200) {
                     // $('.productDetails .productContainerDetails').css('overflow', 'inherit');
                     _self.$('.productDetails .productContainerDetails').css('max-height', 'none');
                     _self.$( ".mapOffersContainerSmdevice" ).prependTo( ".productDetails" );


                   } else {
                    _self.$('.productDetails .productContainerDetails').css('max-height', productContainerDetailsHeight);
                    _self.$('.productDetails .mapSmDeviceHeightSet').css('max-height', productContainerDetailsHeight);

                        _self.$( ".mapOffersContainerSmdevice" ).appendTo( ".productDetails" );

                   }



                });





    getAttrId = function(){
        return Attributes.findOne() &&  Attributes.findOne()._id;
    };

    startAtOffer();

    attr_id = getAttrId;
    Session.set('attr', false);
    Session.set('allAttributes',[]);
    Session.set('combinedValues',[]);
    Session.set('sortFilter',{});
    Session.set('arrayForParams',[]);
    Session.setPersistent('userOffer', Session.get('userOffer') || []);
    Session.set('vendorIds', []);
    Session.set('imgIndex', 0);
    Session.set('currentProductId', FlowRouter.current().params.id);
    Session.set('filterBy', []);
    Session.set('filterIds', []);
    Session.set('modelOpen', false);
    Session.set('defaultZoom', true);
    Session.set('totalPriceArray', []);

    _self.$('.floatingTabsMenu').css({opacity: 0, display: 'none'});

    var config = {
        '.chosen-select'           : {},
        '.chosen-select-deselect'  : {allow_single_deselect:true},
        '.chosen-select-no-single' : {disable_search_threshold:10},
        '.chosen-select-no-results': {no_results_text:'Oops, nothing found!'},
        '.chosen-select-width'     : {width:"95%"}
    };
    for (var selector in config) {
        _self.$(selector).chosen(config[selector]);
    }

    //$("#distanceFilters").ionRangeSlider({
    //    min: 0,
    //    from_fixed: true,
    //    max: 10000,
    //    type: 'double',
    //    postfix: "km",
    //    prettify: false,
    //    hasGrid: true,
    //    onFinish : function (data) {
    //        if( Session.get('coords') ){
    //            Meteor.call('offersByRadius', Session.get('coords') || 1, Number(data.to), (err, res)=>{
    //                Session.set('vendors', _.uniq(_.map(res, '_id')));
    //            });
    //        }
    //    }
    //});

    _self.autorun(function () {
        if (GoogleMaps.loaded()) {
            _self.$("#map-autocomplete").geocomplete()
                .bind("geocode:result", function(event, result){
                    var zoomLevel;
                    if (result.formatted_address.match('Search ')){
                        callMapSubmit();
                        return;
                    }


                    // If the place has a geometry, then present it on a map.
                    if ( result.geometry && result.geometry.viewport ) {
                        GoogleMaps.maps.userDetailsMap.instance.fitBounds(result.geometry.viewport);
                        zoomLevel = GoogleMaps.maps.userDetailsMap.instance.getZoom();
                        updateZoom(zoomLevel);

                    } else {
                        zoomLevel = GoogleMaps.maps.userDetailsMap.instance.getZoom();
                        updateZoom(zoomLevel);
                    }

                    //collect data for location obj.
                    let formatted_address = result.formatted_address,
                        lat = result.geometry.location.lat(),
                        lng = result.geometry.location.lng(),
                        recentLocation = {formatted_address, lat, lng};

                    //center map according to location choose from auto-complete.
                    GoogleMaps.maps.userDetailsMap.instance.setCenter(new google.maps.LatLng(lat, lng));

                    //save location in db.
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

                    let newUrls = Meteor.user().profile.recentUrls, first, second, mostRecent,
                        fields = [
                            {html: `<div id="areasearch" class="recent-visited pac-item areasearch" style="padding: 0;"><label style="background: #ccc; text-align: center; font-weight: normal; margin-bottom: 0; min-width: 100%; color: black;">last location</label></div>`}
                        ];

                    if( newUrls.length > 1 ){
                        [first, second] = newUrls;
                        mostRecent = [first, second];
                    }
                    else{
                        [first] = newUrls;
                        mostRecent = [first];
                    }

                    mostRecent.forEach((obj, i) => {
                        fields.push(elementObj(obj, i))
                    });

                    //add last label in fields array.
                    fields.push({html: `<div id="areasearch" class="recent-visited pac-item areasearch" style="padding: 0;"><label style="background: #ccc; text-align: center; font-weight: normal; margin-bottom: 0; min-width: 100%; color: black;">$google content suggestion</label></div>`});


                    addRecentUrls(fields)

                });
        }
    });

    _self.$('.vendorToolsBar').click(function() {
        _self.$('.vendorToolsBar .faketable .hideM').toggleClass('hidden-sm hidden-xs');
    });

    _self.$('.floatingTabsMenu .closeMenu').click(function() {
        _self.$('.floatingTabsMenu').toggleClass('hidden-sm hidden-xs');
    });

    _self.$('.productContainerDetails').scroll(function(){
        if( _self.$(this).scrollTop() > 850 ) {
            _self.$('.floatingTabsMenu').css({position: 'fixed', top: '0px', width: '65%', 'z-index': '900', opacity:'1 !important'});
            _self.$('.floatingTabsMenu').css('display', 'block');
            _self.$('.floatingTabsMenu').addClass("animated fadeIn");
        } else {
            _self.$('.floatingTabsMenu').css({position: 'static', top: '0px', width: '100%'});
            _self.$('.floatingTabsMenu').removeClass("animated fadeIn");
        }
    });
    _self.$('.productContainerDetails').on('scroll', check_if_in_view);
});




function check_if_in_view() {
    var scrollPos = $('.productContainerDetails').scrollTop();
    var test = $('.link-fun');
    $(test).each(function () {
        var currLink = $(this);
        var refElement = $(currLink.find('a').attr("href"));

        if (refElement.position().top <= (scrollPos - 750) && refElement.position().top + refElement.height() > (scrollPos - 750)) {
            $('.floatingTabsMenu .link-fun').removeClass("active animated fadeIn");
            currLink.addClass("active animated fadeIn");
        }
        else{
            currLink.removeClass("active");
        }
    });
}

Template.productDetails.helpers({

    viewOffers: ()=> {
        var a = Session.get('muchCloseOffer');
        var elem1 = $('#linkToMuchCloseOffer');
        var elem2 = $('#linktoOffers');
        if(elem1[0]){
            return '#linkToMuchCloseOffer'
        }
        else{
            return '#linktoOffers'
        }
    },

    search: 'search',

    offersStarts: ()=>{
        return Session.get('startAt');
    },

    activeSmallImg:( id ) => Session.get('imgIndex') == id ? 'selected-thumbnail' : '',

    categoryListings:() => getCategories([Session.get('categoriesId') && Session.get('categoriesId')[0]], true),

    isTop: ( index ) => Number(index) == 0,

    isVendor: () => Roles.userIsInRole(Meteor.userId(), 'vendor'),


    productImages: () => currentProduct() && currentProduct().images,


    imageIndex: () => currentProduct() && currentProduct().images[Session.get('imgIndex')],


    showImage: function( index ) {
        if(index != Session.get('imgIndex')){
            return 'hidden';
        }
    },


    shareData: function() {
        return {
            title:'Market Place',
            auther: 'Market Place',
            description: 'A French Marketplace',
            summary: 'A French Marketplace',
            url: 'http://marketplace1.herokuapp.com/',
            thumbnail: 'https://s3.eu-central-1.amazonaws.com/marketplacedemomike/test.jpg',
            image: 'https://s3.eu-central-1.amazonaws.com/marketplacedemomike/test.jpg'
        }
    },

    subscribed: ()=> {
        return currentProduct() && currentProduct().subscribers && _.contains(currentProduct().subscribers, Meteor.userId())
    },

    productAttributes: ()=> {
        var attributes = currentProduct() && currentProduct().attributes;
        attributes && (attributes = attributes[Session.get('currentEditLang')]);
        var combined = [];
        var allAttributes = Session.get('allAttributes') || [];
        var combinedValues = Session.get('combinedValues') || [];
        for( var i = 0; i < (attributes && attributes.length); i++){
            let obj = {
                values: []
            };

            for (var key1 in attributes[i]) {
                for (var key in attributes[i][key1]){
                    obj.name = key; // color
                    allAttributes.push(key);
                    obj.values.push(attributes[i][key1][key]);
                }
            }
            combinedValues.concat(obj.values);
            combined.push(obj);
            Session.set('allAttributes', _.uniq(allAttributes));
            Session.set('combinedValues', combinedValues);
        }
        return combined
    },

    Product: currentProduct,

    attributesName: (attr) => getAttributesName(attr),

    attributes: (attr, name) => selectedAttributes(attr, name),

    SourceLang: () => Languages.findOne({isoCode: currentProduct() && currentProduct().source}),

    offerCount:() => {
        var count = Offers.find({
            product: FlowRouter.current().params.id,
            vendor: Meteor.userId(),
            status: true
        }).count();
        return count ? count - 1 : count
    },

    id: ()=> FlowRouter.current().params.id,

    FeatureObj: (featureArr) => {
        if( featureArr ){
            return getTranslation(featureArr) && getTranslation(featureArr).values;
        }
    },

    RelatedProducts: (product) => {
        //get translation object according to current language.
        if(product){
            let nameRegex =  new RegExp(name, "i"),
                productTranslate = getTranslation(product.translation);
            //get name prefix.
            if(productTranslate) {
                let name = productTranslate.name.length > 4 ? productTranslate.name.slice(0, 4) : productTranslate.name.slice(0)
            }
            //generate namePrefix regex.


            //find related products.
            return Products.find({
                _id: {$ne: product._id},
                'translation.language': productTranslate.language,
                'translation.name': {$regex: nameRegex},
                bestOffer: {$lte: (product.bestOffer + 100), $gte: (product.bestOffer - 100)}
            }, {limit: 10, sort: { bestOffer: -1 }});
        }
    },

    SimilarProducts: (product) => {
        //find similar products.
        if(product){
            var id = product && product._id;
            return Products.find({
                _id: {$ne: product._id},
                category: {$in: product.category}
            }, {limit: 10, sort: { bestOffer: -1 }});
        }
    },

    productOffers: (attr) => {

        let query = {status: true};
        if(Session.get('selectedCountry')){
            let carrier = Carrier.find({'ranges.allowedCountry.countryId': Session.get('selectedCountry')},{fields: {_id:1}}).map( (obj) => obj._id);
            query.shipping = { $in: carrier};
        }

        if( Session.get('filterIds') &&  Session.get('filterIds').length ){
            query['combId'] = {'$in' : Session.get('filterIds')}
        }
        else{
            query['combId'] && delete query['combId']
        }

        if(Session.get('mapOffers')){
            google.maps.event.trigger(GoogleMaps.maps.userDetailsMap.instance, 'idle');
            return Session.get('mapOffersData');

        }
        else{
            query.product = FlowRouter.current().params.id;
            return Offers.find(query, {sort: Session.get('sortFilter')});
        }
    },

    muchCloseOffer: () => {

        let query = {status: true, product: FlowRouter.current().params.id, location: {$near: [Session.get("userLocation").latitude, Session.get("userLocation").longitude]}};
        if (Session.get('filterIds') && Session.get('filterIds').length){
            query['combId'] = {'$in' : Session.get('filterIds')}
        }

        Session.set('muchCloseOffer', [ ReactiveMethod.call("getMuchCloseOffer", query) ]);
        return [ ReactiveMethod.call("getMuchCloseOffer", query) ];
    },

    findOffers: () => {
        return Session.get('findOffers');
    },

    selectPrice: (ranges, weight, id) => {

        if(ranges.length){
            let priceObj = ranges.find((obj) => {
                return Number(obj.min) <= weight && Number(obj.max) >= weight;
            });
            id ? $(id).trigger('change') : $('.selectedPrice').trigger('change');
            return priceObj ? priceObj.allowedCountry[0].price : 0;
        }
        else{
            return 0;
        }
    },
    addPrice: (price, index) => {
        let totalPriceArray = Session.get('totalPriceArray');
        let shippingPrice = $('#total-price' + index).val() || 0;
        return Number(shippingPrice) + Number(price);
    },

    shippingPrice: (index) => {
        let shippingPrice = $('#total-price' + index).val() || 0;
        return Number(shippingPrice)
    },

    addPriceSelected: (price) => {
        let shippingPrice = Session.get('selectedOfferShipping') || 0;
        return Number(shippingPrice) + Number(price);
    },
    selectedShippingPrice: () => {
        let shippingPrice = Session.get('selectedOfferShipping') || 0;
        return Number(shippingPrice);
    },

    calculateDistance: (id) => {

        //get offer's vendor location.
        const vendorLocation = Meteor.users.findOne({_id: id}) && Meteor.users.findOne({_id: id}).profile.address[0] && Meteor.users.findOne({_id: id}).profile.address[0].location;

        //checking map is ready.
        GoogleMaps.ready('userDetailsMap', () => {

            //get current user location object.
            if(vendorLocation && Session.get("userLocation").hasOwnProperty("latitude")){

                const userLocation = [Session.get("userLocation").longitude, Session.get("userLocation").latitude];
                let origin = new google.maps.LatLng(userLocation[1], userLocation[0]),
                    destination = new google.maps.LatLng(vendorLocation[1], vendorLocation[0]),
                    service = new google.maps.DistanceMatrixService();

                service.getDistanceMatrix({
                    origins: [origin],
                    destinations: [destination],
                    travelMode: 'DRIVING',
                    avoidHighways: true,
                    avoidTolls: true
                }, (response, status) => {
                    if(status == 'OK'){
                        let distanceArr = Session.get('offersDistance'),
                            distance = response.rows[0].elements[0].distance && response.rows[0].elements[0].distance.text;
                        distanceArr.push({id, distance});
                        Session.set('offersDistance', distanceArr);
                    }
                });
            }
        });
        return '';
    },

    getDistance: (id) => {
        if(Session.get('offersDistance').length) return Session.get('offersDistance') && Session.get('offersDistance').find((obj) => obj.id == id) && Session.get('offersDistance').find((obj) => obj.id == id).distance;
    },

    shippingOffers: function(){
        return Carrier.find({
            _id: {$in: this.shipping || []}
        }).fetch();
    },

    vendorProfile: function() {
        return Meteor.users.findOne({
            _id: this.vendor
        }) && Meteor.users.findOne({
            _id: this.vendor
        }).profile;
    },

    flag : function() {
        return Meteor.users.findOne({
                _id: this.vendor
            }) && Meteor.users.findOne({
                _id: this.vendor
            }).profile.country
    },

    userDetailsMapOptions: function() {
        // Make sure the maps API has loaded
        if (GoogleMaps.loaded()) {
            // Map initialization options
            return {
                center: new google.maps.LatLng(46.227638, 2.213749),
                zoom: 10,
                scrollwheel: false,
                zoomControlOptions: {
                    position: google.maps.ControlPosition.LEFT_CENTER
                }
            };
        }
    },

    mapDemo2Options: function() {
        // Make sure the maps API has loaded
        if (GoogleMaps.loaded()) {
            // Map initialization options

            GoogleMaps.ready('mapDemo2', (map) => {

                //Declaration.
                var directionsDisplay, directionsService, vendorId, start, end, bounds, request, vendorAddress;


                vendorId = Session.get('muchCloseOffer')[0].vendor;
                vendorAddress = getUserAddress(vendorId);
                if(vendorAddress.hasOwnProperty('location')){
                    directionsDisplay = new google.maps.DirectionsRenderer();
                    directionsService = new google.maps.DirectionsService();
                    start = new google.maps.LatLng(Session.get("userLocation").latitude, Session.get("userLocation").longitude);
                    end = new google.maps.LatLng(vendorAddress.location[1], vendorAddress.location[0]);
                    bounds = new google.maps.LatLngBounds();

                    directionsDisplay.setMap(map.instance);
                    bounds.extend(start);
                    bounds.extend(end);
                    map.instance.fitBounds(bounds);
                    request = {
                        origin: start,
                        destination: end,
                        travelMode: google.maps.TravelMode.DRIVING
                    };
                    directionsService.route(request, function (response, status) {
                        if (status == google.maps.DirectionsStatus.OK) {
                            directionsDisplay.setDirections(response);
                            directionsDisplay.setMap(map.instance);
                        } else {
                            alert("Directions Request from " + start.toUrlValue(6) + " to " + end.toUrlValue(6) + " failed: " + status);
                        }
                    });
                }

            });

            return {
                center: new google.maps.LatLng(46.227638, 2.213749),
                zoom: 10,
                zoomControlOptions: {
                    position: google.maps.ControlPosition.LEFT_CENTER
                }
            };
        }
    },

    countries: () => Countries.find().fetch()

});

Template.productDetails.onCreated(function() {
    let _self = this;
    //set values in session.
    Session.set('mapOffers', false);
    Session.set('offersDistance', []);

    $('.pac-container').remove();

    //checking map is ready



    GoogleMaps.ready('userDetailsMap', (map) => {
        import InfoBox from './../../infobox.js'
        function getoffers(){
            let query = {status: true},
                bounds = map.instance.getBounds(),
                southWest = bounds.getSouthWest(),
                northEast = bounds.getNorthEast(),
                bound = [ [southWest.lat(), southWest.lng()], [northEast.lat(), northEast.lng()] ];

            //update Query object.
            query.location = { '$geoWithin': { '$box': bound } };
            if ( Session.get('filterIds') && Session.get('filterIds').length){
                query['combId'] = {'$in' : Session.get('filterIds')}
            }
            else{
                query['combId'] && delete query['combId']
            }
            //if (Session.get('distanceFilter')) {
            //    query
            //}
            //else {
            //
            //}

            //get local offers according to map bounds.
            Meteor.call('getLocalOffers', query, (err, res) => {
                let findOffers = res.length;
                //findOffers && Session.set('muchCloseOffer', res.splice(0, 1));
                Session.set('findOffers', findOffers);
                Session.set('mapOffersData', res);

                //remove previous infoBox from Dom.
                _self.$('.info-Box-Style').remove();

                res.forEach((obj, i) => {

                    var secheltLoc = new google.maps.LatLng(obj.location.lat, obj.location.lon);
                    var labelText = `$ ${Math.round(obj.price).toString()}`;

                    var boxText = document.createElement('div');
                    boxText.id = 'boxText' + i;
                    boxText.innerHTML = labelText;


                    var myOptions = {
                        content: boxText
                        ,boxClass: "info-Box-Style"
                        ,disableAutoPan: true
                        ,pixelOffset: new google.maps.Size(-25, 0)
                        ,position: secheltLoc
                        ,closeBoxURL: ""
                        ,isHidden: false
                        ,pane: "floatPane"
                        //,pane: "mapPane"
                        ,enableEventPropagation: true
                    };

                    let iBox = new InfoBox(myOptions);
                    iBox.open(map.instance);

                    google.maps.event.addListener(iBox,'domready',function(){
                        _self.$("#" + boxText.id).on('click', function(){
                            infoClicked(obj._id);
                        });
                    });
                });
            });
        }

        //for first time call.
        getoffers();

        //add idle event on map.
        map.instance.addListener('idle', getoffers);

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

        //check if recent location exists then push into fields array.
        if( recentUrls.length ){
            let mostRecent, first, second;
            if( recentUrls.length > 1 ){
                [first, second] = recentUrls;
                mostRecent = [first, second];
            }
            else{
                [first] = recentUrls;
                mostRecent = [first];
            }
            fields.push({html: `<div id="areasearch" class="recent-visited pac-item areasearch" style="padding: 0;"><label style="background: #ccc; text-align: center; font-weight: normal; margin-bottom: 0; min-width: 100%; color: black;">last location</label></div>`});
            mostRecent.forEach((obj, i) => {
                fields.push(elementObj(obj, i))
            })
        }

        //add last label in fields array.
        fields.push({html: `<div id="areasearch" class="recent-visited pac-item areasearch" style="padding: 0;"><label style="background: #ccc; text-align: center; font-weight: normal; margin-bottom: 0; min-width: 100%; color: black;">$google content suggestion</label></div>`});



        //setTimeout(function(){

        addRecentUrls(fields);

        //}, 500);
    });
});

Template.productDetails.events({

    'keyup #map-autocomplete': function(e, t){
        if( e.which == 13 ){
            //e.stopImmediatePropagation();
            callMapSubmit(t);
        }
        else{
            if(e.target.value.match('Search ')){
                t.$('#map-autocomplete').val('');
            }
            else{
                Session.set('oldVal', e.target.value);
            }
        }
    },

    'click #addcombination': ()=> {
        Session.set("modelOpen", true)
    },
    'click #closeModel': ()=> {
        Session.set("modelOpen", false)
    },
    'click #closeBtn': ()=> {
        Session.set("modelOpen", false)
    },

    'click .fb-share':function(e){
        e.preventDefault();
        FB.ui({
            method: 'share',
            href: 'http://marketplace1.herokuapp.com/'
        }, function(response){});
    },

    'click .offership': function(e, t){
        e.preventDefault();
    },

    'click .leftControl': function(e, t){
        let index = Session.get('imgIndex');
        if( index == 0 ) index = ( currentProduct().images.length - 1 );
        else index -= 1;
        Session.set('imgIndex', index);
    },

    'click .rightControl': function(e, t){
        let index = Session.get('imgIndex');
        if( index >= ( currentProduct().images.length -1 ) ) index = 0;
        else index += 1;
        Session.set('imgIndex', index);
    },

    'focus #map-autocomplete': function(e, t){

        let ele = t.$('#map-autocomplete'),
            elePosition = ele.offset(),
            top = (elePosition.top + ele.outerHeight()) + 'px',
            left = elePosition.left + 'px';
        t.$('.pac-container').css({display: '', position: 'absolute', left, top, width: '136px'});
    },


    'change .combinationsSelect': function(e, t){
        var filterBy = Session.get('filterBy');
        var oldValue = _.findIndex(filterBy, {name: e.target.name});
        if ((!e.currentTarget.value) || e.currentTarget.value == ''){
            ((index != -1) && filterBy.splice(index, 1));
            Session.set('filterBy', filterBy);
        }
        else{
            if ( oldValue == -1 ){
                filterBy.push({
                    name: e.target.name,
                    value: e.currentTarget.value
                });
            }
            else{
                filterBy[oldValue].value = e.currentTarget.value;
            }
        }

        var totalCount = filterBy.length;
        Session.set('filterBy', filterBy);
        var filteredIds = [];
        var filteredCombinations = getDocument(FlowRouter.current().params.id, Products).combinations;
        if( filteredCombinations && filteredCombinations.length ){
            var index = findSearchIndexes(filteredCombinations, Session.get('currentEditLang'), 'language');
            var s = filteredCombinations[index];
            if( s.values && s.values.length ){
                for (var i = 0; i < s.values.length; i++){
                    var count = 0;
                    for (var j = 0; j < s.values[i].combination.length; j++)
                        for(var k = 0; k < filterBy.length; k++){
                            if(filterBy[k].name == s.values[i].combination[j].attribute && filterBy[k].value == s.values[i].combination[j].value){
                                count++
                            }
                        }
                    if( count == totalCount ) {
                        filteredIds.push(s.values[i].combId)
                    }
                }
            }
            Session.set('filterIds', filteredIds);
            google.maps.event.trigger(GoogleMaps.maps.userDetailsMap.instance , 'idle')
        }
    },

    'change #map-checkbox': function(e, t){
        e.preventDefault();
        Session.set('mapOffers', t.$('#map-checkbox')[0].checked);
    },

    'change #selectCountry': function(e, t){
        e.preventDefault();

        let selectedCountry = Countries.findOne({name: t.$('#selectCountry').val()});

        if(selectedCountry){
            Session.set('selectedCountry', selectedCountry._id);
        }
        else{
            Session.set('selectedCountry', '');
        }
    },

    'change .selectedPrice': function(e, t){
        e.preventDefault();

        let totalPriceArray = Session.get('totalPriceArray');
        totalPriceArray[e.target.attributes.index.value] = e.target.value;
        Session.set('totalPriceArray', totalPriceArray);
    },

    'change #selected-offer': function(e, t){
        e.preventDefault();

        let selectedOfferShipping = Session.get('selectedOfferShipping');
        selectedOfferShipping = t.$('#selected-offer').val() || 0;
        Session.set('selectedOfferShipping', selectedOfferShipping);
    },

    'change #selectProductSort': function(e, t){

        e.preventDefault();
        var d = t.$('#selectProductSort');
        var prodId = d[0].selectedOptions[0].value;
        switch(prodId){
            case "basePrice:asc":
                FlowRouter.setQueryParams({sort: 'price'});
                FlowRouter.setQueryParams({doReverse: false});
                Session.set('sortFilter',{price: 1});
                break;
            case "basePrice:desc":
                FlowRouter.setQueryParams({sort: 'price'});
                FlowRouter.setQueryParams({doReverse: true});
                Session.set('sortFilter',{price: -1});
                break;
            case "totalPrice:asc":
                FlowRouter.setQueryParams({sort: 'grossPrice'});
                FlowRouter.setQueryParams({doReverse: false});
                Session.set('sortFilter',{grossPrice: 1});
                break;
            case "totalPrice:desc":
                FlowRouter.setQueryParams({sort: 'grossPrice'});
                FlowRouter.setQueryParams({doReverse: true});
                Session.set('sortFilter',{grossPrice: -1});
                break;
            case "name:asc":
                FlowRouter.setQueryParams({sort: 'vendorName'});
                FlowRouter.setQueryParams({doReverse: false});
                Session.set('sortFilter',{'vendorName': 1});
                break;
            case "name:desc":
                FlowRouter.setQueryParams({sort: 'vendorName'});
                FlowRouter.setQueryParams({doReverse: true});
                Session.set('sortFilter',{'vendorName': -1});
                break;
            default :{
                break;
            }
        }

    },

    'click #addvalue':function( e, t ){
        e.preventDefault();
        var at = Session.get('allAttributes');
        let params = currentProduct ();
        let data = params.attributes[Session.get('currentEditLang')];
        if( at && at.length ){
            for(var i = 0; i < at.length; i++){
                let name = at[i];
                let obj = {};
                //obj.name = name;
                if( t.$('#'+ at[i]).val() ){
                    obj[name] = t.$('#'+ at[i]).val();
                    data[i].push(obj)
                }
            }
        }

        params.attributes[Session.get('currentEditLang')] = data;
        params.user = Meteor.userId();
        params.language = getLanguageName(Session.get('currentEditLang'));
        params.status = "pending";

        params.product = params._id;
        //TODO delete through iteration OR use _.pick
        delete params._id;
        delete params.combinations;
        delete params.weight;
        delete params.source;
        delete params.offersCount;
        delete params.avgOffer;
        delete params.bestOffer;
        delete params.commission;
        delete params.published;
        delete params.uin;
        delete params.views;
        delete params.company;
        delete params.createdAt;
        delete params.account;
        delete params.isMapped;
        delete params.subscribers;
        delete params.mapProducts;
        delete params.contributions;

        //var params2 = {
        //    id: attr_id,
        //    attributes: {}
        //};
        //
        ////For translation of attributes available
        //var temp = [];
        //var allAttributes = [];
        //var enAttributes = '';
        //var comb = $available.jstree().get_json('#');
        //if(comb.length) {
        //    for (var a = comb.length; a > 0; a--) {
        //        forLoopValue(a);
        //    }
        //    function forLoopValue(n) {
        //        for (var x = n - 1; x < n; x++) {
        //            for (var y = 0; y < comb[x].children.length; y++) {
        //                myComb = comb[x].text;
        //                myCombChild = comb[x].children[y].text;
        //                temp.push(' <chocha> '+myComb+' <chocha/> '+myCombChild+' <chocha> ');
        //            }
        //            allAttributes[x] = (' <$chocha> '+temp+' <$chocha> ');
        //            enAttributes = allAttributes[x] + enAttributes;
        //            temp = [];
        //        }
        //    }
        //}
        //
        //availableLanguages = getLangCodes();
        //Meteor.call('yandexTranslate', enAttributes, Session.get('currentEditLang') || 'en', getLangCodes(), function( err, result ){
        //    if(err){
        //        swal({
        //            title: "translation Failed!",
        //            text: err.message,
        //            type: "error"
        //        });
        //        return;
        //    }
        //    if( result ){
        //        for ( var key in result ){
        //            if( result.hasOwnProperty( key )) {
        //                params.attributes[key] = translateAttributes(result[key].text.toString());
        //            }
        //        }
        //    }
        //    Meteor.call('createAttribute', params2, function(err, id) {
        //        if (err) {
        //            swal({
        //                title: "Failed!",
        //                text: err.message,
        //                type: "error"
        //            });
        //        }
        //        attr_id = id;
        //    });
        //});


        Meteor.call('addNewContribution', params, function (err) {
            if(err){
                swal({
                    title: "Problem",
                    text: "Problem processing request !",
                    type: "error"
                })
            }else{
                Session.set("modelOpen", false);
                t.$('#addNewCombinationModal').modal('hide');
                swal('Updated Succussfully')
            }
        })
    },

    'click #subscribe': function(e, t){
        e.preventDefault();
        var _id  = FlowRouter.current().params.id;
        Meteor.call('subscribed', _id, function(err) {
            if (err) {
                toastr.error('We are sorry but something went wrong.');
                return;
            }
            toastr.info('The Product is now subscribed!');
        });

    },

    'click #unSubscribe': function(e, t){
        e.preventDefault();
        var _id  = FlowRouter.current().params.id;
        Meteor.call('unsubscribeProduct', _id, function(err) {
            if (err) {
                toastr.error('We are sorry but something went wrong.');
                return;
            }
            toastr.success('The Product is now unSubscribed.');
        });

    },

    'click #selectOffer': function(){

        var offerId = this._id;

        var vendorIds = Session.get('vendorIds') || [];

        var userOffer = Session.get('userOffer') || [];

        var offerIndex = _.findIndex(userOffer, function(obj){
            return obj.offer == offerId;
        });
        if(offerIndex != -1){
            userOffer[offerIndex].qty++;
            Session.setPersistent('userOffer', userOffer);
            toastr.success("Offer quantity increased in cart");
            return;
        }

        vendorIds.push({vendorId: this.vendor});

        userOffer.push({offer: this._id, product: this.product, vendorId: this.vendor, qty: 1});

        Session.setPersistent('vendorIds', vendorIds);

        Session.setPersistent('userOffer', userOffer);

        var totalItems = Session.get('userOffer').length;

        toastr.success(totalItems + " Offer add to cart");
    },

    'click #proImages': function( e ){
        e.preventDefault();
        var index = parseInt(e.currentTarget.attributes.index.value);
        Session.set('imgIndex', index);
    },

        // Toggle product page map for mobile laptop
    'click .showSearchFormBt' : function(e , t){
        t.$('.searchOffersContent').toggleClass('animated fadeInDown hidden-xs hidden-sm');
        t.$('.showSearchFormBt').toggleClass('focus');
        t.$('.searchOffersContent #map-autocomplete').focus();
    },

        // Toggle product page map for mobile laptop
    'click .showVendorToolBtn' : function(e, t){
        t.$('.vendorToolsBar .hideM').toggleClass('hidden-sm hidden-xs');
        t.$('.vendorToolsBar .showVendorToolBtn .pull-right i').toggleClass('fa fa-minus-square fa fa-plus-square');
    },   

        // Toggle product page map for mobile laptop
    'click .showOffersBtn' : function(e, t){
        t.$('.showOffersBtn').addClass('active');
        t.$('#linktoOffers').toggleClass('hidden-xs');
        t.$('#linktoOffers .offerContent').toggleClass('animated fadeInUp');
    },    

    'click .showDescriptionBtn' : function(e, t){

        t.$('#linktoDescription, #linkTutorial, #linkRelatedProducts').addClass('hidden-xs hidden-sm');

        t.$('.showDescriptionBtn').addClass('active');
        t.$('#linktoDescription').toggleClass('hidden-xs animated fadeInUp');
    },    
    'click .showTutorialBtn' : function(e, t){
        t.$('#linktoDescription, #linkTutorial, #linkRelatedProducts').addClass('hidden-xs hidden-sm');

        t.$('.showTutorialBtn').addClass('active');
        t.$('#linkTutorial').toggleClass('hidden-xs animated fadeInUp');
    },    
    'click .showRelatedProductsBtn' : function(e, t){
        t.$('#linktoDescription, #linkTutorial, #linkRelatedProducts').addClass('hidden-xs hidden-sm');

        t.$('.showRelatedProductsBtn').addClass('active');
        t.$('#linkRelatedProducts').toggleClass('hidden-xs animated fadeInUp');
    },   

        'click .mobileTabs .btn' : function( e, t){
        t.$(e.target).removeClass('active');
    }



});

function  currentProduct () {
    let product = Products.findOne({
        _id: Session.get('currentProductId')
    });

    if( product ){
        Session.set('categoriesId', product.category);
        Session.set('attr', product.attributes);
    }
    return product;
}

function getLanguageName (params){
    return Languages.findOne({
        isoCode: params
    }).name
}

function manuallySetAutocompleteValue(value){
    $('#map-autocomplete').val(value);
}

function currentLocation(obj){
    //let data = obj;
    return function(){
        if (!obj && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                let geocoder = new google.maps.Geocoder,
                    latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                GoogleMaps.maps.userDetailsMap.instance.setCenter(latLng);
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
            GoogleMaps.maps.userDetailsMap.instance.setCenter(new google.maps.LatLng(obj.lat, obj.lng));
            var newZoom = GoogleMaps.maps.userDetailsMap.instance.getZoom() + 1;
            updateZoom(newZoom);
            manuallySetAutocompleteValue(obj.formatted_address)
        }
    }
}

function addRecentUrls(arr){

    //remove old places.
    $('.recent-visited').remove();

    arr.forEach((obj) => {
        $(".pac-container").append(obj.html);
        if(obj.hasOwnProperty('id') && obj.id == 'search-area') $('#' + obj.id).on('mousedown', function(){ $('#map-autocomplete').val('');  GoogleMaps.maps.userDetailsMap.instance.setZoom(0) } );
        else if(obj.hasOwnProperty('id')) $('#' + obj.id).on('mousedown', currentLocation(obj.parameter))
    });
    //$('#map-autocomplete').trigger( "focus" );

}

function elementObj(obj, i){
    return {
        html: `<div id="most-recent${i}" class="recent-visited pac-item areasearch" ><span class="pac-icon pac-icon-marker"></span><span class="pac-item-query"><span class="pac-matched"></span><strong>${obj.formatted_address}</strong></span> <span></span></div>`,
        id: `most-recent${i}`,
        parameter: obj
    }
}

function callMapSubmit(t){
    let element = $('#map-autocomplete');
    element.val(Session.get('oldVal'));
    element.trigger("geocode");
}

function updateZoom(zoom){
    if ( zoom < 10 ){
        GoogleMaps.maps.userDetailsMap.instance.setZoom(zoom + 1);
    }
}

function startAtOffer(){
    Meteor.call('minOffer', FlowRouter.current().params.id, (err, res)=> {
        if (res && res[0]){
            Session.set('startAt', res[0].minPrice)
        }
    })
}


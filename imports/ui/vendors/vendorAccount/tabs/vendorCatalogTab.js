
Template.vendorCatalogTab.onRendered(()=> {
    Session.set('preLoaded', [])
});

Template.vendorCatalogTab.helpers({


    //All Products top loop
    Products: () => Products.find({
        views: 2
        //user: Meteor.userId()
    }),

    //top row and main offer table
    mainOffer: (productId)=> {
        return Offers.findOne({
            product: productId,
            main: true
        });
    },

    //get inherited values from main offer with dynamic key
    inherited: (productId, key) => {
        var offer = Offers.findOne({
            product: productId,
            main: true
        });
        return offer && offer[key]
    },

    //display the total length of total combination of a product
    totalCombination(combinations){
        if ( combinations && combinations.length ){
            var index = _.findIndex(combinations, (obj) => {
                return obj.language == Session.get('currentEditLang')
            });
            return index != -1 ? combinations[index].values.length -4 : 0
        }
    },

    //display product combinations of current selected languages
    productCombinations: (combinations, id)=> {
        if ( combinations && combinations.length ){
            var index = _.findIndex(combinations, (obj) => {
                return obj.language == Session.get('currentEditLang')
            });
            if ( index != -1 ) {
                //if all combination loaded combinations
                if( Session.get('preLoaded').includes(id) ){
                    return combinations[index].values
                }
                //else just preview top 4 combinations
                return combinations[index].values.slice(0, 4);
            }
        }
    },

    //display all or few combination count based on preLoaded conditions
    preloaded: ( id )=> Session.get('preLoaded').includes(id),

    //get offer for each related combination
    offer: ( offerId )=> getDocument(offerId, Offers)
});

Template.vendorCatalogTab.events({

    'click .loadMore': (e) => {
        var preLoaded = Session.get('preLoaded');
        preLoaded.push(e.target.attributes.product.value);
        Session.set('preLoaded', preLoaded)
    },

    'keyup #vendorFilter': function(e, t){
        //if( e.which == 13 ){
        //    e.preventDefault();
            //var results = Session.get('textSearch');
            //if (results && results.length){
            //    FlowRouter.go('/search/' + results[0].category + '?search=' + t.$('#top-search').val())
            //}
            //else{
            //    FlowRouter.go('/search/' + Session.get('defaultCat')._id + '?search=' + t.$('#top-search').val())
            //}
        //}
    },

    'click .hideMore': (e) => {
        var preLoaded = Session.get('preLoaded');
        preLoaded.splice(preLoaded.indexOf(e.target.attributes.product.value), 1);
        Session.set('preLoaded', preLoaded)
    },

    'click .deleteOffer': (e) => {
        var id = e.target.attributes.offerId.value;
        swal({
            title: "Are you sure?",
            text: "it will remove all existing offers for that product",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, remove it!",
            closeOnConfirm: false
        }, function () {
            Meteor.call('removeOffer', id, function(err) {
                if (err) {
                    swal({
                        title: "Failed!",
                        text: err.message,
                        type: "error"
                    });
                    return;
                }
                swal("Removed!", "The Offer is now removed.", "success");
            });
        });
    }
});

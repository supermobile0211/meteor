var getAlignmentInterVal;

Template.vendorToolsMyOffers.onRendered(()=> {

    Session.set('inheritedQuantity', 0);
    Session.set('inheritedPrice', 0);
    Session.set('inheritedAlign', 0);
    Session.set('filterBy', {});
    Session.set('changed', false);
    Session.set('isSession', true);

    var config = {
        '.chosen-select'           : {},
        '.chosen-select-deselect'  : {allow_single_deselect:true},
        '.chosen-select-no-single' : {disable_search_threshold:10},
        '.chosen-select-no-results': {no_results_text:'Oops, nothing found!'},
        '.chosen-select-width'     : {width:"95%"}
    };
    for (var selector in config) {
        $(selector).chosen(config[selector]);
    }

    // Tooltips demo
    $("[data-toggle=tooltip]").tooltip();
    setInheritedValues();

    setSessionOffers();


});

Template.vendorToolsMyOffers.helpers({

    mainOffer: ()=> {
      return Offers.findOne({
          product: FlowRouter.current().params.id,
          main: true
      });
    },
    mainOfferStatus:()=>{
        var mainOfferIndex = findSearchIndexes(Session.get('totalOffers'), true, 'main');
        if (mainOfferIndex != -1){
            return !Session.get('totalOffers')[mainOfferIndex].status
        }
    },

    offer: ( id )=> {
        if( Session.get('totalOffers') && Session.get('totalOffers').length ){
            return getCurrentOffer(id)
        }
        else{
            var totalOffers = Offers.find({
                product: FlowRouter.current().params.id
            }).fetch();
            Session.setPersistent('totalOffers', totalOffers);
            return getCurrentOffer(id)
        }
    },

    inheritedQuantity: ()=> {
        return Session.get('inheritedQuantity');
    },
    inheritedPrice: ()=> {
        return Session.get('inheritedPrice');
    },

    combinations: ()=> {
        var product = Products.findOne({
            _id: FlowRouter.current().params.id
        });
        var combinations = product && product.combinations;
        if ( combinations && combinations.length ){
            var index = _.findIndex(combinations, (obj) => {
                return obj.language == Session.get('currentEditLang')
            });
            if ( index != -1 ) {

                let combinationArray = combinations[index] && combinations[index].values,
                    filterBy = Session.get('filterBy') || {};

                for(let key in filterBy){
                    combinationArray = combinationArray.filter((obj) => {
                        for(let i = 0; i < obj.combination.length; i++){
                            if(_.isEqual(obj.combination[i], {attribute: key, value: filterBy[key]})) return obj
                        }
                    })
                }

                return combinationArray;
            }
        }
    },

    product: ()=> {
        return Products.findOne({_id: FlowRouter.current().params.id});
    },

    isTrue: (index)=> {
        return index === 0;
    },

    attributesName: (attr) => {
        //Session.setPersistent('attributes', []);
        return getAttributesName(attr)
    },

    attributes: (attr, name) => {
        return selectedAttributes(attr, name)
    }

});

Template.vendorToolsMyOffers.events({
    'change #mainOfferStatus': function(e, t){
        getParentValue('status', e.target.checked, this._id)
    },
    'change #mainOfferQuantity': function(e, t){
        getParentValue('quantity', e.target.value, this._id)
    },
    'change #mainOfferPrice': function(e, t){
        getParentValue('price', e.target.value, this._id, this._id)
    },
    'change #mainOfferAlign': function(e, t){
        getParentValue('alignToOffer', e.target.checked, this._id)
    },
    'change .chosen-select': function(e, t){

        let filterBy = Session.get('filterBy'),
            keyName = e.currentTarget.attributes.name.value,
            keyValue = e.currentTarget.value;

        keyValue ? filterBy[keyName] = keyValue : delete filterBy[keyName];
        Session.set('filterBy', filterBy);

    },

    'click #save': function( e, t ){
        Meteor.clearInterval(getAlignmentInterVal);

        Session.set('changed', true);
        Session.set('isSession', true);
        var offers = inheritIfEmptyValue(t);
        let length = offers.length;
        if( offers && offers.length ){
            offers.forEach((offer, index)=>{
                Meteor.call('vendorToolsUpdate', offer._id, offer, function(err){
                    offers.shift();
                    if (err) {

                    }
                    if(!offers.length){
                        toastr.success('all Offers Successfully updated');
                        Session.set('changed', false);
                        setSessionOffers();
                        //history.back();
                    }
                })
            });
        }

    },

    'change .offer-status': function( e ){
        var index = getCurrentIndex(this._id);
        var totalOffers = Session.get('totalOffers');
        totalOffers[index].status = e.target.checked;
        Session.setPersistent('totalOffers', totalOffers);
    },

    'change #qty': function( e ){
        var index = getCurrentIndex(this._id);
        var totalOffers = Session.get('totalOffers');
        totalOffers[index].quantity = e.target.value;
        Session.setPersistent('totalOffers', totalOffers);
    },

    'change #productAlignPrice': function(e, t){
        Session.set('isSession', false);
        var index = getCurrentIndex(this._id);
        var totalOffers = Session.get('totalOffers');
        totalOffers[index].alignToOffer = e.target.checked;
        if ( e.target.checked ){
            Meteor.call('avgCombination', this.product, this.combId, this._id, (err, result)=> {
                if(result && result.length){
                    var priceAlign = Number(Number(result[0].priceAlign).toFixed(2));
                    var bestOffer = Number(Number(result[0].minPrice).toFixed(2));
                    totalOffers[index].avgOffer = priceAlign;
                    totalOffers[index].price = priceAlign;
                    totalOffers[index].bestOffer = bestOffer;
                }
                Session.setPersistent('totalOffers', totalOffers);
            });
        }
        else{
            Session.setPersistent('totalOffers', totalOffers);
        }
    },

    'change #vendorPrice': function(e, t){
        var index = getCurrentIndex(this._id);
        var totalOffers = Session.get('totalOffers');
        if( e.target.value && e.target.value != 0 ){
            totalOffers[index].price = e.target.value;
            Session.setPersistent('totalOffers', totalOffers);
        }
    }
});

Template.vendorToolsMyOffers.onDestroyed(()=>{
    Meteor.clearInterval(getAlignmentInterVal);
});

getParentValue =(key, value, id)=> {
    Session.set('isSession', false);
    var totalOffers = Session.get('totalOffers');
    if( key == 'quantity' ){
        Session.setPersistent('inheritedQuantity', value);
    }
    else if( key == 'price'){
        Session.setPersistent('inheritedPrice', value);
    }
    else if( key == 'status'){
        totalOffers.forEach( (offer)=> {
            offer.status = value
        });
        Session.setPersistent('totalOffers', totalOffers)
    }
    else if( key == 'alignToOffer'){
        totalOffers.forEach( (offer)=> {
            offer.alignToOffer = value
        });
        Session.setPersistent('totalOffers', totalOffers)
    }
    //var params = {};
    //params[key] = value;
    //Meteor.call('vendorToolsUpdate', id, params, function(err){
    //    if (err) {
    //        toastr.error(err);
    //    }
    //    else{
    //        toastr.success('main Offer Successfully updated');
    //    }
    //})
};

getCurrentOffer = (id)=> {
    var offerIndex = _.findIndex(Session.get('totalOffers'), (offer)=>{
        return offer.combId == id
    });
    if( offerIndex != -1 ){
        return Session.get('totalOffers')[offerIndex]
    }
};

getCurrentIndex = (id)=> {
    return _.findIndex(Session.get('totalOffers'), (offer)=> {
        return offer._id == id
    })
};

setInheritedValues = ()=> {
    Meteor.setTimeout(()=> {
        var offer = Offers.findOne({
            product: FlowRouter.current().params.id,
            main: true
        });
        offer && (Session.setPersistent('inheritedQuantity', offer.quantity));
        offer && (Session.setPersistent('inheritedPrice', offer.price));
        offer && (Session.setPersistent('inheritedAlign', offer.alignToOffer));
    });
};


setSessionOffers = ()=>{
    Meteor.setTimeout(()=>{
        var totalOffers = Offers.find({
            product: FlowRouter.current().params.id,
            vendor: Meteor.userId()
        }).fetch();
        Session.setPersistent('totalOffers', totalOffers);
        getAlignmentFromServer();
    }, 1000);

};


getAlignmentFromServer = ()=>{
    getAlignmentInterVal = Meteor.setInterval(()=> {
        var oldOffers = Session.get('totalOffers');
        var totalOffers = Offers.find({
            product: FlowRouter.current().params.id,
            vendor: Meteor.userId()
        }).fetch();
        oldOffers.forEach((obj, index)=>{
            if( Session.get('isSession')){
                oldOffers[index].bestOffer = totalOffers[index].bestOffer;
                oldOffers[index].avgOffer = totalOffers[index].avgOffer;
                if ( obj.alignToOffer && oldOffers[index]){
                    oldOffers[index].price = totalOffers[index].price;
                }
            }
        });
        Session.setPersistent('totalOffers', oldOffers);
    }, 1000)
};

inheritIfEmptyValue =(t) => {

    var oldOffers = Session.get('totalOffers');
    for(var i = 0; i < oldOffers.length - 1; i++){
        if( !t.$('.vendorPrice')[i].value){
            oldOffers[i].price = Session.get('inheritedPrice');
        }
    }
    Session.set('totalOffers', oldOffers);
    return oldOffers
};


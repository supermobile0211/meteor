
Template.vendorToolsMyOffersOfferDetails.onRendered(()=> {

    $('#productDescription').summernote({
        minHeight: 250
    });

    parentOffer();

});

Template.vendorToolsMyOffersOfferDetails.helpers({
    mainOffer: ()=> Session.get('mainOffer'),

    allowOutOfStock: (value) => value == true,

    denyOutOfStock: (value) => value == false,

    offerDescription: function(){
        var lang = Session.get('currentEditLang');
        if( this.translation && this.translation[lang] ){
            return this.translation[lang].description
        }
    },
    offerD: (mainOffer)=> {
        var lang = Session.get('currentEditLang');
        if( mainOffer && mainOffer.translation && mainOffer.translation[lang] ){
            return mainOffer.translation[lang].description
        }
    },
    mainOfferStatus: ()=> {
        if (Session.get('mainOffer')) {
            return !Session.get('mainOffer').status
        }
    },

    offers: () => Offers.findOne({_id: FlowRouter.current().params.id}),

    carrier: () => Offers.findOne({_id: FlowRouter.current().params.id}),

    shippingMethod: ()=> Carrier.find({vendorId: Meteor.userId()}).fetch(),

    isCarrierAdded: (id) => {
        let offer = Offers.findOne({_id: FlowRouter.current().params.id});
        if(offer){
            return offer.shipping.includes(id);
        }
    },

    products: function(){
        return Products.find({_id: this.product})
    },

    combination: (id)=> {
        var product = Products.findOne({
            _id: id
        });
        if( product && product.combinations && product.combinations.length ){
            var index = findSearchIndexes(product.combinations, Session.get('currentEditLang'), 'language');
            var selected = product.combinations[index];
            if( selected.values && selected.values.length ){
                var offerIndex = findSearchIndexes(selected.values, FlowRouter.current().params.id, 'UIN');
                if ( offerIndex != -1 ){
                    return selected.values[offerIndex].combination;
                }
            }
        }
    },

    feature: function(){
        //let currentFeatures = [{value: []}];
        let currentFeatures = [];
        for(let i=0; i < this.features.length; i++){
            if(this.features[i].language == Session.get('currentEditLang')){
                currentFeatures = this.features[i].values;
            }
        }
        return currentFeatures;
    }
});

Template.vendorToolsMyOffersOfferDetails.events({

    'click #cancelChange': function(e){
        history.back();
    },
    'keyup #offerDesc': function ( e ) {
        var $textarea = $(e.currentTarget),
            maxLength = $textarea.attr('maxlength'),
            length = $textarea.val().length;
        length = maxLength - length;
        $textarea.prev().text(length);
    },

    'click #offerPriceAlignto': function ( e, t ) {
        if (t.$('#offerPriceAlignto').is(':checked')){
            var $input = $(e.currentTarget);
            if($input.get(0).checked){
                Meteor.call('avgCombination', currentOffer().product, currentOffer().combId, currentOffer()._id, function (error, result) {
                    if(error){
                    }
                    else if(result && result.length){
                        t.$('#offerPrice').val(result[0].priceAlign);
                    }
                });
            }else{
                t.$('#offerPriceAlignto').val($input.data('price'));
            }
        }
    },

    'click #save': function(e, t){
        let carrier = [], mainDescription;
        var mainOffer = Session.get('mainOffer');
        var totalCarriers = Carrier.find({vendorId: Meteor.userId()}).fetch();
        var maxWeightOfCarriers = [];
        var lang = Session.get('currentEditLang');
        if( mainOffer.translation && mainOffer.translation[lang] ){
            mainDescription = mainOffer.translation[lang].description
        }

        var test =  totalCarriers.map((obj)=> obj._id);
        for( let i = 0; i < test.length; i++ ){
            if(t.$('#shippingMethod_' + i)[0].checked){
                carrier.push(test[i]);
            }
        }

        let payload = {
            price : t.$('#offerPrice').val() || mainOffer.price,
            offerPriceAlignto : t.$('#offerPriceAlignto')[0].checked,
            offerDesc : t.$('#offerDesc').val() ||  mainDescription,
            offerDeadLine : t.$('#offerDeadLine').val(),
            priceQty : t.$('#offerQty').val() || mainOffer.quantity,
            offerStatus2 : t.$('#offerStatus2')[0].checked,
            whenOutStock : (t.find("[name='radioInline']:checked").value == 'true'),
            packageWidth : t.$('#packageWidth').val(),
            packageDepth : t.$('#packageDepth').val(),
            packageHeight : t.$('#packageHeight').val(),
            packageWeight : t.$('#packageWeight').val(),
            shippingMethod1 : carrier
        };


        if(!carrier.length){
            swal({
                title: "Are you sure you want to update without carrier?",
                text: "This offer will be updated without carrier",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55 ",
                confirmButtonText: "Yes, update it!",
                closeOnConfirm: false
            }, function () {
                Meteor.call('vendorToolsMyOffersOfferDetail', FlowRouter.current().params.id, Session.get('currentEditLang'), payload, function(err){
                    if (err) {
                        swal({
                            title: "Failed!",
                            text: err.message,
                            type: "error"
                        });
                        return;
                    }else{
                        swal("Updated!", "Updated successfully", "success");
                        history.back();
                    }
                });
            });
        }else{
            totalCarriers.forEach((obj)=>{
                maxWeightOfCarriers.push(Math.max.apply(null, _.pluck(obj.ranges, "max")));
            });
            var filteredWeight = Math.max.apply(null, maxWeightOfCarriers);
            if(t.$('#packageWeight').val() > filteredWeight){
                toastr.warning('No carrier available for this weight please create a new one or check informations')
            } else {
                Meteor.call('vendorToolsMyOffersOfferDetail', FlowRouter.current().params.id, Session.get('currentEditLang'), payload, function(err){
                    if(err){
                        toastr.error(err);
                    }else{
                        toastr.success('Updated successfully');
                        history.back();
                    }
                });
            }
        }
    }
});

currentOffer = () => {
    return Offers.findOne({
        _id: FlowRouter.current().params.id
    })
};

parentOffer = ()=> {
    var productId = currentOffer() && currentOffer().product;

    var mainOffer = Offers.findOne({
        product: productId,
        main: true
    });
    Session.set('mainOffer', mainOffer);
};

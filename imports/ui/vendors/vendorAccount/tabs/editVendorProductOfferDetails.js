
Template.editVendorProductOfferDetails.onCreated(()=>{

});

Template.editVendorProductOfferDetails.onRendered(()=>{

});

Template.editVendorProductOfferDetails.helpers({

    offers: function(){
        return Offers.findOne({
            _id: FlowRouter.current().params.id
        })
    },

    carrier: function(){
        Offers.findOne({
            _id: FlowRouter.current().params.id
        })
    },

    shippingMethod: function(){
        return Carrier.find({
            _id: this.shipping[0]
        }).fetch();
    },

    products: function(){
        return Products.find({
            _id: this.product
        })
    },

    feature: function(){
        let currentFeatures = [];
        for(let i=0; i < this.features.length; i++){
            if(this.features[i].language == Session.get('currentEditLang')){
                currentFeatures = this.features[i].values;
            }
        }
        return currentFeatures;
    }
});

Template.editVendorProductOfferDetails.events({
    'click #save': function(e, t){
        let carrier = [];

        for(let i = 0; i < this.shipping.length; i++){
            if(t.$('#shippingMethod_' + i)[0].checked){
                carrier.push(this.shipping[i])
            }

        }
        let payload = {
            price : t.$('#offerPrice').val(),
            offerPriceAlignto : t.$('#offerPriceAlignto')[0].checked,
            offerDesc : t.$('#offerDesc').val(),
            offerDeadLine : t.$('#offerDeadLine').val(),
            priceQty : t.$('#offerQty').val(),
            offerStatus2 : t.$('#offerStatus2')[0].checked,
            shippingMethod1 : carrier
        };

        Meteor.call('vendorToolsMyOffersOfferDetail', FlowRouter.current().params.id, Session.get('currentEditLang'), payload, function(err){
            if(err){
                swal({
                    title: "Failed!",
                    text: err.message,
                    type: "error"
                })
            }else{
                swal({title: "Updated successfully"});
            }
        });
    }
});
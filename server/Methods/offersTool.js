
Meteor.methods({

    vendorToolsMyOffersOfferDetail: (id, lang, payload)=> {
        check(id, String);
        check(lang, String);
        check(payload, {
            price: Match.Optional(Match.OneOf(String, Number)),
            priceQty: Match.Optional(Match.OneOf(String, Number)),
            offerStatus2: Match.Optional(Boolean),
            offerPriceAlignto: Match.Optional(Boolean),
            offerDeadLine: Match.Optional(Match.OneOf(String, Number)),
            offerDesc: Match.Optional(String),
            whenOutStock: Match.Optional(Boolean),
            shippingMethod1: Match.Optional([String]),
            packageWidth: Match.Optional(String),
            packageDepth: Match.Optional(String),
            packageHeight: Match.Optional(String),
            packageWeight: Match.Optional(String)
        });

        var update = {
            $set: {
                price: payload.price,
                quantity: payload.priceQty,
                inStock: true,
                status: payload.offerStatus2,
                alignToOffer: payload.offerPriceAlignto,
                delayDays: payload.offerDeadLine,
                allowOrder: payload.whenOutStock,
                ["translation."+ lang]: {},
                shipping: payload.shippingMethod1,
                packageWidth: payload.packageWidth,
                packageDepth: payload.packageDepth,
                packageHeight: payload.packageHeight,
                packageWeight: payload.packageWeight
            }
        };
        update.$set["translation." + lang].description = payload.offerDesc;
        Offers.update({_id: id}, update);
    },

    getLocalOffers: (query) => Offers.find(query).fetch(),
    getMuchCloseOffer: (query) => Offers.findOne(query)

});

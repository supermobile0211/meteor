import './../../collections/offers.js';

Offers.find({}).observe({
   changed: function(offer, fields){

      var result = Offers.aggregate(
          [
             {
                $match:
                {
         product: offer.product,
         status: true,
         alignToOffer: false,
         combId: Number(offer.combId)
                }
             },
             {
                $group:
                {
                   _id: "$product",
                   priceAlign: { $avg: "$price" },
                   minPrice: { $min: "$price" }
                }
             }
          ]
      );

      if ( result.length ){
         var averageValue = Number(Number(result[0].priceAlign).toFixed(2)),
         bestOffer = Number(Number(result[0].minPrice).toFixed(2));
         var updateValues = { $set: {
            avgOffer: averageValue,
            bestOffer: bestOffer
         }};

         var updatePrice = { $set: {
            price : averageValue
         }};

      Offers.update({
         product: offer.product,
            combId: offer.combId,
            status: true
         }, updateValues, {multi: true});

         Offers.update({
            product: offer.product,
            combId: offer.combId,
         alignToOffer: true,
            status: true
         }, updatePrice, {multi: true});
   }
   }
});

Meteor.publish('offersWithSkip', (skip, limit, sort)=>{
   var options;
   if (skip < 0) {
      skip = 0;
   }
   options = {};
   options.skip = skip;
   options.limit = limit;
   if (options.limit > 100) {
      options.limit = 12;
   }
   sort && (options.sort = sort);
   return Offers.find({}, options);
});

Meteor.publish('offers', function() {
   return Offers.find();
});

Meteor.publish('offersWithId', function(obj) {
   return Offers.find({vendor: Meteor.userId});
});
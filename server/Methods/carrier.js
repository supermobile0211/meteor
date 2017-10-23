/**
 * Created by appBakerz - 05 on 21-Jan-17.
 */


Meteor.methods({
 createCarrier: function(params) {
        // Is user logged in ?
        if (!this.userId) {
            throw new Meteor.Error(403);
        }
        // Check arguments type
        check(params, {
            name: String,
            time: String,
            vendorId: String,
            trackingUrl:  Match.Optional(String),
            images: Array,
            ranges: [Object],
            status: Boolean,
            freeShipping: Boolean,
            packageWidth:  Match.Optional(Number),
            packageHeight:  Match.Optional(Number),
            packageDepth:  Match.Optional(Number),
            packageWeight:  Match.Optional(Number),
            position: Match.Optional(Number),
            isAllMarked  : Match.Optional(Boolean)
        });
        // Update the record and return id
        return Carrier.insert(params);
    },

    editCarrier : function(params, id){
        if (!this.userId) {
            throw new Meteor.Error(403);
        }
        check(id,String);
        // Check arguments type
        check(params, {
            name: String,
            time: String,
            //vendorId: String,
            trackingUrl:  Match.Optional(String),
            images: Array,
            ranges: [Object],
            status: Boolean,
            freeShipping: Boolean,
            packageWidth:  Match.Optional(Number),
            packageHeight:  Match.Optional(Number),
            packageDepth:  Match.Optional(Number),
            packageWeight:  Match.Optional(Number),
            position: Match.Optional(Number),
            isAllMarked  : Match.Optional(Boolean)
        });
        var update = {$set : {
            name : params.name,
            time : params.time,
            trackingUrl : params.trackingUrl,
            images : params.images,
            ranges : params.ranges,
            status : params.status,
            freeSipping : params.freeShipping,
            packageWidth : params.packageWidth,
            packageHeight : params.packageHeight,
            packageDepth : params.packageDepth,
            packageWeight : params.packageWeight,
            position : params.position,
            isAllMarked : params.isAllMarked
        }};
        return Carrier.update({_id : id},update);
    }
});
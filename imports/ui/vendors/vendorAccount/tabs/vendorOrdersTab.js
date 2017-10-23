/********** global variable  **********/
Template.vendorOrdersTab.onRendered(()=> {
//var filter = {vendorId: Meteor.userId(), $or: [ { riskScore: { $lt: 5 } }, {status:  "Approved"} ]};
//TODO: approved or risk score filter removed just for checking
    var filter = {vendorId: Meteor.userId()};
    Session.set('vendorOrderFilter', filter);

$('input[name="daterange"]').daterangepicker();

    Meteor.setTimeout(() => {
        $("[data-toggle=tooltip]").tooltip();
    }, 1000);

});

Template.vendorOrdersTab.helpers({
    orders: function(){
        data = Orders.find(Session.get("vendorOrderFilter")).fetch();
        return data.sort(function(a, b){
            return new Date(b.createdAt) - new Date(a.createdAt);
        });
    },
    class: ((status)=> {
        return status.toLowerCase();
    }),
    userName: ( userId )=> {
        var user = Meteor.users.findOne(userId);
        return user && user.profile.name
    }
});

Template.vendorOrdersTab.events({
    'change #filterOrderDate': function ( e, t ) {
        var filter = Session.get("vendorOrderFilter");
        var value = t.$('input[name="daterange"]').val();
        if( value ){
            value = value.split('-');
            var dateStart = new Date(value[0]),
                dateEnd = new Date(value[1]);

            //check empty and not date values
            if(!( dateStart || dateEnd )){
                filter.createdAt && delete filter['createdAt'];
            }
            else {
                if ( isDate(dateStart) || dateStart == '' ) {
                    filter.createdAt && delete filter.createdAt['$gte'];
                }
                else {
                    if ( filter.createdAt ) {
                        filter.createdAt.$gte = dateStart
                    }
                    else filter['createdAt'] = {$gte: dateStart}
                }
                if ( isDate(dateEnd) || dateEnd == '' ) {
                    filter.createdAt && delete filter.createdAt['$lte'];
                }
                else {
                    if ( filter.createdAt ) {
                        filter.createdAt.$lte = dateEnd
                    }
                    else filter['createdAt'] = {$lte: dateEnd}
                }
            }
            Session.set("vendorOrderFilter", filter);
        }
    },
    'change #userName' : function( e ) {
        var filter = Session.get("vendorOrderFilter");
        var name = e.target.value;
        if ( !name || name == '' ) {
            filter.user && delete filter.user;
        }
        else {
            var query = {};
            query['profile.name'] = {$regex : name + " *", $options:"i"};
            var users = Meteor.users.find(query).fetch(),
                ids = filterKeys(users, '_id');
            if ( filter.user ){
                filter.user.$in = ids;
            }
            else{
                filter.user = { $in: ids }
            }
        }
        Session.set("vendorOrderFilter", filter);
    },
    'change #filterStatus' : function( e, t ){
        var filter = Session.get("vendorOrderFilter");
        var status = e.target.value;
        if( status == 'all' ){
            filter.status && delete filter['status']
        }
        else{
            filter['status'] = status
        }
        Session.set("vendorOrderFilter", filter);
    },
    'change #deliveryDay' : function( e ) {
        var filter = Session.get("vendorOrderFilter");
        var days = Number(e.target.value);
        if ( !days || days == '' || isNaN(days) ) {
            filter.deliveryDay && delete filter.deliveryDay
        }
        else {
            filter.deliveryDay = days;
        }
        Session.set("vendorOrderFilter", filter);
    },
    'change #filterPrice' : function( e, t ){
        var filter = Session.get("vendorOrderFilter");
        var offersFrom = Number( t.find('#totalPriceFrom').value ),
            offersTo = Number( t.find('#totalPriceTo').value );

        //check empty and not numbers values
        if(!( offersFrom || offersTo )){
            filter.gorssPrice && delete filter['gorssPrice'];
        }
        else {
            if ( isNaN(offersFrom) || offersFrom == '' ) {
                filter.gorssPrice && delete filter.gorssPrice['$gte'];
            }
            else {
                if ( filter.gorssPrice ) {
                    filter.gorssPrice.$gte = offersFrom
                }
                else filter['gorssPrice'] = {$gte: offersFrom}
            }
            if ( isNaN(offersTo) || offersTo == '' ) {
                filter.gorssPrice && delete filter.gorssPrice['$lte'];
            }
            else {
                if ( filter.gorssPrice ) {
                    filter.gorssPrice.$lte = offersTo
                }
                else filter['gorssPrice'] = {$lte: offersTo}
            }
        }
        Session.set("vendorOrderFilter", filter);
    },
    'change #filterCommission' : function( e, t ){
        var filter = Session.get("vendorOrderFilter");
        var offersFrom = Number( t.find('#totalCommissionFrom').value ),
            offersTo = Number( t.find('#totalCommissionTo').value );

        //check empty and not numbers values
        if(!( offersFrom || offersTo )){
            filter.commission && delete filter['commission'];
        }
        else {
            if ( isNaN(offersFrom) || offersFrom == '' ) {
                filter.commission && delete filter.commission['$gte'];
            }
            else {
                if ( filter.commission ) {
                    filter.commission.$gte = offersFrom
                }
                else filter['commission'] = {$gte: offersFrom}
            }
            if ( isNaN(offersTo) || offersTo == '' ) {
                filter.commission && delete filter.commission['$lte'];
            }
            else {
                if ( filter.commission ) {
                    filter.commission.$lte = offersTo
                }
                else filter['commission'] = {$lte: offersTo}
            }
        }
        Session.set("vendorOrderFilter", filter);
    },
    'change #orderRef' : function( e ) {
        var filter = Session.get("vendorOrderFilter");
        var orderRef = e.target.value;
        if ( !orderRef || orderRef == '' ) {
            filter.orderRef && delete filter.orderRef;
        }
        else {
            filter['orderRef'] = orderRef;
        }
        Session.set("vendorOrderFilter", filter);
    },
    'change #orderId' : function( e ) {
        var filter = Session.get("vendorOrderFilter");
        var id = e.target.value;
        if ( !id || id == '' ) {
            filter._id && delete filter._id;
        }
        else {
            filter['_id'] = id;
        }
        Session.set("vendorOrderFilter", filter);
    }
});


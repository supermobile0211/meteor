Meteor.methods({
    getInvoice: function( url, id){
        check( id, String );
        check( url, String );
        var order = Orders.findOne({
            _id: id
        });
        if(order && (order.user == this.userId || order.vendorId == this.userId)){
            let fut = new Future();
            let response = HTTP.call('GET', url,{npmRequestOptions: { encoding: null }},function(err, response){
                if (err) {
                    fut.return(null);
                }
                fut.return(data);
            });
            return fut.wait();
        }
        else{
            throw "you don't have access rights";
        }
    },

    updateOrders: function(query, obj){
        check( query, String );
        check(obj ,{
            vads_trans_status: String,
            vads_threeds_status: Boolean,
            isPaid: Boolean,
            score: Number,
            riskFactors: Object
        });

        let update = {
            $set: {
                paymentStatus: obj.vads_trans_status,
                '3dSecure': obj.vads_threeds_status,
                isPaid: obj.isPaid,
                displayed: true
            },
            $inc: {
                riskScore: obj.score
            }
        };
        for (var key in obj.riskFactors){
            update.$set[`riskFactors.${key}`] = obj.riskFactors[key];
        }

        Orders.update({orderRef: query}, update, {
            multi: true
        }, function(err, res){
            let orders = Orders.find({
                orderRef: query
            }).fetch();

            //get all order _id for finding related payments
            if(orders && orders.length){
                orders = orders.length && _.map(orders, (order) => order._id);
                //updated the payments based on orders _id
                Payments.update({
                    orderId: {
                        $in: orders
                    }
                }, {
                    $set: {
                        displayed: true
                    }
                }, {
                    multi: true
                })
            }
        });
    }
});
import './../../collections/earnings.js';
import './../../collections/payments.js';

Earnings.find({}).observe({

    added: function(doc, fields){
        Payments.update({
            orderId: {
                $in: doc.orders
            }
        },{
            $set:{
                status: 'Added'
            },
            $push: {
                history: {
                    $each: [{
                        status: 'Added',
                        updatedAt: new Date()
                    }],
                    $position: 0
                }
            }
        })
    },
    changed: function(doc, fields){
        if( doc.status != "Pending" ){
            Payments.update({
                orderId: {
                    $in: doc.orders
                },
                status: {
                    $ne: doc.status
                }
            },{
                $set:{
                    status: doc.status
                },
                $push: {
                    history: {
                        $each: [{
                            status: doc.status,
                            updatedAt: new Date()
                        }],
                        $position: 0
                    }
                }
            }, {
                multi: true
            })
        }
        else{
            //if just added new then change the pending status to Added
            Payments.update({
                orderId: {
                    $in: doc.orders
                },
                    status: {
                        $eq: 'Pending'
                    }
                }
            ,{
                $set:{
                    status: 'Added'
                },
                $push: {
                    history: {
                        $each: [{
                            status: 'Added',
                            updatedAt: new Date()
                        }],
                        $position: 0
                    }
                }
            })
        }
    }
});

Meteor.publish('earnings', function () {
    return Earnings.find({});
});
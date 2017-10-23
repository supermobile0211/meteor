
Meteor.methods({
    updateOrderStatus: ( id, status, vendorId )=> {
        check(id, String);
        check(status, String);

        //check if order status is completed then update the earning Account
        if( status == 'Completed' ){
            let order = Orders.findOne({
                _id: id
            }),
            receiver = Meteor.users.findOne({
                _id: order.vendorId
            }),
            orderSales = _.map(order.details, function(obj){
                return obj.sales
            }).reduce((a, b) => a + b);
            Earnings.update({
                receiverId: order.vendorId,
                //status: { $in:
                //    ['Added','Eligible']
                //}
                status: { $in:
                    ['Pending','Eligible']
                }
            },{
                $setOnInsert: {
                    status: 'Pending',
                    receiverId: order.vendorId,
                    type: 'vendor',
                    sales: 0,
                    company: receiver.profile.vendor.company,
                    title: receiver.profile.title,
                    name: receiver.profile.name,
                    firstName: receiver.profile.firstName,
                    deliveryCountry: receiver.profile.country,
                    amount: 0,
                    orders: [],
                    history:[{
                        status: 'Pending',
                        updatedAt: new Date()
                    }],
                    details: ''
                },
                $push:{
                    orders: id
                },
                $inc:{
                    amount: (order.grossPrice - order.commission),
                    sales: orderSales
                }
            },{
                upsert: true
            })
        }

        Orders.update({_id: id},
            {
                $set:{
                    status: status,
                    responded: !!(vendorId && vendorId == Meteor.userId())
                },
                $push: {
                    history: {
                        $each: [{status: status, updatedBy: Meteor.userId(), updatedAt: new Date()}],
                        $position: 0

                    }
                }
            }
        );
    },

    cancelOrder: ( params )=> {
        check(params, {
            id: String,
            vendorId: Match.Optional(String),
            message: Match.Optional(String)
        });
        Orders.update({_id: params.id},
            {
                $set:{
                    status: 'Canceled',
                    cancelMessage: params.message || '',
                    cancelDate: new Date(),
                    responded: !!(params.vendorId && params.vendorId == Meteor.userId())
                },
                $push: {
                    history: {
                        $each: [{
                            status: 'Canceled',
                            updatedBy: Meteor.userId(),
                            updatedAt: new Date()
                        }],
                        $position: 0
                    }
                }
            }
        );
    },

    createOrder: function(params){
        check(params, {
            ip: String,
            name: String,
            orderRef : String,
            vendorId : String,
            affiliateId : Match.Optional(String),
            affiliateName : Match.Optional(String),
            affiliateCompany : Match.Optional(String),
            firstName : String,
            user : String,
            itemRelated: Number,
            totalPrice : Number,
            grossPrice : Number,
            status : String,
            riskScore : Number,
            riskFactors: Object,
            '3dSecure': Boolean,
            deliveryCountry : String,
            commission : Number,
            shipping : Number,
            totalCommission : Number,
            sentByMail : Boolean,
            deliveryDay : Number,
            vendor : String,
            action : String,
            transactionalDetails : String,
            company : String,
            checkPaidToVendor : true,
            shippingAddress : Number,
            billingAddress : Number,
            affiliateCommission : Match.Optional(Number),
            history: Array,
            carriers: [Object],
            details: [Object],
            settings: Object
        });
        //TODO: wrap all similar keys in one obj
        let affiliateName = params.affiliateName;
        let affiliateCompany = params.affiliateCompany;
        let totalCommission = params.totalCommission;
        let shippingCommission = params.shipping;
        let productsCommission = params.commission;
        params.commission = params.totalCommission;

        delete params.affiliateName;
        delete params.affiliateCompany;

        return Orders.insert(params, function(err, order){
            Payments.insert({receiverId: params.vendorId,
                status: 'Pending',
                orderId: order,
                amount: productsCommission,
                shipping: shippingCommission,
                total: totalCommission,
                history: [{
                    status: 'Pending',
                    updatedAt: new Date()
                }],
                sales: params.sales,
                firstName: params.firstName,
                deliveryCountry: params.deliveryCountry,
                name: params.name,
                company: params.company
            });
            if(params.affiliateId){
                Payments.insert({
                    type: 'affiliate',
                    receiverId: params.affiliateId,
                    status: 'Pending',
                    orderId: order,
                    amount: params.affiliateCommission,
                    total: params.affiliateCommission,
                    history:[{
                        status: 'Pending',
                        updatedAt: new Date()
                    }],
                    sales: params.sales,
                    firstName: params.firstName,
                    deliveryCountry: params.deliveryCountry,
                    name: affiliateName,
                    company: affiliateCompany
                });
            }

            Logs.insert({
                orderId: order,
                transactionId: params.orderRef
            });

            return order

        });

    },

    deleteInvoice: ( id ) => {
        check(id, String);
        Orders.update({_id: id},
            {
                $set: {"invoices": []}
            });
    }
});
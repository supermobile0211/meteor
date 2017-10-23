import YT from './config/translation.js';
import Future from 'fibers/future';
import SystemPay from './config/systemPay';

Meteor.methods({
    yandexTranslate: function( text, from, to ) {
        check( text, String );
        check( from, String );
        check( to, Array );
        var translateSync = Meteor.wrapAsync( YT.getAllLanguages);
        try {
            return translateSync( text, from, to );
        }
        catch( e ){
            return e;
        }
    },
    getImage: function(url){
        
        check( url, String );
        var fut = new Future();
        var response = HTTP.call('GET', url, {npmRequestOptions: { encoding: null }},function(err, response){
            if (err) {
                fut.return(null);
            }
            var data = "data:" + response.headers["content-type"] + ";base64," + new Buffer(response.content).toString('base64');
            fut.return(data);
        });
        return fut.wait();
    },
    payment: function(arg){
        check( arg.cardRequest, {
            number: Number,
            scheme: String,
            expiryMonth: Number,
            expiryYear: Number,
            cardSecurityCode: Number
        } );

        check( arg.customerRequest.extraDetails, {
            sendMail: Number,
            ipAddress: String
        } );

        check( arg.customerRequest.billingDetails, { email: String } );
        var SP = new SystemPay();
        var SP1 = new SystemPay();

        SP.execute('createToken', arg, function( err, ret, res ){

        });

        //SP1.execute('createPayment', {
        //    commonRequest: {submissionDate: new Date().toISOString()},
        //    paymentRequest: {amount: 200, currency: 978},
        //    orderRequest:{orderId: '9223372036854775685'},
        //    cardRequest:{
        //        number:4970100000000003,
        //        scheme:"VISA",
        //        expiryMonth:12,
        //        expiryYear:2023,
        //       + cardSecurityCode:123
        //    }
        //
        //}, function(err, ret, res){
        //    console.log("err in createPayment", err);
        //    console.log("ret in createPayment", ret);
        //    console.log("res in createPayment", res)
        //})
    }
});

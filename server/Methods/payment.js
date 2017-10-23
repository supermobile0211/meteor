import systemPay from './../config/systemPay.js'
Meteor.methods({
    verifyCard: function(card){
        check(card ,{
            number: Number,
            date: Date,
            name: String,
            cvc: Number
        });
        //TODO: execute systemPay with credentials
        //systemPay.execure
    }
});
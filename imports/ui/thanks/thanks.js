Template.thanks.onRendered(()=> {


    var settings = Settings.findOne();

    let params = FlowRouter.current().queryParams;
    //update 3D secure

    var riskFactors = settings && settings.riskFactors;
    var score = 0;
    if(!params.vads_threeds_status){
        score = 10;
        //score = riskFactors['3DSecure'];
    }


    if(params.vads_trans_status == "AUTHORISED"){
        let riskObj = {};

        //here the payment success so we can empty cart
        Session.set('userOffer', 0);

        //TODO:check bank Country and IP of current country different
        if( params.vads_card_country != params.vads_pays_ip ){
            score += riskFactors.CBIp;
            riskObj.cbIp = true;
            riskObj.bankCountry = params.vads_card_country;
            riskObj.currentIP = params.vads_pays_ip;
        }
        //

        //check amount > 3000
        if( params.vads_amount > 30000 ){
            score += riskFactors.orderAmount;
        }

        var logsDetails = {
            title: "Customer make a payment",
            details: "Details transaction given by payment solution",
            code: "1234",
            keys: [params]
        };
        Meteor.call('updateLogs', params.vads_trans_id, logsDetails,  (err, res) =>{
        });
        Meteor.call('updateOrders', params.vads_trans_id, {
            vads_trans_status: params.vads_trans_status,
            vads_threeds_status: params.vads_threeds_status ? true : false,
            isPaid: true,
            score: score,
            riskFactors: riskObj
        }, (err, res) => {
            if(err){
                console.log("err", err)
            }
        })
    }
});

Template.thanks.helpers({
    products: ()=> Products.find({}),

    paymentStatus: ()=> FlowRouter.current().queryParams.vads_trans_status == "AUTHORISED"
});

Template.thanks.events(()=> {

});



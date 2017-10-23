/********** imports  **********/
import dateFormat from 'dateformat';
Template.payment.onRendered (function(){

    /********** Set Default Session **********/
    Session.set('termsAccepted', false);
    Session.set('transactionRef', Random.fraction().toString().slice(-6));
    Session.set('orderRef', Random.id());
    Session.set('country', Countries.findOne({name: Meteor.user().profile.address[0].country}));

    //call method to get user location fallback
    getUserLocation();

});

Template.payment.events ({

    'click #terms': (e, t) => {
        Session.set('termsAccepted', t.$('#terms').prop('checked'))
    },
    'click #payment-by-card': (e, t) => {
        Session.set("isProcessing", true);
        if( !t.$('#terms').prop('checked') ){
            toastr.error('You must agree the Terms of Service');
            return;
        }
        var risk = calculateRisk();
        var settings = getOrderSettings();
        var orders = Session.get('productsGroupByVendor');
        orders.forEach((cart, i) =>{
            var details = [];
            cart.forEach((doc, i) => {
                details.push({
                    product : doc.product,
                    offerId : doc.offer,
                    sales : doc.qty,
                    commissionPerc: Number(getVendorCommission(doc.product)),
                    price: (getDocument(doc.offer, Offers).price),
                    totalPrice: (getDocument(doc.offer, Offers).price * doc.qty)
                });
                details[i].commission = Number((details[i].totalPrice * details[i].commissionPerc) / 100);
            });
                //let commission = Number(getVendorCommission(doc.product));
                var params = {
                    details: details,
                    orderRef: Session.get('transactionRef'),
                    vendorId: getDocument(cart[0].offer, Offers).vendor,
                    firstName: Meteor.user().profile.firstName,
                    user: Meteor.userId(),
                //    status: risk.score >= 5 ? "Onhold" : "Pending",
                    status: "Pending",
                    itemRelated : 324201,
                    riskScore: risk.score,
                    riskFactors: risk.factors,
                    '3dSecure': true,
                    deliveryCountry: shippingAddress().country,
                    sentByMail: true,
                    deliveryDay: 3,
                    vendor: getVendorDetails(cart[0].offer).username,
                    action: "Pay the money",
                    ip: Session.get('userLocation').ip,
                    transactionalDetails: "Transactional Details",
                    company: getVendorDetails(cart[0].offer).profile.vendor.company,
                    name: getVendorDetails(cart[0].offer).profile.name,
                    shippingAddress: Number(Session.get('currentEditAddDelivery')),
                    billingAddress: Number(Session.get('currentEditAddBilling')),
                    history: [{
                        //status: risk.score >= 5 ? "Onhold" : "Pending",
                        status: "Pending",
                        updatedAt: new Date(),
                        updatedBy: Meteor.userId()
                    }],
                    carriers: [
                        {
                            id: Session.get('selectedShippingArray')[0],
                            price: Session.get(`shippingArray`)[i]
                        }
                    ],
                    settings: {
                        shippingCommission: settings.appliedCommission,
                        affiliateCommission: settings.defaultAffiliateCommission,
                        VAT: settings.appliedVAT
                    },
                    checkPaidToVendor: true
                };
            params.totalPrice = params.details.reduce((a, b) => a + b.totalPrice, 0);
            params.commission = params.details.reduce((a, b) => a + b.commission, 0);
            params.shipping = Number((params.carriers[0].price * settings.appliedCommission) / 100);
            params.totalCommission = Number(params.commission + params.shipping ) ;
            params.grossPrice = Number(params.totalPrice + params.carriers[0].price);

            if(Session.get('affiliateLinked')){
                params.affiliateId = Session.get('affiliateId');
                params.affiliateName = getDocument(Session.get('affiliateId'), Meteor.users).profile.name;
                params.affiliateCompany = getDocument(Session.get('affiliateId'), Meteor.users).profile.vendor.company;
                params.affiliateCommission = Number((params.totalPrice * settings.defaultAffiliateCommission) / 100);
            }
            Meteor.call('createOrder', params,  (err, res) => {
                if( err ){
                    //toastr.error(err.message);
                    return;
                }
                var ordered = Session.get('productsGroupByVendor');
                //ordered.shift();
                Session.setPersistent('productsGroupByVendor', ordered);
                Session.set('paid', true);
                //toastr.success('order ' + res + ' successfully created');
                //if(!ordered.length){
                //    Session.set('userOffer', 0);
                //    FlowRouter.go('dashboard1')
                //}

            })
        });
        computeSignature();

        //var orders = Session.get('userOffer');
        //orders.forEach( (doc)=> {
        //    let commission = Number(getVendorCommission(doc.product));
        //    var params = {
        //        orderRef : Random.id(),
        //        offerId: doc.offer,
        //        vendorId : getDocument(doc.offer, Offers).vendor,
        //        firstName : Meteor.user().profile.firstName,
        //        user : Meteor.userId(),
        //        price : (getDocument(doc.offer, Offers).price),
        //        totalPrice : (getDocument(doc.offer, Offers).price * doc.qty),
        //        status : risk.score >= 5 ? "Onhold" : "Pending",
        //        riskScore : risk.score,
        //        riskFactors : risk.factors,
        //        '3dSecure': true,
        //        deliveryCountry : "France",
        //        sentByMail: true,
        //        deliveryDay : 3,
        //        vendor : getVendorDetails(doc.offer).username,
        //        action : "Pay the money",
        //        product : doc.product,
        //        ip : Session.get('userLocation').ip,
        //        //itemRelated : 324201,  question from mickael
        //        commissionPerc : commission,
        //        //payType : "Affiliate", //true false
        //        transactionalDetails : "Transactional Details",
        //        sales : doc.qty,
        //        company : getVendorDetails(doc.offer).profile.vendor.company,
        //        name : getVendorDetails(doc.offer).profile.name,
        //        shippingAddress: Number(Session.get('currentEditAddDelivery')),
        //        billingAddress: Number(Session.get('currentEditAddBilling')),
        //        history: [{
        //            status: risk.score >= 5 ? "Onhold" : "Pending",
        //            updatedAt: new Date(),
        //            updatedBy: Meteor.userId()
        //        }],
        //        carriers : [
        //            {
        //                id: Session.get('selectedShippingArray')[0],
        //                price: Session.get(`shippingArray`)[0]
        //            }
        //        ],
        //        settings:{
        //            shippingCommission: settings.appliedCommission,
        //            orderCommission: settings.ordersCommission,
        //            affiliateCommission: settings.defaultAffiliateCommission,
        //            VAT: settings.appliedVAT
        //        },
        //        checkPaidToVendor : true
        //    };
        //    params.commission = Number((params.totalPrice * commission) / 100);
        //    params.shipping = Number((params.carriers[0].price * params.settings.shippingCommission) / 100);
        //    params.totalCommission = Number(params.commission + params.shipping ) ;
        //    params.grossPrice = Number(params.totalPrice + params.carriers[0].price);
        //    if(Session.get('affiliateLinked')){
        //        params.affiliateId = Session.get('affiliateId');
        //        params.affiliateName = getDocument(Session.get('affiliateId'), Meteor.users).profile.name;
        //        params.affiliateCompany = getDocument(Session.get('affiliateId'), Meteor.users).profile.vendor.company;
        //        params.affiliateCommission = Number((params.totalPrice * settings.defaultAffiliateCommission) / 100);
        //    }
        //    Meteor.call('createOrder', params,  (err, res) => {
        //        if( err ){
        //            toastr.error(err.message);
        //            return;
        //        }
        //        var userOffer = Session.get('userOffer');
        //        userOffer.shift();
        //        Session.setPersistent('userOffer', userOffer);
        //        Session.set('paid', true);
        //        toastr.success('order ' + res + ' successfully created');
        //        FlowRouter.go('dashboard1')
        //    })
        //});

    },
    'click #previous-step3': function(evt, temp){
        Session.set('step', Session.get('step') - 1);
    }

    //'click #finished': () => {
    //    FlowRouter.go('dashboard1')
    //},

    //TODO uncomment below code if you want payment with card button.
    //'click #payment': () => {
    //
    //    console.log("running...")
    //    var now = new Date();
    //
    //    var args = {
    //        commonRequest : {
    //            submissionDate : dateFormat(now, "yyyy-mm-dd'T'HH:MM:ss'Z'")
    //        },
    //        cardRequest:{
    //            number:4970100000000003,
    //            scheme:"VISA",
    //            expiryMonth:12,
    //            expiryYear:2023,
    //            cardSecurityCode:123
    //        },
    //        customerRequest:{
    //            billingDetails:{
    //                email:"chicoo2006@gmail.com"
    //            },
    //            extraDetails:{
    //                sendMail:1,
    //                ipAddress:"127.0.0.1"
    //            }
    //        }
    //    };
    //
    //    Meteor.call('payment', args, (err, res) => {
    //
    //    })
    //}
});

Template.payment.helpers ({

    getIsoCode: (countryName) => getIsoCode(countryName),

    isProcessing: () =>{
        return Session.get("isProcessing");
    },

    termsAccepted: (e, t) =>{
        return (!Session.get('termsAccepted') || Session.get('processStarted'));
    },

    isPaid: ()=> Session.get('paid'),

    grandTotal: ()=> Session.get('calcGrandTotal'),

    grandShipping: ()=> Session.get('grandShipping'),

    grandTotalShipping: ()=> Session.get('grandShipping') + Session.get('calcGrandTotal'),

    shippingAddress: shippingAddress,

    billingAddress: billingAddress,

    getUserProfile: () => {
        return Meteor.user().profile
    },

    getUserEmail: () => {
        return Meteor.user().emails[0]
    },

    orderAmount: () => {
        return (Session.get('orderAmount') * 100)
    },

    countryCode: () => {
        return Session.get('country') && Session.get('country').isoCode
    }
});

function getVendorDetails(offerId) {
    var vendorId = getDocument(offerId, Offers).vendor;
    return getDocument(vendorId, Meteor.users);
}

function calculateRisk(){
    var settings = Settings.find().fetch();
    var riskFactors = settings[0].riskFactors;


    //Declare variables.
    let addressIndex, selectedCountry, currentIpCountry, pAddress, score = 0, factors = {};

    addressIndex = Session.get('currentEditAddDelivery') || 0;
    pAddress = Meteor.user().profile;
    selectedCountry = Countries.findOne({flag: pAddress.address[addressIndex].country});
    currentIpCountry = Session.get('userLocation').country_name;

    //check risk Country
    if( selectedCountry.risk ){
        score += riskFactors.riskCountry;
    }

    //check failed payment > 3
    if(pAddress.failedPayment > 3){
        score += riskFactors.failedPayment;
    }

    //check delivery Country and IP of current country different
    if( selectedCountry.flag.toLowerCase() != currentIpCountry.toLowerCase() ){
        factors.deliveryCountry = selectedCountry.flag;
        factors.currentCountry = currentIpCountry;
        score += riskFactors.deliveryIp;
    }

    return {
        score: score,
        factors: factors
    };
}

function proceedToPayment(card) {
    Meteor.call('verifyCard', card, function(err, res){
        if(err){
        toastr.error('your card number is incorrect due to ' +err)
        }
        else{
            //logic with payment proceeding
        }
    })
}

getCurrentShippingPrice = (id, productId) => {
    let product = getDocument(productId, Products);
    let productWeight = product && product.weight || 0;
    var ranges = getDocument(id, Carrier);
    ranges = ranges && ranges.ranges || [];
    var shippingPrice = ranges.find((obj) => {
        return obj.min >= productWeight || obj.max <= productWeight
    });
    shippingPrice = shippingPrice && shippingPrice.allowedCountry[0].price;
    return shippingPrice;
};

getCategoryCommission = (productId) => {
    let product = getDocument(productId, Products);
    let category = getDocument(product.defaultCategory, Categories);
    return (category.commission || category.inheritedCommission)
};

function computeSignature() {
    //utc date
    var now = new Date();
    var utc_timestamp = now.getUTCFullYear() + "" +
        zeroPadNum(1 + now.getUTCMonth()) + "" +
        zeroPadNum(now.getUTCDate()) + "" +
        zeroPadNum(1 + now.getUTCHours()) + "" +
        zeroPadNum(now.getUTCMinutes()) + "" +
        zeroPadNum(now.getUTCSeconds());

    //append values to payment Form
    this.$('input[name=vads_trans_date]').val(utc_timestamp);
    this.$('input[name=vads_order_id]').val(Session.get('orderRef'));
    this.$('input[name=vads_trans_id]').val(Session.get('transactionRef'));

    //code for computing the signature with params
    let user = Meteor.user();
    let country = Session.get('country');
    var params = {
        vads_action_mode: 'INTERACTIVE',
        vads_amount: Session.get('orderAmount') * 100,
        vads_contrib: Meteor.App.NAME,
        vads_ctx_mode:'TEST',
        vads_currency:'978',
        vads_cust_address:billingAddress().streetAddress,
        vads_cust_city: billingAddress().address,
        vads_cust_country: country.isoCode,
        vads_cust_email: user.emails[0].address,
        vads_cust_first_name: user.profile.firstName,
        vads_cust_id: Meteor.userId(),
        //vads_cust_last_name:'TEST PRO',
        vads_cust_phone: user.profile.phone,
        vads_cust_zip: billingAddress().zipCode,
        vads_language:'fr',
        vads_order_id: Session.get('orderRef'),
        //vads_order_info:'Paiement par carte bancaire',
        vads_page_action:'PAYMENT',
        vads_payment_cards:'CB;VISA;VISA_ELECTRON;MASTERCARD;MAESTRO;E-CARTEBLEUE',
        vads_payment_config:'SINGLE',
        vads_return_mode:'GET',
        vads_ship_to_city: shippingAddress().address,
        vads_ship_to_country: getIsoCode(shippingAddress().country),
        //vads_ship_to_first_name:'test pro',
        //vads_ship_to_last_name:'TEST PRO',
        vads_ship_to_phone_num: user.profile.phone,
        vads_ship_to_street:shippingAddress().streetAddress,
        //vads_ship_to_street2:'',
        vads_ship_to_zip: shippingAddress().zipCode,
        vads_site_id:'24937366',
        vads_trans_date:utc_timestamp,
        vads_trans_id: Session.get('transactionRef'),
        vads_url_return:'http://localhost:3000/thanks',
        vads_version:'V2'

    };
    var values = _.values(params);
    var concatenateString = values.join("+");
    Meteor.call('computeSignature', concatenateString, (err, res) => {
        Session.set("isProcessing", false);
        if (err) {
            console.log(err)
        }
        else {
            Session.set("processStarted", true);
            this.$('input[name=signature]').val(res);
            $('#payment').trigger('click');

        }
    })
}

function shippingAddress() {
    if(Meteor.user()){
         return Meteor.user().profile.address[Session.get('currentEditAddDelivery')];
    }
}

function billingAddress(){
    if(Meteor.user()){
        return Meteor.user().profile.address[Session.get('currentEditAddDelivery')];
    }
}

function getIsoCode(countryName){
    let country = Countries.findOne({
        name: countryName.replace("-", " ")
    });
    return country && country.isoCode
}
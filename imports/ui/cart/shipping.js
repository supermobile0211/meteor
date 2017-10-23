Template.shipping.onRendered (function() {
    Session.setPersistent('totalPrice', []);
    Session.setPersistent('temp', false);
    Session.setPersistent('grandTotal', []);
    Session.setPersistent('ShippingTotal', []);
    Session.set('grandTotal', []);
    Session.set('eachTableShipping', []);
    Session.set('shippingArray', []);
    Session.set('selectedShippingArray', []);
    Session.set('totalShipping', 0);
    Session.set('calcGrandTotal', 0);
    Session.set('deliveryCountry', Meteor.user() && Meteor.user().profile.address[Session.get('currentEditAddDelivery')] &&
        Meteor.user().profile.address[Session.get('currentEditAddDelivery')].country || 'France');
    if(Session.get('userOffer')){

        //grouped by vendorId and save all values in productsGroupByVendor.
        let carts = _.groupBy(Session.get('userOffer'), 'vendorId');
        var productsGroupByVendor = _.values(carts);
        Session.setPersistent('productsGroupByVendor', productsGroupByVendor);
    }
    else{
        Session.setPersistent('productsGroupByVendor', []);
    }

    //select default one or first shipping method by default selected
    Meteor.setTimeout(function(){
        this.$('.dropdown-ele-0').trigger('click');
    });
});

Template.shipping.events ({
    'click #save': (e, t)=>{
        Session.set('step', Session.get('step') + 1);
    },

    'click #previous-step2': function(evt, temp){
        Session.set('step', Session.get('step') - 1);
    },

    'change .product-qty': function(e, t){

        let products = Session.get('productsGroupByVendor'),
            index = e.currentTarget.attributes.index.value,
            parentIndex = e.currentTarget.attributes.parentIndex.value,
            id = `#product-qty-${parentIndex}${index}`,
            userOffer = Session.get('userOffer'),
            offerId = e.currentTarget.attributes.offer.value,
            offerIndex = userOffer.findIndex((obj => obj.offer == offerId));

        userOffer[offerIndex].qty = Number($(id).val());
        Session.set('userOffer', userOffer);

        products[parentIndex][index].qty = Number($(id).val());
        Session.setPersistent('productsGroupByVendor', products);
    },

    'click #increment': function(e, t){
        let products = Session.get('productsGroupByVendor'),
            index = e.currentTarget.attributes.index.value,
            parentIndex = e.currentTarget.attributes.parentIndex.value,
            userOffer = Session.get('userOffer'),
            offerId = e.currentTarget.attributes.offer.value,
            offerIndex = userOffer.findIndex((obj => obj.offer == offerId));

        userOffer[offerIndex].qty += 1;
        Session.set('userOffer', userOffer);
        products[parentIndex][index].qty += 1;
        Session.setPersistent('productsGroupByVendor', products);
    },

    'click #decrement': function(e, t){
        let products = Session.get('productsGroupByVendor'),
            index = e.currentTarget.attributes.index.value,
            parentIndex = e.currentTarget.attributes.parentIndex.value,
            userOffer = Session.get('userOffer'),
            offerId = e.currentTarget.attributes.offer.value,
            offerIndex = userOffer.findIndex((obj => obj.offer == offerId));

        if(products[parentIndex][index].qty > 0){
            userOffer[offerIndex].qty -= 1;
            Session.set('userOffer', userOffer);

            products[parentIndex][index].qty -= 1;
            Session.setPersistent('productsGroupByVendor', products);
        }
    },

    'click #remove': function(e, t){
        let products = Session.get('productsGroupByVendor'),
            index = e.currentTarget.attributes.index.value,
            parentIndex = e.currentTarget.attributes.parentIndex.value,
            parentArray = products[parentIndex],
            removeObj = parentArray[index],
            userSelectedOffers = Session.get('userOffer'),
            indexInUserOffers = userSelectedOffers.findIndex( obj => obj.offer == removeObj.offer );
        userSelectedOffers.splice(indexInUserOffers, 1);
        Session.setPersistent('userOffer', userSelectedOffers);
        parentArray.splice(index, 1);
        parentArray.length && (products[parentIndex] = parentArray);
        parentArray.length || products.splice(parentIndex, 1);
        Session.setPersistent('productsGroupByVendor', products);
    },

    'click .shipping-dropdown-item': function(e, t){
        let attributes = e.currentTarget.attributes;
        Session.set(`selectedCarrierForTable${attributes.parent.value}`, attributes.index.value)
    }
});


Template.shipping.helpers ({

    eachOfferSum: (index) => {
        return eachOfferSum(index);
    },

    eachTableShipping: (pIndex) => {
        return eachTableShipping(pIndex)
    },

    totalCalPrice: (index, shipping) =>{
        return eachOfferSum(index) + Number(shipping);
    },

    grandTotalWithShipping: (shipping) => {
        let orderAmount = shipping + Session.get('calcGrandTotal');
        Session.setPersistent('orderAmount', orderAmount);
        return orderAmount;
    },

    eachOfferShipping: (data) => {

        //get available shipping service of this offer.
        let shippings = Offers.findOne({_id: data.offer});
        //return array of shipping ids.
        return shippings && shippings.shipping
    },

    //get Carrier object by id.
    shippingOptions: (id) => Carrier.findOne({_id: id}),

    availableCarriers: (arr, index) => {

        let query, totalWeight, packageWidth, packageHeight, packageDepth, countryName, countryObj, carriers;
        countryName = Session.get('deliveryCountry');
        if(countryName){

            //assign initial values.
            totalWeight = 0;
            packageWidth = 0;
            packageHeight = 0;
            packageDepth = 0;
            countryObj = Countries.findOne({name: countryName});

            if(countryObj){

                //calculating total weight, width, height and depth of order.
                arr.forEach(function(obj){
                    let offerObj = Offers.findOne({_id: obj.offer});
                    if(obj.qty > 0 && offerObj){
                        totalWeight += (obj.qty * Number(offerObj.packageWeight));
                        packageWidth += (obj.qty * Number(offerObj.packageWeight));
                        packageHeight += (obj.qty * Number(offerObj.packageHeight));
                        packageDepth += (obj.qty * Number(offerObj.packageDepth))
                    }
                });

                //create query for getting only matched carriers.
                query = {
                    vendorId: arr[0].vendorId,
                    'ranges.min': {$lte: totalWeight},
                    'ranges.max': {$gte: totalWeight},
                    'ranges.allowedCountry.countryId': countryObj._id,
                    packageWidth: {$gte: packageWidth},
                    packageHeight: {$gte: packageHeight},
                    packageDepth: {$gte: packageDepth}
                };

                carriers = Carrier.find(query).fetch();
                Session.set(`table${index}`, carriers);
                Session.set(`weightOfTable${index}`, totalWeight);
                Session.set(`DeliveryCountryId`, countryObj._id);
                return carriers;
            }

        }

    },

    selectedCarrier: (index, key) => {
        let selectedCarrierIndex, carrierArray = Session.get(`table${index}`),
            selectedShippingArray = Session.get('selectedShippingArray'),
            tableLength = Session.get(`productsGroupByVendor`).length ;

        if( tableLength < selectedShippingArray.length ){
            selectedShippingArray.splice(tableLength)
        }
        if(carrierArray && carrierArray.length){
            if(Session.get(`selectedCarrierForTable${index}`) < carrierArray.length){
                selectedCarrierIndex = Session.get(`selectedCarrierForTable${index}`) || 0;
                selectedShippingArray[index] = carrierArray[selectedCarrierIndex]._id;
                Session.set('selectedShippingArray', selectedShippingArray);
                return carrierArray[selectedCarrierIndex][key]
            }
            else{
                Session.set(`selectedCarrierForTable${index}`, 0);
            }

        }
        else{
            selectedShippingArray[index] = '';
            Session.set('selectedShippingArray', selectedShippingArray);
        }
    },

    hasCarrier: (index) => {
        let selectedShippingArray = Session.get('selectedShippingArray');
        if(selectedShippingArray){
            return !selectedShippingArray[index];
        }
    },

    appliedRange: (index, arr) => {

        //Declaration.
        let weight, selectedObj, shippingArray, tableLength;

        //get current table weight
        weight = Session.get(`weightOfTable${index}`);
        shippingArray = Session.get(`shippingArray`);

        tableLength = Session.get(`productsGroupByVendor`).length;
        if( tableLength < shippingArray.length ){
            shippingArray.splice(tableLength)
        }

        if(arr && arr.length){
            //find price object according to current table weight.
            selectedObj = arr.find((obj) => {
                if(obj.min <= weight && obj.max >= weight){
                    return obj
                }
            })
            .allowedCountry.find((countryObj) => {
                if(countryObj.hasOwnProperty('countryId')) {
                    return countryObj.countryId == Session.get(`DeliveryCountryId`)
                }
            });

            //store shipping price in shipping array.
            shippingArray[index] = Number(selectedObj.price);
            Session.set(`shippingArray`, shippingArray);

            return selectedObj;
        }
        else{
           shippingArray[index] = 0;
            Session.set(`shippingArray`, shippingArray);
        }
    },

    shippingTotalAmount: function(){
        let shippingAmount = Session.get(`shippingArray`);
        if(shippingAmount && shippingAmount.length){
            let grandTotalShipping = shippingAmount.length > 1 ? shippingAmount.reduce( (o, n) => o + n ) : shippingAmount[0];
            Session.set('totalShipping', grandTotalShipping);
            Session.set('grandShipping', grandTotalShipping);
            return grandTotalShipping;
        }
    },

    selectedShippingPrice: (key, productId, pIndex, index) => {
        if(Session.get(key)){
            let ranges, productWeight, products, shipping;
                ranges = Carrier.findOne({_id: Session.get(key)});
                ranges = ranges && ranges.ranges || [];
                productWeight = Products.findOne({_id: productId});
                productWeight = productWeight && productWeight.weight || 0;
                products = Session.get('productsGroupByVendor');
                shipping = Session.get('eachTableShipping');
            if( products && products[pIndex] && products[pIndex][index] && products[pIndex][index].qty ){
                var eachShipping = ranges.find((obj) => {

                    return obj.min <= productWeight && obj.max >= productWeight
                });
                eachShipping = eachShipping && eachShipping.allowedCountry[0].price * products[pIndex][index].qty;
            }
            if (shipping[pIndex]) {
                shipping[pIndex][index] = eachShipping;
            }
            else shipping[pIndex] = [eachShipping];
            Session.set('eachTableShipping', shipping);
            return eachShipping;
        }
    },

    getGrandTotal: () => {
        let grandTotal = Session.get('grandTotal');
        Session.setPersistent('calcGrandTotal', grandTotal && grandTotal.length && grandTotal.reduce( (o, n) => o + n , 0));
        return Session.get('calcGrandTotal');
    },

    currentCart: function(index, parentIndex){
        var collectionOfObj = [this];
        Session.setPersistent('current_' + index, collectionOfObj);
        return this;
    },


    totalPrice: function(){
        let offerPrice = Offers.findOne({_id: this.offer}) && Offers.findOne({_id: this.offer}).price;
        return offerPrice * this.qty;
    },


    multiCarts: function(){
        return Session.get('productsGroupByVendor');
    },

    checkCarrier: function(){
        let index, btnDisabled = false,
            products = Session.get('productsGroupByVendor');

        if(products && products.length){
            for(index = 0; index < products.length; index++){
                if(Session.get(`table${index}`) && !Session.get(`table${index}`).length){
                    btnDisabled = true;
                    break;
                }
            }
        }

        return btnDisabled;
    },


    cartProducts: function(){
        return Session.get('userOffer');
    },

    product: function(){
        return Products.findOne({_id: this.product});
    },

    offer: function(){
        return Offers.findOne({_id: this.offer});
    },


    vendorName: function(){
        let offerId = this.offer;
        let vendorID =  Offers.findOne({_id: offerId}) && Offers.findOne({_id: offerId}).vendor;
        return Meteor.users.findOne({_id: vendorID}) && Meteor.users.findOne({_id: vendorID}).username;
    },

    shipping: function(){
        return Offers.findOne({_id: this.offer});
    },



    //TODO
    shippingMethod: function(){
        var currentOffer = Session.get('userOffer');
        var offer_id = currentOffer && currentOffer[0].offer;
        var offers = Offers.findOne({_id: offer_id});
        var shippingId = offers && offers.shipping && offers.shipping[0];
        Session.set('carrierName', Carrier.find({_id: shippingId}).fetch());
        return Carrier.find({
            _id: shippingId
        }).fetch();
    },

    carrierName: function(){
        return Session.get('carrierName') && Session.get('carrierName')[0] && Session.get('carrierName')[0].name;
    }
});

function eachOfferSum(index){

    let products = Session.get('productsGroupByVendor'),
        grandTotal = Session.get('grandTotal');
    if( products && products[index] && products[index].length){
        let offerSum = products[index].map( (obj) => {
            let offer = Offers.findOne({_id: obj.offer});
            return offer && offer.price * obj.qty;
        }).reduce( (o, n) => o + n , 0);
        grandTotal[index] = offerSum;
        Session.setPersistent('grandTotal', grandTotal);
        return offerSum;
    }
    else{
        Session.setPersistent('grandTotal', [0]);
    }

}

function eachTableShipping(pIndex){
    let shipping = Session.get('eachTableShipping');
    if( shipping && shipping[pIndex] ){
        return shipping[pIndex].length > 1 ? shipping[pIndex].reduce( (o, n) => o + n ) : shipping[pIndex][0];
    }
    else return '';
}
import numeral from 'numeral';

/********** replace Images for sending  in translation  **********/
replaceImages = function ( content, count ) {
    if( !content ){
        return;
    }
    var link = '<imaggg>',
        images1  = [],
        reg = /<img[^>]*?>[\s\S]*?/gi;
    for ( var i = 0; i < count; i++ ){
        var matches = content.match( reg );
        matches = matches.length > 0 ? matches[0] : matches;
        images1.push(matches.toString());
        content = content.replace( matches, link );
    }
    return {
        images: images1,
        content: content
    }
};

getCurrencySymbol =  function(){
    return Currencies.findOne() && Currencies.findOne({
        name: Session.get('currentCurrency') || 'Euro'
    }).symbol
};

/********** translate features in different values  **********/
translateFeatures = function( features, originalFeatures){
    var translatedFeatures = [], index, values;
    features = filterFeatures(eliminate(features.split(' <chocha> ')));
    for ( var i = 0; i < features.length; i++ ){
        features[i] = features[i].trim().split('<chocha/>');
        features[i][1] && (values = features[i][1].split('&&'));
        index = values.splice(values.length - 1, 1);
        index = index[0] && index[0].split(",");
        index = index ? index[0]: index;
        translatedFeatures.push({
            //fall back to original values for name and values
            name: features[i][0] ? features[i][0] :originalFeatures.values[i].name,
            values: values[0] ? eliminate(values[0].split(',')) : originalFeatures.values[i].values,
            index: index
        })
    }
    return translatedFeatures;
};

/********** eliminate extra features  **********/
filterFeatures = function(array){
    return array.filter(function(ele){
        return ele.indexOf('<chocha/>') != -1
    });
};

//repopulate images to save in db
populateImages = function ( content, count, images ){
    if( !content ){
        return;
    }
    for (var i = 0; i < count; i++){
        content = content.replace('<imaggg>', images[i]);
    }
    return content;
};

/********** for all translatable objects  **********/

getTranslation = ( t, key, notExist )=>{

    var translation = _.filter( t, function(obj) {
        return obj.language == Session.get('currentEditLang');
    });

    if( translation.length ){
        if( key ){
            return translation[0] && translation[0][key];
        }
        else {
            return translation[0];
        }
    }
    else {
        if( notExist ){
            return;
        }
        if( key ){
            return t && t[0] && t[0][key];
        }
        else{
            return t && t[0];
        }
    }
};

/********** getting filtered  keys form array **********/
filterKeys = ( obj, key )=>{
    return obj.map((data)=>{
        return data[key];
    })
};

/********** Check Invalid Date String **********/
//TODO: check date from instance or core methods
isDate = ( date )=>{
    return date == 'Invalid Date';
};

//TODO: replace it with _.uniq
unique = (a) =>{
    a = a.filter(function(data){
        return data != undefined
    });
    for (var i = 0; i < a.length; ++i) {
        for (var j = i + 1; j < a.length; ++j) {
            if (a[i] === a[j] || a[j] == undefined)
                a.splice(j--, 1);
        }
    }
    return a;
};

/********** Data URI to Blob **********/
dataURItoBlob = function(files) {
    var binary = atob(files.split(',')[1]);
    var array = [];
    for(var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)],{type: 'image/jpeg'});
};

/********** change is valid image url **********/
validUrl = function (url) {
    return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
};

//preSelectedFeatures = function( id ){
//    var preSelectedFeatures = [];
//    var selectionChoices = Features.find({}).fetch();
//    var preSelected = selectionChoices[0] && selectionChoices[0].translation[Session.get('currentEditLang') || 'en'];
//    if( preSelected ){
//        preSelected.forEach((feature, index)=>{
//            if( feature.defaultInAll ){
//                preSelectedFeatures.push(index)
//            }
//            if ( id ){
//                if(feature.defaultIn.includes(id)){
//                    preSelectedFeatures.includes(id) || preSelectedFeatures.push(index)
//                }
//            }
//        })
//    }
//    Session.set('preSelectedFeatures', preSelectedFeatures);
//};


//checkDefaulltIn = function(array, id){
//    var preSelectedFeatures = [];
//    var selectionChoices = Features.find({}).fetch();
//    var preSelected = selectionChoices[0] && selectionChoices[0].translation[Session.get('currentEditLang') || 'en'];
//    if( preSelected ){
//        preSelected.forEach(function(feature, index){
//            if(feature.defaultIn.includes(id)){
//                (array.includes(index) || preSelectedFeatures.includes(index)) || preSelectedFeatures.push(index)
//            }
//        })
//    }
//    return preSelectedFeatures
//};


/********** get all active Languages  **********/
allLanguages = ()=>{
    return Languages.find({
        status: true
    });
};

/********** get ISO Codes for active Languages  **********/
getLangCodes = ()=>{
    var result = Languages.find({
        status: true
    }).fetch();
    result = filterKeys(result, 'isoCode');
    return result;
};

/********** translate attributes for active Languages  **********/
translateAttributes = function( attributes ){
    var translateAttribute= [];
    var eachArray = [];
    attributes = eliminate(attributes.split('<$chocha>'));
    for ( var i = 0; i < attributes.length; i++ ){
        attributes[i] = attributes[i].trim().split('<chocha>');
        for( var j = 0; j < attributes[i].length; j++ ){
            var obj = {};
            attributes[i][j] =  attributes[i][j].trim().split('<chocha/>');
            //fall back in case of failing Translation API
            if ( attributes[i][j][0] || attributes[i][j][1] ){
                typeof attributes[i][j][0] == 'string' && (attributes[i][j][0] = attributes[i][j][0].trim());
                typeof attributes[i][j][1] == 'string' && (attributes[i][j][1] = attributes[i][j][1].trim());
                //attributes[i][j][0] != ',' && attributes[i][j][0] != '' && (obj[attributes[i][j][0]] = attributes[i][j][1]) && eachArray.push(obj);
                attributes[i][j][0] != ',' && attributes[i][j][0] != '' && (obj[attributes[i][j][0]] = attributes[i][j][1]);
                attributes[i][j][0] != ',' && attributes[i][j][0] != '' && eachArray.push(obj);
            }

        }
        eachArray.length && translateAttribute.push(eachArray);
        eachArray = [];
    }
    return translateAttribute;
};

/********** eliminate empty values  **********/
//TODO: replace it with underscore _.filter whenever used
eliminate = function(array){
    return array.filter(function(f) {
        return f;
    });
};

/********** show swal with less values  **********/
showSwal = function ( title, text, type ){
    swal({
        title: title,
        text: text,
        type: type
    });
};

/********** image convert to base64  **********/
convertBase64 = function (url, callback){
    Meteor.call('getImage', url, function (err, res) {
        callback(res);
    })
};

/********** call this every page which user details needed **********/
getUserLocation = (flag) => {
    //$.ajax({
    //    url: 'http://ip-api.com/json',
    //    type: 'GET',
    //    success: function(json)
    //    {
    //        Session.set('userLocation' , json);
    //    },
    //    error: function( err )
    //    {
    //        console.log("Request failed, error= " + err);
    //    }
    //});
    Meteor.call('getInformation', function(err, res){
        if( err ){
            console.log("Request failed, error= " + err);
        }
        else{
            Session.setPersistent('userLocation' , res);
            if(flag){
                Meteor.call('updateIps', res, function(e, r){
                    console.log("updated...")
                });
            }
        }
    });
};

/********** get single attributes names only  **********/
getAttributesName = (attr) => {

    if(attr && Object.keys(attr).length){

        //get key name according to current language, and initialize empty object.
        let selectedLang = Session.get('currentEditLang') || 'en', attribute = {};
        attr[selectedLang].forEach(arr => {

            //create key from 0 index of selectedLang array.
            let keyName = Object.keys(arr[0])[0];

            //add key in attribute obj.
            attribute[keyName] = ''
        });

        //return attribute keys.
        return Object.keys(attribute);
    }
    return [];
};

/********** get key value pairs  **********/
selectedAttributes = (attr, name) => {
    if(Object.keys(attr).length){
        //get key name according to current language, and initialize empty object.
        let selectedLang = Session.get('currentEditLang') || 'en', attribute = {};
        attr[selectedLang].forEach(arr => {
            var keyName = Object.keys(arr[0])[0];
            attribute[keyName] = arr.reduce( (old, curr) =>  [...old, curr[keyName]], 0);
        });
        return attribute[name];
    }
    return [];
};

/********** get root Category  **********/
parentRootCategory= function() {
    return Categories.find({
        parent: {$exists: false}
    }).fetch();
};

/********** apply select2 dynamically  **********/
applySelectTo = function(id){
    (function(domId){
        Meteor.setTimeout(function(id) {
            $('#' +domId).select2({});
        },50);
    })(id)
};

/**********show count of products in cart**********/

cartProductLength = function(){
    if( Session.get('userOffer') && Session.get('userOffer').length ){
        return Session.get('userOffer').map(obj => obj.qty).reduce((a, b) => a + b)
    }
    else return 'empty';
};

/**********  for whole application with comparisation to jS values **********/
capitalizeFirstLetter = function (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

/********** get single document with ID **********/
getDocument = (id, Collection)=> {
    return Collection.findOne({
        _id: id
    })
};

/********** get Vendor commession for any order **********/
getVendorCommission = (productId)=> {
    var product = getDocument(productId, Products);
     if(product && (product.commission || product.inheritedCommission )){
        return product.commission ? product.commission : product.inheritedCommission
    }
    else{
        return 10
    }
};


/********** find index of key or deep keys  **********/
findSearchIndexes = (values, key, deepValue)=> {
    if( deepValue ){
        return _.findIndex(values, (value)=> {
            return value[deepValue] == key
        })
    }
    else{
        return _.findIndex(values, key)
    }
};

/********** scroll on infoWindow Clicked  **********/
infoClicked = function( objId, e ){
    if(objId){
        var elem = $('#' + objId);
        $('.offerContent').removeClass('selected');
        elem.addClass('selected');
        //TODO: get the dynamic parent div top
        //var offset = elem.position().top + 1112;
        var offset = elem.position().top + 1235;
        if( objId && offset >= 0 ){
            $("body .productContainer").animate({ scrollTop: offset });
        }
    }

};

addTwo = function(a, b){
    return a + b;
};

multiplyTwo = function(a, b){
    return a * b;
};


/********** check length and concatenate ... if large then given value **********/
checkLength = (arr, key, len) => {
    let text = getTranslation(arr, key);
    if(text && text.length > len) return `${text.substring(0, len)}...`;
    else return text;
};

/********** get Default Category ... if categories Subscribed **********/
getDefaultCategory = () => {
    return Categories.findOne({
        'translation.name':'Default Category'
    })
};

currentOrder = () => {
    return getDocument(FlowRouter.current().params.id, Orders);
};

/********** convert scientific values into fixed values **********/
LargeFixedValues = function(x) {
    var e;
    if (Math.abs(x) < 1.0) {
         e = parseInt(x.toString().split('e-')[1]);
        if (e) {
            x *= Math.pow(10,e-1);
            x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
        }
    } else {
         e = parseInt(x.toString().split('+')[1]);
        if (e > 20) {
            e -= 20;
            x /= Math.pow(10,e);
            x += (new Array(e+1)).join('0');
        }
    }
    return x;
};

/********** get user location address on map **********/
getUserAddress = (id) => {
    var user = getDocument(id, Meteor.users);
    return user && user.profile.address[0]
};

generateAffiliateUrl = (url) =>{
    if(!url){
        url = Meteor.absoluteUrl()
    }
    return url + `?af=${Meteor.userId()}`
};

getOrderStatusObj = (name) => {

    //get all status from db
    let status = Settings.findOne({});

    if(status){

        //return selected status color code.
        return status.orders.find((obj) => {
            return obj.translation.find((transObj) => transObj.name == name )
        });

    }

};


/********** Invoice upload to Server **********/
uploadInvoice = function (orderId, editor, callback){
    var existingimageName;
    if ( FlowRouter.current().params.id ) {
        var generateName = FlowRouter.current().params.id.split("").join("/") + '/' + FlowRouter.current().params.id + Math.random().toPrecision(5).replace(".", ""),
            invoiceName = Session.get('invoiceFrom') == 'vendor' ? 'invoices/v/' + generateName : 'invoices/m/' + generateName;
    }
    Session.set('inProgress', true);

    var file = $('#inputInvoice').prop('files')[0];
    if(file.name){
        invoiceName += "." + file.name.split('.').pop();
    }

    //IMPORTANT TODO: shifting privite keys to meteor config or environment variables
    AWS.config.update({
        accessKeyId: "AKIAIGJTZEZTQ6WJF2EA",
        secretAccessKey: "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",
        region: "eu-central-1"
    });
    var s3 = new AWS.S3({
        params: {
            Bucket: "market-place-invoices",
            region: "eu-central-1"
        }
    });

    var params = {
        Key: invoiceName,
        Body: file,
        ACL: 'public-read'
    };

    events = s3.upload(params, function(error, downloadUrl){
        Session.set('inProgress', false);
        Session.set('uploadingProgress', 0);
        if(error){
            swal("Error", error, "error");
        }
        else{
            if (editor) {
                callback(null, {
                    fileName: file.name, downloadUrl: downloadUrl.Location
                })
            }
            swal("success", "invoice successfully uploaded")
        }

    });
    events.on('httpUploadProgress', function(progress) {
        Session.set('uploadingProgress',(progress.loaded / progress.total * 100).toPrecision(2));
    });
    events.on('success', function(response) {
    });
};

/********** minimise length and concatenate ... if large then given value **********/
minimiseLength = (string, len) => {
    if(string && string.length > len) return `${string.substring(0, len)}...`;
    else return string;
};

/********** trigger resize to get template updated **********/
triggerResize = () => {
    Meteor.setTimeout(function(){
        window.dispatchEvent(new Event('resize'));
    });
};

/********** change Date format with given values dynamically **********/
formatNumber =(num, format) => {
    if( typeof format != 'string'){
        format = '0,0.00';
    }
    return numeral(num).format(format);
};

/********** calculate basic price with tax inclusion **********/
taxInclusivePrice = function (price) {
    if(Settings.findOne()){
        var settings = Settings.findOne(),
            ordersSettings = settings.ordersSettings,
            tax = ordersSettings && ordersSettings.appliedVAT,
            result = {};
        if( tax >= 10 ) {
            result.tax  = price * Number('0.' + tax);
            result.price = price + (price * Number('0.' + tax))
        }
        else{
            result.tax  = price * Number('0.0' + tax);
            result.price = price + (price * Number('0.0' + tax));
        }
        return result
    }
    return {
        tax: 0,
        price: 0
    }
};

/********** calculate basic price with tax inclusion **********/
calculatePercentages = function (price, orderId) {
    let order = getDocument(orderId, Orders),
        settings = order.settings,
        shippingCommission =  settings.shippingCommission,
        orderCommission = order.commissionPerc,
        affiliateCommission = settings.affiliateCommission,
        VAT  = settings.VAT,
        newPrice = price / (1 + (VAT/100));
    return {
        orderCommission: price * (orderCommission/100),
        shippingCommission: price * (shippingCommission/100),
        affiliateCommission: price * (affiliateCommission/100),
        tax: (price - newPrice),
        exclusive : newPrice
    };
};

getOrderSettings = () => {
    let settings = Settings.findOne();
    return settings && settings.ordersSettings;
};

productName = (productId) => {
    let product = Products.find({_id: productId}).fetch();
    return product.length ? getTranslation(product[0].translation, 'name') : '';
};

/********** prepend 0 if value < 10 **********/
zeroPadNum =(val) => {
    return (`0${val}`).slice(-2)
};
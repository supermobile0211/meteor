/**
 * Created by appBakerz - 05 on 15-Nov-16.
 */

var env = process.env;
import uuid from 'uuid';
import soap from 'soap';
import crypto from 'crypto';
import dateFormat from 'dateformat';

var config = {
    systemPay: {
        shopId:24937366,
        url:'https://paiement.systempay.fr/vads-ws/v5?wsdl',
        cert:'1018401849976287',
        mode:env != 'production' ? 'TEST' : 'PRODUCTION'
    }
};

var systemPay = function(){
    var now = new Date();
    now.setHours(now.getHours()-5);
    this.shopId = config.systemPay.shopId;
    this.cert = config.systemPay.cert;
    this.url = config.systemPay.url;
    this.mode = config.systemPay.mode;
    this.timestamp = dateFormat(now, "yyyy-mm-dd'T'HH:MM:ss'Z'");
    this.requestId = uuid.v4();
};
var b = new systemPay();

systemPay.prototype.execute = function(fname, args, cb){
    var systemPay = this;
    soap.createClient(systemPay.url, {
        ignoredNamespaces: { namespaces: [], override: true }
        //ignoreBaseNameSpaces : true
    }, function(err, client) {
        if(err){
            return cb(err);
        }
        var code = crypto.createHmac("sha256", systemPay.cert).update(systemPay.requestId+''+systemPay.timestamp).digest("base64");
        console.log("code", code);

        client.addSoapHeader({
            shopId:systemPay.shopId,
            requestId:systemPay.requestId,
            timestamp:systemPay.timestamp,
            mode:systemPay.mode,
            authToken:code
        });
        console.log("client.soapHeaders", client.soapHeaders);

        client[fname](args, function(err, result, raw, soapHeader) {
            if(err){
                console.log('ERROR');
                console.log("err.body", err.body);
            }else{
                console.log("result", fname, result)
                console.log("raw", fname, raw)
                console.log("soapHeader", fname, soapHeader)
            }
        });

    });
};

module.exports = systemPay;
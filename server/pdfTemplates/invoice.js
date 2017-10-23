/**
 * Created by appBakerz - 05 on 27-Feb-17.
 */


/********** calculate basic price with tax inclusion **********/
let taxInclusivePrice = function (price) {
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
            result.tax  = Number((price * Number('0.0' + tax)).toFixed(2));
            result.price = Number((price + (price * Number('0.0' + tax))).toFixed(2));
        }
        result.total = (result.tax + result.price).toFixed(2);
        return result
    }
    return {
        tax: 0,
        price: 0
    }
};


export function invoiceTemplate(order, user){
    let calculation = taxInclusivePrice(order.details[0].totalPrice);
    return `
    <html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Document sans nom</title>
    <style>

        td, th {
            padding: 0;
        }

        .table > thead > tr > th {
            vertical-align: bottom;
            border-bottom: 2px solid #ddd;
        }

        .table > caption + thead > tr:first-child > th, .table > colgroup + thead > tr:first-child > th, .table > thead:first-child > tr:first-child > th, .table > caption + thead > tr:first-child > td, .table > colgroup + thead > tr:first-child > td, .table > thead:first-child > tr:first-child > td {
            border-top: 0;
        }

        .table {
            width: 100%;
            max-width: 100%;
            margin-bottom: 20px;
        }

        .table-striped > tbody > tr:nth-of-type(odd) {
            background-color: #f9f9f9;
        }
        tfoot > tr.preTotal:first-child {
            border-top: 3px solid #2297c7;
        }

        tr.preTotal {
            font-weight: 600;
        }

        tfoot .total {
            background: #2297c7;
            color: #FFF;
            font-weight: 900;
        }

        .table > thead > tr > th, .table > tbody > tr > th, .table > tfoot > tr > th, .table > thead > tr > td, .table > tbody > tr > td, .table > tfoot > tr > td {
            border-top: 1px solid #e7eaec;
            line-height: 1.42857;
            padding: 8px;
            vertical-align: top;
        }


        body {background: #ccc; font-family: Arial, Helvetica, sans-serif; font-size: 3.5mm}
        .invoiceContainer {
            width: 210mm;
            height: 297mm;
            margin: auto;
            background: #fff;
        }

        .invoice {
            padding: 15mm
        }

        .invoiceContainer .top {
            height:260mm;
        }

        .invoiceContainer .footerContainer {
            height:37mm;
        }

        .invoiceContainer .footerContainer .footer {
            padding-left: 15mm;
            padding-right: 15mm;
            text-align:center;
            color: #666;
            font-size: 2.5mm;
        }

        .pageCount {
            text-align:center;
            color: #666;
            font-size:3mm;
            margin-top: 2mm;

        }

        .table.details {
            font-size: 3mm;
            margin-top: 10mm
        }

    </style>
</head>

<body>
<div class="invoiceContainer">
    <div class="top">
        <div class="invoice">
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td valign="middle">$LOGO COMPANY PICTURE HERE</td>
                    <td align="right" valign="middle"><h1>INVOICE</h1></td>
                </tr>
                <tr>
                    <td><h3>Billing address</h3>
                        <p>${user.profile.name} $customerSurname<br />
                            ${user.profile.address[order.billingAddress].streetAddress}
                            <br />
                            ${user.profile.address[order.billingAddress].city} ${user.profile.address[order.billingAddress].zipCode}<br />
                            ${user.profile.address[order.billingAddress].country}
                            <br />
                        </p>
                        <h3>Shipping address</h3>
                        <p>${user.profile.name} $customerSurname<br />
                            ${user.profile.address[order.shippingAddress].streetAddress} <br />
                            ${user.profile.address[order.shippingAddress].city} ${user.profile.address[order.shippingAddress].zipCode}<br />
                            ${user.profile.address[order.shippingAddress].country} </p></td>
                    <td align="right"><h3>${order.company}<br />
                        $companyStreet<br />
                        $companyCity $companyZIPCODE<br />
                        $companyCountry<br />
                        $companyOtherInfo</h3></td>
                </tr>
                <tr>
                    <td><strong>Order number:</strong> ${order._id}<br />
                        <strong>Order date:</strong> ${moment(order.createdAt).format("MMM Do YY")}</td>
                    <td><strong>Invoice number:</strong> #123456789<br />
                        <strong>Order related number:</strong> 7894512</td>
                </tr>
                <tr>
                    <td colspan="2">
                        <table class="table table-striped details" cellspacing="0">
                            <thead>
                            <tr>
                                <th align="center">ID</th>
                                <th>product</th>
                                <th class="text-right" align="right">Price <small>(tax excl.)</small></th>
                                <th class="text-right" align="right">Price <small>(tax incl.)</small></th>
                                <th class="text-center" align="center">QTY</th>
                                <th class="text-right" align="right">Total price <small>(tax excl.)</small></th>
                            </tr>
                            </thead>

                            <tbody>

                            <tr>
                                <td align="center">${order._id}</td>
                                <td>Commission: test 6</td>
                                <td align="right">${order.details[0].price} &euro;</td>
                                <td align="right">${order.details[0].price} &euro;</td>
                                <td align="center">${order.details[0].sales}</td>
                                <td align="right">${order.details[0].totalPrice} &euro;</td>
                            </tr>

                            </tbody>
                            <tfoot>

                            <tr class="preTotal">
                                <td colspan="5" align="right">Products</td>
                                <td align="right">${calculation.price} &euro;</td>
                            </tr>
                            <tr class="preTotal">
                                <td colspan="5" align="right">Taxes</td>
                                <td align="right">${calculation.tax} &euro;</td>
                            </tr>
                            <tr class="total">
                                <td colspan="5" align="right">Total</td>
                                <td align="right">${calculation.total} &euro;</td>
                            </tr>

                            </tfoot>

                        </table>
                    </td>
                </tr>
                <tr>
                    <td colspan="2">&nbsp;</td>
                </tr>
            </table>
        </div>
    </div>

    <div class="footerContainer">
        <div class="footer"> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi ultricies feugiat mollis. Sed id nisi sed velit dapibus sodales. In vel iaculis nisi. In hac habitasse platea dictumst. Maecenas finibus, nisl id vestibulum egestas, nisi lectus lacinia ipsum, et eleifend quam est nec tellus. Etiam molestie ipsum odio, ac condimentum justo faucibus eu. Phasellus commodo mollis neque in faucibus. Ut placerat lacus ligula, vitae vehicula tortor porttitor vitae. Nunc et ornare lectus. Proin mollis vitae turpis nec gravida. Nullam et leo posuere, porta quam a, consectetur tortor. Curabitur eget lectus ac risus auctor cursus a quis ex. /<br />
            $ComanyName $companyStreet $companyCity $companyZIPCODE $companyCountry $companyOtherInfo
        </div>
        <div class="pageCount">Page 1/1</div>
    </div>
</div>
</body>
</html>
`
}
var admin = Meteor.users.findOne({
        'emails.address':'admin@admin.com'
    }),

    customer = Meteor.users.findOne({
        'emails.address':'marketsol123bis@gmail.com'
    }),

    vendor = Meteor.users.findOne({
        'emails.address':'vendor@vendor.com'
    }),

    vendor1 = Meteor.users.findOne({
        'emails.address':'vendor1@vendor.com'
    }),

    vendor2 = Meteor.users.findOne({
        'emails.address':'vendor2@vendor.com'
    }),

    vendor3 = Meteor.users.findOne({
        'emails.address':'vendor3@vendor.com'
    }),

    vendor4 = Meteor.users.findOne({
        'emails.address':'vendor4@vendor.com'
    }),
    vendor5 = Meteor.users.findOne({
        'emails.address':'vendor5@vendor.com'
    }),

    testVendor = Meteor.users.findOne({
        'emails.address':'marketsol123@gmail.com'
    }),

    affiliate = Meteor.users.findOne({
            'emails.address':'affiliate@affiliate.com'}
    ),

    roles = ['admin', 'customer','vendor','affiliate'];

if( !admin ){
    try{
        admin1 = Accounts.createUser({
            username: 'superadmin',
            password: 'admin',
            email: 'admin@admin.com',
            profile: {
                name: 'superadmin',
                recentUrls: []
            }
        });
        Meteor.setTimeout(function () {
            Roles.addUsersToRoles(admin1, 'admin');
        },0);
    }
    catch( err ){

    }
}
if(!affiliate){
    try {
        var affiliate1 = Accounts.createUser({
            username: 'superaffiliate',
            password: 'affiliate',
            email: 'affiliate@affiliate.com',
            profile: {
                name: 'superaffiliate',
                recentUrls: [],
                failedPayment: 0,
                title: 'Mr.',
                firstName: 'David',
                address: '14/z AC Washington',
                country: 'United-States',
                phone: '+33 3131313',
                language: 'English',
                newsLetter: false,
                isVendor: false,
                status: true,
                vendor: {
                    company: 'Effic'
                }
            }
        });
        Meteor.setTimeout(function () {
            Roles.addUsersToRoles(affiliate1, 'affiliate');
        },0);
    }
    catch ( err ){
        //
    }
}
if( !customer ){
    try{
        customer1 = Accounts.createUser({
            username: 'supercustomer',
            password: 'customer',
            email: 'marketsol123bis@gmail.com',
            settings: {},
            profile: {
                name: 'supercustomer',
                title: 'Mr.',
                firstName: 'Johny',
                recentUrls: [],
                failedPayment: 2,
                address: [{
                    name: 'supercustomer',
                    firstName: 'Johny',
                    "address" : 'Florange',
                    "streetAddress": "gulshan e iqbal block 13-B",
                    "zipCode" : 75016,
                    "city" : 'Florange',
                    "phoneNumber" : "0612345678",
                    "phoneIsoCode": 'fr',
                    country: 'France',
                    "location" : [7.261953, 43.710173]
                }],
                country: 'United-States',
                phone: '+33 3131313',
                language: 'English',
                newsLetter: false,
                isVendor: true,
                status: true,
                vendor: {
                    company: 'sadasdsad'
                }
            }
        });
        Meteor.setTimeout(function () {
            Roles.addUsersToRoles(customer1, 'customer');
        },0);
    }
    catch ( err ){
        //
    }
}

if( !vendor ){
    try{
        vendor = Accounts.createUser({
            username: 'supervendor',
            password: 'vendor',
            email: 'vendor@vendor.com',
            settings: {},
            profile: {
                name: 'supervendor',
                title: 'Mr.',
                firstName: 'Johny',
                recentUrls: [],
                failedPayment: 4,
                address: [
                    {
                        "name" : "supervendor",
                        "firstName" : "Mickael",
                        "country" : "France",
                        "address" : "florange",
                        "streetAddress" : "gulshan e iqbal block 13-B",
                        "zipCode" : "6200",
                        "phoneNumber" : "0612345678",
                        "phoneIsoCode": 'fr',
                        "location" : [
                            6.1182819999999998,
                            49.3213739999999990
                        ]
                    },
                    {
                        "name" : "Jhon cena",
                        "firstName" : "jhon",
                        "country" : "France",
                        "din" : "",
                        "company" : "company",
                        "tva" : "test",
                        "address" : "that one is test address",
                        "additionalAddress" : "",
                        "zipCode" : "75300",
                        "city" : "florange",
                        "phoneIsoCode": 'fr',
                        "phoneNumber" : "0612345678",
                        "location" : [
                            6.118282, 49.321374
                        ]
                    },
                    {
                        name: 'shon',
                        firstName: 'David',
                        address: '14/z AC Washington',
                        country: 'United-States',
                        "city": "florange",
                        "zipCode": "75300",
                        "phoneNumber" : "0612345678",
                        "phoneIsoCode": 'us',
                        language: 'English',
                        "location": [
                            6.118282, 49.321374
                        ]
                    }
                ],
                country: 'France',
                phone: '+33 3131313',
                language: 'English',
                newsLetter: false,
                isVendor: true,
                status: true,
                vendor: {
                    company: 'Epik'
                }
            }
        });
        Meteor.setTimeout(function () {
            Roles.addUsersToRoles(vendor, 'vendor');
        },0);
    }
    catch ( err ){
        //
    }
}

if( !vendor1 ){
    try{
        vendor1 = Accounts.createUser({
            username: 'underTaker',
            password: 'vendor',
            email: 'vendor1@vendor.com',
            settings: {},
            profile: {
                name: 'underTaker',
                title: 'Mr.',
                firstName: 'underTaker',
                recentUrls: [],
                failedPayment: 0,
                address: [{
                    name: 'underTaker',
                    firstName: 'underTaker',
                    country: 'France',
                    address: 'Paris',
                    "phoneIsoCode": 'fr',
                    "phoneNumber" : "0612345678",
                    "streetAddress": "gulshan e iqbal block 13-B",
                    "location" : [2.352222, 48.856614]
                }],
                country: 'France',
                phone: '+33 3131313',
                language: 'English',
                newsLetter: false,
                isVendor: true,
                status: true,
                vendor: {
                    company: 'WWE'
                }
            }
        });
        Meteor.setTimeout(function () {
            Roles.addUsersToRoles(vendor1, 'vendor');
        },0);
    }
    catch ( err ){
        //
    }
}

if( !vendor2 ){
    try{
        vendor2 = Accounts.createUser({
            username: 'mark',
            password: 'vendor',
            email: 'vendor2@vendor.com',
            settings: {},
            profile: {
                name: 'mark',
                title: 'Mr.',
                firstName: 'mark',
                recentUrls: [],
                failedPayment: 0,
                address: [{
                    name: 'mark',
                    firstName: 'Johny',
                    country: 'France',
                    address: 'Bordeaux',
                    "phoneIsoCode": 'fr',
                    "phoneNumber" : "0612345678",
                    "streetAddress": "gulshan e iqbal block 13-B",
                    "location" : [-0.579180, 44.837789]
                }],
                country: 'France',
                phone: '+33 3131313',
                language: 'English',
                newsLetter: false,
                isVendor: true,
                status: true,
                vendor: {
                    company: 'Apple'
                }
            }
        });
        Meteor.setTimeout(function () {
            Roles.addUsersToRoles(vendor2, 'vendor');
        },0);
    }
    catch ( err ){
        //
    }
}

if( !vendor3 ){
    try{
        vendor3 = Accounts.createUser({
            username: 'HK',
            password: 'vendor',
            email: 'vendor3@vendor.com',
            settings: {},
            profile: {
                name: 'vendor3',
                title: 'Mr.',
                firstName: 'vendor3',
                recentUrls: [],
                failedPayment: 0,
                address: [{
                    name: 'vendor3',
                    firstName: 'vendor3',
                    country: 'France',
                    address: 'Marseille',
                    "phoneIsoCode": 'fr',
                    "phoneNumber" : "0612345678",
                    "streetAddress": "gulshan e iqbal block 13-B",
                    "location" : [5.369780, 43.296482]
                }],
                country: 'France',
                phone: '+33 3131313',
                language: 'English',
                newsLetter: false,
                isVendor: true,
                status: true,
                vendor: {
                    company: 'Disco'
                }
            }
        });
        Meteor.setTimeout(function () {
            Roles.addUsersToRoles(vendor3, 'vendor');
        },0);
    }
    catch ( err ){
        //
    }
}

if( !vendor4 ){
    try{
        vendor4 = Accounts.createUser({
            username: 'ronaldo',
            password: 'vendor',
            email: 'vendor4@vendor.com',
            settings: {},
            profile: {
                name: 'ronaldo',
                title: 'Mr.',
                firstName: 'Johny',
                recentUrls: [],
                failedPayment: 0,
                address: [{
                    name: 'supervendor',
                    firstName: 'Johny',
                    country: 'France',
                    "phoneIsoCode": 'fr',
                    "phoneNumber" : "0612345678",
                    address: 'Lyon',
                    "streetAddress": "gulshan e iqbal block 13-B",
                    "location" : [4.835659, 45.764043]
                }],
                country: 'France',
                phone: '+33 3131313',
                language: 'English',
                newsLetter: false,
                isVendor: true,
                status: true,
                vendor: {
                    company: 'G-Ball'
                }
            }
        });
        Meteor.setTimeout(function () {
            Roles.addUsersToRoles(vendor4, 'vendor');
        },0);
    }
    catch ( err ){
        //
    }
}

if( !vendor5 ){
    try{
        vendor5 = Accounts.createUser({
            username: 'tiger Woods',
            password: 'vendor',
            email: 'vendor5@vendor.com',
            settings: {},
            profile: {
                name: 'tiger Woods',
                title: 'Mr.',
                firstName: 'Cena',
                recentUrls: [],
                failedPayment: 0,
                address: [{
                    name: 'tiger Woods',
                    firstName: 'Cena',
                    country: 'France',
                    address: 'Colombes',
                    "phoneNumber" : "0612345678",
                    "phoneIsoCode": 'fr',
                    "streetAddress": "gulshan e iqbal block 13-B",
                    "location" : [2.253331, 48.922061]
                }],
                country: 'France',
                phone: '+33 3131313',
                language: 'English',
                newsLetter: false,
                isVendor: true,
                status: true,
                vendor: {
                    company: 'G-F_INC'
                }
            }
        });
        Meteor.setTimeout(function () {
            Roles.addUsersToRoles(vendor5, 'vendor');
        }, 0);
    }
    catch ( err ){
        //
    }
}

if( !testVendor ) {
    try {
        testVendor = Accounts.createUser({
            username: 'testVendor',
            password: 'vendor',
            email: 'marketsol123@gmail.com',
            settings: {},
            profile: {
                name: 'testVendor',
                title: 'Mr.',
                firstName: 'Cena',
                recentUrls: [],
                failedPayment: 0,
                address: [{
                    name: 'testVendor',
                    firstName: 'Cena',
                    country: 'France',
                    address: 'Nancy',
                    "phoneIsoCode": 'fr',
                    "phoneNumber" : "0612345678",
                    "streetAddress": "gulshan e iqbal block 13-B",
                    "location" : [6.184417, 48.692054]
                }],
                country: 'France',
                phone: '+33 3131313',
                language: 'English',
                newsLetter: false,
                isVendor: true,
                status: true,
                vendor: {
                    company: 'Kidco'
                }
            }
        });
        Meteor.setTimeout(function () {
            Roles.addUsersToRoles(testVendor, 'vendor');
        }, 0);
    }
    catch (err) {
        //
    }
}
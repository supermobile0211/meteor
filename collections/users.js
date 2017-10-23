UserAddressSchema = new SimpleSchema({
    location:{
        type: Object,
        index: '2dsphere',
        label: 'User verified Location',
        optional: true
    },
    //location with 2d index
    'location.$.type': {
        type: String,
        allowedValues: ['Point'],
        label: 'Type of coordinates: Point'
    },

    'location.$.coordinates':{
        type: [Number],
        decimal: true,
        label: 'User verified Location latitude',
        optional: true
    },

    //'location.lon':{
    //    type: Number,
    //    decimal: true,
    //    label: 'User verified Location longitude',
    //    optional: true
    //},
    name: {
        type: String,
        label: 'User Country Name',
        optional: true
    },
    firstName: {
        type: String,
        label: 'First Name',
        optional: true

    },
    code: {
        type: String,
        label: 'User Country Code',
        regEx: /^[A-Z]{2}$/,
        optional: true

    },

    address: {
        type: String,
        label: 'Address',
        optional: true
    },

    additionalAddress: {
        type: String,
        label: 'Additional Address',
        optional: true

    },

    zipCode: {
        type : Number,
        label: 'Zip code',
        optional: true

    },

    city: {
        type : String,
        label: 'city',
        optional: true

    },

    streetAddress: {
        type : String,
        label: 'streetAddress',
        optional: true

    },

    country: {
        type : String,
        label: 'country',
        optional: true
    },

    phone: {
        type : String,
        label: 'phone number',
        optional: true

    }

});

UserAffiliateSchema = new SimpleSchema({
    origin: {
        type: String,
        label: 'affiliated User Origin',
        optional: true
    }
});

UserVendorSchema = new SimpleSchema({
    company: {
        type: String,
        label: 'User Company',
        optional:true
    },
    contributions: {
        type: [String],
        optional: true,
        label: 'User Contributions',
        defaultValue: []
    },
    salesNo: {
        type: Number,
        label: 'User Sales No',
        optional:true
    },
    dueFromAdmin: {
        type: String,
        label: 'Due From Admin for User',
        optional:true
    },
    reviews: {
        type: Object,
        label: 'User Reviews',
        optional:true
    }
});

UserProfileSchema = new SimpleSchema({
    name: {
        type: String,
        label: 'User Name',
        optional: true
    },
    image: {
        type: String,
        label: 'User profile Image',
        optional: true
    },
    firstName: {
        type: String,
        label: 'User First Name',
        optional: true
    },
    lastName: {
        type: String,
        label: 'User Last Name',
        optional: true
    },
    title: {
        type: String,
        label: 'User Title',
        optional: true
    },

    earnings: {
        type: Number,
        label: 'User earnings',
        optional: true,
        defaultValue: 0
    },
    newsLetter: {
        type: Boolean,
        label: "User Subscribed for website news letter ?",
        optional: true
    },
    failedPayment: {
        type: Number,
        label: "Failed payment count ?",
        defaultValue: 0
    },
    partnersNews: {
        type: Boolean,
        label: "User Subscribed for website news letter ?",
        optional: true
    },
    gender: {
        type: String,
        label: 'User Gender',
        allowedValues: ['Male', 'Female'],
        optional: true
    },
    organization : {
        type: String,
        label: 'User Organization',
        optional: true
    },
    recentIps : {
        type: [Object],
        label: 'User Ips',
        defaultValue: [],
        blackbox: true
    },
    website: {
        type: String,
        label: 'User Website',
        regEx: SimpleSchema.RegEx.Url,
        optional: true
    },

    address: {
        type: [UserAddressSchema],
        label: 'User Address',
        //optional:true,
        defaultValue: [],
        blackbox: true
    },

    phone: {
        type: String,
        label: 'User Phone No',
        optional: true
    },
    language: {
        type: String,
        label: 'User Language',
        optional: true
    },
    country: {
        type: String,
        label: 'User Country',
        optional: true
    },
    isVendor: {
        type:Boolean,
        label: "User is Vendor?",
        optional: true
    },
    vendor: {
        type: UserVendorSchema,
        optional: true
    },
    affiliate: {
        type: UserAffiliateSchema,
        optional: true
    },
    status: {
        type:Boolean,
        label: "User Status",
        optional: true
    },
    purchase:{
        type: Number,
        optional: true,
        label: 'User Purchases',
        autoValue : function(){
            if (this.isInsert) {
                return 0;
            }
        }
    }

});

VendorsSchema = new SimpleSchema({
    banner: {
        type: String,
        label: "Vendor's banner",
        optional: true
    },
    avatar: {
        type: String,
        label: "Vendor avatar",
        optional: true
    },
    bages: {
        type: Object,
        label: "Vendor badges if more than one",
        optional: true
    },
    averageRating: {
        type: Number,
        label: "Vendor rating calculating from reviews",
        optional: true
    },
    description: {
        type: String,
        label: "Vendor rating calculating from reviews",
        optional: true
    },
    reviews: {
        type: Object,
        label: 'Vendor Reviews',
        optional: true
    },
    profile: {
        type: UserProfileSchema,
        label: 'Vendor Reviews',
        optional: true
    }
});

UserSchema = new SimpleSchema({
    username: {
        type: String,
        // For accounts-password, either emails or username is required, but not both. It is OK to make this
        // optional here because the accounts-password package does its own validation.
        // Third-party login packages may not require either. Adjust this schema as necessary for your usage.
        optional: true
    },
    emails: {
        type: Array,
        // For accounts-password, either emails or username is required, but not both. It is OK to make this
        // optional here because the accounts-password package does its own validation.
        // Third-party login packages may not require either. Adjust this schema as necessary for your usage.
        optional: true
    },
    "emails.$": {
        type: Object
    },
    "emails.$.address": {
        type: String,
        regEx: SimpleSchema.RegEx.Email
    },
    "emails.$.verified": {
        type: Boolean
    },
    createdAt: {
        type: Date,
        label: "users joining Date",
        autoValue: function() {
            return new Date()
        }
    },
    profile: {
        type: UserProfileSchema,
        blackbox: true,
        optional: true
    },
    // Make sure this services field is in your schema if you're using any of the accounts packages
    services: {
        type: Object,
        optional: true,
        blackbox: true
    },
    // Option 2: [String] type
    // If you are sure you will never need to use role groups, then
    // you can specify [String] as the type
    roles: {
        type: [String],
        optional: true
    },
    // In order to avoid an 'Exception in setInterval callback' from Meteor
    heartbeat: {
        type: Date,
        optional: true
    },

    settings: {
        type: Object,
        label: 'User Settings',
        optional:true,
        blackbox: true
    },

    lastLogin: {
        type: Date,
        optional: true,
        defaultValue: new Date()
    }
});

Meteor.users.attachSchema(UserSchema);

Meteor.users.allow({
    insert: function (userId) {
        return userId;
    },
    update: function (userId) {
        return userId;
    },
    remove: function (userId) {
        return userId;
    }
});
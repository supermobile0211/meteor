Reviews = new Meteor.Collection('reviews');

ReviewsSchema = new SimpleSchema({
    comment: {
        type: String,
        label: 'Review Comment'
    },
    createdAt: {
        type: Date,
        label: 'Review Creation Time',
        defaultValue: new Date()
    },
    customer: {
        type: String,
        label: 'Reviewer',
        optional: true
    },
    rating: {
        label: 'Review Rating',
        type: Array
    },
    'rating.$': {
        type: Array
    },
    'rating.$.$': {
        type: String
    },
    avgRating:{
        type: Number,
        label: 'Review Average Rating',
        decimal: true
    },
    order: {
        type: String,
        label: 'Order on which given Review',
        optional: true
    },
    orderRef:{
        type: String,
        optional: true
    }
});

Reviews.attachSchema( ReviewsSchema );
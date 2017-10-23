Template.vendorReviewsTab.onRendered(()=> {

});


Template.vendorReviewsTab.helpers({

    criteria: () => {
        return ReviewsCriteria.findOne({})
    }
});

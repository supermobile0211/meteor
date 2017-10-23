Template.vendorPublicProfileReviews.onRendered(()=> {

    Session.set('pageLimit', 5);
    Session.set('pageSkip', 0);

});

Template.vendorPublicProfileReviews.helpers({
    products: function() {
        return Products.find({},{limit: 5, skip: Session.get('pageSkip')});
    }
});

/********** Template Events **********/
Template.vendorPublicProfileReviews.events({
    'click .vendorActionTools .replyToThisComment' : function(){
        idComment = $(this).data('commentID');
        $('.replyForm').attr('data-commentID', idComment).toggleClass('hide');
    },
    'click #previous' : function(e){
        e.preventDefault();
        var oldSkip = Session.get('pageSkip');
        if(oldSkip != 0){
           Session.set("pageSkip", oldSkip - 5);
        }
    },
    'click #next' : function(e){
        e.preventDefault();
        var total = Products.find().fetch().length;
        var oldSkip = Session.get('pageSkip');
        var current = oldSkip + 5;
        if(current <= total){
            Session.set("pageSkip", current);
        }
    }

});

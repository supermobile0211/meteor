var total;
Template.homepage.onRendered(function() {

    // Initialize fooTable
    this.$('.footable').footable();
    Session.set('pageLimit', 5);
    Session.set('pageSkip', 0);

    Session.set('searchQuery', false);
});

Template.homepage.helpers({
    products: function() {
        if(Session.get('searchQuery')){
            var a = Products.find({
                'translation.name': Session.get('searchQuery')
            },{
                limit: 5, skip: Session.get('pageSkip')
            },{
                sort: {
                    views: -1
                }
            }).fetch();
            return a.sort(function(x, y){
                return y.views - x.views;
            });
        }
        else {
            return Products.find({},{
                limit: 5,
                skip: Session.get('pageSkip')
            });
        }
    }
});

Template.homepage.events({
    'keyup #searchInput': function(e,t){
        if(e.target.value == ''){
            Session.set('searchQuery', false);
        }
        else{
            Session.set('searchQuery', e.target.value);
        }
    },
    'click #previous' : function(){
        var oldSkip = Session.get('pageSkip');
        if(oldSkip != 0){
            Session.set("pageSkip", oldSkip - 5);
        }
    },
    'click #next' : function(){
        if( Session.get('searchQuery') ){
            var a = Products.find({'translation.name': Session.get('searchQuery')}).fetch();
            total = a.length;
        }
        else{
            total = Products.find().fetch().length;
        }
        var oldSkip = Session.get('pageSkip');
        var current = oldSkip + 5;
        if(current <= total){
            Session.set("pageSkip", current);
        }
    }

});



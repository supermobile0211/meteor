
/********** global variable  **********/
var expandButtonJustClicked = false;

Template.searchResultCategories.helpers({
    categories: function() {
        return Categories.find({
            parent: this._id
        });
    },
    products: function() {
        return Products.find({
            category: this._id
        });
    },
    expandChild: function(childID) {

        let id, result;
        //get selected category id from Session.
        id = Session.get('currentCatId');

        //get all child categories.
        result = Categories.find({
            parent: id
        }).fetch();

        if(result.length){
            return result.map( obj => obj.parent ).includes(childID) ? 'rotate-180' : '';
        }

    },
    categoryClass: function(id){
        if(Session.get('currentCatId') == id){
            Meteor.setTimeout(function() {
                try{
                    $('.catalogTable').treetable("expandNode", id);
                }
                catch(err){

                }
            }, 100);
            $(window).trigger('resize');
            return 'active'
        }
    },
    productCount: (id)=>{
        var count = Products.find({
            category: id
        }).count();
        if( count ){
            return count
        }
    }
});

Template.searchResultCategories.events({
    'click #expandButton': function( e, t ) {
        e.preventDefault();
        // !!! Begin of the dirty hack. TODO: Fix it
        if (expandButtonJustClicked) {
            return;
        }
        expandButtonJustClicked = true;
        Meteor.setTimeout(function() {
            expandButtonJustClicked = false;
        }, 100);
        // !!! End of the dirty hack.
        var id = this._id ? this._id : this.id;
        FlowRouter.setParams({id: id});
        Session.set('currentCatId', id);
        FlowRouter.setQueryParams({page: 1});
        var node = $('.catalogTable').treetable('node', id);
        if (node && node.treeCell && node.treeCell.parent().hasClass('expanded')) {
            $('.catalogTable').treetable("collapseNode", id);
        } else {
            if (node && node.loaded != undefined) {
            $('.catalogTable').treetable("expandNode", id);
            return;
            }
            Meteor.subscribe('childCategories', id, {
                onReady: function() {
                    Meteor.subscribe('childProducts', id, {
                        onReady: function() {
                            node = $('.catalogTable').treetable('node', id);
                            $('.catalogTable').treetable("loadBranch", node, '[data-tt-parent-id="' + id + '"]');
                            $('.catalogTable').treetable("expandNode", id);
                            node.loaded = true;
                        }
                    });
                }
            });
        }
    }
});
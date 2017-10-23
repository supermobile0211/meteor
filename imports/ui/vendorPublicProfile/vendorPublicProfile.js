Template.vendorPublicProfile.onRendered(()=> {

});

Template.vendorPublicProfile.helpers({
    shareData: function() {
        return {
            title:'Market Place',
            auther: 'Market Place',
            description: 'A French Marketplace',
            summary: 'A French Marketplace',
            url: 'http://marketplace1.herokuapp.com/',
            thumbnail: 'https://s3.eu-central-1.amazonaws.com/marketplacedemomike/test.jpg',
            image: 'https://s3.eu-central-1.amazonaws.com/marketplacedemomike/test.jpg'
        }
    },
    vendor: ()=>{
       return Meteor.user() && Meteor.user().profile;
    },

    vendorDetails: ()=>{
      return  Meteor.user().profile && Meteor.user().profile.address[0]
    },

    vendorProducts: ()=>{
        return Products.find();
    }
});

Template.vendorPublicProfile.events({
    'click .fb-share':function(e){
      e.preventDefault();
        FB.ui({
            method: 'share',
            href: 'http://marketplace1.herokuapp.com/'
        }, function(response){});
    },
    'click #changePage':(e) =>{
        var page = e.currentTarget.name;
        FlowRouter.setQueryParams({page: page});
    },

    'click #next': ()=>{
        var pageNo = parseInt(FlowRouter.getQueryParam('page')) || 0;
        var page = pageNo+1;
        FlowRouter.setQueryParams({page: page});
    },

    'click #previous': ()=>{
        var pageNo = parseInt(FlowRouter.getQueryParam('page'));
        if(pageNo > 0){
            var page = pageNo-1;
            FlowRouter.setQueryParams({page: page});
        }
    }
});



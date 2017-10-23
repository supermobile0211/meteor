var modalSwiper;
var swiper;

Template.customerDashboardTab.onCreated(()=>{
    //$('.swiper-container').css({width: '100%'});
    //$('.swiper-slide').css({backgroundColor: 'white', height: '300px'});
});
Template.customerDashboardTab.onRendered(function() {

    // Initialize fooTable
    this.$('.footable').footable();
    //hack to render full modal on page refresh
    //Meteor.setTimeout(function(){
    //    modalSwiper = new Swiper ('.swiper-container', {
    //        // Navigation arrows
    //        speed: 400,
    //        spaceBetween: 100,
    //        nextButton: '.swiper-button-next',
    //        prevButton: '.swiper-button-prev'
    //    });
    //}, 1000);

    Meteor.setTimeout(function(){
        swiper = new Swiper('.swiper-container', {
            pagination: '.swiper-pagination',
            slidesPerView: 3,
            paginationClickable: true,
            spaceBetween: 30
        });
    },1000);

    Session.set('hasLength', true);

});

Template.customerDashboardTab.helpers({

    Followed:()=> Products.find({}).fetch(),

    username: ()=>Meteor.user(),

    ticketTime: ()=>{
       Session.set('ticketsDate', Tickets.findOne({}, {sort: {createdAt: -1}}) && Tickets.findOne({}, {sort: {createdAt: -1}}).createdAt);
        if(Session.get('ticketsDate')){
            return parseInt(moment(Session.get('ticketsDate')).toNow(true));
        }
    },

    duration: ()=> (moment(Session.get('ticketsDate')).toNow(true).split(" ")[1]),

    //dashboardProducts: ()=>{
    //    return Products.find({});
    //},

    lastOrder: ()=> Orders.find({}, {sort: {createdAt: -1}, limit: 1}).fetch(),

    lengthCheck: ()=> !Session.get('hasLength')
});

Template.customerDashboardTab.events({
    'click #changePage':(e) =>{
        var page = e.currentTarget.name;
        FlowRouter.setQueryParams({page: page});
    },

    'click #next, click#previous': function(e){
        e.preventDefault();
    },

    //'click #next': ()=>{
    //    var pageNo = parseInt(FlowRouter.getQueryParam('page')) || 0;
    //    var count = Products.find({}).count();
    //
    //    if(count == 0) {
    //      Session.set('hasLength', false);
    //    } else {
    //        var page = pageNo+1;
    //        FlowRouter.setQueryParams({page: page});
    //    }
    //
    //    //if(pageNo < 6){
    //    //    var page = pageNo+1;
    //    //    FlowRouter.setQueryParams({page: page});
    //    //}
    //},

    //'click #previous': ()=>{
    //    var pageNo = parseInt(FlowRouter.getQueryParam('page'));
    //    if(pageNo > 0){
    //        var page = pageNo-1;
    //        FlowRouter.setQueryParams({page: page});
    //    }
    //},

    'click #logout': ()=> {
        Meteor.logout();
        FlowRouter.go('login');
    }
});

//Template.customerDashboardTab.onDestroyed(()=>{
//    modalSwiper.destroy();
//});




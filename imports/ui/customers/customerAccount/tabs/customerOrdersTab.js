import moment from 'moment';

Template.customerOrdersTab.onRendered(function(){
    this.$('[data-toggle="tooltip"]').tooltip();
});

Template.customerOrdersTab.helpers({
    orders : (()=>{
        var data = Orders.find({user: Meteor.userId()}).fetch();
        return data.sort(function(a, b){
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

    }),

    class: ((status)=>{
        return status.toLowerCase();
    }),

    formattedDate : ((date)=>{
        return moment(this.createdAt).format('DD/MM/YYYY');
    })
});



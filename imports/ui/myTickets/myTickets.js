
Template.myTickets.onCreated(()=>{
    Session.set("TicketsFilter", false);
});

Template.myTickets.onRendered(function (){
    Session.set('TicketsFilter', {});

    // Initialize fooTable
    this.$('.footable').footable();

    // Bind normal buttons
    this.$('.ladda-button').ladda('bind', {timeout: 2000});

    // Bind progress buttons and simulate loading progress
    Ladda.bind('.progress-demo .ladda-button', {
        callback: function (instance) {
            var progress = 0;
            var interval = setInterval(function () {
                progress = Math.min(progress + Math.random() * 0.1, 1);
                instance.setProgress(progress);

                if (progress === 1) {
                    instance.stop();
                    clearInterval(interval);
                }
            }, 200);
        }
    });


    this.$('input[name="daterange"]').daterangepicker();

    // Tooltips demo
    this.$("[data-toggle=tooltip]").tooltip();

});

Template.myTickets.events({

    'change #filterDate': function ( e, t ) {
        var filter = Session.get('TicketsFilter');

        var value = t.$('#filterDate').val();
        if( value ){
            value = value.split('-');
            var dateStart = new Date(value[0]),
                dateEnd = new Date(value[1]);

            //check empty and not date values
            if(!( dateStart || dateEnd )){
                filter.createdAt && delete filter['createdAt'];
            }
            else {
                if ( isDate(dateStart) || dateStart == '' ) {
                    filter.createdAt && delete filter.createdAt['$gte'];
                }
                else {
                    if ( filter.createdAt ) {
                        filter.createdAt.$gte = dateStart
                    }
                    else filter['createdAt'] = {$gte: dateStart}
                }
                if ( isDate(dateEnd) || dateEnd == '' ) {
                    filter.createdAt && delete filter.createdAt['$lte'];
                }
                else {
                    if ( filter.createdAt ) {
                        filter.createdAt.$lte = dateEnd
                    }
                    else filter['createdAt'] = {$lte: dateEnd}
                }
            }
            Session.set("TicketsFilter", filter);
        }
    },

    'change #updateDate': function ( e, t ) {
        var filter = Session.get('TicketsFilter');

        var value = t.$('#updateDate').val();
        if( value ){
            value = value.split('-');
            var dateStart = new Date(value[0]),
                dateEnd = new Date(value[1]);

            //check empty and not date values
            if(!( dateStart || dateEnd )){
                filter.updatedAt && delete filter['updatedAt'];
            }
            else {
                if ( isDate(dateStart) || dateStart == '' ) {
                    filter.updatedAt && delete filter.updatedAt['$gte'];
                }
                else {
                    if ( filter.updatedAt ) {
                        filter.updatedAt.$gte = dateStart
                    }
                    else filter['updatedAt'] = {$gte: dateStart}
                }
                if ( isDate(dateEnd) || dateEnd == '' ) {
                    filter.updatedAt && delete filter.updatedAt['$lte'];
                }
                else {
                    if ( filter.updatedAt ) {
                        filter.updatedAt.$lte = dateEnd
                    }
                    else filter['updatedAt'] = {$lte: dateEnd}
                }
            }
            Session.set("TicketsFilter", filter);
        }
    },

    'change #sector' : ( e )=>{
        var filter = Session.get('TicketsFilter');
        var sector =  e.target.value;
        if( sector == 'all'){
            filter.sector && delete filter.sector;
        }
        else {
            filter['sector'] = sector
        }
        Session.set("TicketsFilter", filter);
    },

    'change #status' : ( e )=>{
        var filter = Session.get('TicketsFilter');
        var status = e.target.value;
        if( status == 'all' ){
            filter.hasOwnProperty('status') && delete filter['status']
        }
        else{
            filter['status'] = status
        }
        Session.set("TicketsFilter", filter);
    },

    'change #ticketId' : function( e ) {
        var filter = Session.get("TicketsFilter");
        var id = e.target.value;
        if ( !id || id == '' ) {
            filter._id && delete filter._id;
        }
        else {
            filter['_id'] = id;
        }
        Session.set("TicketsFilter", filter);
    },

    'change #ticket' : function( e ) {
        var filter = Session.get('TicketsFilter');
        var content = e.target.value;
        if ( !content || content == '' ) {
            filter._id && delete filter._id;
        }
        else {
            var query = {};
            query.content = {$regex : content + " *", $options:"i"};
            var messages = Messages.find(query).fetch(),
                ids = filterKeys(messages, 'ticket');
            //ids = unique(ids);
            if ( filter._id ){
                filter._id.$in = ids;
            }
            else{
                filter._id = { $in: ids };
            }
        }
        Session.set("TicketsFilter", filter);
    }
});


Template.myTickets.helpers({
    tickets: ()=> Tickets.find(Session.get('TicketsFilter')).fetch(),

    lastMessage: ( user, emp )=>{
        var a = Messages.find({
            sender: user,
            receiver: emp
        }).fetch();
        return a[a.length - 1] && a[a.length - 1].content
    }

});


/**
 * Created by appBakerz - 05 on 02-Feb-17.
 */



Template.vendorOrderDetails.onRendered(()=> {
    let order = currentOrder();
    if (order) Session.set('filterOrders', order.status);
});

Template.statusDropdown.helpers({

    //Note: Cancelled must contain higher index vs others.
    orderSteps: () => {
        //gte setting object
        let settings = Settings.findOne({});

        //current status object.
        let statusIndex = getOrderStatusObj(Session.get('filterOrders'));
        if(settings && statusIndex){

            //sort setting order array according to index key.
            settings.orders.sort( (a, b) => a.index - b.index );

            //current order index.
            let objIndex = settings.orders.findIndex( (obj) => obj.index == statusIndex.index );

            if(objIndex < settings.orders.length){
                let statusName = getTranslation(settings.orders[objIndex + 1].translation, 'name');
                if(statusName == 'Cancelled' || statusName == 'Cancellation'){
                    return [settings.orders[objIndex + 1]]
                }
                else{
                    return [settings.orders[objIndex + 1], settings.orders.pop()];
                }
            }

            //return settings.orders.filter( obj => typeof obj.index == 'string' || obj.index > statusIndex.index );
        }

    },

    selectedStatus: () => {
        return Session.get('filterOrders');
    },

    ordersFilterByStatus: () => {
        return Orders.findOne({_id: FlowRouter.current().params.id});
    }

});
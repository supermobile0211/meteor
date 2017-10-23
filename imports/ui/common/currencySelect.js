Template.currencySelect.onRendered(()=>{

});

Template.currencySelect.helpers({
    //isoCode: (()=>{
    //        return Countries.find();
    //}),
});

Template.currencySelect.events({
    'change #currentCurrency': (e, t)=>{
        Session.set('currentCurrency', e.currentTarget.value);
    }
});
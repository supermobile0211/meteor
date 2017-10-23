
Template.productList.helpers({

    products: ()=> Products.find({}),

    showDetailsButton: ()=> {
        let user = Meteor.user();
        if(user.hasOwnProperty('settings')) return user.settings.view === 'list';
        return true;
    },

    startPrice: function(){
        var offer = getDocument(this._id, Offers);
        if(offer && offer.bestOffer){
            return offer.bestOffer
        }
        else{
            return this.bestOffer
        }
    }

});
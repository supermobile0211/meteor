
Meteor.methods({
  removeAddressByIndex : function(index){
      check(parseInt(index), Number);
      // access data
      Meteor.users.update({_id : Meteor.userId()},
          {
              $unset: {
                  [`profile.address.${index}`]: 1
              }
          }
      );
      return Meteor.users.update({_id : Meteor.userId()},
          {
              $pull: {
                  'profile.address': null
              }
          }
      );
  }
});


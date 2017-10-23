
Meteor.methods({
   userSetting: (params)=>{
       check(params, Object);
       let settings = Meteor.user().settings || {};
       for(let key in params){
         settings[key] = params[key];
       }

       Meteor.users.update({_id:Meteor.userId()},
           {
               $set:{settings}
           }
       );
   }
});
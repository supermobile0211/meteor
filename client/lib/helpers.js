
/********** get all users except Admin **********/
currentUser = function () {
   return Meteor.users.findOne({})
};

/********** find Parents Tree till last **********/
findParent = function ( doc, list){
   if(!doc){
      return list;
   }
   list = list || [];
   if( !doc.parent || doc.parent == ''){
      list.unshift( doc._id );
      return list
   }
   else{
      list.unshift( doc._id );
      var parent = Categories.find({_id: doc.parent }).fetch()[0];
      return findParent( parent, list )
   }
};

/********** Categories Generator **********/
getCategories = function ( ids, noRoot ){
   if ( ids ){
      var currentId, obj = [];
      for ( var i = 0; i < ids.length; i++ ){
         var uniqueID = Math.floor(Math.random() * 100000);
         currentId = Categories.find({_id: ids[i] }).fetch()[0];
         var result = findParent(currentId, []);
         obj.push(result)
      }
      if( noRoot ){
         obj[0] && obj[0].shift()
      }
      return obj
   }
};

/********** Change Desc **********/
changeDesc = function( obj, value, desc ) {
   for (var i in obj) {
      if (obj[i].uniqueId == value) {
         obj[i].index = desc;
         break; //Stop this loop, we found it!
      }
   }
};

/********** Remove Desc **********/
removeDesc = function ( obj, value ) {
   for (var i = 0; i < obj.length; i++) {
      if (obj[i].uniqueId == value) {
         obj.splice(i, 1);
         break;
      }
   }
};

/********** Checking Combinations **********/
checkCombinations = function(t , generatedCombinations, fromEditProduct , key){
   var count = 0;
   var oldCombinations;
   t.data.combinations && (fromEditProduct ? oldCombinations = t.data.combinations[key] : oldCombinations = t.data.combinations[Session.get('currentEditLang') || 'en']);
   var newCombinations = generatedCombinations;
   if(oldCombinations && oldCombinations.length){
      for(var k = 0; k < oldCombinations.length; k++){
         var old_comb = oldCombinations[k].combination.filter(function(entry){return entry.attribute});
         for(var l = 0; l < newCombinations.length; l++){
            var new_comb = newCombinations[l].combination.filter(function(entry){return entry.attribute});
            if(old_comb.length == new_comb.length){
               for(var m = 0; m < old_comb.length; m++){
                  for(var n = 0; n < new_comb.length; n++){
                     if(old_comb[m].attribute == new_comb[n].attribute && old_comb[m].value == new_comb[n].value){
                        count = count + 1;
                     }
                  }
               }
               if(count == old_comb.length){
                  newCombinations.splice(l,1);
               }
               count = 0;
            }
         }
      }
      if(newCombinations.length){
         for(var x = 0; x < newCombinations.length; x++){
            oldCombinations.push(newCombinations[x]);
         }
      }
      return oldCombinations;
   }
   else if(newCombinations && newCombinations.length && newCombinations[0].combination.length){
      return newCombinations
   }
   else{
      return [];
   }
};

/********** Combinations Generator **********/
combinationsGenerator = function( uin, attributes, flag, combinationsUin, productCommission ){
   //Combinations
   var uin = uin;
   var comb = attributes;
   var n = comb.length;
   var u = [];
   var combCount = 0;
   var abcd = [];
   var combinationsUin = combinationsUin;
   if(attributes.length){
      if(flag){
         for(var a = comb.length ; a > 0 ; a--){
            forLoopValue(a);
         }
         function forLoopValue(n){
            for(var x = n-1 ; x < n ; x++ ){
               for(var y = 0; y < comb[x].children.length ; y++){
                  var obj = {};
                  myComb = comb[x].text;
                  obj[myComb] = comb[x].children[y].text;
                  abcd.push(obj);
               }
               u.push(abcd);
               abcd = [];
            }
         }
      }

      var getCombinations = function(allOptionsArray, combination) {
         if(allOptionsArray.length > 0) {
            for(var i=0; i < allOptionsArray[0].length; i++) {
               var tmp = allOptionsArray.slice(0);
               combination.codes[combination.counter] = allOptionsArray[0][i];
               tmp.shift();
               combination.counter++;
               getCombinations(tmp, combination);
            }
         } else {
            var comb = combination.codes.slice(0);
            var combi = [];
            for ( var x = 0; x < comb.length ; x++){
               combi.push({
                  attribute : Object.keys(comb[x])[0],
                  value : comb[x][Object.keys(comb[x])[0]]
               });
            }
            var combUin;
            combinationsUin ? combUin = combinationsUin[combCount] : combUin = uin+'-Comb'+Random.id().toUpperCase();
            combUin = combUin.slice(0, 28);
            combObj = {UIN :combUin, inheritedCommission: productCommission , status: true, combination:combi};
            combination.result.push(combObj);
            combCount = combCount + 1;

         }
         combination.counter--;
      };
      flag ? (allOptionsArray = u) : (allOptionsArray = comb);
      var combination = {codes : [], result : [], counter : 0};
      combinations = [];
      getCombinations(allOptionsArray, combination);
      for(var i=0; i < combination.result.length; i++) {
         combinations.push(combination.result[i]);
      }
      return combinations;
   }
   else{
      return [];
   }

};
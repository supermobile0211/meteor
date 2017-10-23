import moment from 'moment';

Template.registerHelper('formatDate', function(date, format){
  if( typeof format != 'string'){
      format = 'DD/MM/YYYY'
  }
  return moment(date).format(format);
});

Template.registerHelper('Symbol', function(){
    return getCurrencySymbol();
});

Template.registerHelper('formatNumber', function(num, format){
    return formatNumber(num, format);
});

Template.registerHelper('displayIndex', function(index){
	return index + 1;
});

Template.registerHelper('lowerCase', function( data ){
    return typeof data === 'string' ? data.toLowerCase() : data
});

Template.registerHelper('getOrderStatusColor', function( name ){
    let selectedStatus = getOrderStatusObj(name);
    if(selectedStatus) return selectedStatus.color
});
/************************* for all translatable objects ************************/
Template.registerHelper('getTranslation', function( t, key, notExists){
    return getTranslation( t, key, notExists);
});

Template.registerHelper('isLogin', function () {
    return !Meteor.user()
});

Template.registerHelper('AppName', function () {
    return Meteor.App.NAME;
});

Template.registerHelper('AppUrl', function () {
    return Meteor.absoluteUrl();
});

Template.registerHelper('currentUser',()=>{
    return Meteor.user();
});

/************************* return Active Class ************************/
Template.registerHelper('activeLanguage', function(){
    if( this.isoCode == Session.get('currentEditLang') ){
        return 'active';
    }
});

/************************* For ...String ************************/
Template.registerHelper('checkLength', function(arr, key, len){
    return checkLength(arr, key, len);
});

/*************************  ************************/
Template.registerHelper('minimiseLength', function(string, len){
    return minimiseLength(string, len);
});

/************************* check the last element ************************/
Template.registerHelper('last', function(list, elem) {
    return _.last(list) === elem;
});

/************************* check the first element ************************/
Template.registerHelper('first', function(list, elem) {
    return _.first(list) === elem;
});

Template.registerHelper('catName', function( id ) {
    var a = Categories.find({
        '_id': id
    }).fetch();
    return getTranslation(a[0].translation, 'name');
});

/************************* display tree like category array ************************/
Template.registerHelper('categoriesListings',()=>
    getCategories([Session.get('categoriesId') && Session.get('categoriesId')[0]], true));


/************************* compare 2 values in any template ************************/
Template.registerHelper('compare',(a, b)=>{
    return a == b;
});

/************************* compare 2 values in any template ************************/
Template.registerHelper('toFixedPrice',(mixedValue)=>{
    return LargeFixedValues(mixedValue);
});

/************************* return the result of addition (2) ************************/
Template.registerHelper('addTwo', function(a, b){
    return addTwo(a, b);
});

/************************* return the result of multiply (2) ************************/
Template.registerHelper('multiplyTwo', function(a, b){
    return multiplyTwo(a, b);
});

/************************* return a product name by id ************************/
Template.registerHelper('productName', function(productId){
    return productName(productId)
});



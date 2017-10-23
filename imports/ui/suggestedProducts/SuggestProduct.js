
/********** global variable  **********/
var descriptionImages = [],
    combinations = [],
    categoriesSelected = [],
    categoryCount = 1, uinNo,
    combinationsUin,
    availableLanguages,
    progressInterval,
    removed = false;

/********** initialize Features **********/
//var initializeFeatures = ()=>{
//    var $tableBody = $('table#feature tbody') ;
//    Meteor.setTimeout( function(){
//        Session.get('preSelectedFeatures').forEach( function( number, index ){
//            index++;
//            $tableBody.find('tr:nth-child(' + index +') .features-key').select2('val', number);
//        });
//    }, 1000)
//};

Session.set('type', 'Product');
Session.set('currentEditLang', 'en');

Template.SuggestProduct.onCreated(()=>{

});

Template.SuggestProduct.onRendered(()=>{
    //preSelectedFeatures(FlowRouter.current().params.id);

    /********** Set Default Session **********/
    Session.setDefault('images', []);
    Session.set('imageFrom', 'product');
    Session.setDefault('createProductUinNo', '');
    Session.setDefault('currentImage', '');
    Session.set('showFeatures', []);
    Session.set('copper', true);
    Session.set('features', []);
    Session.set('type', 'Product');
    Session.set('progress', 0);
    Session.set('inProgress', false);
    Session.set('progressBar2',false);
    Session.set('preselected', false);
    Session.set('categoryArray1', []);
    Session.set('addCategoryBar', false);
    Session.set('mayContainProduct', true);
    Session.set('currentId', Random.id());

    /********** PreSelect one Category if comes from Advance Manager **********/
    Session.set('showCategories', [{uniqueId:1, index: FlowRouter.current().params.id || '',defaultCategory : true}]);
    //Session.set('showCategories', [{uniqueId:1}]);
    Session.set('sourceLang', false);
    Session.set('addCategoryBar', false);
    removed = false;

    availableLanguages = getLangCodes();
    uinNo = 'P' + Random.id().toUpperCase();
    var $image = this.$(".image-crop > img"),
        $inputImage = this.$("#inputImage"),
        config;

    Session.set('createProductUinNo', uinNo);
    this.find('#productUin').value = (uinNo);


    this.$(".features-key, .features-select").select2({
        tags: true,
        width: '100%'
    });


    this.$("#selectSkill, #selectFeatures, #selectGTIN, #selectReference").select2({
        tags: true,
        width: '100%'
    });

    this.$(".selectCategory, .selectSubCategory, .selectSubSubCategory").select2({
        width: '100%'
    });


	$(".selectCategory").select2({
	    placeholder: "Select a category",
	    allowClear: true
	});


	$(".selectCategory").select2({
	   width: '100%'
	});

    // Initialize jsTree

    $('#combinationsAvailable, #combinationsSelected, #editproductCombinationsAvailable, #editproductCombinationsSelected').jstree({
        'core' : {
            'check_callback' : true
        },
        'plugins' : [ 'types', 'dnd' ],
        'types' : {
            'default' : {
                'icon' : 'fa fa-folder'
            },
            'html' : {
                'icon' : 'fa fa-file-code-o'
            },
            'svg' : {
                'icon' : 'fa fa-file-picture-o'
            },
            'css' : {
                'icon' : 'fa fa-file-code-o'
            },
            'img' : {
                'icon' : 'fa fa-file-image-o'
            },
            'js' : {
                'icon' : 'fa fa-file-text-o'
            }

        }
    });

    /********** Initialize Editor **********/
    $('#productDescription').summernote({
        callbacks: {
            onImageUpload: function(files) {
                Session.set('inProgress', true);
                Session.set('progressBar2',true);
                uploadImage(files[0], true, function (error, downloadUrl) {
                    Session.set('inProgress', false);
                    if (error) {
                        swal("Error", error, "error");
                    }
                    else {
                        Meteor.users.update(Meteor.userId(), {$push: {"profile.files": downloadUrl}});
                        $('#productDescription').summernote('insertImage', downloadUrl);
                        swal("Success", "Image Uploaded", "success");
                    }
                });
            }
        },
        minHeight: 250
    });
    Meteor.setTimeout(()=>{
        this.$('[data-code=en]').addClass('active');
        $(".selectCategory").select2({});
    });
});

Template.SuggestProduct.helpers({

    featureTranslatable: function(index){
        var selectionChoices = Features.find({}).fetch();
        return selectionChoices[0] && selectionChoices[0].translation[Session.get('currentEditLang') || 'en'][index]
            && selectionChoices[0].translation[Session.get('currentEditLang') || 'en'][index].translatable;
    },

    skills: ()=> {
        var selectionChoices = Skills.find({}).fetch();
        return selectionChoices[0] && selectionChoices[0].translation[Session.get('currentEditLang') || 'en'];
    },

    editImage : ()=>{
        return Session.get('editImage');
    },
    progress:  ()=>{
        return Math.round(Session.get('uploadingProgress'));
    },

    translationProgress: function(){
        return Session.get('progress');
    },

    names: ( obj )=> {
        if(obj){
            if(obj.translation[Session.get('currentEditLang')]){
                return obj.translation[Session.get('currentEditLang')].name;
            }
            else return obj.translation[Object.keys(obj.translation)[0]].name;
        }
    },

    showFeatures: () =>{
        return Session.get('showFeatures');
    },

    showCategories: ()=>{
        return Session.get('showCategories');
    },

    showValues: (index)=> {
        if (index && index != 'placeholder') {
            var selectionChoices = Features.find({}).fetch();
            return selectionChoices[0] && selectionChoices[0].translation[Session.get('currentEditLang') || 'en'][index]
                && selectionChoices[0].translation[Session.get('currentEditLang') || 'en'][index].values;
        }
        else{
            return false;
        }
    },

    showIndex: (index)=>{
        return index + 1;
    },

    images : ()=>{
        return Session.get('images');
    },

    attributes_available: function(){
        attr_id = Attributes.findOne() &&  Attributes.findOne()._id;
        return Attributes.findOne() &&  retrieveAttributes(Attributes.findOne().attributes);
    },

    Languages: allLanguages,

    sourceLanguage: ()=>{
        return this.isoCode == Session.get('sourceLang');
    },

    isPreSelect: ()=>{
        return true;
    },

    addCategoryBar: ()=>{
        return Session.get('addCategoryBar') && true;
    },

    isType: ()=>{
        return Session.get('type');

    },

    isProduct: ()=>{
        return Session.get('type') == 'Product';
    },

    categoryList: ( currentId )=> {
        var categoryArray = [];
        var categoryNumber = Session.get('categoryTabIndex') || Session.get('categoryNumber') || 1,
            id = Session.get('newCategory_' + categoryNumber) || Categories.findOne({parent: {$exists: false}})._id,
            index = Session.get('newCategoryIndex_' + categoryNumber),
            categoryArray = Session.get('categoryArray' + categoryNumber),
            uniqueId = Session.get('uniqueId') || 1,
            a = Categories.find({parent: id}).fetch(),
            aId = a.length && a.map(function(x){return x._id}),
            categoryArrayId = [],
            match;

        categoryArray && categoryArray.length && categoryArray.map((x)=>{x.map((y)=>{categoryArrayId.push(y._id)})});

        //if this category does not match the changed category
        if(currentId != uniqueId){
            var y = parseInt($('#'+ currentId).attr('categoryNumber')) + 1;
            if(removed == false){
                $("#" + currentId).find('span.select2').remove();
                removed = true;
            }
            currentId == 1 && $("#" + currentId).find('select').prop('disabled', true) &&
            $("#" + currentId).find('select').each(()=>{
                $(this).find('option').each(function(){
                    $(this).val() != 'placeholder' &&  $(this).prop('selected', true);
                })
            });
            return Session.get('categoryArray' + y);
        }

        //Restrict repeat children
        forLoop:
            for(var x = 0; x < aId.length; x++){
                for(var y = 0; y < categoryArrayId.length; y++){
                    if(aId[x] == categoryArrayId[y]){
                        match = true;
                        break forLoop
                    }
                }
            }

        //Splice all _id previous child select2
        categoryArray && categoryArray.length - 1 > index && !match && categoryArray.splice(index + 1, categoryArray.length - 1);

        //Destroys all _id previous child select2
        for(var x = $(".select_" + uniqueId).length-1; x > 0; x--){
            x > index && !match && $("#categories_" + x + '_' + uniqueId).select2("destroy");
        }

        a.length && !match && categoryArray.push(a);
        Meteor.setTimeout(function() {
            $(".select_" + uniqueId).select2({});
            Session.set('categoryArray'+categoryNumber, categoryArray);
        }, 50);
        return categoryArray;
    },

    categories: ()=> {
        var a = Categories.find({
            parent: {$exists: false}
        }).fetch();
        return a.length && Categories.find({parent: a[0]._id});
    },

    canContainProduct: (id)=>{
        if( !id ) return null;
        var a = Categories.find({
            _id: id
        }).fetch();
        return a[0] && !(a[0].mayContainProduct)
    },

    features: ()=>{
        var selectionChoices = Features.find({}).fetch();
        /*Todo find out best way without setTimeout */
        if(selectionChoices[0] && selectionChoices[0].translation[Session.get('currentEditLang') || 'en']){
            Meteor.setTimeout(function() {
                $(".features-select").select2({
                    tags: true
                })
            });
            Session.set("features", selectionChoices[0].translation[Session.get('currentEditLang') || 'en'])
        }
        return selectionChoices[0] && selectionChoices[0].translation[Session.get('currentEditLang') || 'en'];
    }

});

Template.SuggestProduct.events({

    'click #availableToSelected': function(){
        var  $editProductAvailable = $("#editproductCombinationsAvailable"),
            $editProductSelected =   $("#editproductCombinationsSelected"),
            getSelected = $editProductAvailable.jstree().get_selected(true),
            inSelectedText = $editProductSelected.jstree().get_json('#',{ 'flat': true }).map(function(x){
                return x.text.toLowerCase();
            }),
            inSelected = $editProductSelected.jstree().get_json('#',{ 'flat': true }),
            theSelected, getParent, inSelected_id;
        for( var i = 0 ; i < getSelected.length ; i++ ){
            var getSelectedJson = $('#editproductCombinationsAvailable').jstree().get_json('#'+ getSelected[i].id);
            getParent = $editProductAvailable.jstree().get_json('#'+getSelected[i].parent);
            if(getSelected[i].parent == '#'){
                if(!inSelectedText.includes(getSelectedJson.text.toLowerCase())){
                    $('#editproductCombinationsSelected').jstree('create_node', getSelected[i].parent, getSelectedJson, 'last');
                    $editProductAvailable.jstree().delete_node(getSelected[i]);
                }
                else{
                    for( var j = 0; j < getSelectedJson.children.length; j++){
                        for( var z = 0 ; z < inSelected.length ; z++){
                            if(inSelected[z].text.toLowerCase() == getSelectedJson.text.toLowerCase() ){
                                theSelected = inSelected[z].id;
                            }
                        }
                        if(inSelectedText.includes(getSelectedJson.children[j].text.toLowerCase())){
                            swal("Oops...", "'"+getSelectedJson.children[j].text+"'"+' already available', "error");
                            $editProductAvailable.jstree().delete_node(getSelectedJson.children[j]);
                        }
                        else{
                            $('#editproductCombinationsSelected').jstree('create_node', '#'+theSelected, getSelectedJson.children[j], 'last');
                        }
                    }
                    $editProductAvailable.jstree().delete_node(getSelected[i]);
                }
            }
            else{
                getParent = $editProductAvailable.jstree().get_json('#'+getSelected[i].parent);
                inSelected_id = $editProductSelected.jstree().get_json('#',{ 'flat': true }).map(function(x){
                    return x.id;
                });
                inSelectedText = $editProductSelected.jstree().get_json('#',{ 'flat': true }).map(function(x){
                    return x.text.toLowerCase();
                });
                if(!inSelected_id.includes(getSelected[i].parent) && !inSelectedText.includes(getSelected[i].parent.toLowerCase())){
                    $editProductSelected.jstree('create_node', '#', {id:getParent.id, text:getParent.text}, 'last');
                    $editProductSelected.jstree('create_node', getParent.id, getSelectedJson, 'last');
                    $editProductAvailable.jstree().delete_node(getSelected[i]);
                }
                else{
                    inSelected = $editProductSelected.jstree().get_json('#',{ 'flat': true });
                    for( var z = 0 ; z < inSelected.length ; z++){
                        inSelected = $editProductSelected.jstree().get_json('#',{ 'flat': true });
                        if(inSelected[z].text.toLowerCase() == getParent.text.toLowerCase() ){
                            theSelected = inSelected[z].id;
                        }
                    }
                    if(inSelectedText.includes(getSelectedJson.text.toLowerCase())){
                        swal("Oops...", "'"+getSelectedJson.text+"'"+' already available', "error");
                        $editProductAvailable.jstree().delete_node(getSelectedJson);
                    }
                    else{
                        $('#editproductCombinationsSelected').jstree('create_node', theSelected, getSelectedJson, 'last');
                        $editProductAvailable.jstree().delete_node(getSelectedJson);
                    }
                }
                getParent = $editProductAvailable.jstree().get_json('#'+getSelected[i].parent);
                if(getParent.children.length == 0){
                    $editProductAvailable.jstree().delete_node(getSelected[i].parent);
                }
            }
        }
    },

    'click #selectedToAvailable': function(){
        var $editCombinationsSelected = $("#editproductCombinationsSelected"),
            $editAvailable = $("#editproductCombinationsAvailable"),
            getSelected = $editCombinationsSelected.jstree().get_selected(true),
            inSelectedText = $editAvailable.jstree().get_json('#',{ 'flat': true }).map(function(x){
                return x.text.toLowerCase();
            }),
            inSelected_id = $editAvailable.jstree().get_json('#',{ 'flat': true }).map(function(x){
                return x.id;
            }),
            inSelected = $editAvailable.jstree().get_json('#',{ 'flat': true }),
            getParent, theSelected;
        for( var i = 0 ; i < getSelected.length ; i++ ){
            var getSelectedJson = $editCombinationsSelected.jstree().get_json('#'+ getSelected[i].id);
            getParent = $editCombinationsSelected.jstree().get_json('#'+getSelected[i].parent);
            if(getSelected[i].parent == '#'){
                if(!inSelectedText.includes(getSelectedJson.text.toLowerCase())){
                    $('#editproductCombinationsAvailable').jstree('create_node', getSelected[i].parent, getSelectedJson, 'last');
                    $editCombinationsSelected.jstree().delete_node(getSelected[i]);
                }
                else{
                    for( var j = 0; j < getSelectedJson.children.length; j++){
                        for( var z = 0 ; z < inSelected.length ; z++){
                            if(inSelected[z].text.toLowerCase() == getSelectedJson.text.toLowerCase() ){
                                theSelected = inSelected[z].id;
                            }
                        }
                        if(inSelectedText.includes(getSelectedJson.children[j].text.toLowerCase())){
                            swal("Oops...", "'"+getSelectedJson.children[j].text+"'"+' already available', "error");
                            $editCombinationsSelected.jstree().delete_node(getSelectedJson.children[j]);
                        }
                        else {
                            $('#editproductCombinationsAvailable').jstree('create_node', '#' + theSelected, getSelectedJson.children[j], 'last');
                        }
                    }
                    $editCombinationsSelected.jstree().delete_node(getSelected[i]);
                }
            }
            else{
                getParent = $editCombinationsSelected.jstree().get_json('#'+getSelected[i].parent);
                inSelected_id = $editAvailable.jstree().get_json('#',{ 'flat': true }).map(function(x){
                    return x.id;
                });
                if(!inSelected_id.includes(getSelected[i].parent) && !inSelectedText.includes(getParent.text.toLowerCase())){
                    $editAvailable.jstree('create_node', '#', {id:getParent.id, text:getParent.text}, 'last');
                    $editAvailable.jstree('create_node', getParent.id, getSelectedJson, 'last');
                    $editCombinationsSelected.jstree().delete_node(getSelected[i]);
                }
                else{
                    inSelected = $editAvailable.jstree().get_json('#',{ 'flat': true });
                    for( var z = 0 ; z < inSelected.length ; z++){
                        inSelected = $editAvailable.jstree().get_json('#',{ 'flat': true });
                        if(inSelected[z].text.toLowerCase() == getParent.text.toLowerCase() ){
                            theSelected = inSelected[z].id;
                        }
                    }
                    if(inSelectedText.includes(getSelectedJson.text.toLowerCase())){
                        swal("Oops...", "'"+getSelectedJson.text+"'"+' already available', "error");
                        $editCombinationsSelected.jstree().delete_node(getSelectedJson);
                    }
                    else{
                        $('#editproductCombinationsAvailable').jstree('create_node', theSelected, getSelectedJson, 'last');
                        $editCombinationsSelected.jstree().delete_node(getSelectedJson);
                    }
                }
                getParent = $editCombinationsSelected.jstree().get_json('#'+getSelected[i].parent);
                if(getParent.children.length == 0){
                    $editCombinationsSelected.jstree().delete_node(getSelected[i].parent);
                }
            }
        }
    },

    /************* Search Attributes inSelected ****************/
    'change .search-inSelected': function( e ){
        var searchString = e.target.value;
        $('#editproductCombinationsSelected').jstree('search', searchString);
    },
    /************* Search Attributes inAvailable ****************/
    'change .search-inAvailable': function( e){
        var searchString = e.target.value;
        $('#editproductCombinationsAvailable').jstree('search', searchString);
    },

    'change #selectFeatures' : function(e){
        var showFeatures = Session.get('showFeatures'),
            id = e.currentTarget.attributes.uniqueId.value,
            value = e.currentTarget.value;
        changeDesc(showFeatures, id, value);
        Session.set( 'showFeatures', showFeatures );
    },

    /************* Add remove Features ****************/
    'click #addNewFeature': function () {
        var showFeatures = Session.get('showFeatures');
        var uniqueId = Math.floor(Math.random() * 100000);
        showFeatures.push({
            uniqueId: uniqueId
        });
        Meteor.setTimeout(function() {
            $(".features-key").select2({
                tags: true
            })
        },50);
        Session.set('showFeatures', showFeatures);
    },

    'click .remove-features' : function( e, t ) {
        t.$('table#feature tr#' + e.currentTarget.name).remove();
    },

    'click #addNewAttribute': function(){
        var $available = $('#editproductCombinationsAvailable'),
            combinations_available = $available.jstree().get_json('#'),
            title = $('#attributeTitle').val().trim(),
            value = $('#attributeValue').val();
        value = value.split(',');

        if(combinations_available.length > 0){
            var count = 0;
            keep:
                for(var i = 0; i < combinations_available.length; i++){
                    if(combinations_available[i].text.toLowerCase() == title.toLowerCase()){
                        for(var j = 0 ; j < value.length ; j++) {
                            childrenValue:
                                for(var k = 0 ; k < combinations_available[i].children.length ; k++){
                                    if( value[j].trim().toLowerCase() == combinations_available[i].children[k].text.toLowerCase() ){
                                        swal("Oops...", "'"+value[j].trim()+"'"+' already available', "error");
                                        count = 1;
                                        break childrenValue;
                                    }
                                    else{
                                        count = 0;
                                    }
                                }
                            if(count != 1){
                                $available.jstree('create_node', combinations_available[i], {
                                    id: title+'_'+value[j].trim(),
                                    text: value[j].trim()
                                }, 'last');
                            }
                            count = 1;
                        }break keep;
                    }
                }
            if(count != 1){
                $available.jstree('create_node', '#', { id:title, text:title}, 'last');
                for(var i = 0 ; i < value.length ; i++){
                    $available.jstree('create_node', '#'+title, {id: title+'_'+value[i].trim(), text:value[i].trim()}, 'last');
                }
            }

        }
        else{
            $available.jstree('create_node', '#', { id:title, text:title}, 'last');
            for(var i = 0 ; i < value.length ; i++){
                $available.jstree('create_node', '#'+title, {id: title+'_'+value[i], text:value[i].trim()}, 'last');
            }
        }

        var params = {
            id: attr_id,
            attributes: {}
        };
        //For translation of attributes available
        var temp = [];
        var allAttributes = [];
        var enAttributes = '';
        var comb = $available.jstree().get_json('#');
        if(comb.length) {
            for (var a = comb.length; a > 0; a--) {
                forLoopValue(a);
            }
            function forLoopValue(n) {
                for (var x = n - 1; x < n; x++) {
                    for (var y = 0; y < comb[x].children.length; y++) {
                        myComb = comb[x].text;
                        myCombChild = comb[x].children[y].text;
                        temp.push(' <chocha> '+myComb+' <chocha/> '+myCombChild+' <chocha> ');
                    }
                    allAttributes[x] = (' <$chocha> '+temp+' <$chocha> ');
                    enAttributes = allAttributes[x] + enAttributes;
                    temp = [];
                }
            }
        }
        availableLanguages = getLangCodes();
        params.attributes[Session.get('currentEditLang') || 'en'] = translateAttributes(enAttributes);
        Meteor.call('yandexTranslate', enAttributes, Session.get('currentEditLang') || 'en', getLangCodes(), function( err, result ){
            if(err){
                stopProgress();
                swal({
                    title: "translation Failed!",
                    text: err.message,
                    type: "error"
                });
                return;
            }
            if( result ){
                for ( var key in result ){
                    if( result.hasOwnProperty( key )) {
                        params.attributes[key] = translateAttributes(result[key].text.toString());
                    }
                }
            }
            Meteor.call('createAttribute', params, function(err, id) {
                stopProgress();
                if (err) {
                    stopProgress();
                    swal({
                        title: "Failed!",
                        text: err.message,
                        type: "error"
                    });
                }
                attr_id = id;
            });
        });

    },
    'click .changeLang': (e)=> {
        e.preventDefault();
        var prevLang = Session.get('currentEditLang'),
            lang = $(e.target).data('code');
        if(!Session.get('sourceLang')){
            Session.set('sourceLang', lang);
        }
        if (lang == undefined) return;
        if (prevLang == lang) return;
        Session.set('currentEditLang', lang);
        var attributesAvailable = Attributes.findOne() && retrieveAttributes(Attributes.findOne().attributes);
        $('#editproductCombinationsAvailable').jstree(true).settings.core.data = attributesAvailable;
        $('#editproductCombinationsAvailable').jstree(true).refresh();
        //initializeFeatures();
        Meteor.setTimeout(()=> {
            $(".features-key, .selectCategory, #selectReference, #selectGTIN").select2({
                tags: true
            });
        },50);
        Session.set('sourceLang', lang);
    },

    'click #generateUin': ( e, t )=>{
        var type = t.find("[name='radioInline']:checked").value,
            alpha = type == 'Product' ? 'P' : 'S';
        uinNo = alpha + Random.id().toUpperCase();
        t.find('#productUin').value = uinNo;
    },

    'change input[name=radioInline]': (e, t)=>{
        var type = t.find("[name='radioInline']:checked").value,
            alpha = type == 'Product' ? 'P' : 'S';
        uinNo = alpha + Random.id().toUpperCase();
        t.find('#productUin').value = uinNo;
        Session.set('type', type);
    },

    'click #defaultCat' : (e)=>{
        e.preventDefault();
        setDefaultCategory(e.currentTarget.attributes.index.value);
    },

    /************* Select remove Category ****************/
    'click #addNewCategory':  (e)=> {
        e.preventDefault();
        if(categoryCount > 7){
            swal("Error", 'maximum 8 Categories allowed', "error");
            return;
        }
        categoryCount++ ;
        var showCategories = Session.get('showCategories');
        var uniqueId = Math.floor(Math.random() * 100000);
        showCategories.push({
            uniqueId: uniqueId
        });
        Meteor.setTimeout(()=>{
            $(".selectCategory, .selectSubCategory, .selectSubSubCategory").select2({
                width: '100%'
            });

        },50);
        Session.set('addCategoryBar', true);
        Session.set('uniqueId', showCategories[showCategories.length - 1].uniqueId);
        Session.set('categoryTabIndex', categoryCount);
        Session.set('categoryArray'+categoryCount, []);
        Session.set('showCategories', showCategories);
        setDefaultCategory(showCategories.length - 1);
    },

    'click .removeCategory': (e)=>{
        e.preventDefault();
        if(categoryCount <= 1){
            swal("Error", 'at least one Category is required', "error");
            return;
        }
        Session.set('newCategory_' + categoryCount, '');
        categoryCount-- ;
        id = e.currentTarget.attributes.id.value;
        $("[categoryNumber ="+ id+"]").remove();

        //t.$('.col-sm-3#' + id).remove();
    },

    'change .selectCategory' : function( e ){
        e.preventDefault();
        //getFeaturesindexes( $(e.target).val( ));
        var k = e.target.attributes.id.value;
        var index = parseInt(k.split('_')[1]);
        var uniqueID = parseInt(k.split('_')[2]);
        var categoryNumber = parseInt($('#'+e.target.attributes.uniqueId.value).attr('categoryNumber')) + 1;
        var updateShowCategory = Session.get('showCategories');
        Session.set('categoryTabIndex', '');
        Session.set('uniqueId', e.target.attributes.uniqueId.value);
        Session.set('categoryNumber', categoryNumber);
        Session.set("newCategory_" + categoryNumber, $(e.target).val());
        Session.set("newCategoryIndex_" + categoryNumber, index);
    },

    'click #publish': function ( e, t ) {
        e.preventDefault();
        Session.set('inProgress', true);
        Session.set('mayContainProduct', true);

        /********** start translation progress values **********/
        startProgress();

        /********** get template values for request **********/
        var features = getFeatures(),
            name = t.$('#productName').val(),
            productCommission = t.$('#prodCommission').val(),
            //TODO: summerNote Initialization
            description = t.$('#productDescription').summernote('code'),
            type = t.find("[name='radioInline']:checked").value,
            status = t.$('#productStatus').is(':checked'),
            skills = t.$('#selectSkill').val(),
            gtinNo = t.$('#selectGTIN').val(),
            uin = t.$('#productUin').val(),
            reference = t.$('#selectReference').val(),
            attributes = t.$('#editproductCombinationsSelected').jstree().get_json('#'),
            tempCategories = [],
            tempDescription, translationText = "", skillFlag, featuresFlag, attributesFlag, referenceFlag,
            totalFeatures  = [], allAttributes = [],
            defaultCategory = _.findWhere(Session.get('showCategories'),{defaultCategory : true});

        if(!defaultCategory){
            stopProgress();
            showSwal("Failed", "Please select default category", "error");
            return;
        }
        /* defaultCategory = defaultCategory.index;
         commission = setProductCommission(defaultCategory);*/
        /*
         var defaultCategoryData = Categories.findOne({_id : defaultCategory});
         defaultCategoryData.commission ? commission = defaultCategoryData.commission : commission = defaultCategoryData.inheritedCommission;
         */


        /********** Set params for request **********/
        params = {
            _id: Session.get('currentId'),
            translation: [],
            skills: [],
            features: [],
            type: type,
            status: status,
            offersCount: 100,
            avgOffer: 130.0,
            bestOffer: 115.0,
            published: true,
            attributes: {},
            uin: uin,
            combinations: [],
            images : getImages(),
            source : Session.get('sourceLang') || Session.get('currentEditLang'),
            defaultCategory : defaultCategory
        };
        /*    params.category = filterKeys(Session.get('showCategories'), 'uniqueId').map(function(x){
         var categoryId = $('#'+x),
         last = categoryId.find('.selectCategory').length - 1;
         return getSelectedCategory(categoryId, last)
         });*/

        for(var l=0;l<Session.get('showCategories').length;l++){
            var setDefault = false;
            if($('#isDefault'+l).is(':checked')){
                setDefault = true;
            }
            childLoop:
                for(var j=0;;j++) {
                    var tempSelectId =  j.toString() + '_' + l.toString(),
                        incrementID = (j+1).toString() + '_' + l.toString();
                    if ($("[fetchId="+tempSelectId+"]").val() &&  $("[fetchId="+tempSelectId+"]").val() != "placeholder") {
                        if(!($("[fetchId="+incrementID+"]").val()) || $("[fetchId="+incrementID+"]").val() == "placeholder"){
                            if(setDefault){params.defaultCategory = $("[fetchId="+tempSelectId+"]").val();setDefault=false}
                            tempCategories.push($("[fetchId="+tempSelectId+"]").val());
                            break childLoop;
                        }
                    }
                    else{
                        break childLoop;
                    }
                }
        }
        if( typeof params.defaultCategory == 'object' ){
            stopProgress();
            showSwal("Failed", "Your default Category is empty", "error");
            return;
        }
        var parentCategory = Categories.findOne({_id : params.defaultCategory});
        if( productCommission ){
            params['commission'] = productCommission;
        }
        else if(parentCategory.commission){
            params['commission'] = parentCategory.commission;
        }
        else if(parentCategory.inheritedCommission){
            params.inheritedCommission = parentCategory.inheritedCommission;
        }
        else{
            params.inheritedCommission = '%';
        }
        params.category = tempCategories;
        if( params.category == false){
            return
        }
        else{
            params.category.forEach(function( catId ) {
                var category = Categories.findOne({
                    _id: catId
                });
                if( !category.mayContainProduct ){
                    Session.set('mayContainProduct', false)
                }
            });
        }
        //check if any selected Category may not Contain Products
        if ( !Session.get('mayContainProduct') ){
            stopProgress();
            showSwal("Failed", "One of Your selected Category can not Contain Products", "error");
            return;
        }

        /********** if features added **********/
        if ( features.length ){
            params.features.push({
                language: Session.get('currentEditLang'),
                values: getCurrentProductsFeatures(getFeatures())
            });
            params.featuresIndexes = Session.get('indexArray');
        }
        var values = [];
        for ( var i = 0; i < features.length; i++ ){
            for ( var key in features[i] ){

                if (key != 'translatable' && features[i][key]) {
                    totalFeatures.push(' <chocha> ' + key + ' <chocha/> ' + features[i][key] + '&&' + i)
                }
            }
        }
        if( params.category.length ){
            params.category = unique(params.category).filter(function(data){
                data == 'placeholder' && swal('Warning', 'Root cannot be added as a direct parent of a product', 'error');
                return data != 'placeholder';
            })
        }
        params.translation.push({
            language: Session.get('currentEditLang') || 'en',
            name: name,
            description: description || ""
        });

        if( skills && skills.length ){
            skillFlag = true;
            params.skills.push({
                language: Session.get('currentEditLang') || 'en',
                values: skills
            })
        }
        if( gtinNo ){
            params.gtin = gtinNo;
        }

        /********** extract images from Editor **********/
        var imagesCount = ( description.match(/img src/g) || [] ).length;
        if( imagesCount ){
            var resultingValue = replaceImages( description, imagesCount );
            descriptionImages = resultingValue.images;
            tempDescription = resultingValue.content
        }

        /********** concatenate  text for Translation **********/
        tempDescription = tempDescription ? tempDescription : description;
        translationText = name + ' <ohoo> '+  tempDescription;
        if( skillFlag ){
            translationText = translationText + ' <ohoo> '+ skills;
        }

        if( totalFeatures && totalFeatures.length ){
            translationText = translationText + ' <ohoo> '+ totalFeatures;
            featuresFlag = true
        }
        //Retrieving Attributes
        var temp = [];
        var comb = attributes;
        var enAttributes = '';
        if(attributes.length) {
            for (var a = comb.length; a > 0; a--) {
                forLoopValue(a);
            }
            function forLoopValue(n) {
                for (var x = n - 1; x < n; x++) {
                    for (var y = 0; y < comb[x].children.length; y++) {
                        myComb = comb[x].text;
                        myCombChild = comb[x].children[y].text;
                        temp.push(' <chocha> '+myComb+' <chocha/> '+myCombChild+' <chocha> ');
                    }
                    allAttributes[x] = (' <$chocha> '+temp+' <$chocha> ');
                    enAttributes = allAttributes[x] + enAttributes;
                    temp = [];
                }
            }
        }
        if( allAttributes && allAttributes.length ){
            var tempAttributes = translateAttributes(enAttributes);
            params.attributes[Session.get('currentEditLang') || 'en'] = tempAttributes;
            params.combinations.push({
                language: Session.get('currentEditLang'),
                values: combinationsGenerator(t.find('#productUin').value, $('#editproductCombinationsSelected').jstree().get_json('#'), true, undefined, params.commission ? params.commission:params.inheritedCommission)
            });
            combinationsUin = params.combinations[0].values.map(function(x){return x.UIN});
            translationText = translationText + ' <ohoo> '+ allAttributes;
            attributesFlag = true
        }

        if( reference && reference.length ){
            params.translation[0].reference = reference;
            referenceFlag = true;
            reference = reference.toString();
            translationText = translationText + ' <ohoo> ' + reference;
        }
        /********** Translation API Call **********/
        Meteor.call('yandexTranslate', translationText, Session.get('currentEditLang') || 'en', availableLanguages, function( err, result ){
            if(err){
                stopProgress();
                swal({
                    title: "translation Failed!",
                    text: err.message,
                    type: "error"
                });
                return;
            }

            //add untranslatable features
            if ( values && values.length ){
                //untranslatableFeatures(availableLanguages, values, params)
            }

            if( result ){
                /********** separate translated data **********/
                multipleTranslation( true, result, params, true, true, skillFlag, featuresFlag, imagesCount, descriptionImages, 'product', attributesFlag, false, t.find('#productUin').value, combinationsUin, referenceFlag)
            }
            descriptionImages = [];

            /********** only translate Values not Names **********/
            if ( values && values.length ){
                reTranslate(params.features, params.featuresIndexes);
            }

            /********** save data in Db **********/
            Meteor.call('addProduct', params, function(err) {
                stopProgress();
                if (err) {

                    swal({
                        title: "Failed!",
                        text: err.message,
                        type: "error"
                    });
                    return;
                }
                swal("Published!", "The item is now on the fly.", "success");
                history.back();
            });
        });
    }
});

/********** Template On Destroyed **********/
Template.SuggestProduct.onDestroyed(function(){
    $('#editproductCombinationsAvailable, #editproductCombinationsSelected').jstree().destroy();
});

function setDefaultCategory(index){
    var categories = Session.get('showCategories').map((category)=>{
        category['defaultCategory'] = false;
        return category
    });
    categories[index]['defaultCategory'] = true;
    Session.set('showCategories', categories);
}



//pre-select Features which default in all
/*Session.get('preSelectedFeatures').forEach( function(){
    var showFeatures = Session.get('showFeatures');
    showFeatures.push({
        uniqueId: Math.floor(Math.random() * 100000)
    });
    Meteor.setTimeout(function() {
        $(".features-key").select2({
            tags: true
        })
    },50);
    Session.set('showFeatures', showFeatures);
});*/
//initializeFeatures();

//Retrieving Attributes
retrieveAttributes = (attributes)=>{
    return attributes[Session.get('currentEditLang') || 'en'] && attributes[Session.get('currentEditLang') || 'en'].map(function(x){
            return {text: Object.keys(x[0])[0],
                children: x.map((y)=>{return {text: y[Object.keys(x[0])[0]]}})}
        });
};


startProgress = ()=>{
    Session.set("inProgress", true);
    var progress = Session.get('progress');
    progressInterval = Meteor.setInterval(function(){
        if(progress < 95){
            progress++;
            Session.set('progress', progress);
        }
        else Meteor.clearInterval(progressInterval);
    },230);
};

stopProgress = ()=>{
    Meteor.clearInterval(progressInterval);
    Session.set('progress', 100);
    Session.set('progress', 0);
    Session.set('inProgress', false);
};


function getSelectedCategory(categoryId, x){
    if ( categoryId.find('.selectCategory')[x].value && categoryId.find('.selectCategory')[x].value != 'placeholder'){
        return categoryId.find('.selectCategory')[x].value;
    }
    return x-1 == -1 ? selectCategoryError() : getSelectedCategory(categoryId, x-1);
}

selectCategoryError = ()=>{
    stopProgress();
    swal('Error', 'Select a category', 'error')
};

function getFeaturesindexes( id ){
    var indexArray = [], uniqueIds = [];
    $("table#feature tbody").find('tr').each(function() {
        var key = $(this).find('.features-key').val();
        if(key){
            indexArray.push(Number(key))
        }
    });
    var newArray = checkDefaulltIn(indexArray, id);
    newArray.forEach( function(value){
        var showFeatures = Session.get('showFeatures');
        var uniqueId = Math.floor(Math.random() * 100000);
        showFeatures.push({
            uniqueId: uniqueId
        });
        uniqueIds.push({
            uniqueId: uniqueId,
            value: value
        });
        Meteor.setTimeout(function() {
            $(".features-key").select2({
                tags: true
            });
            updateAdjust(uniqueIds)
        }, 50);
        Session.set('showFeatures', showFeatures);
    });
}

//updateAdjust = (ids)=>{
//    ids.forEach((obj)=>{
//        var $tableBody = $('table#feature tbody') ;
//        var $tr = $tableBody.find('#' + obj.uniqueId);
//        $tr.find('.features-key').select2('val', obj.value);
//    })
//};

reTranslate = (features, indexes)=>{
    var currentFeatures = Session.get('currentLangFeatures');
    for ( var i = 0; i < indexes.length; i++){
        if(! indexes[i].translatable ){
            features.forEach(function( language ){
                language.values && language.values[i] && (language.values[i].values = currentFeatures[i].values)
            })
        }
    }
};

preSelectCategory = ()=>{
    var CatId = FlowRouter.current().params.id;
    var a = Categories.find({_id:CatId}).fetch();
    if(findParent(a[0], []).length){
        return findParent(a[0]);
    }
};


/********** Return Images url **********/
function getImages(){
    var img = Session.get('images');
    return (img.length) ? (img.map(function(obj){
        return obj.url;
    })) : [];
}

function getFeatures(){
    var features = Session.get('features'),
        array = [], indexArray = [];
    $("table#feature tbody").find('tr').each(function() {
        var key = $(this).find('.features-key').val(),
            text = $(this).find('.features-key').select2('data')[0]['text'],
            value = $(this).find('.features-select').val(),
            obj = {
                translatable : $(this).find('.onoffswitch-checkbox').is(':checked')
            };
        if(value && key && text != 'placeholder'){
            for (var i = 0; i < indexArray.length; i++ ){
                if ( key == indexArray[i].index){
                    return 'twice';
                }

            }
            indexArray.push({
                index: key,
                translatable: obj.translatable
            });
            obj[text] = value;
            array.push(obj)
        }
    });
    Session.set('indexArray', indexArray);
    return array;
}

/********** get Current Features **********/
getCurrentProductsFeatures = function(features){
    var result = [];
    for ( var i = 0; i < features.length; i++){
        for (var key in features[i]){
            if(key != "translatable"){
                result.push({
                    name: key,
                    values: features[i][key]
                })
            }
        }
    }
    Session.set('currentLangFeatures', result)
    return result
};
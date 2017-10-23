
/********** global variable  **********/
var descriptionImages = [],
    combinations = [],
    categoriesSelected = [],
    categoryCount = 1, uinNo,
    combinationsUin,
    availableLanguages,
    progressInterval,
    removed = false,attr_id,
    originalFeatures = [],
    imagesCount = 0,
    languageChanged = true,
    translationFlag;


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

/********** Set Default Session **********/
Session.set('preselected', false);
Session.set('categoryArray1', []);
Session.set('addCategoryBar', false);
Session.set('type', 'Product');
//Session.set('currentEditLang', 'en');

Template.vendorToolsProductContribution.onCreated(()=> {

});

Template.vendorToolsProductContribution.onRendered(()=> {
    var self = this;
    var data = currentEditedProduct();
    Session.set('data', data);

    /********** Set Default Session **********/
    Session.set('Features', Features.find({}).fetch());
    Session.setDefault('images', []);
    Session.set('imageFrom', 'product');
    Session.setDefault('createProductUinNo', '');
    Session.setDefault('currentImage', '');
    //atleast one for show the structure correctly
    Session.set('showFeatures', [{uniqueId: 12345}]);
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

    if(Session.get('data')){
        Session.set('categoryOnlyTreeSelectedID', Session.get('data').category);
        Session.set('productTranslation', [Session.get('data').translation]);
        Session.set('sourceLang', Session.get('data').source);
        Session.set('prodFeatures', Session.get('data').features);
        if( Session.get('data').translation[Session.get('currentEditLang')] ){
            //Session.set('currentDescription', Session.get('data').translation[Session.get('currentEditLang')].description);
        }
        var images = Session.get('data').images;
        if(images && images.length){
            var a = images.map(function(obj, index){
                convertBase64(obj, function(base64){
                    var image = Session.get('images');
                    image.push({url : obj , base64: base64});
                    Session.set('images', image);
                    if(index == images.length - 1){
                        Session.set('copper', false);
                        self.$(".image-crop > img").cropper("reset", true).cropper("replace", base64)
                    }
                })
            })
        }
    }

    /********** PreSelect one Category if comes with old values **********/
    //Session.set('showCategories', [{uniqueId:1, index: FlowRouter.current().params.id || '', defaultCategory : true}]);
    if ( Session.get('data') && Session.get('data').category && Session.get('data').category.length){
        var preselectedCategories = Session.get('data').category, showCategories = [];
        preselectedCategories.forEach(function(id){
            var uniqueId = Math.floor(Math.random() * 100000);
            showCategories.push({
                uniqueId: uniqueId,
                index: id
            });
        });
    }
    Session.set('showCategories', showCategories);
    Session.set('addCategoryBar', false);
    removed = false;
    Session.set('selectedParentCategories',[]);
    Session.set('selectedIndex',[]);
    if(categoryCount < 8){
        Session.set('newCategoryDefaultInData',[[parentRootCategory()]]);
        categoryCount++;
    }
    else{
        Session.set('newCategoryDefaultInData',[]);
    }
    Meteor.setTimeout(function(){
        $(".selectCategory, .selectSubCategory, .selectSubSubCategory").select2({
            width: '100%'
        });

    },50);
    Session.set('addCategoryBar', false);
    removed = false;

    availableLanguages = getLangCodes();
    uinNo = 'P' + Random.id().toUpperCase();
    var $image = this.$(".image-crop > img"),
        $inputImage = this.$("#inputImage"),
        config;

    Session.set('createProductUinNo', uinNo);
    this.find('#productUin').value = (uinNo);




    $(".features-key, .features-select").select2({
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
            onChange: function( ) {
                if( languageChanged ){
                    Session.set('updated', true);
                    Session.set('updatedDescription', $('#productDescription').summernote('code'));
                }
            },
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
    Meteor.setTimeout(function(){
        $('[data-code=en]').addClass('active');
        $(".selectCategory").select2({});
    });

    //before the dom attached
    setSelect2();

    getProductsFeatures();
    //setSelect2()

});

Template.vendorToolsProductContribution.helpers({

    showDefaultIn : function(){
        var categoriesData = [];
        categoryCount = 0;
        if( Session.get('data') && Session.get('data').category.length ){
            var preselectedCategories = Session.get('data').category;
            categoryCount += preselectedCategories.length;
            Session.set('defautInArray',preselectedCategories);
            Session.set('newCategoryNumber',preselectedCategories.length+1);
            for(var i in preselectedCategories){
                var mainCategoryObj= Categories.findOne({_id:preselectedCategories[i]});
                var allParentCategories = [];
                if( mainCategoryObj && mainCategoryObj.parent ){
                    var allParentCategoriesId = findParent(mainCategoryObj);
                    for(var j in allParentCategoriesId){
                        allParentCategories.push(Categories.findOne({_id : allParentCategoriesId[j]}))
                    }
                }
                else{
                    allParentCategories.push([mainCategoryObj]);
                }
                categoriesData.push(allParentCategories);
            }
            return categoriesData;
        }
        Session.set('defautInArray',[]);
    },

    emptyCategoryData : function(){
        Meteor.setTimeout(function() {
            $('#0_0').select2({});
        },100);
        return Session.get('newCategoryDefaultInData');

    },

    products_attributes: function(attr){
        return retrieveAttributes(attr);
    },

    Product: ()=>{
        return Products.findOne({
            _id: FlowRouter.current().params.productId
        })
    },

    prodSkills: function(skills){
        return skills && getTranslation(skills, 'values');
    },

    featureTranslatable: function(index){
        var selectionChoices = Features.find({}).fetch();
        return selectionChoices[0] && selectionChoices[0].translation[Session.get('currentEditLang') || 'en'][index]
            && selectionChoices[0].translation[Session.get('currentEditLang') || 'en'][index].translatable;
    },

    skills: function(skills) {
        if(Skills.find({}).fetch() && Skills.find({}).fetch()[0])
        var selectionChoices = Skills.find({}).fetch()[0].translation[Session.get('currentEditLang') || 'en'];
        var prodSkills = skills && getTranslation(skills, 'values');
        if(prodSkills && selectionChoices){
            selectionChoices = selectionChoices.filter(function(duplicate){
                return !prodSkills.includes(duplicate);
            });
        }
        return selectionChoices;
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

    images : ()=>{
        return Session.get('images');
    },

    attributes_available: function(){
        attr_id = Attributes.findOne() &&  Attributes.findOne()._id;
        return Attributes.findOne() &&  retrieveAttributes(Attributes.findOne().attributes);
    },

    Languages: allLanguages,

    sourceLanguage: (doc)=>{
        return doc.isoCode == Session.get('sourceLang');
    },

    isType: ()=>{
        return Session.get('type');

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

Template.vendorToolsProductContribution.events({
    'change #productName': function( e, t ) {
        Session.set('updated', true);
        Session.set('updatedName', t.$('#productName').val());
    },

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
    'click .changeLang': ( e, t )=> {
        var prevLang = Session.get('currentEditLang'),
            lang = $(e.target).data('code');
        if(!Session.get('sourceLang')){
            Session.set('sourceLang', lang);
        }
        if (lang == undefined) return;
        if (prevLang == lang) return;
        Session.set('currentEditLang', lang);
        var translation = currentEditedProduct().translation;
        translation = translation && getTranslation(translation, null, true);
        if(translation){
            t.$('#productName').val(translation.name || '');
            t.$('#productDescription').summernote('code', translation.description || '');
            Session.set('currentDescription', translation.description || '');
        }
        else{
            t.$('#productName').val('');
            t.$('#productDescription').summernote('code', '');
            Session.set('currentDescription', '');
        }


        Meteor.setTimeout(function(){
            languageChanged = true;
        }, 500);

        var attributes = retrieveAttributes(t.data.attributes),
            attributesAvailable = Attributes.findOne() && retrieveAttributes(Attributes.findOne().attributes),
            tempAttributesAvailable = t.$('#editproductCombinationsSelected'),
            tempAttributesSelected = t.$('#editproductCombinationsAvailable');

        //Refreshing Jstrees
        tempAttributesAvailable.jstree(true).settings.core.data = attributes;
        tempAttributesAvailable.jstree(true).refresh();
        tempAttributesSelected.jstree(true).settings.core.data = attributesAvailable;
        tempAttributesSelected.jstree(true).refresh();
        tempAttributesSelected.bind("refresh.jstree", function(event, data) {
            compareAttributes();
        });

        getProductsFeatures();
        setSelect2();
        setProductsFeatures();
        //initializeFeatures();
        Meteor.setTimeout(function() {
            $(".features-key, .selectCategory, #selectReference, #selectGTIN").select2({
                tags: true
            });
        },50);
        Session.set('sourceLang', lang);
    },

    'change input[name=radioInline]': (e, t)=>{
        uinNo = "P" + Random.id().toUpperCase();
        t.find('#productUin').value = uinNo;
        Session.set('type', type);
    },

    'click #defaultCat' : (e)=>{
        setDefaultCategory(e.currentTarget.attributes.index.value);
    },

    /************* Select remove Category ****************/
    'click #addNewCategory':  ()=> {

        var emptyCategories = Session.get('newCategoryDefaultInData');
        if(categoryCount > 7){
            swal("Error", 'maximum 8 Categories allowed', "error");
            return;
        }

        emptyCategories.push([parentRootCategory()]);
        Session.set('newCategoryDefaultInData',emptyCategories);
        categoryCount++;
        applySelectTo('0'+'_'+(emptyCategories.length-1).toString());
        //if(categoryCount > 7){
        //    swal("Error", 'maximum 8 Categories allowed', "error");
        //    return;
        //}
        //categoryCount++ ;
        //var showCategories = Session.get('showCategories');
        //var uniqueId = Math.floor(Math.random() * 100000);
        //showCategories.push({
        //    uniqueId: uniqueId
        //});
        //Meteor.setTimeout(function(){
        //    $(".selectCategory, .selectSubCategory, .selectSubSubCategory").select2({
        //        width: '100%'
        //    });
        //
        //},50);
        //Session.set('addCategoryBar', true);
        //Session.set('uniqueId', showCategories[showCategories.length - 1].uniqueId);
        //Session.set('categoryTabIndex', categoryCount);
        //Session.set('categoryArray'+categoryCount, []);
        //Session.set('showCategories', showCategories);
        //setDefaultCategory(showCategories.length - 1);
    },

    'click .removeCategory': (e)=>{

        $('#box' + e.target.attributes.id.value).remove();
        categoryCount--;

        //if(categoryCount <= 1){
        //    swal("Error", 'at least one Category is required', "error");
        //    return;
        //}
        //Session.set('newCategory_' + categoryCount, '');
        //categoryCount-- ;
        //id = e.currentTarget.attributes.id.value;
        //$("[categoryNumber ="+ id+"]").remove();

        //t.$('.col-sm-3#' + id).remove();
    },

    'click .defaultRemoveCateogories' : function(e){
        $('#defaultBox' + e.target.attributes.id.value).remove();
        var tempDefaultInData = Session.get('defautInArray');
        tempDefaultInData.splice(e.target.attributes.id.value,1);
        Session.set('defautInArray',tempDefaultInData);
        categoryCount--;
    },
    'change .selectCategory' : function( e ){
        var selectedBoxIndex = parseInt(e.target.attributes.id.value.split('_')[0]),
            parentSelectedBoxIndex = parseInt(e.target.attributes.id.value.split('_')[1]);
        if(Session.get('selectedIndex').includes(e.target.attributes.id.value)){
            var tempnewCategoryDefaultInData = Session.get('newCategoryDefaultInData');
            for(var i=selectedBoxIndex+1;i<tempnewCategoryDefaultInData[parentSelectedBoxIndex].length;i++){
                $('#'+i+'_'+parentSelectedBoxIndex.toString()).select2('destroy');
            }
            tempnewCategoryDefaultInData[parentSelectedBoxIndex].splice(selectedBoxIndex +1,tempnewCategoryDefaultInData[parentSelectedBoxIndex].length -1);
            Session.set('newCategoryDefaultInData',tempnewCategoryDefaultInData)
        }
        var childCategories = Categories.find({
            parent : e.currentTarget.value
        }).fetch();
        if(childCategories.length){
            var newCateogoryData = Session.get('newCategoryDefaultInData');
            newCateogoryData[parentSelectedBoxIndex].push(childCategories);
            var updateSelectedIndex = Session.get('selectedIndex');
            updateSelectedIndex.push(e.target.attributes.id.value);
            Session.set('selectedIndex',updateSelectedIndex);
            Session.set('newCategoryDefaultInData',newCateogoryData);
            applySelectTo((selectedBoxIndex+1)+'_'+parentSelectedBoxIndex.toString());
        }
    },

    //'change .selectCategory' : function( e ){
    //    //getFeaturesindexes( $(e.target).val( ));
    //    var k = e.target.attributes.id.value;
    //    var index = parseInt(k.split('_')[1]);
    //    var uniqueID = parseInt(k.split('_')[2]);
    //    var categoryNumber = parseInt($('#'+e.target.attributes.uniqueId.value).attr('categoryNumber')) + 1;
    //    var updateShowCategory = Session.get('showCategories');
    //    Session.set('categoryTabIndex', '');
    //    Session.set('uniqueId', e.target.attributes.uniqueId.value);
    //    Session.set('categoryNumber', categoryNumber);
    //    Session.set("newCategory_" + categoryNumber, $(e.target).val());
    //    Session.set("newCategoryIndex_" + categoryNumber, index);
    //},

    'click #publish': function ( e, t ) {
        e.preventDefault();
        Session.set('inProgress', true);
        Session.set('mayContainProduct', true);

        /********** start translation progress values **********/
        startProgress();

        /********** get template values for request **********/
        var features = getFeatures(),
            name = t.$('#productName').val(),
        //TODO: summerNote Initialization
            description = t.$('#productDescription').summernote('code'),
            type = "P",
            skills = t.$('#selectSkill').val(),
            attributes = t.$('#editproductCombinationsSelected').jstree().get_json('#'),
            tempCategories = [],
            tempDescription, translationText = "", skillFlag, featuresFlag, attributesFlag, referenceFlag,
            totalFeatures  = [], allAttributes = [],
            //defaultCategory = _.findWhere(Session.get('showCategories'),{defaultCategory : true});

        //if( !defaultCategory ){
        //    stopProgress();
        //    showSwal("Failed", "Please select default category", "error");
        //    return;
        //}
        /* defaultCategory = defaultCategory.index;
         commission = setProductCommission(defaultCategory);*/
        /*
         var defaultCategoryData = Categories.findOne({_id : defaultCategory});
         defaultCategoryData.commission ? commission = defaultCategoryData.commission : commission = defaultCategoryData.inheritedCommission;
         */

            tempNewCategoriesData = Session.get('newCategoryDefaultInData'),
            tempDefaultIn = Session.get('defautInArray');

        for(var i=0;i<tempNewCategoriesData.length;i++) {
            childLoop:
                for (var j = tempNewCategoriesData[i].length - 1; j >= 0; j--) {
                    var tempSelectId = j.toString() + '_' + i.toString();
                    if ($('#' + tempSelectId).val()) {
                        tempDefaultIn.push($('#' + tempSelectId).val());
                        break childLoop;
                    }
                }
        }


        /********** Set params for request **********/
        params = {
            product: FlowRouter.current().params.productId,
            translation: [],
            skills: [],
            features: [],
            type: type,
            status: 'pending',
            user: Meteor.userId(),
            attributes: {},
            images : getImages(),
            language : Session.get('currentEditLang')
            //defaultCategory : defaultCategory
        };
        /*    params.category = filterKeys(Session.get('showCategories'), 'uniqueId').map(function(x){
         var categoryId = $('#'+x),
         last = categoryId.find('.selectCategory').length - 1;
         return getSelectedCategory(categoryId, last)
         });*/

        var subscribe = $('#inlineCheckbox1')[0].checked;
        if( subscribe ){
            var _id  = FlowRouter.current().params.productId;
            Meteor.call('subscribed', _id);
        }

        //for(var l=0;l<Session.get('showCategories').length;l++){
        //    var setDefault = false;
        //    if($('#isDefault'+l).is(':checked')){
        //        setDefault = true;
        //    }
        //    childLoop:
        //        for(var j=0;;j++) {
        //            var tempSelectId =  j.toString() + '_' + l.toString(),
        //                incrementID = (j+1).toString() + '_' + l.toString();
        //            if ($("[fetchId="+tempSelectId+"]").val() &&  $("[fetchId="+tempSelectId+"]").val() != "placeholder") {
        //                if(!($("[fetchId="+incrementID+"]").val()) || $("[fetchId="+incrementID+"]").val() == "placeholder"){
        //                    if(setDefault){params.defaultCategory = $("[fetchId="+tempSelectId+"]").val();setDefault=false}
        //                    tempCategories.push($("[fetchId="+tempSelectId+"]").val());
        //                    break childLoop;
        //                }
        //            }
        //            else{
        //                break childLoop;
        //            }
        //        }
        //}
        //if( typeof params.defaultCategory == 'object' ){
        //    stopProgress();
        //    showSwal("Failed", "Your default Category is empty", "error");
        //    return;
        //}
        //params.category = tempCategories;
        //if( params.category == false){
        //    return
        //}

        params.category = tempDefaultIn;
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
        params.translation = currentEditedProduct().translation;
        var langIndex = _.findIndex(params.translation, function(obj) {
            return obj.language == Session.get('currentEditLang');
        });
        if ( langIndex ){
            params.translation[langIndex].name = name;
            params.translation[langIndex].description = description
        }
        else{
            params.translation.push({
                language: Session.get('currentEditLang'),
                name: name,
                description: description || ""
            });
        }


        if( skills && skills.length ){
            skillFlag = true;
            params.skills.push({
                language: Session.get('currentEditLang') || 'en',
                values: skills
            })
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
            attributesFlag = true
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
            Meteor.call('addNewContribution', params, function(err) {
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
Template.vendorToolsProductContribution.onDestroyed(function(){
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
    if(attributes){
        return attributes[Session.get('currentEditLang') || 'en'] && attributes[Session.get('currentEditLang') || 'en'].map(function(x){
                return {text: Object.keys(x[0])[0],
                    children: x.map((y)=>{return {text: y[Object.keys(x[0])[0]]}})}
            });
    }
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

//preSelectCategory = ()=>{
//    var CatId = FlowRouter.current().params.id;
//    var a = Categories.find({_id:CatId}).fetch();
//    if(findParent(a[0], []).length){
//        return findParent(a[0]);
//    }
//};


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
    Session.set('currentLangFeatures', result);
    return result
};


/********** get Current Product Details **********/
currentEditedProduct = function() {
    return Products.findOne({
        _id: FlowRouter.current().params.productId
    });
};

//any keys which want to generate for update in specific lauguage
generateValues = function( lang ) {
    var keys = [], values = [];
    if( Session.get('updatedName') ){
        keys.push('name');
        values.push(Session.get('updatedName'));
    }
    if( Session.get('updatedDescription') ){
        keys.push('description');
        values.push(Session.get('updatedDescription'));
    }
    return {
        keys: keys,
        values: values
    }
};

resolveLanguage = function(){
    Session.set('updatedName', false);
    Session.set('updatedDescription', false)
};

getProductsFeatures = function (){
    var prodFeature = Session.get('prodFeatures');
    var langIndex = _.findIndex(prodFeature, function(obj) {
        return obj.language == Session.get('currentEditLang');
    });
    if ( langIndex != -1 ){
        var features = prodFeature[langIndex] && prodFeature[langIndex].values;
        if( features && features.length ){
            Session.set('showFeatures' ,features.map(function(obj){
                    return {uniqueId : Math.floor(Math.random() * 100000), feature : obj}
                })
            );
        }
        setProductsFeatures();
    }
};

setProductsFeatures = function(){
    var langIndex = _.findIndex(Session.get('Features')[0].translation, function(obj) {
        return obj.language == Session.get('currentEditLang');
    });
    Meteor.setTimeout(function() {
        var check;
        Session.get('showFeatures').find(function(obj, index){
            for(var i in obj.feature){
                Session.get('Features')[0].translation[Session.get('currentEditLang') || 'en'].find(function(o, index1){
                    if ( typeof obj.feature[i] == 'string' ){
                        check = obj.feature[i].trim();
                    }
                    if(o.name && o.name.trim() == check){
                        var $table = $("table#feature"),
                            $tr = $table.find('#' + obj.uniqueId),
                            select = $tr.find('.features-key'),
                            values = $tr.find('.features-select'),
                            showFeatures = Session.get('showFeatures'),
                            id = obj.uniqueId;
                        changeDesc(showFeatures, id, index1);
                        Session.set('showFeatures', showFeatures);
                        $tr.find('.onoffswitch-checkbox').prop('checked', obj.feature.translatable);
                        Meteor.setTimeout(function(){
                            values.select2('val', obj.feature.values);
                            select.select2('val', index1);
                        }, 0)
                    }
                })
            }
        });
    }, 0);
};

function setSelect2(){
    Meteor.setTimeout(function(){
        $(".features-select").select2({
            tags: true
        });
        $(".features-key").select2({
            tags: true
        });

        $(".gtin-key").select2({
            tags: true
        });
        $(".selectSkill").select2({
            tags: true
        });
        $("#selectReference").select2({
            tags: true
        });
    },0);
}

preSelectCategory = function( id ) {
    if (id) {
        var a = Categories.find({_id:id}).fetch();
        if(findParent(a[0], []).length){
            return findParent(a[0]);
        }
    }
};

compareAttributes = function(){
    var $combinationsAvailable  = $('#editproductCombinationsAvailable'),
        comb_available = $combinationsAvailable.jstree().get_json('#'),
        comb_selected = $('#editproductCombinationsSelected').jstree().get_json('#'),
        temp;
    for( var x = 0 ; x < comb_selected.length ; x++ ){
        for( var y = 0 ; y < comb_available.length ; y++ ){
            if(comb_selected[x].text.toLowerCase() == comb_available[y].text.toLowerCase()){
                temp = comb_available[y].children.length;
                for( var z = 0 ; z < comb_selected[x].children.length ; z++){
                    for ( var k = 0 ; k < comb_available[y].children.length ; k++){
                        if(comb_selected[x].children[z].text.toLowerCase() == comb_available[y].children[k].text.toLowerCase()){
                            $combinationsAvailable.jstree().delete_node(comb_available[y].children[k]);
                            temp = temp - 1;
                            if(temp == 0){
                                $combinationsAvailable.jstree().delete_node(comb_available[y]);
                            }
                        }
                    }
                }
            }
        }
    }
};
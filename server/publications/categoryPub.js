
Meteor.publish('categories', ()=> {
    //limiting publication to prevent all data goes to client
    return Categories.find({},{limit:50});
});

Meteor.publish('childCategories', function (parent) {
    check(parent, String);
    if (parent == '') {
        return Categories.find({parent: {$exists: false}});
    } else {
        return Categories.find({parent: parent});
    }
});

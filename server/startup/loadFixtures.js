Meteor.startup(()=>{
    var a = Meteor.users.findOne({
            "emails.address": 'marketsol123bis@gmail.com'
        }),

        admin = Meteor.users.findOne({
            'emails.address':'admin@admin.com'
        }),

        vendor = Meteor.users.findOne({
            'emails.address':'vendor@vendor.com'
        }),

        vendor1 = Meteor.users.findOne({
            'emails.address':'vendor1@vendor.com'
        }),

        vendor2 = Meteor.users.findOne({
            'emails.address':'vendor2@vendor.com'
        }),

        vendor3 = Meteor.users.findOne({
            'emails.address':'vendor3@vendor.com'
        }),

        vendor4 = Meteor.users.findOne({
            'emails.address':'vendor4@vendor.com'
        }),

        vendor5 = Meteor.users.findOne({
            'emails.address':'vendor5@vendor.com'
        }),

        testVendor = Meteor.users.findOne({
            'emails.address':'marketsol123@gmail.com'
        });

    //fall back relational values
    var product6 = Products.findOne({views:2});
    product6 = product6 && product6._id ;


    /*******  if Collection defined don't run startup code every time in development *****/
    if(  ! Categories.find().fetch().length ){
        Categories.remove({});
        var root = Categories.insert({
            translation: [
                {
                    "language": "de",
                    "name": "Root",
                    "description": "Root Category"
                },
                {
                    "language": "es",
                    "name": "Root ",
                    "description": "Root Category"
                },
                {
                    "language": "it",
                    "name": "Root ",
                    "description": "Root Category"
                },
                {
                    "language": "fr",
                    "name": "Root ",
                    "description": "Root Category"
                },
                {
                    "language": "en",
                    "name": "Root ",
                    "description": "Root Category"
                }
            ],
            source: 'en',
            published: true,
            mayContainProduct: false,
            autoPublish: false,
            status: true
        });

        var defaultCategory = Categories.insert({
            translation: [
                {
                    "language": "en",
                    "name": "Default Category",
                    "description": "<p>Default Category<br></p>"
                },
                {
                    "language": "de",
                    "name": "Default Category ",
                    "description": " <p>Kategorie<br></p>"
                },
                {
                    "language": "es",
                    "name": "Default Category ",
                    "description": " <p>Default Category<br / ></p>"
                },
                {
                    "language": "fr",
                    "name": "Categorie par defaut ",
                    "description": " <p>Categorie par Defaut<br></p>"
                },
                {
                    "language": "it",
                    "name": "Categoria predefinita ",
                    "description": " <p>Default Category><br > </p>"
                }
            ],
            source: 'en',
            published: true,
            mayContainProduct: true,
            autoPublish: false,
            status: true,
            parent: root
        });

        var parent1 = Categories.insert({
            translation: [
                {
                    "language": "en",
                    "name": "parent 1",
                    "description": "<p>Parent 1<br></p>"
                }
            ],
            source: 'en',
            published: true,
            mayContainProduct: true,
            autoPublish: false,
            status: true,
            parent: defaultCategory
        });

        var parent2 = Categories.insert({
            translation: [
                {
                    "language": "en",
                    "name": "parent 2",
                    "description": "<p>Parent 2<br></p>"
                }
            ],
            source: 'en',
            published: true,
            mayContainProduct: true,
            autoPublish: false,
            status: true,
            parent: defaultCategory
        });

        var child1 = Categories.insert({
            translation: [
                {
                    "language": "en",
                    "name": "child 2",
                    "description": "<p>child 2<br></p>"
                }
            ],
            source: 'en',
            published: true,
            mayContainProduct: true,
            autoPublish: false,
            status: true,
            parent: parent1
        });

        var child2 = Categories.insert({
            translation: [
                {
                    "language": "en",
                    "name": "child 2",
                    "description": "<p>child 2<br></p>"
                }
            ],
            source: 'en',
            published: true,
            mayContainProduct: true,
            autoPublish: false,
            status: true,
            parent: parent1
        });

        var subChild1 = Categories.insert({
            translation: [
                {
                    "language": "en",
                    "name": "subChild 1",
                    "description": "<p>subChild 1<br></p>"
                }
            ],
            source: 'en',
            published: true,
            mayContainProduct: true,
            autoPublish: false,
            status: true,
            parent: child1
        });

        var subChild2 = Categories.insert({
            translation: [
                {
                    "language": "en",
                    "name": "subChild 2",
                    "description": "<p>subChild 2 <br></p>"
                }
            ],
            source: 'en',
            published: true,
            mayContainProduct: true,
            autoPublish: false,
            status: true,
            parent: child1
        });
    }

    if ( ! Products.find().fetch().length ){
        Products.remove({});
        var Product1 = Products.insert({
            translation: [
                {
                    language: 'en',
                    name: 'iphone',
                    reference: ['DDD'],
                    description: 'iphone is the best brand from apple'
                },
                {
                    language: 'fr',
                    name: 'iphone',
                    reference: ['test'],
                    description: 'iphone is the best brand from apple'
                }
            ],
            source: 'en',
            offersCount: 100,
            type: 'Product',
            defaultCategory: defaultCategory,
            avgOffer: 130.0,
            bestOffer: 115.0,
            commission: '10',
            published: true,
            status: true,
            user: vendor._id,
            affiliate: {
                origin: 'customSite.com'
            },
            category: [defaultCategory],
            uin: 'P1234567',
            weight: 23,
            "images": [
                "https://marketplacedemomike.s3.eu-central-1.amazonaws.com/img/p/Y/L/P/j/g/8/w/7/t/K/6/D/d/Z/S/Q/H/YLPjg8w7tK6DdZSQH0.024920.jpg",
                "https://marketplacedemomike.s3.eu-central-1.amazonaws.com/img/p/Y/L/P/j/g/8/w/7/t/K/6/D/d/Z/S/Q/H/YLPjg8w7tK6DdZSQH0.024920.jpg"
            ],
            "skills": [
                {
                    language: 'en',
                    values: ["test 1"]
                },
                {
                    language: 'fr',
                    values: ["test 1"]
                }
            ],
            "features": [
                {
                    language: 'en',
                    values: [{
                        "name": "feature 1",
                        "values": [
                            "test",
                            "best"
                        ]
                    },
                        {
                            "name": "feature2",
                            "values": [
                                "guest",
                                "nest"
                            ]
                        }
                    ]
                },
                {
                    language: 'fr',
                    values: [{
                        "name": "feature 1",
                        "values": [
                            "test",
                            "best"
                        ]
                    },
                        {
                            "name": "feature2",
                            "values": [
                                "guest",
                                "nest"
                            ]
                        }
                    ]
                }
            ]
        });
        var Product2 = Products.insert({
            translation: [
                {
                    language: 'en',
                    name: 'samsung',
                    reference: ['DDD'],
                    description: 'samsung galaxy prices'
                },
                {
                    language: 'fr',
                    name: 'samsung',
                    reference: ['test'],
                    description: 'samsung galaxy prices'
                }
            ],
            source: 'en',
            offersCount: 100,
            type: 'Product',
            defaultCategory: defaultCategory,
            avgOffer: 130.0,
            bestOffer: 115.0,
            commission: '10',
            published: true,
            subscribers: [a._id],
            status: true,
            user: vendor._id,
            affiliate: {
                origin: 'customSite.com'
            },
            "attributes" : {
                "en" : [
                    [
                        {
                            "color" : "yellow"
                        },
                        {
                            "color" : "blue"
                        }
                    ],
                    [
                        {
                            "size" : "L"
                        },
                        {
                            "size" : "XS"
                        }
                    ]
                ]
            },
            category: [defaultCategory],
            uin: 'P1234567',
            weight: 12,
            "images": [
                "https://marketplacedemomike.s3.eu-central-1.amazonaws.com/img/p/Y/L/P/j/g/8/w/7/t/K/6/D/d/Z/S/Q/H/YLPjg8w7tK6DdZSQH0.024920.jpg",
                "https://marketplacedemomike.s3.eu-central-1.amazonaws.com/img/p/Y/L/P/j/g/8/w/7/t/K/6/D/d/Z/S/Q/H/YLPjg8w7tK6DdZSQH0.024920.jpg"
            ],
            "skills": [
                {
                    language: 'en',
                    values: ["test 1"]
                },
                {
                    language: 'fr',
                    values: ["test 1"]
                }
            ],
            "features": [
                {
                    language: 'en',
                    values: [{
                        "name": "feature 1",
                        "values": [
                            "test",
                            "best"
                        ]
                    },
                        {
                            "name": "feature2",
                            "values": [
                                "guest",
                                "nest"
                            ]
                        }
                    ]
                },
                {
                    language: 'fr',
                    values: [{
                        "name": "feature 1",
                        "values": [
                            "test",
                            "best"
                        ]
                    },
                        {
                            "name": "feature2",
                            "values": [
                                "guest",
                                "nest"
                            ]
                        }
                    ]
                }
            ]
        });
        var Product3 = Products.insert({
            translation: [
                {
                    language: 'en',
                    name: 'google nexus 6',
                    reference: ['DDD'],
                    description: 'google nexus 6 a proud google product'
                },
                {
                    language: 'fr',
                    name: 'google nexus 6',
                    reference: ['test'],
                    description: 'google nexus 6 a proud google product'
                }
            ],
            source: 'en',
            offersCount: 100,
            type: 'Product',
            defaultCategory: defaultCategory,
            avgOffer: 130.0,
            bestOffer: 115.0,
            commission: '10',
            published: true,
            subscribers: [a._id],
            status: true,
            user: vendor._id,
            affiliate: {
                origin: 'customSite.com'
            },
            category: [defaultCategory],
            uin: 'P1234567',
            weight: 10,
            views: 1,
            "images": [
                "https://marketplacedemomike.s3.eu-central-1.amazonaws.com/img/p/Y/L/P/j/g/8/w/7/t/K/6/D/d/Z/S/Q/H/YLPjg8w7tK6DdZSQH0.024920.jpg",
                "https://marketplacedemomike.s3.eu-central-1.amazonaws.com/img/p/Y/L/P/j/g/8/w/7/t/K/6/D/d/Z/S/Q/H/YLPjg8w7tK6DdZSQH0.024920.jpg"
            ],
            "skills": [
                {
                    language: 'en',
                    values: ["test 1"]
                },
                {
                    language: 'fr',
                    values: ["test 1"]
                }
            ],
            "features": [
                {
                    language: 'en',
                    values: [{
                        "name": "feature 1",
                        "values": [
                            "test",
                            "best"
                        ]
                    },
                        {
                            "name": "feature2",
                            "values": [
                                "guest",
                                "nest"
                            ]
                        }
                    ]
                },
                {
                    language: 'fr',
                    values: [{
                        "name": "feature 1",
                        "values": [
                            "test",
                            "best"
                        ]
                    },
                        {
                            "name": "feature2",
                            "values": [
                                "guest",
                                "nest"
                            ]
                        }
                    ]
                }
            ]
        });
        var Product6 = Products.insert({
            combinations: [
                {
                    "language" : "en",
                    "values" : [
                        {
                            "UIN" : "PQ8GUYYB7IERPNE9NX-CombVSOAJ",
                            combId: 1,
                            "inheritedCommission" : "%",
                            "status" : true,
                            "combination" : [
                                {
                                    "attribute" : "color",
                                    "value" : "red"
                                },
                                {
                                    "attribute" : "size",
                                    "value" : "XL"
                                }
                            ]
                        },
                        {
                            "UIN" : "PQ8GUYYB7IERPNE9NX-CombCMM7N",
                            combId: 2,
                            "inheritedCommission" : "%",
                            "status" : true,
                            "combination" : [
                                {
                                    "attribute" : "color",
                                    "value" : "red"
                                },
                                {
                                    "attribute" : "size",
                                    "value" : "L"
                                }
                            ]
                        },
                        {
                            "UIN" : "PQ8GUYYB7IERPNE9NX-CombHSSOY",
                            combId: 3,
                            "inheritedCommission" : "%",
                            "status" : true,
                            "combination" : [
                                {
                                    "attribute" : "color",
                                    "value" : "red"
                                },
                                {
                                    "attribute" : "size",
                                    "value" : "S"
                                }
                            ]
                        },
                        {
                            "UIN" : "PQ8GUYYB7IERPNE9NX-CombA7MYA",
                            combId: 4,
                            "inheritedCommission" : "%",
                            "status" : true,
                            "combination" : [
                                {
                                    "attribute" : "color",
                                    "value" : "blue"
                                },
                                {
                                    "attribute" : "size",
                                    "value" : "XL"
                                }
                            ]
                        },
                        {
                            "UIN" : "PQ8GUYYB7IERPNE9NX-CombQQD7F",
                            combId: 5,
                            "inheritedCommission" : "%",
                            "status" : true,
                            "combination" : [
                                {
                                    "attribute" : "color",
                                    "value" : "blue"
                                },
                                {
                                    "attribute" : "size",
                                    "value" : "L"
                                }
                            ]
                        },
                        {
                            "UIN" : "PQ8GUYYB7IERPNE9NX-CombSJ7G3",
                            combId: 6,
                            "inheritedCommission" : "%",
                            "status" : true,
                            "combination" : [
                                {
                                    "attribute" : "color",
                                    "value" : "blue"
                                },
                                {
                                    "attribute" : "size",
                                    "value" : "S"
                                }
                            ]
                        },
                        {
                            "UIN" : "PQ8GUYYB7IERPNE9NX-CombBZ5JJ",
                            combId: 7,
                            "inheritedCommission" : "%",
                            "status" : true,
                            "combination" : [
                                {
                                    "attribute" : "color",
                                    "value" : "green"
                                },
                                {
                                    "attribute" : "size",
                                    "value" : "XL"
                                }
                            ]
                        },
                        {
                            "UIN" : "PQ8GUYYB7IERPNE9NX-CombGHHZ7",
                            combId: 8,
                            "inheritedCommission" : "%",
                            "status" : true,
                            "combination" : [
                                {
                                    "attribute" : "color",
                                    "value" : "green"
                                },
                                {
                                    "attribute" : "size",
                                    "value" : "L"
                                }
                            ]
                        },
                        {
                            "UIN" : "PQ8GUYYB7IERPNE9NX-CombERW4S",
                            combId: 9,
                            "inheritedCommission" : "%",
                            "status" : true,
                            "combination" : [
                                {
                                    "attribute" : "color",
                                    "value" : "green"
                                },
                                {
                                    "attribute" : "size",
                                    "value" : "S"
                                }
                            ]
                        }
                    ]
                },
                {
                    "language" : "es",
                    "values" : [
                        {
                            "UIN" : "PQ8GUYYB7IERPNE9NX-CombVSOAJ",
                            "status" : true,
                            "combination" : [
                                {
                                    "attribute" : "tamaño",
                                    "value" : "XL"
                                },
                                {
                                    "attribute" : "color",
                                    "value" : "rojo"
                                }
                            ]
                        },
                        {
                            "UIN" : "PQ8GUYYB7IERPNE9NX-CombCMM7N",
                            "status" : true,
                            "combination" : [
                                {
                                    "attribute" : "tamaño",
                                    "value" : "XL"
                                },
                                {
                                    "attribute" : "color",
                                    "value" : "azul"
                                }
                            ]
                        },
                        {
                            "UIN" : "PQ8GUYYB7IERPNE9NX-CombHSSOY",
                            "status" : true,
                            "combination" : [
                                {
                                    "attribute" : "tamaño",
                                    "value" : "XL"
                                },
                                {
                                    "attribute" : "color",
                                    "value" : "verde"
                                }
                            ]
                        },
                        {
                            "UIN" : "PQ8GUYYB7IERPNE9NX-CombA7MYA",
                            "status" : true,
                            "combination" : [
                                {
                                    "attribute" : "tamaño",
                                    "value" : "L"
                                },
                                {
                                    "attribute" : "color",
                                    "value" : "rojo"
                                }
                            ]
                        },
                        {
                            "UIN" : "PQ8GUYYB7IERPNE9NX-CombQQD7F",
                            "status" : true,
                            "combination" : [
                                {
                                    "attribute" : "tamaño",
                                    "value" : "L"
                                },
                                {
                                    "attribute" : "color",
                                    "value" : "azul"
                                }
                            ]
                        },
                        {
                            "UIN" : "PQ8GUYYB7IERPNE9NX-CombSJ7G3",
                            "status" : true,
                            "combination" : [
                                {
                                    "attribute" : "tamaño",
                                    "value" : "L"
                                },
                                {
                                    "attribute" : "color",
                                    "value" : "verde"
                                }
                            ]
                        },
                        {
                            "UIN" : "PQ8GUYYB7IERPNE9NX-CombBZ5JJ",
                            "status" : true,
                            "combination" : [
                                {
                                    "attribute" : "tamaño",
                                    "value" : "S"
                                },
                                {
                                    "attribute" : "color",
                                    "value" : "rojo"
                                }
                            ]
                        },
                        {
                            "UIN" : "PQ8GUYYB7IERPNE9NX-CombGHHZ7",
                            "status" : true,
                            "combination" : [
                                {
                                    "attribute" : "tamaño",
                                    "value" : "S"
                                },
                                {
                                    "attribute" : "color",
                                    "value" : "azul"
                                }
                            ]
                        },
                        {
                            "UIN" : "PQ8GUYYB7IERPNE9NX-CombERW4S",
                            "status" : true,
                            "combination" : [
                                {
                                    "attribute" : "tamaño",
                                    "value" : "S"
                                },
                                {
                                    "attribute" : "color",
                                    "value" : "verde"
                                }
                            ]
                        }
                    ]
                },
                {
                    "language" : "fr",
                    "values" : [
                        {
                            "UIN" : "PQ8GUYYB7IERPNE9NX-CombVSOAJ",
                            "status" : true,
                            "combination" : [
                                {
                                    "attribute" : "taille",
                                    "value" : "XL"
                                },
                                {
                                    "attribute" : "couleur",
                                    "value" : "rouge"
                                }
                            ]
                        },
                        {
                            "UIN" : "PQ8GUYYB7IERPNE9NX-CombCMM7N",
                            "status" : true,
                            "combination" : [
                                {
                                    "attribute" : "taille",
                                    "value" : "XL"
                                },
                                {
                                    "attribute" : "couleur",
                                    "value" : "bleu"
                                }
                            ]
                        },
                        {
                            "UIN" : "PQ8GUYYB7IERPNE9NX-CombHSSOY",
                            "status" : true,
                            "combination" : [
                                {
                                    "attribute" : "taille",
                                    "value" : "XL"
                                },
                                {
                                    "attribute" : "couleur",
                                    "value" : "vert"
                                }
                            ]
                        },
                        {
                            "UIN" : "PQ8GUYYB7IERPNE9NX-CombA7MYA",
                            "status" : true,
                            "combination" : [
                                {
                                    "attribute" : "taille",
                                    "value" : "L"
                                },
                                {
                                    "attribute" : "couleur",
                                    "value" : "rouge"
                                }
                            ]
                        },
                        {
                            "UIN" : "PQ8GUYYB7IERPNE9NX-CombQQD7F",
                            "status" : true,
                            "combination" : [
                                {
                                    "attribute" : "taille",
                                    "value" : "L"
                                },
                                {
                                    "attribute" : "couleur",
                                    "value" : "bleu"
                                }
                            ]
                        },
                        {
                            "UIN" : "PQ8GUYYB7IERPNE9NX-CombSJ7G3",
                            "status" : true,
                            "combination" : [
                                {
                                    "attribute" : "taille",
                                    "value" : "L"
                                },
                                {
                                    "attribute" : "couleur",
                                    "value" : "vert"
                                }
                            ]
                        },
                        {
                            "UIN" : "PQ8GUYYB7IERPNE9NX-CombBZ5JJ",
                            "status" : true,
                            "combination" : [
                                {
                                    "attribute" : "taille",
                                    "value" : "S"
                                },
                                {
                                    "attribute" : "couleur",
                                    "value" : "rouge"
                                }
                            ]
                        },
                        {
                            "UIN" : "PQ8GUYYB7IERPNE9NX-CombGHHZ7",
                            "status" : true,
                            "combination" : [
                                {
                                    "attribute" : "taille",
                                    "value" : "S"
                                },
                                {
                                    "attribute" : "couleur",
                                    "value" : "bleu"
                                }
                            ]
                        },
                        {
                            "UIN" : "PQ8GUYYB7IERPNE9NX-CombERW4S",
                            "status" : true,
                            "combination" : [
                                {
                                    "attribute" : "taille",
                                    "value" : "S"
                                },
                                {
                                    "attribute" : "couleur",
                                    "value" : "vert"
                                }
                            ]
                        }
                    ]
                },
                {
                    "language" : "it",
                    "values" : [
                        {
                            "UIN" : "PQ8GUYYB7IERPNE9NX-CombVSOAJ",
                            "status" : true,
                            "combination" : [
                                {
                                    "attribute" : "dimensione",
                                    "value" : "XL"
                                },
                                {
                                    "attribute" : "colore",
                                    "value" : "rosso"
                                }
                            ]
                        },
                        {
                            "UIN" : "PQ8GUYYB7IERPNE9NX-CombCMM7N",
                            "status" : true,
                            "combination" : [
                                {
                                    "attribute" : "dimensione",
                                    "value" : "XL"
                                },
                                {
                                    "attribute" : "colore",
                                    "value" : "blu"
                                }
                            ]
                        },
                        {
                            "UIN" : "PQ8GUYYB7IERPNE9NX-CombHSSOY",
                            "status" : true,
                            "combination" : [
                                {
                                    "attribute" : "dimensione",
                                    "value" : "XL"
                                },
                                {
                                    "attribute" : "colore",
                                    "value" : "verde"
                                }
                            ]
                        },
                        {
                            "UIN" : "PQ8GUYYB7IERPNE9NX-CombA7MYA",
                            "status" : true,
                            "combination" : [
                                {
                                    "attribute" : "dimensione",
                                    "value" : "L"
                                },
                                {
                                    "attribute" : "colore",
                                    "value" : "rosso"
                                }
                            ]
                        },
                        {
                            "UIN" : "PQ8GUYYB7IERPNE9NX-CombQQD7F",
                            "status" : true,
                            "combination" : [
                                {
                                    "attribute" : "dimensione",
                                    "value" : "L"
                                },
                                {
                                    "attribute" : "colore",
                                    "value" : "blu"
                                }
                            ]
                        },
                        {
                            "UIN" : "PQ8GUYYB7IERPNE9NX-CombSJ7G3",
                            "status" : true,
                            "combination" : [
                                {
                                    "attribute" : "dimensione",
                                    "value" : "L"
                                },
                                {
                                    "attribute" : "colore",
                                    "value" : "verde"
                                }
                            ]
                        },
                        {
                            "UIN" : "PQ8GUYYB7IERPNE9NX-CombBZ5JJ",
                            "status" : true,
                            "combination" : [
                                {
                                    "attribute" : "dimensione",
                                    "value" : "S"
                                },
                                {
                                    "attribute" : "colore",
                                    "value" : "rosso"
                                }
                            ]
                        },
                        {
                            "UIN" : "PQ8GUYYB7IERPNE9NX-CombGHHZ7",
                            "status" : true,
                            "combination" : [
                                {
                                    "attribute" : "dimensione",
                                    "value" : "S"
                                },
                                {
                                    "attribute" : "colore",
                                    "value" : "blu"
                                }
                            ]
                        },
                        {
                            "UIN" : "PQ8GUYYB7IERPNE9NX-CombERW4S",
                            "status" : true,
                            "combination" : [
                                {
                                    "attribute" : "dimensione",
                                    "value" : "S"
                                },
                                {
                                    "attribute" : "colore",
                                    "value" : "verde"
                                }
                            ]
                        }
                    ]
                },
                {
                    "language" : "de",
                    "values" : [
                        {
                            "UIN" : "PQ8GUYYB7IERPNE9NX-CombVSOAJ",
                            "status" : true,
                            "combination" : [
                                {
                                    "attribute" : "Größe",
                                    "value" : "XL"
                                },
                                {
                                    "attribute" : "Farbe",
                                    "value" : "rot"
                                }
                            ]
                        },
                        {
                            "UIN" : "PQ8GUYYB7IERPNE9NX-CombCMM7N",
                            "status" : true,
                            "combination" : [
                                {
                                    "attribute" : "Größe",
                                    "value" : "XL"
                                },
                                {
                                    "attribute" : "Farbe",
                                    "value" : "blau"
                                }
                            ]
                        },
                        {
                            "UIN" : "PQ8GUYYB7IERPNE9NX-CombHSSOY",
                            "status" : true,
                            "combination" : [
                                {
                                    "attribute" : "Größe",
                                    "value" : "XL"
                                },
                                {
                                    "attribute" : "Farbe",
                                    "value" : "grün"
                                }
                            ]
                        },
                        {
                            "UIN" : "PQ8GUYYB7IERPNE9NX-CombA7MYA",
                            "status" : true,
                            "combination" : [
                                {
                                    "attribute" : "Größe",
                                    "value" : "L"
                                },
                                {
                                    "attribute" : "Farbe",
                                    "value" : "rot"
                                }
                            ]
                        },
                        {
                            "UIN" : "PQ8GUYYB7IERPNE9NX-CombQQD7F",
                            "status" : true,
                            "combination" : [
                                {
                                    "attribute" : "Größe",
                                    "value" : "L"
                                },
                                {
                                    "attribute" : "Farbe",
                                    "value" : "blau"
                                }
                            ]
                        },
                        {
                            "UIN" : "PQ8GUYYB7IERPNE9NX-CombSJ7G3",
                            "status" : true,
                            "combination" : [
                                {
                                    "attribute" : "Größe",
                                    "value" : "L"
                                },
                                {
                                    "attribute" : "Farbe",
                                    "value" : "grün"
                                }
                            ]
                        },
                        {
                            "UIN" : "PQ8GUYYB7IERPNE9NX-CombBZ5JJ",
                            "status" : true,
                            "combination" : [
                                {
                                    "attribute" : "Größe",
                                    "value" : "S"
                                },
                                {
                                    "attribute" : "Farbe",
                                    "value" : "rot"
                                }
                            ]
                        },
                        {
                            "UIN" : "PQ8GUYYB7IERPNE9NX-CombGHHZ7",
                            "status" : true,
                            "combination" : [
                                {
                                    "attribute" : "Größe",
                                    "value" : "S"
                                },
                                {
                                    "attribute" : "Farbe",
                                    "value" : "blau"
                                }
                            ]
                        },
                        {
                            "UIN" : "PQ8GUYYB7IERPNE9NX-CombERW4S",
                            "status" : true,
                            "combination" : [
                                {
                                    "attribute" : "Größe",
                                    "value" : "S"
                                },
                                {
                                    "attribute" : "Farbe",
                                    "value" : "grün"
                                }
                            ]
                        }
                    ]
                }
            ],
            translation: [
                {
                    language: 'en',
                    name: 'test 6',
                    reference: ['DDD'],
                    description: 'xyz'
                },
                {
                    language: 'fr',
                    name: 'test',
                    reference: ['test'],
                    description: 'Some intro here'
                }
            ],
            "attributes" : {
                "en" : [
                    [
                        {
                            "color" : "red"
                        },
                        {
                            "color" : "blue"
                        },
                        {
                            "color" : "green"
                        }
                    ],
                    [
                        {
                            "size" : "XL"
                        },
                        {
                            "size" : "L"
                        },
                        {
                            "size" : "S"
                        }
                    ]
                ],
                "fr" : [
                    [
                        {
                            "couleur" : "rouge"
                        },
                        {
                            "couleur" : "bleu"
                        },
                        {
                            "couleur" : "vert"
                        }
                    ],
                    [
                        {
                            "taille" : "XL"
                        },
                        {
                            "taille" : "L"
                        },
                        {
                            "taille" : "S"
                        }
                    ]
                ],
                "es" : [
                    [
                        {
                            "color" : "rojo"
                        },
                        {
                            "color" : "azul"
                        },
                        {
                            "color" : "verde"
                        }
                    ],
                    [
                        {
                            "tama�o" : "XL"
                        },
                        {
                            "tama�o" : "L"
                        },
                        {
                            "tama�o" : "S"
                        }
                    ]
                ],
                "it" : [
                    [
                        {
                            "colore" : "rosso"
                        },
                        {
                            "colore" : "blu"
                        },
                        {
                            "colore" : "verde"
                        }
                    ],
                    [
                        {
                            "dimensione" : "XL"
                        },
                        {
                            "dimensione" : "L"
                        },
                        {
                            "dimensione" : "S"
                        }
                    ]
                ],
                "de" : [
                    [
                        {
                            "Farbe" : "rot"
                        },
                        {
                            "Farbe" : "blau"
                        },
                        {
                            "Farbe" : "gr�n"
                        }
                    ],
                    [
                        {
                            "Gr��e" : "XL"
                        },
                        {
                            "Gr��e" : "L"
                        },
                        {
                            "Gr��e" : "S"
                        }
                    ]
                ]
            },
            source: 'en',
            offersCount: 100,
            type: 'Product',
            defaultCategory: defaultCategory,
            avgOffer: 130.0,
            bestOffer: 115.0,
            commission: '10',
            published: true,
            subscribers: [a._id],
            status: true,
            views: 2,
            user: vendor1._id,
            affiliate: {
                origin: 'customSite.com'
            },
            category: [defaultCategory],
            uin: 'P1234567',
            weight: 12,
            "images": [
                "https://marketplacedemomike.s3.eu-central-1.amazonaws.com/img/p/Y/L/P/j/g/8/w/7/t/K/6/D/d/Z/S/Q/H/YLPjg8w7tK6DdZSQH0.024920.jpg",
                "https://marketplacedemomike.s3.eu-central-1.amazonaws.com/img/p/Y/L/P/j/g/8/w/7/t/K/6/D/d/Z/S/Q/H/YLPjg8w7tK6DdZSQH0.024920.jpg"
            ],
            "skills": [
                {
                    language: 'en',
                    values: ["test 1"]
                },
                {
                    language: 'fr',
                    values: ["test 1"]
                }
            ],
            "features": [
                {
                    language: 'en',
                    values: [{
                        "name": "brand",
                        "values": [
                            "Apple",
                            "Sony"
                        ]
                    },
                        {
                            "name": "model",
                            "values": [
                                "Iphone",
                                "Nokia"
                            ]
                        }
                    ]
                },
                {
                    language: 'fr',
                    values: [{
                        "name": "marca",
                        "values": [
                            "Apple",
                            "Sony"
                        ]
                    },
                        {
                            "name": "modelo",
                            "values": [
                                "Iphone",
                                "Nokia"
                            ]
                        }
                    ]
                }
            ]
        });
        var Product7 = Products.insert({
            translation: [
                {
                    language: 'en',
                    name: 'motorola droid razr',
                    reference: ['DDD'],
                    description: 'motorola droid razr the next generation mobile'
                },
                {
                    language: 'fr',
                    name: 'motorola droid razr',
                    reference: ['test'],
                    description: 'motorola droid razr the next generation mobile'
                }
            ],
            source: 'en',
            offersCount: 100,
            type: 'Product',
            defaultCategory: defaultCategory,
            avgOffer: 130.0,
            bestOffer: 115.0,
            commission: '10',
            published: true,
            status: true,
            user: vendor1._id,
            affiliate: {
                origin: 'customSite.com'
            },
            category: [defaultCategory],
            uin: 'P1234567',
            weight: 8,
            "images": [
                "https://marketplacedemomike.s3.eu-central-1.amazonaws.com/img/p/Y/L/P/j/g/8/w/7/t/K/6/D/d/Z/S/Q/H/YLPjg8w7tK6DdZSQH0.024920.jpg",
                "https://marketplacedemomike.s3.eu-central-1.amazonaws.com/img/p/Y/L/P/j/g/8/w/7/t/K/6/D/d/Z/S/Q/H/YLPjg8w7tK6DdZSQH0.024920.jpg"
            ],
            "skills": [
                {
                    language: 'en',
                    values: ["test 1"]
                },
                {
                    language: 'fr',
                    values: ["test 1"]
                }
            ],
            "features": [
                {
                    language: 'en',
                    values: [{
                        "name": "feature 1",
                        "values": [
                            "test",
                            "best"
                        ]
                    },
                        {
                            "name": "feature2",
                            "values": [
                                "guest",
                                "nest"
                            ]
                        }
                    ]
                },
                {
                    language: 'fr',
                    values: [{
                        "name": "feature 1",
                        "values": [
                            "test",
                            "best"
                        ]
                    },
                        {
                            "name": "feature2",
                            "values": [
                                "guest",
                                "nest"
                            ]
                        }
                    ]
                }
            ]
        });
        var Product8 = Products.insert({
            translation: [
                {
                    language: 'en',
                    name: 'nokia lumia 1020',
                    reference: ['DDD'],
                    description: 'Nokia is now under Microsoft'
                },
                {
                    language: 'fr',
                    name: 'nokia lumia 1020',
                    reference: ['test'],
                    description: 'Nokia is now under Microsoft'
                }
            ],
            createAt: new Date(9/12/1970),
            source: 'en',
            offersCount: 100,
            type: 'Product',
            defaultCategory: defaultCategory,
            avgOffer: 130.0,
            bestOffer: 110.0,
            commission: '10',
            published: true,
            status: true,
            user: vendor1._id,
            affiliate: {
                origin: 'customSite.com'
            },
            category: [defaultCategory],
            uin: 'P1234567',
            weight: 15,
            "images": [
                "https://marketplacedemomike.s3.eu-central-1.amazonaws.com/img/p/Y/L/P/j/g/8/w/7/t/K/6/D/d/Z/S/Q/H/YLPjg8w7tK6DdZSQH0.024920.jpg",
                "https://marketplacedemomike.s3.eu-central-1.amazonaws.com/img/p/Y/L/P/j/g/8/w/7/t/K/6/D/d/Z/S/Q/H/YLPjg8w7tK6DdZSQH0.024920.jpg"
            ],
            "skills": [
                {
                    language: 'en',
                    values: ["test 1"]
                },
                {
                    language: 'fr',
                    values: ["test 1"]
                }
            ],
            "features": [
                {
                    language: 'en',
                    values: [{
                        "name": "feature 1",
                        "values": [
                            "test",
                            "best"
                        ]
                    },
                        {
                            "name": "feature2",
                            "values": [
                                "guest",
                                "nest"
                            ]
                        }
                    ]
                },
                {
                    language: 'fr',
                    values: [{
                        "name": "feature 1",
                        "values": [
                            "test",
                            "best"
                        ]
                    },
                        {
                            "name": "feature2",
                            "values": [
                                "guest",
                                "nest"
                            ]
                        }
                    ]
                }
            ]
        });
        var Product9 = Products.insert({
            translation: [
                {
                    language: 'en',
                    name: 'microsoft',
                    reference: ['DDD'],
                    description: 'microsoft is the oldest asset as of now'
                },
                {
                    language: 'fr',
                    name: 'microsoft',
                    reference: ['test'],
                    description: 'microsoft is the oldest asset as of now'
                }
            ],
            source: 'en',
            offersCount: 100,
            type: 'Product',
            defaultCategory: defaultCategory,
            avgOffer: 130.0,
            bestOffer: 120.0,
            commission: '10',
            published: true,
            status: true,
            user: vendor2._id,
            affiliate: {
                origin: 'customSite.com'
            },
            category: [defaultCategory],
            uin: 'P1234567',
            weight: 18,
            "images": [
                "https://marketplacedemomike.s3.eu-central-1.amazonaws.com/img/p/Y/L/P/j/g/8/w/7/t/K/6/D/d/Z/S/Q/H/YLPjg8w7tK6DdZSQH0.024920.jpg",
                "https://marketplacedemomike.s3.eu-central-1.amazonaws.com/img/p/Y/L/P/j/g/8/w/7/t/K/6/D/d/Z/S/Q/H/YLPjg8w7tK6DdZSQH0.024920.jpg"
            ],
            "skills": [
                {
                    language: 'en',
                    values: ["test 1"]
                },
                {
                    language: 'fr',
                    values: ["test 1"]
                }
            ],
            "features": [
                {
                    language: 'en',
                    values: [{
                        "name": "feature 1",
                        "values": [
                            "test",
                            "best"
                        ]
                    },
                        {
                            "name": "feature2",
                            "values": [
                                "guest",
                                "nest"
                            ]
                        }
                    ]
                },
                {
                    language: 'fr',
                    values: [{
                        "name": "feature 1",
                        "values": [
                            "test",
                            "best"
                        ]
                    },
                        {
                            "name": "feature2",
                            "values": [
                                "guest",
                                "nest"
                            ]
                        }
                    ]
                }
            ]
        });
        var Product10 = Products.insert({
            translation: [
                {
                    language: 'en',
                    name: 'sony xperia',
                    reference: ['DDD'],
                    description: 'sony xperia is made by sony'
                },
                {
                    language: 'fr',
                    name: 'sony xperia',
                    reference: ['test'],
                    description: 'sony xperia is made by sony'
                }
            ],
            source: 'en',
            offersCount: 100,
            type: 'Product',
            defaultCategory: defaultCategory,
            avgOffer: 130.0,
            bestOffer: 115.0,
            commission: '10',
            published: true,
            status: true,
            user: vendor2._id,
            affiliate: {
                origin: 'customSite.com'
            },
            category: [defaultCategory],
            uin: 'P1234567',
            weight: 24,
            "images": [
                "https://marketplacedemomike.s3.eu-central-1.amazonaws.com/img/p/Y/L/P/j/g/8/w/7/t/K/6/D/d/Z/S/Q/H/YLPjg8w7tK6DdZSQH0.024920.jpg",
                "https://marketplacedemomike.s3.eu-central-1.amazonaws.com/img/p/Y/L/P/j/g/8/w/7/t/K/6/D/d/Z/S/Q/H/YLPjg8w7tK6DdZSQH0.024920.jpg"
            ],
            "skills": [
                {
                    language: 'en',
                    values: ["test 1"]
                },
                {
                    language: 'fr',
                    values: ["test 1"]
                }
            ],
            "features": [
                {
                    language: 'en',
                    values: [{
                        "name": "feature 1",
                        "values": [
                            "test",
                            "best"
                        ]
                    },
                        {
                            "name": "feature2",
                            "values": [
                                "guest",
                                "nest"
                            ]
                        }
                    ]
                },
                {
                    language: 'fr',
                    values: [{
                        "name": "feature 1",
                        "values": [
                            "test",
                            "best"
                        ]
                    },
                        {
                            "name": "feature2",
                            "values": [
                                "guest",
                                "nest"
                            ]
                        }
                    ]
                }
            ]
        });
        var Product11 = Products.insert({
            translation: [
                {
                    language: 'en',
                    name: 'test 11',
                    reference: ['DDD'],
                    description: 'xyz'
                },
                {
                    "language": "de",
                    name: 'test 11 de',
                    reference: ['DDD'],
                    description: 'xyz de'
                },
                {
                    "language": "es",
                    name: 'test 11 es',
                    reference: ['DDD'],
                    description: 'xyz es'
                },
                {
                    "language": "fr",
                    name: 'test 11 fr',
                    reference: ['DDD'],
                    description: 'xyz fr'
                },
                {
                    "language": "it",
                    name: 'test 11 it',
                    reference: ['DDD'],
                    description: 'xyz it'
                }
            ],
            source: 'en',
            offersCount: 100,
            type: 'Product',
            defaultCategory: defaultCategory,
            avgOffer: 130.0,
            bestOffer: 100.0,
            commission: '10',
            published: true,
            status: true,
            user: vendor2._id,
            affiliate: {
                origin: 'customSite.com'
            },
            category: [defaultCategory],
            uin: 'P1234567',
            weight: 20,
            "images": [
                "https://marketplacedemomike.s3.eu-central-1.amazonaws.com/img/p/Y/L/P/j/g/8/w/7/t/K/6/D/d/Z/S/Q/H/YLPjg8w7tK6DdZSQH0.024920.jpg",
                "https://marketplacedemomike.s3.eu-central-1.amazonaws.com/img/p/Y/L/P/j/g/8/w/7/t/K/6/D/d/Z/S/Q/H/YLPjg8w7tK6DdZSQH0.024920.jpg"
            ],
            "skills": [
                {
                    language: 'en',
                    values: ["test 1"]
                },
                {
                    language: 'fr',
                    values: ["test 1"]
                }
            ],
            "features": [
                {
                    language: 'en',
                    values: [{
                        "name": "feature 1",
                        "values": [
                            "test",
                            "best"
                        ]
                    },
                        {
                            "name": "feature2",
                            "values": [
                                "guest",
                                "nest"
                            ]
                        }
                    ]
                },
                {
                    language: 'fr',
                    values: [{
                        "name": "feature 1",
                        "values": [
                            "test",
                            "best"
                        ]
                    },
                        {
                            "name": "feature2",
                            "values": [
                                "guest",
                                "nest"
                            ]
                        }
                    ]
                }
            ]
        });
        var Product12 = Products.insert({
            translation: [
                {
                    language: 'en',
                    name: 'test 12',
                    reference: ['DDD'],
                    description: 'xyz'
                },
                {
                    language: 'fr',
                    name: 'test',
                    reference: ['test'],
                    description: 'Some intro here'
                }
            ],
            source: 'en',
            offersCount: 100,
            type: 'Product',
            defaultCategory: defaultCategory,
            avgOffer: 130.0,
            bestOffer: 115.0,
            commission: '10',
            published: true,
            status: true,
            user: vendor3._id,
            affiliate: {
                origin: 'customSite.com'
            },
            category: [defaultCategory],
            uin: 'P1234567',
            weight: 23,
            "images": [
                "https://marketplacedemomike.s3.eu-central-1.amazonaws.com/img/p/Y/L/P/j/g/8/w/7/t/K/6/D/d/Z/S/Q/H/YLPjg8w7tK6DdZSQH0.024920.jpg",
                "https://marketplacedemomike.s3.eu-central-1.amazonaws.com/img/p/Y/L/P/j/g/8/w/7/t/K/6/D/d/Z/S/Q/H/YLPjg8w7tK6DdZSQH0.024920.jpg"
            ],
            "skills": [
                {
                    language: 'en',
                    values: ["test 1"]
                },
                {
                    language: 'fr',
                    values: ["test 1"]
                }
            ],
            "features": [
                {
                    language: 'en',
                    values: [{
                        "name": "feature 1",
                        "values": [
                            "test",
                            "best"
                        ]
                    },
                        {
                            "name": "feature2",
                            "values": [
                                "guest",
                                "nest"
                            ]
                        }
                    ]
                },
                {
                    language: 'fr',
                    values: [{
                        "name": "feature 1",
                        "values": [
                            "test",
                            "best"
                        ]
                    },
                        {
                            "name": "feature2",
                            "values": [
                                "guest",
                                "nest"
                            ]
                        }
                    ]
                }
            ]
        });
        var Product13 = Products.insert({
            translation: [
                {
                    language: 'en',
                    name: 'test 13',
                    reference: ['DDD'],
                    description: 'xyz'
                },
                {
                    language: 'fr',
                    name: 'test title',
                    reference: ['test'],
                    description: 'Some intro here'
                }
            ],
            source: 'en',
            createAt: new Date(9/12/1980),
            offersCount: 100,
            type: 'Product',
            defaultCategory: defaultCategory,
            avgOffer: 130.0,
            bestOffer: 115.0,
            commission: '10',
            published: true,
            status: true,
            user: vendor3._id,
            affiliate: {
                origin: 'customSite.com'
            },
            category: [defaultCategory],
            uin: 'P1234567',
            weight: 23,
            "images": [
                "https://marketplacedemomike.s3.eu-central-1.amazonaws.com/img/p/Y/L/P/j/g/8/w/7/t/K/6/D/d/Z/S/Q/H/YLPjg8w7tK6DdZSQH0.024920.jpg",
                "https://marketplacedemomike.s3.eu-central-1.amazonaws.com/img/p/Y/L/P/j/g/8/w/7/t/K/6/D/d/Z/S/Q/H/YLPjg8w7tK6DdZSQH0.024920.jpg"
            ],
            "skills": [
                {
                    language: 'en',
                    values: ["test 1"]
                },
                {
                    language: 'fr',
                    values: ["test 1"]
                }
            ],
            "features": [
                {
                    language: 'en',
                    values: [{
                        "name": "feature 1",
                        "values": [
                            "test",
                            "best"
                        ]
                    },
                        {
                            "name": "feature2",
                            "values": [
                                "guest",
                                "nest"
                            ]
                        }
                    ]
                },
                {
                    language: 'fr',
                    values: [{
                        "name": "feature 1",
                        "values": [
                            "test",
                            "best"
                        ]
                    },
                        {
                            "name": "feature2",
                            "values": [
                                "guest",
                                "nest"
                            ]
                        }
                    ]
                }
            ]
        });
        var Product14 = Products.insert({
            translation: [
                {
                    language: 'en',
                    name: 'test 14',
                    reference: ['DDD'],
                    description: 'xyz'
                },
                {
                    language: 'fr',
                    name: 'test',
                    reference: ['test'],
                    description: 'Some intro here'
                }
            ],
            source: 'en',
            offersCount: 100,
            type: 'Product',
            defaultCategory: defaultCategory,
            avgOffer: 130.0,
            bestOffer: 115.0,
            commission: '10',
            published: true,
            status: true,
            user: vendor3._id,
            affiliate: {
                origin: 'customSite.com'
            },
            category: [defaultCategory],
            uin: 'P1234567',
            weight: 23,
            "images": [
                "https://marketplacedemomike.s3.eu-central-1.amazonaws.com/img/p/Y/L/P/j/g/8/w/7/t/K/6/D/d/Z/S/Q/H/YLPjg8w7tK6DdZSQH0.024920.jpg",
                "https://marketplacedemomike.s3.eu-central-1.amazonaws.com/img/p/Y/L/P/j/g/8/w/7/t/K/6/D/d/Z/S/Q/H/YLPjg8w7tK6DdZSQH0.024920.jpg"
            ],
            "skills": [
                {
                    language: 'en',
                    values: ["test 1"]
                },
                {
                    language: 'fr',
                    values: ["test 1"]
                }
            ],
            "features": [
                {
                    language: 'en',
                    values: [{
                        "name": "feature 1",
                        "values": [
                            "test",
                            "best"
                        ]
                    },
                        {
                            "name": "feature2",
                            "values": [
                                "guest",
                                "nest"
                            ]
                        }
                    ]
                },
                {
                    language: 'fr',
                    values: [{
                        "name": "feature 1",
                        "values": [
                            "test",
                            "best"
                        ]
                    },
                        {
                            "name": "feature2",
                            "values": [
                                "guest",
                                "nest"
                            ]
                        }
                    ]
                }
            ]
        });
        var Product15 = Products.insert({
            translation: [
                {
                    language: 'en',
                    name: 'test 15',
                    reference: ['DDD'],
                    description: 'xyz'
                },
                {
                    language: 'fr',
                    name: 'test title',
                    reference: ['test'],
                    description: 'Some intro here'
                }
            ],
            source: 'en',
            offersCount: 100,
            type: 'Product',
            defaultCategory: defaultCategory,
            avgOffer: 130.0,
            bestOffer: 115.0,
            commission: '10',
            published: true,
            status: true,
            user: vendor4._id,
            affiliate: {
                origin: 'customSite.com'
            },
            category: [defaultCategory],
            uin: 'P1234567',
            weight: 24,
            "images": [
                "https://marketplacedemomike.s3.eu-central-1.amazonaws.com/img/p/Y/L/P/j/g/8/w/7/t/K/6/D/d/Z/S/Q/H/YLPjg8w7tK6DdZSQH0.024920.jpg",
                "https://marketplacedemomike.s3.eu-central-1.amazonaws.com/img/p/Y/L/P/j/g/8/w/7/t/K/6/D/d/Z/S/Q/H/YLPjg8w7tK6DdZSQH0.024920.jpg"
            ],
            "skills": [
                {
                    language: 'en',
                    values: ["test 1"]
                },
                {
                    language: 'fr',
                    values: ["test 1"]
                }
            ],
            "features": [
                {
                    language: 'en',
                    values: [{
                        "name": "feature 1",
                        "values": [
                            "test",
                            "best"
                        ]
                    },
                        {
                            "name": "feature2",
                            "values": [
                                "guest",
                                "nest"
                            ]
                        }
                    ]
                },
                {
                    language: 'fr',
                    values: [{
                        "name": "feature 1",
                        "values": [
                            "test",
                            "best"
                        ]
                    },
                        {
                            "name": "feature2",
                            "values": [
                                "guest",
                                "nest"
                            ]
                        }
                    ]
                }
            ]
        });
        var Product16 = Products.insert({
            translation: [
                {
                    language: 'en',
                    name: 'test 16',
                    reference: ['DDD'],
                    description: 'xyz'
                },
                {
                    language: 'fr',
                    name: 'test',
                    reference: ['test'],
                    description: 'Some intro here'
                }
            ],
            source: 'en',
            offersCount: 100,
            type: 'Product',
            defaultCategory: defaultCategory,
            avgOffer: 130.0,
            bestOffer: 115.0,
            commission: '10',
            published: true,
            status: true,
            user: vendor4._id,
            affiliate: {
                origin: 'customSite.com'
            },
            category: [defaultCategory],
            uin: 'P1234567',
            weight: 24,
            "images": [
                "https://marketplacedemomike.s3.eu-central-1.amazonaws.com/img/p/Y/L/P/j/g/8/w/7/t/K/6/D/d/Z/S/Q/H/YLPjg8w7tK6DdZSQH0.024920.jpg",
                "https://marketplacedemomike.s3.eu-central-1.amazonaws.com/img/p/Y/L/P/j/g/8/w/7/t/K/6/D/d/Z/S/Q/H/YLPjg8w7tK6DdZSQH0.024920.jpg"
            ],
            "skills": [
                {
                    language: 'en',
                    values: ["test 1"]
                },
                {
                    language: 'fr',
                    values: ["test 1"]
                }
            ],
            "features": [
                {
                    language: 'en',
                    values: [{
                        "name": "feature 1",
                        "values": [
                            "test",
                            "best"
                        ]
                    },
                        {
                            "name": "feature2",
                            "values": [
                                "guest",
                                "nest"
                            ]
                        }
                    ]
                },
                {
                    language: 'fr',
                    values: [{
                        "name": "feature 1",
                        "values": [
                            "test",
                            "best"
                        ]
                    },
                        {
                            "name": "feature2",
                            "values": [
                                "guest",
                                "nest"
                            ]
                        }
                    ]
                }
            ]
        });
        var Product17 = Products.insert({
            translation: [
                {
                    language: 'en',
                    name: 'fuzzy baby',
                    reference: ['DDD'],
                    description: 'xyz'
                },
                {
                    language: 'fr',
                    name: 'fuzzy baby',
                    reference: ['test'],
                    description: 'xyz'
                }
            ],
            source: 'en',
            offersCount: 100,
            type: 'Product',
            defaultCategory: defaultCategory,
            avgOffer: 130.0,
            bestOffer: 115.0,
            commission: '10',
            published: true,
            status: true,
            user: vendor4._id,
            affiliate: {
                origin: 'customSite.com'
            },
            category: [defaultCategory],
            uin: 'P1234567',
            weight: 24,
            "images": [
                "https://marketplacedemomike.s3.eu-central-1.amazonaws.com/img/p/Y/L/P/j/g/8/w/7/t/K/6/D/d/Z/S/Q/H/YLPjg8w7tK6DdZSQH0.024920.jpg",
                "https://marketplacedemomike.s3.eu-central-1.amazonaws.com/img/p/Y/L/P/j/g/8/w/7/t/K/6/D/d/Z/S/Q/H/YLPjg8w7tK6DdZSQH0.024920.jpg"
            ],
            "skills": [
                {
                    language: 'en',
                    values: ["test 1"]
                },
                {
                    language: 'fr',
                    values: ["test 1"]
                }
            ],
            "features": [
                {
                    language: 'en',
                    values: [{
                        "name": "feature 1",
                        "values": [
                            "test",
                            "best"
                        ]
                    },
                        {
                            "name": "feature2",
                            "values": [
                                "guest",
                                "nest"
                            ]
                        }
                    ]
                },
                {
                    language: 'fr',
                    values: [{
                        "name": "feature 1",
                        "values": [
                            "test",
                            "best"
                        ]
                    },
                        {
                            "name": "feature2",
                            "values": [
                                "guest",
                                "nest"
                            ]
                        }
                    ]
                }
            ]
        });
        var Product18 = Products.insert({
            translation: [
                {
                    language: 'en',
                    name: 'test 18',
                    reference: ['DDD'],
                    description: 'xyz'
                },
                {
                    language: 'fr',
                    name: 'test',
                    reference: ['test'],
                    description: 'Some intro here'
                }
            ],
            source: 'en',
            offersCount: 100,
            type: 'Product',
            defaultCategory: defaultCategory,
            avgOffer: 130.0,
            bestOffer: 115.0,
            commission: '10',
            published: true,
            status: true,
            user: vendor5._id,
            affiliate: {
                origin: 'customSite.com'
            },
            category: [defaultCategory],
            uin: 'P1234567',
            weight: 24,
            "images": [
                "https://marketplacedemomike.s3.eu-central-1.amazonaws.com/img/p/Y/L/P/j/g/8/w/7/t/K/6/D/d/Z/S/Q/H/YLPjg8w7tK6DdZSQH0.024920.jpg",
                "https://marketplacedemomike.s3.eu-central-1.amazonaws.com/img/p/Y/L/P/j/g/8/w/7/t/K/6/D/d/Z/S/Q/H/YLPjg8w7tK6DdZSQH0.024920.jpg"
            ],
            "skills": [
                {
                    language: 'en',
                    values: ["test 1"]
                },
                {
                    language: 'fr',
                    values: ["test 1"]
                }
            ],
            "features": [
                {
                    language: 'en',
                    values: [{
                        "name": "feature 1",
                        "values": [
                            "test",
                            "best"
                        ]
                    },
                        {
                            "name": "feature2",
                            "values": [
                                "guest",
                                "nest"
                            ]
                        }
                    ]
                },
                {
                    language: 'fr',
                    values: [{
                        "name": "feature 1",
                        "values": [
                            "test",
                            "best"
                        ]
                    },
                        {
                            "name": "feature2",
                            "values": [
                                "guest",
                                "nest"
                            ]
                        }
                    ]
                }
            ]
        });
        var Product19 = Products.insert({
            translation: [
                {
                    language: 'en',
                    name: 'test 19',
                    reference: ['DDD'],
                    description: 'xyz'
                },
                {
                    language: 'fr',
                    name: 'test title',
                    reference: ['test'],
                    description: 'Some intro here'
                }
            ],
            source: 'en',
            offersCount: 100,
            type: 'Product',
            defaultCategory: defaultCategory,
            avgOffer: 130.0,
            bestOffer: 115.0,
            commission: '10',
            published: true,
            status: true,
            user: vendor5._id,
            affiliate: {
                origin: 'customSite.com'
            },
            category: [defaultCategory],
            uin: 'P1234567',
            weight: 24,
            "images": [
                "https://marketplacedemomike.s3.eu-central-1.amazonaws.com/img/p/Y/L/P/j/g/8/w/7/t/K/6/D/d/Z/S/Q/H/YLPjg8w7tK6DdZSQH0.024920.jpg",
                "https://marketplacedemomike.s3.eu-central-1.amazonaws.com/img/p/Y/L/P/j/g/8/w/7/t/K/6/D/d/Z/S/Q/H/YLPjg8w7tK6DdZSQH0.024920.jpg"
            ],
            "skills": [
                {
                    language: 'en',
                    values: ["test 1"]
                },
                {
                    language: 'fr',
                    values: ["test 1"]
                }
            ],
            "features": [
                {
                    language: 'en',
                    values: [{
                        "name": "model",
                        "values": [
                            "Nokia",
                            "nest"
                        ]
                    },
                        {
                            "name": "feature2",
                            "values": [
                                "guest",
                                "nest"
                            ]
                        }
                    ]
                },
                {
                    language: 'fr',
                    values: [{
                        "name": "feature 1",
                        "values": [
                            "test",
                            "best"
                        ]
                    },
                        {
                            "name": "feature2",
                            "values": [
                                "guest",
                                "nest"
                            ]
                        }
                    ]
                }
            ]
        });
        var Product20 = Products.insert({
            translation: [
                {
                    language: 'en',
                    name: 'qmobile j5',
                    reference: ['DDD'],
                    description: 'qmobile the mix of old fashion with new technology'
                },
                {
                    language: 'fr',
                    name: 'qmobile j5',
                    reference: ['test'],
                    description: 'qmobile the mix of old fashion with new technology'
                }
            ],
            source: 'en',
            offersCount: 100,
            type: 'Product',
            defaultCategory: defaultCategory,
            avgOffer: 130.0,
            bestOffer: 115.0,
            commission: '10',
            published: true,
            status: true,
            user: vendor5._id,
            affiliate: {
                origin: 'customSite.com'
            },
            category: [defaultCategory],
            uin: 'P1234567',
            weight: 24,
            "images": [
                "https://marketplacedemomike.s3.eu-central-1.amazonaws.com/img/p/Y/L/P/j/g/8/w/7/t/K/6/D/d/Z/S/Q/H/YLPjg8w7tK6DdZSQH0.024920.jpg",
                "https://marketplacedemomike.s3.eu-central-1.amazonaws.com/img/p/Y/L/P/j/g/8/w/7/t/K/6/D/d/Z/S/Q/H/YLPjg8w7tK6DdZSQH0.024920.jpg"
            ],
            "skills": [
                {
                    language: 'en',
                    values: ["test 1"]
                },
                {
                    language: 'fr',
                    values: ["test 1"]
                }
            ],
            "features": [
                {
                    language: 'en',
                    values: [{
                        "name": "feature 1",
                        "values": [
                            "test",
                            "best"
                        ]
                    },
                        {
                            "name": "brand",
                            "values": [
                                "Apple",
                                "best"
                            ]
                        }
                    ]
                },
                {
                    language: 'fr',
                    values: [{
                        "name": "feature 1",
                        "values": [
                            "test",
                            "best"
                        ]
                    },
                        {
                            "name": "feature2",
                            "values": [
                                "guest",
                                "nest"
                            ]
                        }
                    ]
                }
            ]
        });
        var Product01 = Products.insert({
            translation: [
                {
                    language: 'en',
                    name: 'fuzzy baby',
                    reference: ['DDD'],
                    description: 'xyz'
                },
                {
                    language: 'fr',
                    name: 'fuzzy baby',
                    reference: ['test'],
                    description: 'xyz'
                }
            ],
            source: 'en',
            offersCount: 100,
            type: 'Product',
            defaultCategory: parent1,
            avgOffer: 130.0,
            bestOffer: 115.0,
            commission: '10',
            published: true,
            status: true,
            user: testVendor._id,
            affiliate: {
                origin: 'customSite.com'
            },
            category: [parent1],
            uin: 'P1234567',
            weight: 24,
            "images": [
                "https://marketplacedemomike.s3.eu-central-1.amazonaws.com/img/p/Y/L/P/j/g/8/w/7/t/K/6/D/d/Z/S/Q/H/YLPjg8w7tK6DdZSQH0.024920.jpg",
                "https://marketplacedemomike.s3.eu-central-1.amazonaws.com/img/p/Y/L/P/j/g/8/w/7/t/K/6/D/d/Z/S/Q/H/YLPjg8w7tK6DdZSQH0.024920.jpg"
            ],
            "skills": [
                {
                    language: 'en',
                    values: ["test 1"]
                },
                {
                    language: 'fr',
                    values: ["test 1"]
                }
            ],
            "features": [
                {
                    language: 'en',
                    values: [{
                        "name": "feature 1",
                        "values": [
                            "test",
                            "best"
                        ]
                    },
                        {
                            "name": "feature2",
                            "values": [
                                "guest",
                                "nest"
                            ]
                        }
                    ]
                },
                {
                    language: 'fr',
                    values: [{
                        "name": "feature 1",
                        "values": [
                            "test",
                            "best"
                        ]
                    },
                        {
                            "name": "feature2",
                            "values": [
                                "guest",
                                "nest"
                            ]
                        }
                    ]
                }
            ]
        });
        var Product02 = Products.insert({
            translation: [
                {
                    language: 'en',
                    name: 'test 2',
                    reference: ['DDD'],
                    description: 'xyz'
                },
                {
                    language: 'fr',
                    name: 'test',
                    reference: ['test'],
                    description: 'Some intro here'
                }
            ],
            source: 'en',
            offersCount: 100,
            type: 'Product',
            defaultCategory: parent1,
            avgOffer: 130.0,
            bestOffer: 115.0,
            commission: '10',
            published: true,
            subscribers: [a._id],
            status: true,
            user: testVendor._id,
            affiliate: {
                origin: 'customSite.com'
            },
            "attributes" : {
                "en" : [
                    [
                        {
                            "color" : "yellow"
                        },
                        {
                            "color" : "blue"
                        }
                    ],
                    [
                        {
                            "size" : "L"
                        },
                        {
                            "size" : "XS"
                        }
                    ]
                ]
            },
            category: [parent1],
            uin: 'P1234567',
            weight: 24,
            "images": [
                "https://marketplacedemomike.s3.eu-central-1.amazonaws.com/img/p/Y/L/P/j/g/8/w/7/t/K/6/D/d/Z/S/Q/H/YLPjg8w7tK6DdZSQH0.024920.jpg",
                "https://marketplacedemomike.s3.eu-central-1.amazonaws.com/img/p/Y/L/P/j/g/8/w/7/t/K/6/D/d/Z/S/Q/H/YLPjg8w7tK6DdZSQH0.024920.jpg"
            ],
            "skills": [
                {
                    language: 'en',
                    values: ["test 1"]
                },
                {
                    language: 'fr',
                    values: ["test 1"]
                }
            ],
            "features": [
                {
                    language: 'en',
                    values: [{
                        "name": "feature 1",
                        "values": [
                            "test",
                            "best"
                        ]
                    },
                        {
                            "name": "feature2",
                            "values": [
                                "guest",
                                "nest"
                            ]
                        }
                    ]
                },
                {
                    language: 'fr',
                    values: [{
                        "name": "feature 1",
                        "values": [
                            "test",
                            "best"
                        ]
                    },
                        {
                            "name": "feature2",
                            "values": [
                                "guest",
                                "nest"
                            ]
                        }
                    ]
                }
            ]
        });
        var Product03 = Products.insert({
            translation: [
                {
                    language: 'en',
                    name: 'test 3',
                    reference: ['DDD'],
                    description: 'xyz'
                },
                {
                    language: 'fr',
                    name: 'test title',
                    reference: ['test'],
                    description: 'Some intro here'
                }
            ],
            source: 'en',
            offersCount: 100,
            type: 'Product',
            defaultCategory: parent1,
            avgOffer: 130.0,
            bestOffer: 115.0,
            commission: '10',
            published: true,
            subscribers: [a._id],
            status: true,
            user: testVendor._id,
            affiliate: {
                origin: 'customSite.com'
            },
            category: [parent1],
            uin: 'P1234567',
            weight: 24,
            views: 1,
            "images": [
                "https://marketplacedemomike.s3.eu-central-1.amazonaws.com/img/p/Y/L/P/j/g/8/w/7/t/K/6/D/d/Z/S/Q/H/YLPjg8w7tK6DdZSQH0.024920.jpg",
                "https://marketplacedemomike.s3.eu-central-1.amazonaws.com/img/p/Y/L/P/j/g/8/w/7/t/K/6/D/d/Z/S/Q/H/YLPjg8w7tK6DdZSQH0.024920.jpg"
            ],
            "skills": [
                {
                    language: 'en',
                    values: ["test 1"]
                },
                {
                    language: 'fr',
                    values: ["test 1"]
                }
            ],
            "features": [
                {
                    language: 'en',
                    values: [{
                        "name": "feature 1",
                        "values": [
                            "test",
                            "best"
                        ]
                    },
                        {
                            "name": "feature2",
                            "values": [
                                "guest",
                                "nest"
                            ]
                        }
                    ]
                },
                {
                    language: 'fr',
                    values: [{
                        "name": "feature 1",
                        "values": [
                            "test",
                            "best"
                        ]
                    },
                        {
                            "name": "feature2",
                            "values": [
                                "guest",
                                "nest"
                            ]
                        }
                    ]
                }
            ]
        });
        var Product001 = Products.insert({
            translation: [
                {
                    language: 'en',
                    name: 'fuzzy baby',
                    reference: ['DDD'],
                    description: 'xyz'
                },
                {
                    language: 'fr',
                    name: 'fuzzy baby',
                    reference: ['test'],
                    description: 'xyz'
                }
            ],
            source: 'en',
            offersCount: 100,
            type: 'Product',
            defaultCategory: subChild2,
            avgOffer: 130.0,
            bestOffer: 115.0,
            commission: '10',
            published: true,
            status: true,
            user: vendor._id,
            affiliate: {
                origin: 'customSite.com'
            },
            category: [subChild2],
            uin: 'P1234567',
            weight: 24,
            "images": [
                "https://marketplacedemomike.s3.eu-central-1.amazonaws.com/img/p/Y/L/P/j/g/8/w/7/t/K/6/D/d/Z/S/Q/H/YLPjg8w7tK6DdZSQH0.024920.jpg",
                "https://marketplacedemomike.s3.eu-central-1.amazonaws.com/img/p/Y/L/P/j/g/8/w/7/t/K/6/D/d/Z/S/Q/H/YLPjg8w7tK6DdZSQH0.024920.jpg"
            ],
            "skills": [
                {
                    language: 'en',
                    values: ["test 1"]
                },
                {
                    language: 'fr',
                    values: ["test 1"]
                }
            ],
            "features": [
                {
                    language: 'en',
                    values: [{
                        "name": "feature 1",
                        "values": [
                            "test",
                            "best"
                        ]
                    },
                        {
                            "name": "feature2",
                            "values": [
                                "guest",
                                "nest"
                            ]
                        }
                    ]
                },
                {
                    language: 'fr',
                    values: [{
                        "name": "feature 1",
                        "values": [
                            "test",
                            "best"
                        ]
                    },
                        {
                            "name": "feature2",
                            "values": [
                                "guest",
                                "nest"
                            ]
                        }
                    ]
                }
            ]
        });
        var Product002 = Products.insert({
            translation: [
                {
                    language: 'en',
                    name: 'test 2',
                    reference: ['DDD'],
                    description: 'xyz'
                },
                {
                    language: 'fr',
                    name: 'test',
                    reference: ['test'],
                    description: 'Some intro here'
                }
            ],
            source: 'en',
            offersCount: 100,
            type: 'Product',
            defaultCategory: subChild2,
            avgOffer: 130.0,
            bestOffer: 115.0,
            commission: '10',
            published: true,
            subscribers: [a._id],
            status: true,
            user: vendor1._id,
            affiliate: {
                origin: 'customSite.com'
            },
            "attributes" : {
                "en" : [
                    [
                        {
                            "color" : "yellow"
                        },
                        {
                            "color" : "blue"
                        }
                    ],
                    [
                        {
                            "size" : "L"
                        },
                        {
                            "size" : "XS"
                        }
                    ]
                ]
            },
            category: [subChild2],
            uin: 'P1234567',
            weight: 24,
            "images": [
                "https://marketplacedemomike.s3.eu-central-1.amazonaws.com/img/p/Y/L/P/j/g/8/w/7/t/K/6/D/d/Z/S/Q/H/YLPjg8w7tK6DdZSQH0.024920.jpg",
                "https://marketplacedemomike.s3.eu-central-1.amazonaws.com/img/p/Y/L/P/j/g/8/w/7/t/K/6/D/d/Z/S/Q/H/YLPjg8w7tK6DdZSQH0.024920.jpg"
            ],
            "skills": [
                {
                    language: 'en',
                    values: ["test 1"]
                },
                {
                    language: 'fr',
                    values: ["test 1"]
                }
            ],
            "features": [
                {
                    language: 'en',
                    values: [{
                        "name": "feature 1",
                        "values": [
                            "test",
                            "best"
                        ]
                    },
                        {
                            "name": "feature2",
                            "values": [
                                "guest",
                                "nest"
                            ]
                        }
                    ]
                },
                {
                    language: 'fr',
                    values: [{
                        "name": "feature 1",
                        "values": [
                            "test",
                            "best"
                        ]
                    },
                        {
                            "name": "feature2",
                            "values": [
                                "guest",
                                "nest"
                            ]
                        }
                    ]
                }
            ]
        });
        var Product003 = Products.insert({
            translation: [
                {
                    language: 'en',
                    name: 'test 3',
                    reference: ['DDD'],
                    description: 'xyz'
                },
                {
                    language: 'fr',
                    name: 'test title',
                    reference: ['test'],
                    description: 'Some intro here'
                }
            ],
            source: 'en',
            offersCount: 100,
            type: 'Product',
            defaultCategory: subChild2,
            avgOffer: 130.0,
            bestOffer: 115.0,
            commission: '10',
            published: true,
            subscribers: [a._id],
            status: true,
            user: vendor2._id,
            affiliate: {
                origin: 'customSite.com'
            },
            category: [subChild2],
            uin: 'P1234567',
            weight: 24,
            views: 1,
            "images": [
                "https://marketplacedemomike.s3.eu-central-1.amazonaws.com/img/p/Y/L/P/j/g/8/w/7/t/K/6/D/d/Z/S/Q/H/YLPjg8w7tK6DdZSQH0.024920.jpg",
                "https://marketplacedemomike.s3.eu-central-1.amazonaws.com/img/p/Y/L/P/j/g/8/w/7/t/K/6/D/d/Z/S/Q/H/YLPjg8w7tK6DdZSQH0.024920.jpg"
            ],
            "skills": [
                {
                    language: 'en',
                    values: ["test 1"]
                },
                {
                    language: 'fr',
                    values: ["test 1"]
                }
            ],
            "features": [
                {
                    language: 'en',
                    values: [{
                        "name": "feature 1",
                        "values": [
                            "test",
                            "best"
                        ]
                    },
                        {
                            "name": "feature2",
                            "values": [
                                "guest",
                                "nest"
                            ]
                        }
                    ]
                },
                {
                    language: 'fr',
                    values: [{
                        "name": "feature 1",
                        "values": [
                            "test",
                            "best"
                        ]
                    },
                        {
                            "name": "feature2",
                            "values": [
                                "guest",
                                "nest"
                            ]
                        }
                    ]
                }
            ]
        });
    }

    if ( ! SuggestedProducts.find().fetch().length ){
        SuggestedProducts.remove({});
        var Product4 = SuggestedProducts.insert({
            translation: [
                {
                    language: 'en',
                    name: 'samsung Galaxy Note Edge',
                    reference: ['DDD'],
                    description: 'Some text here'
                },
                {
                    language: 'fr',
                    name: 'test title',
                    reference: ['test'],
                    description: 'Some intro here'
                }
            ],
            source: 'en',
            offersCount: 100,
            type: 'Product',
            defaultCategory: defaultCategory,
            avgOffer: 130.0,
            bestOffer: 115.0,
            commission: '10',
            published: false,
            status: 'pending',
            user: a._id,
            affiliate: {
                origin: 'customSite.com'
            },
            category: [defaultCategory],
            uin: 'P1234567',
            weight: 24,
            "images": [
                "https://marketplacedemomike.s3.eu-central-1.amazonaws.com/img/p/Y/L/P/j/g/8/w/7/t/K/6/D/d/Z/S/Q/H/YLPjg8w7tK6DdZSQH0.024920.jpg",
                "https://marketplacedemomike.s3.eu-central-1.amazonaws.com/img/p/Y/L/P/j/g/8/w/7/t/K/6/D/d/Z/S/Q/H/YLPjg8w7tK6DdZSQH0.024920.jpg"
            ],
            "skills": [
                {
                    language: 'en',
                    values: ["test 1"]
                },
                {
                    language: 'fr',
                    values: ["test 1"]
                }
            ],
            "features": [
                {
                    language: 'en',
                    values: [{
                        "name": "feature 1",
                        "values": [
                            "test",
                            "best"
                        ]
                    },
                        {
                            "name": "feature2",
                            "values": [
                                "guest",
                                "nest"
                            ]
                        }
                    ]
                },
                {
                    language: 'fr',
                    values: [{
                        "name": "feature 1",
                        "values": [
                            "test",
                            "best"
                        ]
                    },
                        {
                            "name": "feature2",
                            "values": [
                                "guest",
                                "nest"
                            ]
                        }
                    ]
                }
            ]
        });
    }

    if ( ! Features.find().fetch().length ){
        Features.remove({});
        Features.insert({
            'translation': {
                "en": [
                    {
                        "name": "brand",
                        "values": [
                            "Apple",
                            "Sony"
                        ],
                        translatable: true,
                        defaultInAll: false,
                        defaultIn: []
                    },
                    {
                        "name": "model",
                        "values": [
                            "Iphone",
                            "Nokia"
                        ],
                        translatable: false,
                        defaultInAll: false,
                        defaultIn: []
                    }
                ],
                "es": [
                    {
                        "name": "marca",
                        "values": [
                            "Apple",
                            "Sony"
                        ],
                        translatable: true,
                        defaultInAll: false,
                        defaultIn: []
                    },
                    {
                        "name": "modelo",
                        "values": [
                            "Iphone",
                            "Nokia"
                        ],
                        translatable: false,
                        defaultInAll: false,
                        defaultIn: []
                    }
                ],
                "it": [
                    {
                        "name": "brand",
                        "values": [
                            "Apple",
                            "Sony"
                        ],
                        translatable: true,
                        defaultInAll: false,
                        defaultIn: []
                    },
                    {
                        "name": "modello",
                        "values": [
                            "Iphone",
                            "Nokia"
                        ],
                        translatable: false,
                        defaultInAll: false,
                        defaultIn: []
                    }
                ],
                "de": [
                    {
                        "name": "Marke",
                        "values": [
                            "Apple",
                            "Sony"
                        ],
                        translatable: true,
                        defaultInAll: false,
                        defaultIn: []
                    },
                    {
                        "name": "Modell",
                        "values": [
                            "Iphone",
                            "Nokia"
                        ],
                        translatable: false,
                        defaultInAll: false,
                        defaultIn: []
                    }
                ],
                "fr": [
                    {
                        "name": "de la marque",
                        "values": [
                            "Apple",
                            "Sony"
                        ],
                        translatable: true,
                        defaultInAll: false,
                        defaultIn: []
                    },
                    {
                        "name": "module",
                        "values": [
                            "Iphone",
                            "Nokia"
                        ],
                        translatable: false,
                        defaultInAll: false,
                        defaultIn: []
                    }
                ]
            }
        });
    }

    if ( ! Skills.find().fetch().length ){
        Skills.insert({
            "translation": {
                "en": [
                    "skill 1"
                ],
                "es": [
                    "habilidad 1"
                ],
                "it": [
                    "capacity 1"
                ],
                "de": [
                    "skill 1"
                ],
                "fr": [
                    "competence 1"
                ]
            }
        });
    }

    if ( ! Tickets.find().fetch().length ){
        Tickets.remove({});
        var Ticket1 = Tickets.insert({
            employee: admin._id,
            user: a._id,
            sector: 'Customer',
            language: 'French',
            status: 'open'
        });
        var Ticket2 = Tickets.insert({
            employee: admin._id,
            user: a._id,
            sector: 'Vendor',
            language: 'English',
            status: 'pending'
        });
        var Ticket3 = Tickets.insert({
            employee: admin._id,
            user: a._id,
            sector: 'Vendor',
            language: 'English',
            status: 'closed'
        });
    }

    if ( ! Messages.find().fetch().length ){
        Messages.remove({});
        Messages.insert({
            receiver: admin._id,
            sender: a._id,
            content: 'Hello help needed',
            ticket: Ticket1
        });
        Messages.insert({
            receiver: a._id,
            sender: admin._id,
            content: 'Hello How can I help You',
            ticket: Ticket1
        });
        Messages.insert({
            receiver: admin._id,
            sender: a._id,
            content: 'I applied as vendor but still status is pending',
            ticket: Ticket1
        });
        Messages.insert({
            receiver: a._id,
            sender: admin._id,
            content: 'Wait a minute, i will check your request',
            ticket: Ticket1
        });
        Messages.insert({
            receiver: a._id,
            sender: admin._id,
            content: 'yes, we have overwhelming response, thousands of requests including your\'s',
            ticket: Ticket1
        });
        Messages.insert({
            receiver: admin._id,
            sender: a._id,
            content: 'so should I submit another ticket?',
            ticket: Ticket1
        });
        Messages.insert({
            receiver: a._id,
            sender: admin._id,
            content: 'No you request in last process, you will get confirmation within 3 days',
            ticket: Ticket1
        });
        Messages.insert({
            receiver: admin._id,
            sender: a._id,
            content: 'Thank You!',
            ticket: Ticket1
        });
        Messages.insert({
            receiver: a._id,
            sender: admin._id,
            content: 'You are always welcome!',
            ticket: Ticket1
        });
    }

    if ( ! Languages.find().fetch().length ){
        Languages.remove({});
        Languages.insert({
            name: 'French',
            flag: 'France',
            isoCode: 'fr',
            languageCode: 'fr-fr',
            dateFormat: 'DD/MM/YYYY',
            status: true,
            direction: false
        });
        Languages.insert({
            name: 'English',
            flag: 'United-States',
            isoCode: 'en',
            languageCode: 'en-US',
            dateFormat: 'DD/MM/YYYY',
            status: true,
            direction: false
        });
        Languages.insert({
            name: 'Spanish',
            flag: 'Spain',
            isoCode: 'es',
            languageCode: 'es',
            dateFormat: 'DD/MM/YYYY',
            status: true,
            direction: false
        });
        Languages.insert({
            name: 'Italian',
            flag: 'Italy',
            isoCode: 'it',
            languageCode: 'it',
            dateFormat: 'DD/MM/YYYY',
            status: true,
            direction: false
        });
        Languages.insert({
            name: 'German',
            flag: 'Germany',
            isoCode: 'de',
            languageCode: 'de',
            dateFormat: 'DD/MM/YYYY',
            status: true,
            direction: false
        });
    }

    if ( ! Countries.find().fetch().length ){
        Countries.remove({});
        var country1 = Countries.insert({
            name: 'France',
            isoCode: 'FR',
            prefix: '+33',
            area: 'Europe',
            currency: '',
            flag : 'France',
            status: true
        });

        var country2 = Countries.insert({
            name: 'United States',
            isoCode: 'US',
            prefix: '+1',
            area: 'America',
            currency: '',
            flag : 'United-States',
            status: true
        });

        var country3= Countries.insert({
            name: 'Pakistan',
            isoCode: 'PK',
            prefix: '+92',
            area: 'Asia',
            currency: '',
            flag : 'Pakistan',
            status: true
        });
    }

    if ( ! Carrier.find().fetch().length ){
        //Carriers Insert
        Carrier.remove({});
        var carrier1 = Carrier.insert({
            ranges : [
                {
                    min : 1,
                    allowedCountry : [
                        {
                            price : 12,
                            allowed : true
                        },
                        {
                            countryId : country1,
                            price : 12,
                            allowed : true
                        },
                        {
                            countryId : country2,
                            price : 12,
                            allowed : true
                        },
                        {
                            countryId : country3,
                            price : 12,
                            allowed : true
                        }
                    ],
                    max : 20
                },
                {
                    min : 21,
                    allowedCountry : [
                        {
                            price : 24,
                            allowed : true
                        },
                        {
                            countryId : country1,
                            price : 24,
                            allowed : true
                        },
                        {
                            countryId : country2,
                            price : 24,
                            allowed : true
                        },
                        {
                            countryId : country3,
                            price : 24,
                            allowed : true
                        }
                    ],
                    max : 50
                },
                {
                    min : 51,
                    allowedCountry : [
                        {
                            price : 100,
                            "allowed" : true
                        },
                        {
                            countryId : country1,
                            price : 100,
                            allowed : true
                        },
                        {
                            countryId : country2,
                            price : 100,
                            allowed : true
                        },
                        {
                            countryId : country3,
                            price : 100,
                            allowed : true
                        }
                    ],
                    max : 1000
                }
            ],
            freeShipping : true,
            packageWidth : 1000,
            packageHeight : 1000,
            packageDepth : 1000,
            packageWeight : 1000,
            position : 1,

            name: 'Uber',
            time: 5,
            images: [
                'https://s3.eu-central-1.amazonaws.com/marketplacedemomike/cup.jpg'
            ],
            status: true,
            isAllMarked: true,
            vendorId: vendor._id
        });
        var carrier2 = Carrier.insert({
            ranges : [
                {
                    min : 1,
                    allowedCountry : [
                        {
                            price : 12,
                            allowed : true
                        },
                        {
                            countryId : country1,
                            price : 12,
                            allowed : true
                        },
                        {
                            countryId : country2,
                            price : 12,
                            allowed : true
                        },
                        {
                            countryId : country3,
                            price : 12,
                            allowed : true
                        }
                    ],
                    max : 20
                },
                {
                    min : 21,
                    allowedCountry : [
                        {
                            price : 24,
                            allowed : true
                        },
                        {
                            countryId : country1,
                            price : 24,
                            allowed : true
                        },
                        {
                            countryId : country2,
                            price : 24,
                            allowed : true
                        },
                        {
                            countryId : country3,
                            price : 24,
                            allowed : true
                        }
                    ],
                    max : 50
                },
                {
                    min : 51,
                    allowedCountry : [
                        {
                            price : 100,
                            "allowed" : true
                        },
                        {
                            countryId : country1,
                            price : 100,
                            allowed : true
                        },
                        {
                            countryId : country2,
                            price : 100,
                            allowed : true
                        },
                        {
                            countryId : country3,
                            price : 100,
                            allowed : true
                        }
                    ],
                    max : 1000
                }
            ],
            freeShipping : true,
            packageWidth : 1000,
            packageHeight : 1000,
            packageDepth : 1000,
            packageWeight : 1000,
            position : 1,

            name: 'Uber',
            time: 5,
            images: [
                'https://s3.eu-central-1.amazonaws.com/marketplacedemomike/cup.jpg'
            ],
            status: true,
            isAllMarked: true,
            vendorId: vendor1._id
        });
        var carrier3 = Carrier.insert({
            ranges : [
                {
                    min : 1,
                    allowedCountry : [
                        {
                            price : 12,
                            allowed : true
                        },
                        {
                            countryId : country1,
                            price : 12,
                            allowed : true
                        },
                        {
                            countryId : country2,
                            price : 12,
                            allowed : true
                        },
                        {
                            countryId : country3,
                            price : 12,
                            allowed : true
                        }
                    ],
                    max : 20
                },
                {
                    min : 21,
                    allowedCountry : [
                        {
                            price : 24,
                            allowed : true
                        },
                        {
                            countryId : country1,
                            price : 24,
                            allowed : true
                        },
                        {
                            countryId : country2,
                            price : 24,
                            allowed : true
                        },
                        {
                            countryId : country3,
                            price : 24,
                            allowed : true
                        }
                    ],
                    max : 50
                },
                {
                    min : 51,
                    allowedCountry : [
                        {
                            price : 100,
                            "allowed" : true
                        },
                        {
                            countryId : country1,
                            price : 100,
                            allowed : true
                        },
                        {
                            countryId : country2,
                            price : 100,
                            allowed : true
                        },
                        {
                            countryId : country3,
                            price : 100,
                            allowed : true
                        }
                    ],
                    max : 1000
                }
            ],
            freeShipping : true,
            packageWidth : 1000,
            packageHeight : 1000,
            packageDepth : 1000,
            packageWeight : 1000,
            position : 1,

            name: 'Uber',
            time: 5,
            images: [
                'https://s3.eu-central-1.amazonaws.com/marketplacedemomike/cup.jpg'
            ],
            status: true,
            isAllMarked: true,
            vendorId: vendor2._id
        });
        var carrier4 = Carrier.insert({
            ranges : [
                {
                    min : 1,
                    allowedCountry : [
                        {
                            price : 12,
                            allowed : true
                        },
                        {
                            countryId : country1,
                            price : 12,
                            allowed : true
                        },
                        {
                            countryId : country2,
                            price : 12,
                            allowed : true
                        },
                        {
                            countryId : country3,
                            price : 12,
                            allowed : true
                        }
                    ],
                    max : 20
                },
                {
                    min : 21,
                    allowedCountry : [
                        {
                            price : 24,
                            allowed : true
                        },
                        {
                            countryId : country1,
                            price : 24,
                            allowed : true
                        },
                        {
                            countryId : country2,
                            price : 24,
                            allowed : true
                        },
                        {
                            countryId : country3,
                            price : 24,
                            allowed : true
                        }
                    ],
                    max : 50
                },
                {
                    min : 51,
                    allowedCountry : [
                        {
                            price : 100,
                            "allowed" : true
                        },
                        {
                            countryId : country1,
                            price : 100,
                            allowed : true
                        },
                        {
                            countryId : country2,
                            price : 100,
                            allowed : true
                        },
                        {
                            countryId : country3,
                            price : 100,
                            allowed : true
                        }
                    ],
                    max : 1000
                }
            ],
            freeShipping : true,
            packageWidth : 1000,
            packageHeight : 1000,
            packageDepth : 1000,
            packageWeight : 1000,
            position : 1,

            name: 'Uber',
            time: 5,
            images: [
                'https://s3.eu-central-1.amazonaws.com/marketplacedemomike/cup.jpg'
            ],
            status: true,
            isAllMarked: true,
            vendorId: vendor3._id
        });
        var carrier5 = Carrier.insert({
            ranges : [
                {
                    min : 1,
                    allowedCountry : [
                        {
                            price : 12,
                            allowed : true
                        },
                        {
                            countryId : country1,
                            price : 12,
                            allowed : true
                        },
                        {
                            countryId : country2,
                            price : 12,
                            allowed : true
                        },
                        {
                            countryId : country3,
                            price : 12,
                            allowed : true
                        }
                    ],
                    max : 20
                },
                {
                    min : 21,
                    allowedCountry : [
                        {
                            price : 24,
                            allowed : true
                        },
                        {
                            countryId : country1,
                            price : 24,
                            allowed : true
                        },
                        {
                            countryId : country2,
                            price : 24,
                            allowed : true
                        },
                        {
                            countryId : country3,
                            price : 24,
                            allowed : true
                        }
                    ],
                    max : 50
                },
                {
                    min : 51,
                    allowedCountry : [
                        {
                            price : 100,
                            "allowed" : true
                        },
                        {
                            countryId : country1,
                            price : 100,
                            allowed : true
                        },
                        {
                            countryId : country2,
                            price : 100,
                            allowed : true
                        },
                        {
                            countryId : country3,
                            price : 100,
                            allowed : true
                        }
                    ],
                    max : 1000
                }
            ],
            freeShipping : true,
            packageWidth : 1000,
            packageHeight : 1000,
            packageDepth : 1000,
            packageWeight : 1000,
            position : 1,

            name: 'Uber',
            time: 5,
            images: [
                'https://s3.eu-central-1.amazonaws.com/marketplacedemomike/cup.jpg'
            ],
            status: true,
            isAllMarked: true,
            vendorId: vendor4._id
        });
        var carrier6 = Carrier.insert({
            ranges : [
                {
                    min : 1,
                    allowedCountry : [
                        {
                            price : 12,
                            allowed : true
                        },
                        {
                            countryId : country1,
                            price : 12,
                            allowed : true
                        },
                        {
                            countryId : country2,
                            price : 12,
                            allowed : true
                        },
                        {
                            countryId : country3,
                            price : 12,
                            allowed : true
                        }
                    ],
                    max : 20
                },
                {
                    min : 21,
                    allowedCountry : [
                        {
                            price : 24,
                            allowed : true
                        },
                        {
                            countryId : country1,
                            price : 24,
                            allowed : true
                        },
                        {
                            countryId : country2,
                            price : 24,
                            allowed : true
                        },
                        {
                            countryId : country3,
                            price : 24,
                            allowed : true
                        }
                    ],
                    max : 50
                },
                {
                    min : 51,
                    allowedCountry : [
                        {
                            price : 100,
                            "allowed" : true
                        },
                        {
                            countryId : country1,
                            price : 100,
                            allowed : true
                        },
                        {
                            countryId : country2,
                            price : 100,
                            allowed : true
                        },
                        {
                            countryId : country3,
                            price : 100,
                            allowed : true
                        }
                    ],
                    max : 1000
                }
            ],
            freeShipping : true,
            packageWidth : 1000,
            packageHeight : 1000,
            packageDepth : 1000,
            packageWeight : 1000,
            position : 1,

            name: 'Uber',
            time: 5,
            images: [
                'https://s3.eu-central-1.amazonaws.com/marketplacedemomike/cup.jpg'
            ],
            status: true,
            isAllMarked: true,
            vendorId: vendor4._id
        });
    }

    if ( ! Contributions.find().fetch().length ) {
        Contributions.remove({});
        var Contribution1 = Contributions.insert({
            translation: [
                {
                    language: 'fr',
                    "name": "titre modifig",
                    "description": "c'est la Description du test. mais contiennent aussi de l'extra contributeur de details.\n",
                    "reference": "AAAA"
                }
            ],
            "skills": [
                {
                    language: 'fr',
                    values: ["competence 1"]
                }
            ],
            "features": [
                {
                    language: 'fr',
                    values: [{
                        "name": "de la marque",
                        "values": [
                            "Apple",
                            "Sony"
                        ]
                    },
                        {
                            "name": "module",
                            "values": [
                                "Iphone",
                                "Nokia"
                            ]
                        }
                    ]
                }
            ],
            "type": "Product",
            "offersCount": 100,
            "avgOffer": 130,
            "bestOffer": 115,
            "commission": "10",
            "published": true,
            "attributes": {
                "fr": [
                    [
                        {
                            "couleur": "rouge"
                        }
                    ]
                ]
            },
            "uin": "PZXBVEYJTQAYBYNSPG",
            "images": [
                "https://marketplacedemomike.s3.eu-central-1.amazonaws.com/img/p/Y/L/P/j/g/8/w/7/t/K/6/D/d/Z/S/Q/H/YLPjg8w7tK6DdZSQH0.024920.jpg",
                "https://marketplacedemomike.s3.eu-central-1.amazonaws.com/img/p/Y/L/P/j/g/8/w/7/t/K/6/D/d/Z/S/Q/H/YLPjg8w7tK6DdZSQH0.024920.jpg",
                "https://marketplacedemomike.s3.eu-central-1.amazonaws.com/img/p/Y/L/P/j/g/8/w/7/t/K/6/D/d/Z/S/Q/H/YLPjg8w7tK6DdZSQH0.024920.jpg"
            ],
            "mapProducts": [],
            "contributions": [],
            "isMapped": false,
            affiliate: {
                origin: 'affiliateSite.com'
            },
            category: [root],
            product: Product1,
            status: 'declined',
            language: 'French',
            user: vendor5._id
        });

        var Contribution2 = Contributions.insert({
            translation: [
                {
                    language: 'fr',
                    "name": "titre modifig",
                    "description": "c'est la Description du test. mais contiennent aussi de l'extra contributeur de details.\n",
                    "reference": "AAAA"
                }
            ],
            "skills": [
                {
                    language: 'fr',
                    values: ["competence 1"]
                }
            ],
            "features": [
                {
                    language: 'fr',
                    values: [{
                        "name": "capacity",
                        "values": [
                            "128 go",
                            "256 go"
                        ]
                    },
                        {
                            "name": "materiel",
                            "values": [
                                "le Verre",
                                "l'Aluminium"
                            ]
                        }
                    ]
                }
            ],
            "type": "Product",
            "offersCount": 100,
            "avgOffer": 130,
            "bestOffer": 115,
            "commission": "10",
            "published": true,
            "attributes": {
                "fr": [
                    [
                        {
                            "couleur": "rouge"
                        }
                    ]
                ]
            },
            "uin": "PZXBVEYJTQAYBYNSPG",
            "images": [
                "https://marketplacedemomike.s3.eu-central-1.amazonaws.com/img/p/Y/L/P/j/g/8/w/7/t/K/6/D/d/Z/S/Q/H/YLPjg8w7tK6DdZSQH0.024920.jpg",
                "https://marketplacedemomike.s3.eu-central-1.amazonaws.com/img/p/Y/L/P/j/g/8/w/7/t/K/6/D/d/Z/S/Q/H/YLPjg8w7tK6DdZSQH0.024920.jpg",
                "https://marketplacedemomike.s3.eu-central-1.amazonaws.com/img/p/Y/L/P/j/g/8/w/7/t/K/6/D/d/Z/S/Q/H/YLPjg8w7tK6DdZSQH0.024920.jpg"
            ],
            "mapProducts": [],
            "contributions": [],
            "isMapped": false,
            affiliate: {
                origin: 'affiliateSite.com'
            },
            category: [root],
            product: Product1,
            status: 'declined',
            language: 'French',
            user: vendor1._id
        });
        Meteor.call('addContributions', Product6, Contribution1);
        Meteor.call('addContributions', Product6, Contribution2);
    }

    if ( ! Reviews.find().fetch().length ) {
        Reviews.remove({});
        var Review1 = Reviews.insert({
            comment: 'Order was recieved successfully.',
            customer: a._id,
            rating: [
                ['Speed', 4],
                ['Price', 2],
                ['Quality of welcome', 5],
                ['Quality of service', 3],
                ['Quality of order', 1]
            ],
            avgRating: 3,
            order: CustToVend3
        });
        var Review2 = Reviews.insert({
            comment: 'Order was not recieved successfully.',
            customer: a._id,
            rating: [
                ['Speed', 5],
                ['Price', 5],
                ['Quality of welcome', 4],
                ['Quality of service', 4],
                ['Quality of order', 2]
            ],
            avgRating: 4.8,
            order: CustToVend2
        });
    }

    if ( ! ReviewsCriteria.find().fetch().length ) {

        ReviewsCriteria.remove({});
        var ReviewsCriteria1 = ReviewsCriteria.insert({
            criteria: [
                'Speed',
                'Price',
                'Quality of welcome',
                'Quality of service',
                'Quality of order'
            ]
        });
    }

    if ( ! Currencies.find().fetch().length ) {
        Currencies.remove({});
        Currencies.insert({
            name: 'Dollar',
            isoCode: 'USD',
            digitalIso: 840,
            symbol: '$',
            status: true
        });

        Currencies.insert({
            name: 'Euro',
            isoCode: 'EUR',
            digitalIso: 978,
            symbol: '€',
            status: false
        });
    }

    if ( ! Comments.find().fetch().length ) {
        Comments.remove({});
        Comments.insert({
            content: 'Hello World',
            refId: Review2,
            sender: a._id
        });
    }

    if ( ! Settings.find().fetch().length ) {
        Settings.remove({});
        Settings.insert({
            riskFactors: {
                riskCountry: 5,
                deliveryIp: 5,
                '3DSecure': 10,
                CBIp: 5,
                orderAmount: 3,
                failedPayment: 5
            },
            ordersSettings: {
                defaultAffiliateCommission : 15,
                ordersCommission : 10,
                appliedVAT : 5,
                appliedCommission : 5
            },

            miscellaneous: {
                name: 'Market Place Solution'
            },
            criteria: [
                {
                    translation: [{
                        language: 'en',
                        name: 'Speed'
                    }],
                    status: true
                },
                {
                    translation: [{
                        language: 'en',
                        name: 'Price'
                    }],
                    status: true
                },
                {
                    translation: [{
                        language: 'en',
                        name: 'Welcome quality'
                    }],
                    status: true
                },
                {
                    translation: [{
                        language: 'en',
                        name: 'Service quality'
                    }],
                    status: true
                }
            ],

            pictures: [
                {
                    name: 'small',
                    height: 80,
                    width: 80,
                    product: true,
                    avatar: false,
                    banner: false
                },
                {
                    name: 'medium',
                    height: 120,
                    width: 120,
                    product: true,
                    avatar: true,
                    banner: false
                },
                {
                    name: 'large',
                    height: 250,
                    width: 250,
                    product: false,
                    avatar: false,
                    banner: true
                }
            ],

            orders : [
                {
                    "translation" : [
                        {
                            "language" : "en",
                            "name" : "Completed"
                        }
                    ],
                    "color" : "#5367ce",
                    "status" : true,
                    "index" : 5
                },
                {
                    "translation" : [
                        {
                            "language" : "en",
                            "name" : "Onhold"
                        }
                    ],
                    "color" : "#5387ce",
                    "status" : true,
                    "index" : 0
                },
                {
                    "translation" : [
                        {
                            "language" : "en",
                            "name" : "Pending"
                        }
                    ],
                    "color" : "#ff8a00",
                    "status" : true,
                    "index" : 1
                },
                {
                    "translation" : [
                        {
                            "language" : "en",
                            "name" : "Cancellation"
                        }
                    ],
                    "color" : "#ff901f",
                    "status" : true,
                    "index" : 40
                },
                {
                    "translation" : [
                        {
                            "language" : "en",
                            "name" : "Processing"
                        }
                    ],
                    "color" : "#ff001f",
                    "status" : true,
                    "index" : 2
                },
                {
                    "translation" : [
                        {
                            "language" : "en",
                            "name" : "Cancelled"
                        }
                    ],
                    "color" : "#ffc700",
                    "status" : false,
                    "index" : 50
                }
            ],
            "paymentStatus" : [
                {
                    "translation" : [
                        {
                            "language" : "en",
                            "name" : "Pending"
                        }
                    ],
                    "colorClass" : "pending",
                    "index" : 0
                },
                {
                    "translation" : [
                        {
                            "language" : "en",
                            "name" : "Added"
                        }
                    ],
                    "colorClass" : "added",
                    "index" : 1
                },
                {
                    "translation" : [
                        {
                            "language" : "en",
                            "name" : "Eligible"
                        }
                    ],
                    "colorClass" : "eligible",
                    "index" : 2
                },
                {
                    "translation" : [
                        {
                            "language" : "en",
                            "name" : "Processing"
                        }
                    ],
                    "colorClass" : "processing",
                    "index" : 3
                },
                {
                    "translation" : [
                        {
                            "language" : "en",
                            "name" : "Paid"
                        }
                    ],
                    "colorClass" : "paid",
                    "index" : 4
                }
            ],
            categories: [
                {
                    translation: [{
                        name: 'test 1',
                        description: 'html',
                        language: 'en'
                    }],
                    _id: Random.id(),
                    position: 2,
                    url: 'xyz',
                    status: true,
                    newPage: true,
                    htmlMenu: true
                },
                {
                    translation: [{
                        name: 'test 2',
                        description: 'html',
                        language: 'en'
                    }],
                    _id: Random.id(),
                    position: 3,
                    status: true,
                    newPage: true,
                    htmlMenu: true
                },
                {
                    translation: [{
                        name: 'test 3',
                        description: 'html',
                        language: 'en'
                    }],
                    _id: Random.id(),
                    position: 4,
                    status: true,
                    newPage: false,
                    htmlMenu: false
                },
                {
                    translation: [{
                        name: 'test 4',
                        description: 'html',
                        language: 'en'
                    }],
                    _id: Random.id(),
                    position: 5,
                    status: false,
                    newPage: true,
                    htmlMenu: false
                }
            ]
        });
    }

    if ( ! Pages.find().fetch().length ) {
        Pages.remove({});
        var sRoot = Pages.insert({
            translation: [
                {
                    language: 'en',
                    name: 'Root',
                    description: 'root'
                }
            ],
            tags: {
                "en": [
                    ["test1"]
                ]
            }
        });
        Pages.insert({
            translation: [
                {
                    language: 'en',
                    name: 'test 1',
                    short: 'new short description',
                    description: 'html'
                }
            ],
            tags: {
                "en": [
                    ["test1"]
                ]
            },
            status: true,
            pages: [
                {

                    url: 'terms-and-conditions-of-use',
                    translation: [
                        {
                            name: 'Terms and conditions of use',
                            short: 'short description',
                            description: 'long description',
                            language: 'en'
                        }
                    ],
                    position: 1,
                    _id: Random.id(),
                    status: true,
                    tags: {
                        "en": [
                            ["test1"]
                        ]
                    }
                },
                {
                    url: 'frequently asked questions',
                    translation: [
                        {
                            name: 'frequently asked questions',
                            short: 'short description',
                            description: 'long description',
                            language: 'en'
                        }
                    ],
                    position: 2,
                    _id: Random.id(),
                    status: true,
                    tags: {
                        "en": [
                            ["test2"]
                        ]
                    }
                },
                {
                    url: 'how can we help you',
                    translation: [
                        {
                            name: 'Terms and conditions of use',
                            short: 'short description',
                            description: 'long description',
                            language: 'en'
                        }
                    ],
                    position: 3,
                    _id: Random.id(),
                    status: true,
                    tags: {
                        "en": [
                            ["test1"]
                        ]
                    }
                }
            ],
            parent: sRoot
        });
    }

    if ( ! Badges.find().fetch().length ) {
        Badges.remove({});
        Badges.insert({
            "status": true,
            "translation": [
                {
                    "name": "Best Seller",
                    "description": "adfasdfasdfasdfd",
                    "language": "en"
                }
            ],
            "rulesUsed": [
                "Should have at least x reviews",
                "Should have make at least X validated contribution",
                "Should have at least a suggest score > to",
                "Should be VIP member"
            ],
            "showONFO": true
        });
    }

    if ( ! Offers.find().fetch().length ){
        Offers.remove({});

        var offer1 = Offers.insert({
            _id: 'PQ8GUYYB7IERPNE9NX-CombVSOAJ',
            translation: {
                en: {
                    description: 'offer 1'
                }
            },
            location : {
                "lat" : 49.321374,
                "lon" : 6.118282
            },
            combId: 1,
            product: Product6,
            vendor: vendor._id,
            vendorName: vendor.profile.vendor.company,
            price: 34,
            avgOffer: 34,
            bestOffer: 34,
            quantity: 5,
            inStock: true,
            status: true,
            alignToOffer: true,
            shipping: [carrier1],
            //validation: new Date
            delayDays: 5,
            packageWidth: 50,
            packageHeight: 50,
            packageDepth: 50,
            packageWeight: 5
        });
        Offers.insert({
            _id: 'PQ8GUYYB7IERPNE9NX-CombCMM7N',
            combId: 2,
            translation: {
                en: {
                    description: 'offer 2'
                }
            },
            location :{
                "lat" : 49.321374,
                "lon" : 6.118282
            },
            product: Product6,
            vendor: vendor._id,
            vendorName: vendor.profile.vendor.company,
            price: 56,
            avgOffer: 56,
            bestOffer: 56,
            quantity: 9,
            inStock: false,
            status: true,
            alignToOffer: false,
            shipping: [carrier1],
            //validation: new Date
            delayDays: 3,
            packageWidth: 50,
            packageHeight: 50,
            packageDepth: 50,
            packageWeight: 5
        });
        Offers.insert({
            _id: 'PQ8GUYYB7IERPNE9NX-CombHSSOY',
            combId: 3,
            translation: {
                en: {
                    description: 'offer 3'
                }
            },
            location : {
                "lat" : 49.321374,
                "lon" : 6.118282
            },
            product: Product6,
            vendor: vendor._id,
            vendorName: vendor.profile.vendor.company,
            price: 79,
            avgOffer: 79,
            bestOffer: 79,
            quantity: 16,
            inStock: true,
            status: true,
            alignToOffer: false,
            shipping: [carrier1],
            //validation: new Date
            delayDays: 1,
            packageWidth: 50,
            packageHeight: 50,
            packageDepth: 50,
            packageWeight: 5
        });
        Offers.insert({
            _id: 'PQ8GUYYB7IERPNE9NX-CombA7MYA',
            combId: 4,
            translation: {
                en: {
                    description: 'offer 3'
                }
            },
            location : {
                "lat" : 49.321374,
                "lon" : 6.118282
            },
            product: Product6,
            vendor: vendor._id,
            vendorName: vendor.profile.vendor.company,
            price: 85,
            avgOffer: 85,
            bestOffer: 85,
            quantity: 16,
            inStock: true,
            status: true,
            alignToOffer: true,
            shipping: [carrier1],
            //validation: new Date
            delayDays: 1,
            packageWidth: 50,
            packageHeight: 50,
            packageDepth: 50,
            packageWeight: 5
        });
        Offers.insert({
            _id: 'PQ8GUYYB7IERPNE9NX-CombQQD7F',
            combId: 5,
            translation: {
                en: {
                    description: 'offer 3'
                }
            },
            location : {
                "lat" : 49.321374,
                "lon" : 6.118282
            },
            product: Product6,
            vendor: vendor._id,
            vendorName: vendor.profile.vendor.company,
            price: 85,
            avgOffer: 85,
            bestOffer: 85,
            quantity: 16,
            inStock: true,
            status: true,
            alignToOffer: true,
            shipping: [carrier1],
            //validation: new Date
            delayDays: 1,
            packageWidth: 50,
            packageHeight: 50,
            packageDepth: 50,
            packageWeight: 5
        });
        Offers.insert({
            _id: 'PQ8GUYYB7IERPNE9NX-CombSJ7G3',
            combId: 6,
            translation: {
                en: {
                    description: 'offer 3'
                }
            },
            location : {
                "lat" : 49.321374,
                "lon" : 6.118282
            },
            product: Product6,
            vendor: vendor._id,
            vendorName: vendor.profile.vendor.company,
            price: 115,
            avgOffer: 115,
            bestOffer: 115,
            quantity: 16,
            inStock: true,
            status: true,
            alignToOffer: true,
            shipping: [carrier1],
            //validation: new Date
            delayDays: 1,
            packageWidth: 50,
            packageHeight: 50,
            packageDepth: 50,
            packageWeight: 5
        });
        Offers.insert({
            _id: 'PQ8GUYYB7IERPNE9NX-CombBZ5JJ',
            combId: 7,
            translation: {
                en: {
                    description: 'offer 3'
                }
            },
            location : {
                "lat" : 49.321374,
                "lon" : 6.118282
            },
            product: Product6,
            vendor: vendor._id,
            vendorName: vendor.profile.vendor.company,
            price: 125,
            avgOffer: 125,
            bestOffer: 125,
            quantity: 16,
            inStock: true,
            status: true,
            alignToOffer: false,
            shipping: [carrier1],
            //validation: new Date
            delayDays: 1,
            packageWidth: 50,
            packageHeight: 50,
            packageDepth: 50,
            packageWeight: 5
        });
        Offers.insert({
            _id: 'PQ8GUYYB7IERPNE9NX-CombGHHZ7',
            combId: 8,
            translation: {
                en: {
                    description: 'offer 3'
                }
            },
            location : {
                "lat" : 49.321374,
                "lon" : 6.118282
            },
            product: Product6,
            vendor: vendor._id,
            vendorName: vendor.profile.vendor.company,
            price: 125,
            avgOffer: 125,
            bestOffer: 125,
            quantity: 16,
            inStock: true,
            status: true,
            alignToOffer: false,
            shipping: [carrier1],
            //validation: new Date
            delayDays: 1,
            packageWidth: 50,
            packageHeight: 50,
            packageDepth: 50,
            packageWeight: 5
        });
        Offers.insert({
            _id: 'PQ8GUYYB7IERPNE9NX-CombERW4S',
            combId: 9,
            translation: {
                en: {
                    description: 'offer 3'
                }
            },
            location : {
                "lat" : 49.321374,
                "lon" : 6.118282
            },
            product: Product6,
            vendor: vendor._id,
            vendorName: vendor.profile.vendor.company,
            price: 125,
            avgOffer: 125,
            bestOffer: 125,
            quantity: 16,
            inStock: true,
            status: true,
            alignToOffer: false,
            shipping: [carrier1],
            //validation: new Date
            delayDays: 1,
            packageWidth: 50,
            packageHeight: 50,
            packageDepth: 50,
            packageWeight: 5
        });
        Offers.insert({
            translation: {
                en: {
                    description: 'mainOffer'
                }
            },
            location : {
                "lat" : 49.321374,
                "lon" : 6.118282
            },
            product: Product6,
            vendor: vendor._id,
            vendorName: vendor.profile.vendor.company,
            price: 56,
            avgOffer: 56,
            bestOffer: 56,
            quantity: 9,
            inStock: false,
            status: true,
            main: true,
            alignToOffer: false,
            shipping: [carrier1],
            //validation: new Date
            delayDays: 3,
            packageWidth: 50,
            packageHeight: 50,
            packageDepth: 50,
            packageWeight: 5
        });

        var offer01 = Offers.insert({
            _id: 'PQ8GUYYB7IERPNE9NX-CombVSOA1',
            translation: {
                en: {
                    description: 'offer 1'
                }
            },
            location : {
                "lat" : 49.321374,
                "lon" : 2.352222
            },
            combId: 1,
            product: Product6,
            vendor: vendor1._id,
            vendorName: vendor1.profile.vendor.company,
            price: 34,
            avgOffer: 34,
            bestOffer: 34,
            quantity: 5,
            inStock: true,
            status: true,
            alignToOffer: true,
            shipping: [carrier1],
            //validation: new Date
            delayDays: 5,
            packageWidth: 50,
            packageHeight: 50,
            packageDepth: 50,
            packageWeight: 5
        });
        Offers.insert({
            _id: 'PQ8GUYYB7IERPNE9NX-CombCMM72',
            combId: 2,
            translation: {
                en: {
                    description: 'offer 2'
                }
            },
            location : {
                "lat" : 49.321374,
                "lon" : 2.352222
            },
            product: Product6,
            vendor: vendor1._id,
            vendorName: vendor1.profile.vendor.company,
            price: 56,
            avgOffer: 56,
            bestOffer: 56,
            quantity: 9,
            inStock: false,
            status: true,
            alignToOffer: false,
            shipping: [carrier1],
            //validation: new Date
            delayDays: 3,
            packageWidth: 50,
            packageHeight: 50,
            packageDepth: 50,
            packageWeight: 5
        });
        Offers.insert({
            _id: 'PQ8GUYYB7IERPNE9NX-CombHSSO3',
            combId: 3,
            translation: {
                en: {
                    description: 'offer 3'
                }
            },
            location : {
                "lat" : 49.321374,
                "lon" : 2.352222
            },
            product: Product6,
            vendor: vendor1._id,
            vendorName: vendor1.profile.vendor.company,
            price: 79,
            avgOffer: 79,
            bestOffer: 79,
            quantity: 16,
            inStock: true,
            status: true,
            alignToOffer: false,
            shipping: [carrier1],
            //validation: new Date
            delayDays: 1,
            packageWidth: 50,
            packageHeight: 50,
            packageDepth: 50,
            packageWeight: 5
        });
        Offers.insert({
            _id: 'PQ8GUYYB7IERPNE9NX-CombA7MY4',
            combId: 4,
            translation: {
                en: {
                    description: 'offer 3'
                }
            },
            location : {
                "lat" : 49.321374,
                "lon" : 2.352222
            },
            product: Product6,
            vendor: vendor1._id,
            vendorName: vendor1.profile.vendor.company,
            price: 85,
            avgOffer: 85,
            bestOffer: 85,
            quantity: 16,
            inStock: true,
            status: true,
            alignToOffer: true,
            shipping: [carrier1],
            //validation: new Date
            delayDays: 1,
            packageWidth: 50,
            packageHeight: 50,
            packageDepth: 50,
            packageWeight: 5
        });
        Offers.insert({
            _id: 'PQ8GUYYB7IERPNE9NX-CombQQD75',
            combId: 5,
            translation: {
                en: {
                    description: 'offer 3'
                }
            },
            location : {
                "lat" : 49.321374,
                "lon" : 2.352222
            },
            product: Product6,
            vendor: vendor1._id,
            vendorName: vendor1.profile.vendor.company,
            price: 93,
            avgOffer: 93,
            bestOffer: 93,
            quantity: 16,
            inStock: true,
            status: true,
            alignToOffer: true,
            shipping: [carrier1],
            //validation: new Date
            delayDays: 1,
            packageWidth: 50,
            packageHeight: 50,
            packageDepth: 50,
            packageWeight: 5
        });
        Offers.insert({
            _id: 'PQ8GUYYB7IERPNE9NX-CombSJ7G6',
            combId: 6,
            translation: {
                en: {
                    description: 'offer 3'
                }
            },
            location : {
                "lat" : 49.321374,
                "lon" : 2.352222
            },
            product: Product6,
            vendor: vendor1._id,
            vendorName: vendor1.profile.vendor.company,
            price: 115,
            avgOffer: 115,
            bestOffer: 115,
            quantity: 16,
            inStock: true,
            status: true,
            alignToOffer: true,
            shipping: [carrier1],
            //validation: new Date
            delayDays: 1,
            packageWidth: 50,
            packageHeight: 50,
            packageDepth: 50,
            packageWeight: 5
        });
        Offers.insert({
            _id: 'PQ8GUYYB7IERPNE9NX-CombBZ5J7',
            combId: 7,
            translation: {
                en: {
                    description: 'offer 3'
                }
            },
            location : {
                "lat" : 49.321374,
                "lon" : 2.352222
            },
            product: Product6,
            vendor: vendor1._id,
            vendorName: vendor1.profile.vendor.company,
            price: 125,
            avgOffer: 125,
            bestOffer: 125,
            quantity: 16,
            inStock: true,
            status: true,
            alignToOffer: false,
            shipping: [carrier1],
            //validation: new Date
            delayDays: 1,
            packageWidth: 50,
            packageHeight: 50,
            packageDepth: 50,
            packageWeight: 5
        });
        Offers.insert({
            _id: 'PQ8GUYYB7IERPNE9NX-CombGHHZ8',
            combId: 8,
            translation: {
                en: {
                    description: 'offer 3'
                }
            },
            location : {
                "lat" : 49.321374,
                "lon" : 2.352222
            },
            product: Product6,
            vendor: vendor1._id,
            vendorName: vendor1.profile.vendor.company,
            price: 125,
            avgOffer: 125,
            bestOffer: 125,
            quantity: 16,
            inStock: true,
            status: true,
            alignToOffer: false,
            shipping: [carrier1],
            //validation: new Date
            delayDays: 1,
            packageWidth: 50,
            packageHeight: 50,
            packageDepth: 50,
            packageWeight: 5
        });
        Offers.insert({
            _id: 'PQ8GUYYB7IERPNE9NX-CombERW49',
            combId: 9,
            translation: {
                en: {
                    description: 'offer 3'
                }
            },
            location : {
                "lat" : 49.321374,
                "lon" : 2.352222
            },
            product: Product6,
            vendor: vendor1._id,
            vendorName: vendor1.profile.vendor.company,
            price: 125,
            avgOffer: 125,
            bestOffer: 125,
            quantity: 16,
            inStock: true,
            status: true,
            alignToOffer: false,
            shipping: [carrier1],
            //validation: new Date
            delayDays: 1,
            packageWidth: 50,
            packageHeight: 50,
            packageDepth: 50,
            packageWeight: 5
        });
        Offers.insert({
            _id: 'PQ8GUYYB7IERPNE9NX-CombERW410',
            translation: {
                en: {
                    description: 'mainOffer'
                }
            },
            location : {
                "lat" : 49.321374,
                "lon" : 2.352222
            },
            product: Product6,
            vendor: vendor1._id,
            vendorName: vendor1.profile.vendor.company,
            price: 56,
            avgOffer: 56,
            bestOffer: 56,
            quantity: 9,
            inStock: false,
            status: true,
            main: true,
            alignToOffer: false,
            shipping: [carrier1],
            //validation: new Date
            delayDays: 3,
            packageWidth: 50,
            packageHeight: 50,
            packageDepth: 50,
            packageWeight: 5
        });

        var offer001 = Offers.insert({
            _id: 'PQ8GUYYB7IERPNE9NX-CombVSOA',
            translation: {
                en: {
                    description: 'offer 1'
                }
            },
            location : {
                "lat" : 44.837789,
                "lon" : -0.579180
            },
            combId: 1,
            product: Product6,
            vendor: vendor2._id,
            vendorName: vendor2.profile.vendor.company,
            price: 34,
            avgOffer: 34,
            bestOffer: 34,
            quantity: 5,
            inStock: true,
            status: true,
            alignToOffer: true,
            shipping: [carrier1],
            //validation: new Date
            delayDays: 5,
            packageWidth: 50,
            packageHeight: 50,
            packageDepth: 50,
            packageWeight: 5
        });
        Offers.insert({
            _id: 'PQ8GUYYB7IERPNE9NX-CombCMM7',
            combId: 2,
            translation: {
                en: {
                    description: 'offer 2'
                }
            },
            location : {
                "lat" : 44.837789,
                "lon" : -0.579180
            },
            product: Product6,
            vendor: vendor2._id,
            vendorName: vendor2.profile.vendor.company,
            price: 56,
            avgOffer: 56,
            bestOffer: 56,
            quantity: 9,
            inStock: false,
            status: true,
            alignToOffer: false,
            shipping: [carrier1],
            //validation: new Date
            delayDays: 3,
            packageWidth: 50,
            packageHeight: 50,
            packageDepth: 50,
            packageWeight: 5
        });
        Offers.insert({
            _id: 'PQ8GUYYB7IERPNE9NX-CombHSSO',
            combId: 3,
            translation: {
                en: {
                    description: 'offer 3'
                }
            },
            location : {
                "lat" : 44.837789,
                "lon" : -0.579180
            },
            product: Product6,
            vendor: vendor2._id,
            vendorName: vendor2.profile.vendor.company,
            price: 79,
            avgOffer: 79,
            bestOffer: 79,
            quantity: 16,
            inStock: true,
            status: true,
            alignToOffer: false,
            shipping: [carrier1],
            //validation: new Date
            delayDays: 1,
            packageWidth: 50,
            packageHeight: 50,
            packageDepth: 50,
            packageWeight: 5
        });
        Offers.insert({
            _id: 'PQ8GUYYB7IERPNE9NX-CombA7MY',
            combId: 4,
            translation: {
                en: {
                    description: 'offer 3'
                }
            },
            location : {
                "lat" : 44.837789,
                "lon" : -0.579180
            },
            product: Product6,
            vendor: vendor2._id,
            vendorName: vendor2.profile.vendor.company,
            price: 85,
            avgOffer: 85,
            bestOffer: 85,
            quantity: 16,
            inStock: true,
            status: true,
            alignToOffer: true,
            shipping: [carrier1],
            //validation: new Date
            delayDays: 1,
            packageWidth: 50,
            packageHeight: 50,
            packageDepth: 50,
            packageWeight: 5
        });
        Offers.insert({
            _id: 'PQ8GUYYB7IERPNE9NX-CombQQD7',
            combId: 5,
            translation: {
                en: {
                    description: 'offer 3'
                }
            },
            location : {
                "lat" : 44.837789,
                "lon" : -0.579180
            },
            product: Product6,
            vendor: vendor2._id,
            vendorName: vendor2.profile.vendor.company,
            price: 93,
            avgOffer: 93,
            bestOffer: 93,
            quantity: 16,
            inStock: true,
            status: true,
            alignToOffer: true,
            shipping: [carrier1],
            //validation: new Date
            delayDays: 1,
            packageWidth: 50,
            packageHeight: 50,
            packageDepth: 50,
            packageWeight: 5
        });
        Offers.insert({
            _id: 'PQ8GUYYB7IERPNE9NX-CombSJ7G',
            combId: 6,
            translation: {
                en: {
                    description: 'offer 3'
                }
            },
            location : {
                "lat" : 44.837789,
                "lon" : -0.579180
            },
            product: Product6,
            vendor: vendor2._id,
            vendorName: vendor2.profile.vendor.company,
            price: 115,
            avgOffer: 115,
            bestOffer: 115,
            quantity: 16,
            inStock: true,
            status: true,
            alignToOffer: true,
            shipping: [carrier1],
            //validation: new Date
            delayDays: 1,
            packageWidth: 50,
            packageHeight: 50,
            packageDepth: 50,
            packageWeight: 5
        });
        Offers.insert({
            _id: 'PQ8GUYYB7IERPNE9NX-CombBZ5J',
            combId: 7,
            translation: {
                en: {
                    description: 'offer 3'
                }
            },
            location : {
                "lat" : 44.837789,
                "lon" : -0.579180
            },
            product: Product6,
            vendor: vendor2._id,
            vendorName: vendor2.profile.vendor.company,
            price: 125,
            avgOffer: 125,
            bestOffer: 125,
            quantity: 16,
            inStock: true,
            status: true,
            alignToOffer: false,
            shipping: [carrier1],
            //validation: new Date
            delayDays: 1,
            packageWidth: 50,
            packageHeight: 50,
            packageDepth: 50,
            packageWeight: 5
        });
        Offers.insert({
            _id: 'PQ8GUYYB7IERPNE9NX-CombGHHZ',
            combId: 8,
            translation: {
                en: {
                    description: 'offer 3'
                }
            },
            location : {
                "lat" : 44.837789,
                "lon" : -0.579180
            },
            product: Product6,
            vendor: vendor2._id,
            vendorName: vendor2.profile.vendor.company,
            price: 125,
            avgOffer: 125,
            bestOffer: 125,
            quantity: 16,
            inStock: true,
            status: true,
            alignToOffer: false,
            shipping: [carrier1],
            //validation: new Date
            delayDays: 1,
            packageWidth: 50,
            packageHeight: 50,
            packageDepth: 50,
            packageWeight: 5
        });
        Offers.insert({
            _id: 'PQ8GUYYB7IERPNE9NX-CombERW4',
            combId: 9,
            translation: {
                en: {
                    description: 'offer 3'
                }
            },
            location : {
                "lat" : 44.837789,
                "lon" : -0.579180
            },
            product: Product6,
            vendor: vendor2._id,
            vendorName: vendor2.profile.vendor.company,
            price: 125,
            avgOffer: 125,
            bestOffer: 125,
            quantity: 16,
            inStock: true,
            status: true,
            alignToOffer: false,
            shipping: [carrier1],
            //validation: new Date
            delayDays: 1,
            packageWidth: 50,
            packageHeight: 50,
            packageDepth: 50,
            packageWeight: 5
        });
        Offers.insert({
            _id: 'PQ8GUYYB7IERPNE9NX-CombERW',
            translation: {
                en: {
                    description: 'mainOffer'
                }
            },
            location : {
                "lat" : 44.837789,
                "lon" : -0.579180
            },
            product: Product6,
            vendor: vendor2._id,
            vendorName: vendor2.profile.vendor.company,
            price: 56,
            avgOffer: 56,
            bestOffer: 56,
            quantity: 9,
            inStock: false,
            status: true,
            main: true,
            alignToOffer: false,
            shipping: [carrier1],
            //validation: new Date
            delayDays: 3,
            packageWidth: 50,
            packageHeight: 50,
            packageDepth: 50,
            packageWeight: 5
        });
    }

    if ( ! Orders.find().fetch().length ){
        Orders.remove({});
        var CustToVend1 = Orders.insert({
            settings : {
                shippingCommission : 5,
                orderCommission : 10,
                affiliateCommission : 15,
                VAT : 5
            },
            details: [{
                product: Product1,
                offerId: offer1,
                sales: 12,
                commissionPerc: 10
            }],
            grossPrice : 7000,
            orderRef: 'OEEEEEE',
            vendorId: vendor1._id,
            firstName: 'Jack',
            //nameTitle: 'Ms.',
            //name: 'Monica',
            history: [{
                status: "Pending",
                updatedAt: new Date(),
                updatedBy: a._id
            }],
            user: a._id,
            totalPrice: 5000,
            status: "Processing",
            riskScore: 15,
            deliveryCountry: "Germany",
            commission: 500,
            sentByMail: true,
            deliveryDay: 3,
            vendor: 'Lavish',
            action: 'Pay the money',
            ip: '192.168.2.3',
            itemRelated: 324201,
            payType: 'Affiliate',
            transactionalDetails: 'Transactional Details',
            company: 'Emaco',
            shippingAddress : 0,
            billingAddress : 0,
            carriers: [{
                id: carrier1,
                price: 963
            }]

        });
        var CustToVend2 = Orders.insert({
            settings : {
                shippingCommission : 5,
                orderCommission : 10,
                affiliateCommission : 15,
                VAT : 5
            },
            grossPrice : 7000,
            offerId: offer1,
            orderRef: 'OFFFFF',
            vendorId: vendor1._id,
            firstName: 'Andrew',
            //nameTitle: 'Ms.',
            //name: 'Monica',
            history: [{
                status: "Pending",
                updatedAt: new Date(),
                updatedBy: a._id
            }],
            user: a._id,
            totalPrice: 10000,
            status: "Pending",
            riskScore: 15,
            deliveryCountry: "Germany",
            commission: 250,
            commissionPerc: 2.5,
            sentByMail: true,
            deliveryDay: 6,
            vendor: 'Jack',
            action: 'Pay the money',
            product: Product1,
            ip: '192.168.2.3',
            itemRelated: 324201,
            payType: 'Affiliate',
            transactionalDetails: 'Transactional Details',
            sales: 56,
            company: 'Emaco',
            shippingAddress : 0,
            billingAddress : 0,
            carriers: [{
                id: carrier1,
                price: 569
            }]

        });
        var CustToVend3 = Orders.insert({
            settings : {
                shippingCommission : 5,
                orderCommission : 10,
                affiliateCommission : 15,
                VAT : 5
            },
            grossPrice : 7000,
            offerId: offer1,
            orderRef: 'OKKKKKK',
            vendorId: vendor1._id,
            firstName: 'George',
            //nameTitle: 'Ms.',
            //name: 'Monica',
            history: [{
                status: "Pending",
                updatedAt: new Date(),
                updatedBy: a._id
            }],
            user: a._id,
            totalPrice: 7000,
            status: "Completed",
            riskScore: 15,
            deliveryCountry: "France",
            commission: 40,
            commissionPerc: 10,
            sentByMail: true,
            deliveryDay: 3,
            vendor: 'Lavish',
            action: 'Pay the money',
            product: Product1,
            ip: '192.168.2.3',
            itemRelated: 324201,
            payType: 'Affiliate',
            transactionalDetails: 'Transactional Details',
            sales: 12,
            company: 'Emaco',
            shippingAddress : 0,
            billingAddress : 0,
            carriers: [{
                id: carrier1,
                price: 0
            }]

        });
        var CustToVend4 = Orders.insert({
            settings : {
                shippingCommission : 5,
                orderCommission : 10,
                affiliateCommission : 15,
                VAT : 5
            },
            grossPrice : 7000,
            offerId: offer1,
            orderRef: 'OKKKKKK',
            vendorId: vendor1._id,
            firstName: 'George',
            //nameTitle: 'Ms.',
            //name: 'Monica',
            history: [{
                status: "Pending",
                updatedAt: new Date(),
                updatedBy: a._id
            }],
            user: a._id,
            totalPrice: 7000,
            status: "Paid",
            riskScore: 15,
            deliveryCountry: "France",
            commission: 40,
            commissionPerc: 10,
            sentByMail: true,
            deliveryDay: 3,
            vendor: 'Lavish',
            action: 'Pay the money',
            product: Product1,
            ip: '192.168.2.3',
            itemRelated: 324201,
            payType: 'Affiliate',
            transactionalDetails: 'Transactional Details',
            sales: 12,
            company: 'Emaco',
            shippingAddress : 0,
            billingAddress : 0,
            carriers: [{
                id: carrier1,
                price: 236
            }]

        });
        var CustToVend5 = Orders.insert({
            settings : {
                shippingCommission : 5,
                orderCommission : 10,
                affiliateCommission : 15,
                VAT : 5
            },
            grossPrice : 7000,
            offerId: offer1,
            orderRef: 'OKKKKKK',
            vendorId: vendor._id,
            firstName: 'George',
            //nameTitle: 'Ms.',
            //name: 'Monica',
            history: [{
                status: "Pending",
                updatedAt: new Date(),
                updatedBy: vendor._id
            }],
            user: a._id,
            totalPrice: 7000,
            status: "Pending",
            riskScore: 3,
            deliveryCountry: "France",
            commission: 40,
            commissionPerc: 10,
            sentByMail: true,
            deliveryDay: 3,
            vendor: 'Lavish',
            action: 'Pay the money',
            product: Product1,
            ip: '192.168.2.3',
            itemRelated: 324201,
            payType: 'Affiliate',
            transactionalDetails: 'Transactional Details',
            sales: 12,
            company: 'Epik',
            shippingAddress : 0,
            billingAddress : 0,
            carriers: [{
                id: carrier1,
                price: 360
            }]
        });
    }

    if ( !Payments.find().fetch().length ) {
        Payments.remove({});
        Payments.insert({
            receiverId : vendor1._id,
            status : 'Pending',
            orderId : CustToVend1,
            amount : 40,
            history : [
                {
                    status : "Pending",
                    updatedAt : new Date()
                }
            ],
            sales : 1,
            firstName : "Johny",
            deliveryCountry : "France",
            name : "supervendor",
            company : "Epik",
            createdAt : new Date,
            type : 'vendor',
            details : "Commission",
            invoices : [],
            title : "Mr."
        });
        Payments.insert({
            receiverId : vendor1._id,
            status : 'Pending',
            orderId : CustToVend2,
            amount : 40,
            history : [
                {
                    status : "Pending",
                    updatedAt : new Date()
                }
            ],
            sales : 1,
            firstName : "Johny",
            deliveryCountry : "France",
            name : "supervendor",
            company : "Epik",
            createdAt : new Date,
            type : 'vendor',
            details : "Commission",
            invoices : [],
            title : "Mr."
        });
        Payments.insert({
            receiverId : vendor1._id,
            status : 'Pending',
            orderId : CustToVend3,
            amount : 40,
            history : [
                {
                    status : "Pending",
                    updatedAt : new Date()
                }
            ],
            sales : 1,
            firstName : "Johny",
            deliveryCountry : "France",
            name : "supervendor",
            company : "Epik",
            createdAt : new Date,
            type : 'vendor',
            details : "Commission",
            invoices : [],
            title : "Mr."
        });
        Payments.insert({
            receiverId : vendor1._id,
            status : 'Pending',
            orderId : CustToVend4,
            amount : 40,
            history : [
                {
                    status : "Pending",
                    updatedAt : new Date()
                }
            ],
            sales : 1,
            firstName : "Johny",
            deliveryCountry : "France",
            name : "supervendor",
            company : "Epik",
            createdAt : new Date,
            type : 'vendor',
            details : "Commission",
            invoices : [],
            title : "Mr."
        });
        Payments.insert({
            receiverId : vendor1._id,
            status : 'Pending',
            orderId : CustToVend5,
            amount : 40,
            history : [
                {
                    status : "Pending",
                    updatedAt : new Date()
                }
            ],
            sales : 1,
            firstName : "Johny",
            deliveryCountry : "France",
            name : "supervendor",
            company : "Epik",
            createdAt : new Date,
            type : 'vendor',
            details : "Commission",
            invoices : [],
            title : "Mr."
        });

    }

    if ( ! Rules.find().fetch().length ) {
        Rules.remove({});
        Rules.insert({
            status: true,
            name: [
                'Should have at least x reviews',
                'Should have review reputation > to X',
                'Should have make at least X validated contribution',
                'Should have make at least X validated suggestion',
                'Should have at least a suggest score > to',
                'Should have much than X sales',
                'Should have win much than X $',
                'Should be VIP member'
            ]
        });
    }
});
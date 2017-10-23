Meteor.startup(function() {
    // Add Facebook configuration entry
    ServiceConfiguration.configurations.upsert(
        { service: "facebook" },
        {
            $set: {
                appId: "254954424878861",
                secret: "63e404d37ffc5ade4368c5202178a179"
            }
        }
    );

    //// Add Google configuration entry
    ServiceConfiguration.configurations.upsert(
        { service: "google" },
        {
            $set: {
                clientId: "213809774282-g4m7ogk6en201brbdrimkfs6o7gj133q.apps.googleusercontent.com",
                secret: "Jq9KczlObgUc065UgQIC_Wab"
            }
        }
    );

    // Add Twitter configuration entry
    ServiceConfiguration.configurations.upsert(
        { service: "twitter" },
        {
            $set: {
                consumerKey: "W2dEDDMn86m6IZwyXX0Jz3V7d",
                secret: "HOK1Ug1GFR625zDi80cfEzY4T1PXtSZW2GGTKQ2TgBc7foxbIJ"
            }
        }
    );

    // Add Twitter configuration entry
    ServiceConfiguration.configurations.upsert(
        { service: "linkedin" },
        {
            $set: {
                clientId: "759u6c915z15so",
                secret: "fFG4EGAJeYglcHRZ"
            }
        }
    );

    // Add Microsoft configuration entry
    ServiceConfiguration.configurations.upsert(
        { service: "microsoft" },
        {
            $set: {
                clientId: "e1fc5539-8c22-4022-9dfd-e6bfbe1017c8",
                secret: "Hrei4QMPqhYXw3wSYB2t2Me"
            }
        }
    );

    // Add Instagram configuration entry
    ServiceConfiguration.configurations.upsert(
        { service: "instagram" },
        {
            $set: {
                clientId: "df9eb0fbaf334846b8a0394879ff14b0",
                secret: "46d44b596700401a84126c963a3d6eb1"
            }
        }
    )

});
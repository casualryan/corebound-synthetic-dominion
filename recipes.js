const recipes = [
    {
        name: "Poison Pistol",
        category: "Weapons",
        ingredients: {
            "Synthetic Poison Gland": 4,
            "Scrap Metal": 5,
            "Minor Electronic Circuit": 2,
            "Partical Fuser": 1
        },
        craftingTime: 5,
    },
    {
        name: "Laser Sword",
        category: "Weapons",
        ingredients: {
            "Crystalized Light": 3,
            "Scrap Metal": 5,
            "Minor Electronic Circuit": 2,
            "Partical Fuser": 1
        },
        craftingTime: 5,
    },

    {
        name: "Photon Inhibitor Shield",
        category: "Shields",
        ingredients: {
            "Scrap Metal": 5,
            "Crystalized Light": 4,
            "Unstable Photon": 1,
            "Partical Fuser": 1
        },
        craftingTime: 5,
    },

    {
        name: "Metal Carapace",
        category: "Armor",
        ingredients: {
            "Scrap Metal": 15,
            "Partical Fuser": 1
        },
        craftingTime: 5,
    },
    {
        name: "Epidermis Alloy",
        category: "Bionics",
        ingredients: {
            "Scrap Metal": 10,
            "Partical Fuser": 1
        },
        craftingTime: 5,
    },
    {
        name: "Health Enhancer",
        category: "Bionics",
        ingredients: {
            "Scrap Metal": 10,
            "Partical Fuser": 1
        },
        craftingTime: 5,
    },
    {
        name: "Reactive Barbs",
        category: "Bionics",
        ingredients: {
            "Scrap Metal": 10,
            "Partical Fuser": 1
        },
        craftingTime: 5,
    },

    {
        name: "Partical Fuser",
        category: "Material",
        ingredients: {
            "Scrap Metal": 20,
            "Unstable Photon": 4
        },
        craftingTime: 5,
    },

    {
        name: 'Reaction Enhancer',
        category: 'Bionics',
        ingredients: {
            "Scrap Metal": 10,
            "Partical Fuser": 1
        },
        craftingTime: 5,
    },

    {
        name: 'Health Exchanger',
        category: 'Bionics',
        ingredients: {
            "Scrap Metal": 10,
            "Partical Fuser": 1
        },
        craftingTime: 5,
    },

    {
        name: 'Kinetic Booster',
        category: 'Bionics',
        ingredients: {
            "Scrap Metal": 3,
        },
    },

    {
        name: 'Heavy Metal Boots',
        category: 'Boots',
        ingredients: {
            "Scrap Metal": 5,
            "Partical Fuser": 1
        },
    },

    {
        name: 'Heavy Metal Gloves',
        category: 'Gloves',
        ingredients: {
            "Scrap Metal": 5,
            "Partical Fuser": 1
        },
    },

    {
        name: 'Rapid Combat Gloves',
        category: 'Gloves',
        ingredients: {
            "Scrap Metal": 3,
            "Minor Electronic Circuit": 1,
            "Partical Fuser": 1
        }
    },

    {
        name: "Focusing Helmet",
        category: "Helmets",
        ingredients: {
            "Scrap Metal": 5,
            "Partical Fuser": 1
        }
    },

    {
        name: "Spiked Reactor Shield",
        category: "Shields",
        ingredients: {
            "Scrap Metal": 5,
            "Titanium Thorn": 1,
            "Partical Fuser": 1
        }
    },

    {
        name: "Scorpion Sword",
        category: "Weapons",
        ingredients: {
            "Metal Scorpion Fang": 1,
            "Scrap Metal": 5,
            "Minor Electronic Circuit": 2,
            "Partical Fuser": 1
        }
    },

    {
        name: 'Fire Spewer Mk1',
        category: 'Weapons',
        ingredients: {
            "Flame Shell": 2,
            "Pyro Core": 1,
            "Partical Fuser": 1,
            "Scrap Metal": 5,
        }
    },

    {
        name: 'Scrap Metal Boots',
        category: 'Scrap Armor',
        ingredients: {
            "Scrap Metal": 4,
        }
    },

    {
        name: 'Scrap Metal Helmet',
        category: 'Scrap Armor',
        ingredients: {
            "Scrap Metal": 8,
        }
    },

    {
        name: 'Scrap Metal Gloves',
        category: 'Scrap Armor',
        ingredients: {
            "Scrap Metal": 4,
        }
    },

    {
        name: 'Scrap Metal Trousers',
        category: 'Scrap Armor',
        ingredients: {
            "Scrap Metal": 8,
        }
    },

    {
        name: 'Scrap Metal Chest Plate',
        category: 'Scrap Armor',
        ingredients: {
            "Scrap Metal": 10,
        }
    },

    {
        name: 'Regen Test Item',
        category: 'Scrap Armor',
        ingredients: {
            "Scrap Metal": 1,
        }
    },
    
];

// Expose recipes as a global variable
window.recipes = recipes;


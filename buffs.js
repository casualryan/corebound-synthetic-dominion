const buffs = [
    {
        name: "Haste",
        description: "Increases your attack speed.",
        type: "buff",
        statChanges: {
            attackSpeed: 2, 
        },
        duration: 60000 
    },
    {
        name: "Sharpen",
        description: "Increases kinetic damage.",
        type: "buff",
        statChanges: {
            kinetic: 5,
        },
        duration: 60000 
    },
    {
        name: "Cracked",
        description: "Lose resistances.",
        type: "buff",
        statChanges: {
            toughness: -30, 
            fortitude: -30, 
            immunity: -30, 
            heatResistance: -30, 
        },
        duration: 999999 
    }
];

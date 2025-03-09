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
            structure: -30,
            stability: -30,
            sturdiness: -30,
        },
        duration: 999999 
    },
    {
        name: "Exposed Weakness",
        description: "Lose resistances.",
        type: "debuff",
        statChanges: {
            structure: -30,
            stability: -30,
            sturdiness: -30,
        },
    }
];

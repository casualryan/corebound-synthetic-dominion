export default {
    name: "Training Dummy Mk. III",
    health: 60,
    energyShield: 10,
    attackSpeed: .8,
    criticalChance: .05,
    criticalMultiplier: 1.5,
    damageTypes: {
        kinetic: 7
    },
    defenseTypes: {
        
    },
    lootConfig: {
        baseDropChance: 0.8,
        minItems: 1,
        maxItems: 2,
        poolsByTier: {
            1: ["genericCommon"],
            2: ["genericUncommon"],
            3: ["genericRare"]
        }
    },
    currencyDrop: {
        min: 10,
        max: 15,
        dropRate: .80
    },
    experienceValue: 8,
    statusEffects: [],        
};



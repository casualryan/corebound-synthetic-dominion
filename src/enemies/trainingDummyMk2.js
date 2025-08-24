export default {
    name: "Training Dummy Mk. II",
    health: 50,
    energyShield: 0,
    attackSpeed: .8,
    criticalChance: 0,
    criticalMultiplier: 1,
    damageTypes: {
        kinetic: 5
    },
    defenseTypes: {
        sturdiness: 10,
        structure: 0,
        stability: 0
    },
    lootConfig: {
        baseDropChance: 0.65,
        minItems: 1,
        maxItems: 2,
        poolsByTier: {
            1: ["genericCommon"],
            2: ["genericUncommon"]
        }
    },
    currencyDrop: {
        min: 7,
        max: 12,
        dropRate: .65
    },
    experienceValue: 5,
    statusEffects: [],        
};



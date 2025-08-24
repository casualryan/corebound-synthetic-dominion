export default {
    name: "Training Dummy Mk. I",
    health: 30,
    energyShield: 0,
    attackSpeed: .5,
    criticalChance: 0,
    criticalMultiplier: 1,
    damageTypes: {
        kinetic: 3
    },
    defenseTypes: {
        sturdiness: 0,
        structure: 0,
        stability: 0
    },
    lootConfig: {
        baseDropChance: 0.5,
        minItems: 1,
        maxItems: 1,
        poolsByTier: {
            1: ["genericCommon"]
        }
    },
    currencyDrop: {
        min: 5,
        max: 10,
        dropRate: .5
    },
    experienceValue: 3,
    statusEffects: [], 
    description: "Found in a box in the storage room of your ship. You can likely smack this thing for some basic combat experience, and maybe even some generic parts."       
};



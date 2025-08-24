export default {
    name: "Spiderbot",
    health: 50,
    energyShield: 0,
    attackSpeed: 1,
    criticalChance: 0,
    criticalMultiplier: 1.5,
    damageTypes: {
        kinetic: 12
    },
    defenseTypes: {
        
    },
    lootConfig: {
        baseDropChance: 0.8,
        minItems: 1,
        maxItems: 3,
        poolsByTier: {
            1: ["lowRoboParts", "arachnidParts"],
            2: ["basicComponents", "genericUncommon"],
            3: ["midRobotParts", "genericRare"],
            4: ["advancedComponents"],
            5: ["epicTech"],
            6: ["legendaryComponents"]
        }
    },
    currencyDrop: {
        min: 5,
        max: 10,
        dropRate: 1
    },
    experienceValue: 10,
    statusEffects: [],        
};



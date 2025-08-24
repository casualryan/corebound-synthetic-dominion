export default {
    name: "Roachbot",
    health: 90,
    energyShield: 5,
    attackSpeed: 1.2,
    criticalChance: 0.15,
    criticalMultiplier: 2.0,
    damageTypes: {
        kinetic: 27
    },
    defenseTypes: {
        toughness: 15
    },
    lootConfig: {
        baseDropChance: 0.75,
        minItems: 1,
        maxItems: 2,
        poolsByTier: {
            1: ["lowRoboParts", "genericCommon"],
            2: ["basicComponents"],
            3: ["midRobotParts"],
            4: ["advancedComponents"],
            5: ["epicTech"],
            6: ["legendaryComponents"]
        }
    },
    currencyDrop: {
        min: 8,
        max: 15,
        dropRate: 1
    },
    experienceValue: 20,
    statusEffects: [],   
};



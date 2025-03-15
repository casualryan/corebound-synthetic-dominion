// Enemy templates
const enemies = [
    {
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
    },
    {
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
    },
    {
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
    },
    {
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
    },
    {
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
    },
    {
        name: "Scorpionbot",
        health: 220,
        energyShield: 30,
        attackSpeed: 1.2,
        criticalChance: 0.10,
        criticalMultiplier: 2.3,
        damageTypes: {
            chemical: 58,
        },
        defenseTypes: {
            toughness: 10,
            immunity: 10,
            heatResistance: -15
        },
        lootTable: [
            { itemName: "Metal Scorpion Fang", minQuantity: 1, maxQuantity: 1, dropRate: 0.05 },
        ],
        experienceValue: 80,
        statusEffects: []
    },
    {
        name: "Cactibot",
        health: 220,
        energyShield: 30,
        attackSpeed: 1.2,
        criticalChance: 0.10,
        criticalMultiplier: 1.5,
        damageTypes: {
            kinetic: 61,
        },
        defenseTypes: {
            toughness: 20,
            heatResistance: -20,
            fortitude: 50,
            immunity: 10,
        },
        lootTable: [
            { itemName: "Titanium Thorn", minQuantity: 1, maxQuantity: 1, dropRate: 0.10 },
        ],
        experienceValue: 70,
        statusEffects: []
    },
    // Add more enemies with random stats
    {
        name: "Steel Golem",
        health: 500,
        energyShield: 0,
        attackSpeed: 0.65,
        criticalChance: 0.00,
        criticalMultiplier: 2,
        damageTypes: {
            kinetic: 67
        },
        defenseTypes: {
            toughness: 30,
            heatResistance: 20,
            fortitude: 50,
            immunity: 50,
            antimagnet: -20
        },
        lootTable: [

        ],
        lootConfig: {
            baseDropChance: 0.9,
            minItems: 2,
            maxItems: 4,
            poolsByTier: {
                1: ["lowRoboParts", "genericCommon"],
                2: ["basicComponents"],
                3: ["midRobotParts", "genericRare"],
                4: ["advancedComponents"],
                5: ["epicTech"],
                6: ["legendaryComponents"]
            }
        },
        experienceValue: 100,
        statusEffects: []
    },
    {
        name: "Awakened Steel Golem",
        health: 800,
        energyShield: 0,
        attackSpeed: 0.75,
        criticalChance: 0.00,
        criticalMultiplier: 2,
        damageTypes: {
            kinetic: 88
        },
        defenseTypes: {
            toughness: 35,
            heatResistance: 30,
            fortitude: 70,
            immunity: 70,
            antimagnet: -30
        },
        lootTable: [
        ],
        experienceValue: 100,
        statusEffects: []
    },
    {
        name: "Electro Wasp",
        health: 150,
        energyShield: 10,
        attackSpeed: 1.5,
        criticalChance: 0.10,
        criticalMultiplier: 2,
        damageTypes: {
            kinetic: 30,
            electric: 10
        },
        defenseTypes: {
            toughness: 10,
            antimagnet: 10
        },
        lootTable: [
            { itemName: "Crystalized Light", minQuantity: 2, maxQuantity: 3, dropRate: .80 },
            { itemName: "Partical Fuser", minQuantity: 1, maxQuantity: 1, dropRate: 0.5 }
        ],
        experienceValue: 55,
        statusEffects: []
    },
    {
        name: "Pyro Beetle",
        health: 330,
        energyShield: 50,
        attackSpeed: 1.35,
        criticalChance: 0.15,
        criticalMultiplier: 2.0,
        damageTypes: {
            pyro: 99
        },
        defenseTypes: {
            toughness: 15,
            heatResistance: 50,
            fortitude: 20,
        },
        lootTable: [
            { itemName: "Flame Shell", minQuantity: 1, maxQuantity: 1, dropRate: 0.15 },
            { itemName: "Pyro Core", minQuantity: 1, maxQuantity: 1, dropRate: 0.1 },

        ],
        experienceValue: 65,
        statusEffects: []
    },
    {
        name: "Knight O'Hare",
        health: 1500,
        energyShield: 40,
        attackSpeed: 2,
        criticalChance: 0.3,
        criticalMultiplier: 2.0,
        damageTypes: {
            kinetic: 150,
        },
        defenseTypes: {
            toughness: 40,
            heatResistance: 40,
            fortitude: 40,
            immunity: 60,
            antimagnet: 10
        },
        lootTable: [            
            
        ],
        experienceValue: 500,
        statusEffects: []
    },
    {
        name: "Screeching Drone",
        health: 75,
        energyShield: 25,
        attackSpeed: 1.2,
        criticalChance: 0.05,
        criticalMultiplier: 1.5,
        damageTypes: {
            slashing: 10,
            electric: 5
        },
        defenseTypes: {
            sturdiness: 5,
            structure: 15,
            stability: 10
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
    },
    {
        name: "Super Screeching Drone",
        health: 130,
        energyShield: 60,
        attackSpeed: 1.5,
        criticalChance: 0.1,
        criticalMultiplier: 1.5,
        damageTypes: {
            slashing: 20,
            electric: 15,
            pyro: 10
        },
        defenseTypes: {
            sturdiness: 15,
            structure: 25,
            stability: 15
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
    },
    {
        name: "Combat Robot",
        health: 150,
        energyShield: 30,
        attackSpeed: 0.8,
        criticalChance: 0.05,
        criticalMultiplier: 2,
        damageTypes: {
            kinetic: 15,
            electric: 10
        },
        defenseTypes: {
            sturdiness: 20,
            structure: 15,
            stability: 5
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
    },
    {
        name: "Pyro Bot",
        health: 90,
        energyShield: 10,
        attackSpeed: 1,
        criticalChance: 0.05,
        criticalMultiplier: 1.5,
        damageTypes: {
            pyro: 25,
            kinetic: 5
        },
        defenseTypes: {
            sturdiness: 15,
            structure: 25,
            stability: 0
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
    },
    {
        name: "Acid Spitter",
        health: 80,
        energyShield: 0,
        attackSpeed: 0.9,
        criticalChance: 0.1,
        criticalMultiplier: 1.8,
        damageTypes: {
            corrosive: 20,
            radiation: 10
        },
        defenseTypes: {
            sturdiness: 5,
            structure: 10,
            stability: 30
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
    },
    {
        name: "Ice Elemental",
        health: 100,
        energyShield: 50,
        attackSpeed: 0.7,
        criticalChance: 0.2,
        criticalMultiplier: 1.5,
        damageTypes: {
            cryo: 30,
            electric: 5
        },
        defenseTypes: {
            sturdiness: 10,
            structure: 30,
            stability: 10
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
    },
    // Continue adding enemies as needed
];

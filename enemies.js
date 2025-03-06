// enemies.js

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
            
        },
        lootTable: [

        ],
        currencyDrop: {
            min: 5,
            max: 10,
            dropRate: .5
        },
        experienceValue: 3,
        statusEffects: [],        
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
            
        },
        lootTable: [
            { itemName: "Broken Phase Sword", minQuantity: 1, maxQuantity: 2, dropRate: 1 },
        ],
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
        lootTable: [
            { itemName: "Scrap Metal", minQuantity: 1, maxQuantity: 2, dropRate: 1 },
        ],
        currencyDrop: {
            min: 10,
            max: 16,
            dropRate: .5
        },
        experienceValue: 11,
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
        lootTable: [
            { itemName: "Synthetic Poison Gland", minQuantity: 1, maxQuantity: 2, dropRate: .15 },
            { itemName: "Unstable Photon", minQuantity: 1, maxQuantity: 1, dropRate: .02 },
            { itemName: "Minor Electronic Circuit", minQuantity: 1, maxQuantity: 1, dropRate: .05 },
            { itemName: "Broken Poison Pistol", minQuantity: 1, maxQuantity: 1, dropRate: .005 }
        ],
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
        lootTable: [
            { itemName: "Crystalized Light", minQuantity: 1, maxQuantity: 2, dropRate: 0.10 },
            { itemName: "Partical Fuser", minQuantity: 1, maxQuantity: 1, dropRate: 0.02 },
            { itemName: "Minor Electronic Circuit", minQuantity: 1, maxQuantity: 1, dropRate: 0.05 }
        ],
        experienceValue: 60,
        statusEffects: []
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
            kinetic: 50,
            magnetic: 10
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
    // Continue adding enemies as needed
];

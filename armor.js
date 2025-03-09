const armor = [
    {
        name: "Metal Carapace",
        type: "Armor",
        icon: "icons/heavy_armor.png",
        damageTypes: {},
        attackSpeed: -0.2,  // -20% attack speed (due to weight)
        criticalChance: 0,
        criticalMultiplier: 0,
        defenseTypes: {
            sturdiness: { min: 20, max: 30 },  // Physical defense
            structure: { min: 10, max: 10 },   // Elemental defense
            stability: { min: 10, max: 10 }    // Chemical defense
        },
        healthBonus: { min: 50, max: 100 },
        healthBonusPercentRange: { min: 15, max: 20 },
        slot: 'chest',
        isDisassembleable: true,
        disassembleResults: [
            {
                name: 'Scrap Metal', quantity: 3
            },
        ],
        effects: [
            {
                trigger: 'whenHit',
                chance: 0.1, // 10% chance
                action: 'heal',
                parameters: {
                    amount: 30
                }
            },
            {
                trigger: 'whenHit',
                chance: 0.25, // 10% chance
                action: 'dealDamage',
                parameters: {
                    damageType: 'kinetic',
                    amount: 15,
                    ignoreDefenses: true
                }
            }
        ],
        description: '10% chance when hit to gain 30 life. 25% chance when hit to deal 15 Kinetic damage, ignoring defenses.'
    },

    {
        name: "Photon Inhibitor Shield",
        type: "Armor",
        icon: "icons/energy_shield.png",
        damageTypes: {},
        attackSpeed: 0,
        criticalChance: 0,
        criticalMultiplier: 0,
        defenseTypes: {
            structure: { min: 30, max: 40 }, // Good against Elemental (pyro, cryo, electric)
            stability: { min: 10, max: 15 }, // Some Chemical resistance
            sturdiness: { min: 5, max: 10 }  // Minor Physical resistance
        },
        energyShieldBonus: { min: 100, max: 150 },
        energyShieldBonusPercentRange: { min: 10, max: 15 },
        slot: 'offHand',
        isDisassembleable: true,
        disassembleResults: [
            {
                name: 'Unstable Photon', quantity: 1
            },
        ],
        description: 'Defensive shield, increases Energy Shield, Health, and Defenses.'
    },

    {
        name: "Heavy Metal Boots",
        type: "Boots",
        icon: "icons/heavy_metal_boots.png",
        defenseTypes: {
            toughness: { min: 5, max: 10 },
            immunity: { min: 5, max: 10 },
            antimagnet: { min: 5, max: 10 }
        },
        healthBonus: { min: 30, max: 30 },
        healthBonusPercentRange: { min: 10, max: 15 },
        deflection: { min: 3, max: 3 },
        slot: 'feet',
        isDisassembleable: true,
        disassembleResults: [
            {
                name: 'Scrap Metal', quantity: 2
            },
        ],
        description: 'Defensive boots.'
    },

    {
        name: "Heavy Metal Gloves",
        type: "Gloves",
        icon: "icons/heavy_metal_gloves.png",
        defenseTypes: {
            toughness: { min: 5, max: 10 },
            immunity: { min: 5, max: 10 },
            antimagnet: { min: 5, max: 10 }
        },
        healthBonus: { min: 30, max: 30 },
        healthBonusPercentRange: { min: 10, max: 15 },
        deflection: { min: 3, max: 3 },
        slot: 'gloves',
        isDisassembleable: true,
        disassembleResults: [
            {
                name: 'Scrap Metal', quantity: 2
            },
        ],
        description: 'Defensive gloves.'
    },

    {
        name: "Rapid Combat Gloves",
        type: "Gloves",
        icon: "icons/rapid_strike_gloves.png",
        attackSpeedModifierRange: { min: 30, max: 40 },
        precision: { min: 3, max: 3 },
        deflection: { min: 3, max: 3 },
        slot: 'gloves',
        isDisassembleable: true,
        disassembleResults: [
            {
                name: 'Scrap Metal', quantity: 2
            },
        ],
        description: 'Offensive Gloves.'
    },

    {
        name: "Focusing Helmet",
        type: "Helmet",
        icon: "icons/focusing_helmet.png",
        defenseTypes: {
            fortitude: { min: 5, max: 5 },
            immunity: { min: 5, max: 5 },
            antimagnet: { min: 5, max: 5 },
            chemical: { min: 5, max: 5 },
            heatResistance: { min: 5, max: 5 }
        },
        healthBonus: { min: 20, max: 20 },
        healthBonusPercentRange: { min: 8, max: 10 },
        precision: { min: 5, max: 5 },
        slot: 'head',
        isDisassembleable: true,
        disassembleResults: [
            {
                name: 'Scrap Metal', quantity: 2
            },
        ],
        description: 'Light defensive helmet, adds some Precision.'
    },

    {
        name: "Spiked Reactor Shield",
        type: "Shield",
        icon: "icons/spiked_reactor_shield.png",
        defenseTypes: {
            toughness: { min: 5, max: 5 },
            heatResistance: { min: 5, max: 5 },
            immunity: { min: 5, max: 5 },
            fortitude: { min: 5, max: 5 },
            antimagnet: { min: 5, max: 5 }
        },
        effects: [
            {
                trigger: 'whenHit',
                chance: 0.2,
                action: 'dealDamage',
                parameters: {
                    damageType: 'kinetic',
                    amount: 20,
                    ignoreDefenses: true
                }
            }
        ],
        slot: 'offHand',
        isDisassembleable: true,
        disassembleResults: [
            {
                name: 'Titanium Thorn', quantity: 3
            },
        ],
        description: '20% chance when hit to deal 20 Kinetic damage, ignoring defense.'
    },

    {
        name: "Big 'Ol Bucket",
        type: 'Helmet',
        icon: 'icons/big_ol_bucket.png',
        defenseTypes: {
            toughness: { min: 20, max: 20 },
            heatResistance: { min: 20, max: 20 },
            immunity: { min: 10, max: 10 },
            fortitude: { min: 20, max: 20 },    
            antimagnet: { min: -10, max: -10 }
        },
        slot: 'head',
        isDisassembleable: true,
        disassembleResults: [
            {
                name: 'Scrap Metal', quantity: 1
            },
        ],
        effects: [
                {
                trigger: 'whenHit',
                chance: 0.1,
                action: 'applyBuff',
                parameters: {
                    buff: 'Cracked',
                }
            }
        ],     
        description: 'A large metal bucket. May crack when damaged.'
    },

    {
        name: 'Scrap Metal Boots',
        type: 'Boots',
        icon: 'icons/iron_boots.png',
        healthBonus: { min: 15, max: 15 },
        healthBonusPercentRange: { min: 10, max: 10 },
        slot: 'feet',
        isDisassembleable: false,
        disassembleResults: [],
        description: "Metal boots fashioned from discarded scrap."
    },

    {
        name: 'Scrap Metal Helmet',
        type: 'Helmet',
        icon: 'icons/iron_helmet.png',
        healthBonus: { min: 20, max: 20 },
        healthBonusPercentRange: { min: 15, max: 15 },
        slot: 'head',
        isDisassembleable: false,
        disassembleResults: [],
        description: "Metal helmet fashioned from discarded scrap."
    },

    {
        name: 'Scrap Metal Gloves',
        type: 'Gloves',
        icon: 'icons/iron_gloves.png',
        healthBonus: { min: 10, max: 10 },
        healthBonusPercentRange: { min: 8, max: 8 },
        slot: 'gloves',
        isDisassembleable: false,
        disassembleResults: [],
        description: "Metal gloves fashioned from discarded scrap."
    },

    {
        name: 'Scrap Metal Trousers',
        type: 'Trousers',
        icon: 'icons/iron_pants.png',
        healthBonus: { min: 20, max: 20 },
        healthBonusPercentRange: { min: 15, max: 15 },
        slot: 'legs',
        isDisassembleable: false,
        disassembleResults: [],
        description: "Metal trousers fashioned from discarded scrap."
    },

    {
        name: 'Scrap Metal Chest Plate',
        type: 'Chest',
        icon: 'icons/iron_gloves.png',
        healthBonus: { min: 30, max: 30 },
        healthBonusPercentRange: { min: 30, max: 30 },
        slot: 'chest',
        isDisassembleable: false,
        disassembleResults: [],
        description: "Metal chest plate fashioned from discarded scrap."
    },

    {
        name: 'Regen Test Item',
        type: 'offHand',
        icon: 'icons/iron_gloves.png',
        healthRegen: { min: 2, max: 2 },
        slot: 'offHand',
        isDisassembleable: false,
        disassembleResults: [],
        description: "Metal chest plate fashioned from discarded scrap."
    },

    {
        name: "Light Armor",
        type: "Armor",
        icon: "icons/light_armor.png",
        damageTypes: {},
        attackSpeed: 0,
        defenseTypes: {
            sturdiness: { min: 15, max: 20 },
            structure: { min: 5, max: 10 },
            stability: { min: 5, max: 10 }
        },
        healthBonus: { min: 50, max: 100 },
        healthBonusPercentRange: { min: 15, max: 20 },
        slot: 'chest',
        isDisassembleable: true,
        disassembleResults: [
            {
                name: 'Scrap Metal', quantity: 3
            },
        ],
        effects: [
            {
                trigger: 'whenHit',
                chance: 0.1, // 10% chance
                action: 'heal',
                parameters: {
                    amount: 30
                }
            },
            {
                trigger: 'whenHit',
                chance: 0.25, // 10% chance
                action: 'dealDamage',
                parameters: {
                    damageType: 'kinetic',
                    amount: 15,
                    ignoreDefenses: true
                }
            }
        ],
        description: '10% chance when hit to gain 30 life. 25% chance when hit to deal 15 Kinetic damage, ignoring defenses.'
    },

    {
        name: "Stealth Suit",
        type: "Armor",
        icon: "icons/stealth_armor.png",
        damageTypes: {},
        attackSpeed: 0.1,  // +10% attack speed
        defenseTypes: {
            sturdiness: { min: 5, max: 10 },
            structure: { min: 10, max: 15 },
            stability: { min: 5, max: 10 }
        },
        healthBonus: { min: 50, max: 100 },
        healthBonusPercentRange: { min: 15, max: 20 },
        slot: 'chest',
        isDisassembleable: true,
        disassembleResults: [
            {
                name: 'Scrap Metal', quantity: 3
            },
        ],
        effects: [
            {
                trigger: 'whenHit',
                chance: 0.1, // 10% chance
                action: 'heal',
                parameters: {
                    amount: 30
                }
            },
            {
                trigger: 'whenHit',
                chance: 0.25, // 10% chance
                action: 'dealDamage',
                parameters: {
                    damageType: 'kinetic',
                    amount: 15,
                    ignoreDefenses: true
                }
            }
        ],
        description: '10% chance when hit to gain 30 life. 25% chance when hit to deal 15 Kinetic damage, ignoring defenses.'
    },

    {
        name: "Heavy Gauntlets",
        type: "Armor",
        icon: "icons/heavy_gauntlets.png",
        damageTypes: {
            kinetic: { min: 3, max: 6 }
        },
        defenseTypes: {
            sturdiness: { min: 10, max: 15 }
        },
        healthBonus: { min: 30, max: 30 },
        healthBonusPercentRange: { min: 10, max: 15 },
        slot: 'gloves',
        isDisassembleable: true,
        disassembleResults: [
            {
                name: 'Scrap Metal', quantity: 2
            },
        ],
        description: 'Defensive gloves.'
    },

    {
        name: "Thermal Insulated Boots",
        type: "Armor",
        icon: "icons/thermal_boots.png",
        defenseTypes: {
            structure: { min: 15, max: 25 } // Good against pyro, cryo, electric
        },
        healthBonus: { min: 30, max: 30 },
        healthBonusPercentRange: { min: 10, max: 15 },
        slot: 'feet',
        isDisassembleable: true,
        disassembleResults: [
            {
                name: 'Scrap Metal', quantity: 2
            },
        ],
        description: 'Defensive boots.'
    },

    {
        name: "Anti-Radiation Helmet",
        type: "Armor",
        icon: "icons/anti_radiation_helmet.png",
        defenseTypes: {
            stability: { min: 20, max: 30 } // Good against corrosive, radiation
        },
        healthBonus: { min: 20, max: 20 },
        healthBonusPercentRange: { min: 8, max: 10 },
        slot: 'head',
        isDisassembleable: true,
        disassembleResults: [
            {
                name: 'Scrap Metal', quantity: 2
            },
        ],
        description: 'Light defensive helmet, adds some Precision.'
    }
];

// Export the armor array
window.armor = armor; 
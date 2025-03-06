// const newItemTemplate = {
//     name: "",                      // String: The name of the item
//     type: "",                      // String: The type of item (e.g., "Weapon", "Armor", "Accessory")
//     weaponType: "",                // String: (Optional) The weapon type (e.g., "Sword", "Bow"). Only for weapons.
//     icon: "",                      // String: Path to the item's icon image
//     description: "",               // String: (Optional) Description of the item

//     // Flat Damage Types
//     damageTypes: {
//         // Example:
//         // kinetic: { min: 5, max: 10 },
//         // pyro: { min: 3, max: 7 }
//     },

//     // Percentage Damage Modifiers
//     statModifiers: {
//         damageTypes: {
//             // Example:
//             // kinetic: { min: 5, max: 15 }, // Percentage increase to kinetic damage
//             // pyro: { min: 5, max: 10 }     // Percentage increase to pyro damage
//         },
//         // Additional stat modifiers can be added here
//     },

//     // Defense Types
//     defenseTypes: {
//         // Example:
//         // toughness: { min: 10, max: 20 },
//         // fortitude: { min: 5, max: 15 }
//     },

//     // Attack Speed Modifier
//     attackSpeedModifierRange: { min: 0, max: 0 }, // Percentage (integers). Negative values for slower attack speed.

//     // Critical Chance Modifier
//     criticalChanceModifierRange: { min: 0, max: 0 }, // Percentage (integers)

//     // Critical Multiplier Modifier
//     criticalMultiplierModifierRange: { min: 0, max: 0 }, // Percentage (integers)

//     // Health Bonuses
//     healthBonus: { min: 0, max: 0 },                  // Flat increase to health
//     healthBonusPercentRange: { min: 0, max: 0 },      // Percentage increase to health (integers)

//     // Energy Shield Bonuses
//     energyShieldBonus: { min: 0, max: 0 },            // Flat increase to energy shield
//     energyShieldBonusPercentRange: { min: 0, max: 0 },// Percentage increase to energy shield (integers)

//     // Other Possible Properties
//     levelRequirement: 1,           // Number: Level required to equip the item
//     slot: "",                      // String: The equipment slot (e.g., "mainHand", "chest", "feet")

//     // Special Effects
//     specialEffects: [
//         // Array of special effect objects
//         // {
//         //     name: "Fireball",
//         //     chance: 0.1, // 10% chance to trigger
//         //     applyEffect: function(target) { /* effect logic */ }
//         // }
//     ],

//     // Additional Custom Properties
//     // Add any other custom properties relevant to your game
// };



// {
//     name: "",
//     type: "",
//     weaponType: "",
//     icon: "",
//     description: "",
//     damageTypes: {

//         // kinetic: { min: 5, max: 10 },
//     },
//     statModifiers: {
//         damageTypes: {

//             // kinetic: { min: 5, max: 15 },
//         },
//     },
//     defenseTypes: {

//         // toughness: { min: 10, max: 20 },
//     },
//     attackSpeedModifierRange: { min: 0, max: 0 },
//     criticalChanceModifierRange: { min: 0, max: 0 },
//     criticalMultiplierModifierRange: { min: 0, max: 0 },
//     healthBonus: { min: 0, max: 0 },
//     healthBonusPercentRange: { min: 0, max: 0 },
//     energyShieldBonus: { min: 0, max: 0 },
//     energyShieldBonusPercentRange: { min: 0, max: 0 },
//     levelRequirement: 1,
//     slot: "",
//     specialEffects: [     ],
//     isDisassembleable: true,
//     disassembleResults: [
//         {
//             name: 'FILL THIS', quantity: 1
//         },
//     ],
// },


const items = [

    //Weapons

    {
        name: "Broken Phase Sword",
        type: "Weapon",
        weaponType: "Sword",
        icon: "icons/ironsword.png",
        bAttackSpeed: 2,
        damageTypes: {
            kinetic: { min: 3, max: 6 }, // Flat Damage
            mental: { min: 3, max: 6 }
        },
        statModifiers: {
            damageTypes: {
                kinetic: { min: 10, max: 20 }, // Percent Damage
            },
        },
        attackSpeedModifierRange: { min: 5, max: 10 },
        criticalChanceModifierRange: { min: 10, max: 20 },
        criticalMultiplierModifierRange: { min: 10, max: 20 },
        deflection: { min: 5, max: 5 },
        defenseTypes: {},
        slot: 'mainHand',
        passiveBonuses: {
            "Swift Strikes": 1 // +1 to Swift Strikes passive
        },
        disassembleResults: [
            {
                name: 'Scrap Metal', quantity: 1
            },
        ],
        isDisassembleable: true,
        effects: [
            {
                trigger: 'onHit', // or 'whenHit', 'onHit', etc.
                chance: .2, // 20% chance
                action: 'dealDamage',
                parameters: {
                    damageType: 'kinetic',
                    amount: 5,
                }
            }
        ],
        description: '20% chance on hit to deal 5 kinetic damage, ignoring defense.'
    },

    {
        name: 'Poison Pistol',
        type: "Weapon",
        weaponType: "Pistol",
        icon: "icons/poison_pistol.png",
        slot: 'mainHand',
        damageTypes: {
            chemical: { min: 12, max: 25 },
        },
        statModifiers: {
            damageTypes: {
                chemical: { min: 30, max: 35 },
            },
        },
        attackSpeedModifierRange: { min: 50, max: 75 },
        disassembleResults: [
            {name: 'Synthetic Poison Gland', quantity: 1,},
            {name: 'Minor Electronic Circuit', quantity: 1},
        ],
        isDisassembleable: true,
        description: 'Made from Synthetic Poison parts harvested from various arachnid-bots'
    },

    {
        name: "Scorpion Sword",
        type: "Weapon",
        weaponType: "Sword",
        icon: "icons/scorpion_sword.png",
        damageTypes: {
            kinetic: { min: 30, max: 40 },
            chemical: { min: 15, max: 25 }
        },
        statModifiers: {
            damageTypes: {
                kinetic: { min: 19, max: 30 },
                chemical: { min: 15, max: 25 }
            },
        },
        attackSpeedModifierRange: { min: 15, max: 25 },
        criticalChanceModifierRange: { min: 20, max: 20 },
        defenseTypes: {},
        effects: [
            {
                trigger: 'onHit',
                chance: .25,
                action: 'dealDamage',
                parameters: {
                    damageType: 'chemical',
                    amount: 15,
                    ignoreDefense: true
                }
            }
        ],
        slot: 'mainHand',
        disassembleResults: [
            {
                name: 'Metal Scorpion Fang', quantity: 1
            },
        ],
        description: '25% chance on hit to deal 15 Chemical damage, ignoring defense.',
        isDisassembleable: true,
    },

    {
        name: "Laser Sword",
        type: "Weapon",
        weaponType: "Sword",
        icon: "icons/lasersword.png",
        damageTypes: {
            kinetic: { min: 12, max: 25 },
        },
        statModifiers: {
            damageTypes: {
                kinetic: { min: 10, max: 25 },
            },
        },
        attackSpeedModifierRange: { min: 10, max: 30 },
        criticalChanceModifierRange: { min: 20, max: 40 },
        criticalMultiplierModifierRange: { min: 5, max: 15 },
        defenseTypes: {},
        effects: [
            {
                trigger: 'onHit',
                chance: .3,
                action: 'dealDamage',
                parameters: {
                    damageType: 'kinetic',
                    amount: 10,
                    ignoreDefense: true
                } 
            },
            {
                trigger: 'onHit',
                chance: .3,
                action: 'dealDamage',
                parameters: {
                    damageType: 'magnetic',
                    amount: 10,
                    ignoreDefense: true
                }
            }
        ],
        slot: 'mainHand',
        disassembleResults: [
            { name: 'Crystalized Light', quantity: 1 },
            { name: 'Minor Electronic Circuit', quantity: 1 }
        ],
        description: '30% chance on hit to deal 10 Kinetic, or 10 Magnetic damage, or both, ignoring defense.',
        isDisassembleable: true,
    },

    {
        name: "Fire Spewer Mk1",
        type: "Weapon",
        weaponType: "Pistol",
        icon: "icons/flame_thrower.png",
        slot: 'mainHand',
        damageTypes: {
            pyro: { min: 17, max: 25 },
        },
        statModifiers: {
            damageTypes: {
                pyro: { min: 40, max: 45 },
            },
        },
        attackSpeedModifierRange: { min: 200, max: 275 },
        defenseTypes: {},
        disassembleResults: [
            { name: 'Flame Shell', quantity: 1 },
            { name: 'Pyro Core', quantity: 1 }
        ],
        isDisassembleable: true,
        description: 'Rapidly spews fire at enemies, dealing Pyro damage.'
    },

    {
        name: "O'Hare's Dementia",
        type: "Weapon",
        weaponType: "Shotgun",
        icon: "icons/dementia.png",
        slot: 'mainHand',
        bAttackSpeed: 1.25, // Base Attack Speed
        damageTypes: {
            mental: { min: 210, max: 270
        }
        },
        statModifiers: {
            damageTypes: {
                mental: { min: 100, max: 125 },
            },
        },
        effects: [
            {
                trigger: 'onHit',
                chance: 1,
                action: 'dealDamage',
                parameters: {
                    damageType: 'mental',
                    amount: 200,
                    ignoreDefense: true
                }
            }
        ],
        slot: 'mainHand',
        disassembleResults: [
            { name: 'Minor Electronic Circuit', quantity: 1 }, // To Be Changed
            { name: 'Pyro Core', quantity: 1 } // To Be Changed
        ],
        isDisassembleable: true,
        description: "O'Hare was lost. With this, he found himself."
    },

    {
        name: "Electro Blaster",
        type: "Weapon",
        weaponType: "Pistol",
        icon: "icons/eblaster.png",
        slot: 'mainHand',
        damageTypes: { kinetic: 5 },
        attackSpeed: 0,
        criticalChance: 0,
        criticalMultiplier: 0,
        defenseTypes: {},
        specialEffect: {
            name: 'Zap',
            chance: 0.25,
            applyEffect: function (target) {
                // Apply Zapped status effect
                applyStatusEffect(target, 'Zapped');
                // Deal 10 Mental Damage upon application
                let damageTypes = { mental: 10 };
                applyDamage(target, 0, target.name, damageTypes);
                logMessage(`${target.name} takes 10 Mental Damage from Zap effect!`);
            }
        },
        isDisassembleable: true,
        disassembleResults: [
            {
                name: 'Minor Electronic Circuit', quantity: 1
            },
        ],
    },

    {
        name: "Broken Poison Pistol",
        type: "Weapon",
        weaponType: "Pistol",
        icon: "icons/poison_pistol.png",
        damageTypes: {
            chemical: { min: 3, max: 6 },
        },
        defenseTypes: {},
        slot: 'mainHand',
        disassembleResults: [
            { name: 'Minor Electronic Circuit', quantity: 1 },
            { name: 'Scrap Metal', quantity: 1 },
            { name: 'Synthetic Poison Gland', quantity: 1 }
        ],
        isDisassembleable: true,
    },

    // Armor

    {
        name: "Metal Carapace",
        type: "Armor",
        icon: "icons/heavy_armor.png",
        damageTypes: {},
        attackSpeed: -0.2,  // -20% attack speed (due to weight)
        criticalChance: 0,
        criticalMultiplier: 0,
        defenseTypes: {
            toughness: { min: 20, max: 30 },
            fortitude: { min: 10, max: 10 },
            heatResistance: { min: 10, max: 10 },
            immunity: { min: 10, max: 10 },
            antimagnet: { min: 10, max: 10 }
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
        type: "Shield",
        icon: "icons/photon_inhibitor_shield.png",
        defenseTypes: {
            toughness: { min: 10, max: 15 },
            heatResistance: { min: 10, max: 15 },
            immunity: { min: 10, max: 15 },
            fortitude: { min: 10, max: 15 },
            antimagnet: { min: 10, max: 15 }
        },
        healthBonus: { min: 10, max: 30 },
        healthBonusPercentRange: { min: 5, max: 5 },
        energyShieldBonus: { min: 30, max: 50 },
        energyShieldBonusPercentRange: { min: 15, max: 15 },
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

    // Bionics

    {
        name: 'Epidermis Alloy',
        type: 'Bionic',
        icon: 'icons/epidermis_alloy.png',
        defenseTypes: {
            toughness: { min: 20, max: 20 },
            immunity: { min: 20, max: 20 },
            heatResistance: { min: 5, max: 5 },
            antimagnet: { min: -10, max: -10 }
        },
        slot: 'bionic',
        isDisassembleable: true,
        disassembleResults: [
            {
                name: 'Scrap Metal', quantity: 1
            },
        ],
        description: 'Increases Toughness, Immunity, and Heat Resistance, but decreases Antimagnet.'
    },
    {
        name: 'Health Enhancer',
        type: 'Bionic',
        icon: 'icons/healthenhancer.png',
        healthBonusPercentRange: { min: 20, max: 25 },
        slot: 'bionic',
        isDisassembleable: true,
        disassembleResults: [
            {
                name: 'Scrap Metal', quantity: 1
            },
        ],
        description: 'Increases Max Health.'
    },

    {
        name: 'Reactive Barbs',
        type: 'Bionic',
        icon: 'icons/reactive_barbs.png',
        slot: 'bionic',
        effects: [
            {
                trigger: 'whenHit',
                chance: 100,
                action: 'dealDamage',
                parameters: {
                    damageType: 'kinetic',
                    amount: 2,
                    ignoreDefenses: true
                }
            },
        ],
        isDisassembleable: true,
        disassembleResults: [
            {
                name: 'Scrap Metal', quantity: 1
            },
        ],
        description: 'When hit, deal 2 Kinetic damage to the target.'
    },

    {
        name: 'Reaction Enhancer',
        type: 'Bionic',
        icon: 'icons/reactionenhancer.png',
        slot: 'bionic',
        attackSpeedModifierRange: { min: 20, max: 35 },
        isDisassembleable: true,
        disassembleResults: [
            {
                name: 'Scrap Metal', quantity: 1
            },
        ],
        isDisassembleable: true,
        disassembleResults: [
            {
                name: 'Scrap Metal', quantity: 1
            },
        ],
        description: 'Increases Attack Speed by 20%-35%.'
    },

    {
        name: 'Health Exchanger',
        type: 'Bionic',
        icon: 'icons/healthexchanger.png',
        slot: 'bionic',
        healthBonus: { min: -30, max: -10 },
        healthBonusPercentRange : { min: -10, max: -15 },
        energyShieldBonus: { min: 50, max: 60 },
        energyShieldBonusPercentRange: { min: 10, max: 15 },
        isDisassembleable: true,
        disassembleResults: [
            {
                name: 'Scrap Metal', quantity: 1
            },
        ],
        description: 'Decreases Max Health by 10-30, but increases Max Energy Shield by 40-60 + 10%.'
    },
    {
        name: 'Kinetic Booster',
        type: 'Bionic',
        icon: 'icons/kinetic_booster.png',
        slot: 'bionic',
        statModifiers: {
            damageTypes: {
                kinetic: { min: 50, max: 100 },
            },
        },
        isDisassembleable: true,
        disassembleResults: [
            {
                name: 'Scrap Metal', quantity: 1
            },
        ],
        description: 'Increases Kinetic Damage Multiplier.'
    },

    // Scrap Metal Set

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


    // Gathering Items
    {
        name: 'Scrap Metal',
        type: 'Material',
        icon: 'icons/iron_ore.png',
        slot: 'material',
        stackable: true,
        isDisassembleable: false,
    },
    {
        name: 'Titanium',
        type: 'Material',
        icon: 'icons/titanium.png',
        slot: 'Material',
        stackable: true,
        isDisassembleable: false,
    },

    //Crafting items

    {
        name: 'Minor Electronic Circuit',
        type: 'material',
        icon: 'icons/minor_electronic_circuit.png',
        slot: 'Material',
        stackable: true,
        isDisassembleable: false,
        disassembleResults: [],
    },

    {
        name: 'Unstable Photon',
        type: 'material',
        icon: 'icons/unstable_photon.png',
        slot: 'Material',
        stackable: true,
        isDisassembleable: false,
        disassembleResults: [],
    },

    {
        name: "Synthetic Poison Gland",
        type: 'material',
        icon: 'icons/synthetic_poison_gland.png',
        slot: 'Material',
        stackable: true,
        isDisassembleable: false,
        disassembleResults: [],
    },

    {
        name: 'Crystalized Light',
        type: 'material',
        icon: 'icons/crystalized_light.png',
        slot: 'Material',
        stackable: true,
        isDisassembleable: false,
        disassembleResults: [],
    },

    {
        name: 'Partical Fuser',
        type: 'material',
        icon: 'icons/partical_fuser.png',
        slot: 'Material',
        stackable: true,
        isDisassembleable: false,
        disassembleResults: [],
        description: 'Crafting Material for advanced technology.'
    },
    {
        name: 'Titanium Thorn',
        type: 'material',
        icon: 'icons/titanium_thorn.png',
        slot: 'Material',
        stackable: true,
        isDisassembleable: false,
        disassembleResults: [],
    },
    {
        name: 'Metal Scorpion Fang',
        type: 'material',
        icon: 'icons/metal_scorpion_fang.png',
        slot: 'Material',
        stackable: true,
        isDisassembleable: false,
        disassembleResults: [],
    },

    {
        name: 'Flame Shell',
        type: 'material',
        icon: 'icons/flame_shell.png',
        slot: 'Material',
        stackable: true,
        isDisassembleable: false,
        disassembleResults: [],
    },

    {
        name: 'Pyro Core',
        type: 'material',
        icon: 'icons/pyro_core.png',
        slot: 'Material',
        stackable: true,
        isDisassembleable: false,
        disassembleResults: [],
    },

    // {
    //     name: 'Big Ol Bucket',
    //     type: 'material',
    //     icon: 'icons/big_ol_bucket.png',
    //     slot: 'Material',
    //     stackable: true,
    //     isDisassembleable: false,
    //     disassembleResults: [],
    // }


];

// Expose items as a global variable
window.items = items;

const weapons = [
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
    }
];

// Export the weapons array
window.weapons = weapons; 
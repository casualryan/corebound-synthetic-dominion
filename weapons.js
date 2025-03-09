const weapons = [
    {
        name: "Broken Phase Sword",
        type: "Weapon",
        weaponType: "Sword",
        icon: "icons/ironsword.png",
        bAttackSpeed: 2,
        damageTypes: {
            kinetic: { min: 3, max: 6 },
            slashing: { min: 3, max: 6 }
        },
        statModifiers: {
            damageTypes: {
                kinetic: { min: 10, max: 20 }, // Specific damage type modifier
            },
            damageGroups: {
                physical: { min: 5, max: 15 } // Group modifier for physical damage
            }
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
                trigger: 'onHit',
                chance: .2, // 20% chance
                action: 'dealDamage',
                parameters: {
                    damageType: 'kinetic',
                    amount: 5,
                }
            }
        ],
        description: '20% chance on hit to deal 5 kinetic damage, ignoring defense. Adds bonus physical damage.'
    },

    {
        name: 'Elemental Staff',
        type: "Weapon",
        weaponType: "Staff",
        icon: "icons/staff.png",
        bAttackSpeed: 1.5,
        damageTypes: {
            pyro: { min: 10, max: 15 },
            electric: { min: 5, max: 10 }
        },
        statModifiers: {
            damageTypes: {
                pyro: { min: 15, max: 25 },
            },
            damageGroups: {
                elemental: { min: 20, max: 30 } // Group modifier for all elemental damage
            }
        },
        criticalChanceModifierRange: { min: 10, max: 15 },
        criticalMultiplierModifierRange: { min: 20, max: 30 },
        defenseTypes: {},
        slot: 'mainHand',
        disassembleResults: [
            { name: 'Scrap Metal', quantity: 2 },
            { name: 'Energy Cell', quantity: 1 }
        ],
        isDisassembleable: true,
        description: 'A staff that channels elemental energy. Increases all elemental damage.'
    },

    {
        name: 'Toxic Blade',
        type: "Weapon",
        weaponType: "Dagger",
        icon: "icons/toxic_blade.png",
        bAttackSpeed: 2.2,
        damageTypes: {
            slashing: { min: 5, max: 8 },
            corrosive: { min: 8, max: 12 }
        },
        statModifiers: {
            damageTypes: {
                corrosive: { min: 30, max: 50 },
            },
            damageGroups: {
                chemical: { min: 15, max: 25 } // Group modifier for all chemical damage
            }
        },
        attackSpeedModifierRange: { min: 15, max: 25 },
        criticalChanceModifierRange: { min: 15, max: 25 },
        defenseTypes: {},
        slot: 'mainHand',
        effects: [
            {
                trigger: 'onHit',
                chance: 0.25,
                action: 'applyStatusEffect',
                parameters: {
                    effect: 'Corroded',
                    duration: 5
                }
            }
        ],
        isDisassembleable: true,
        disassembleResults: [
            { name: 'Scrap Metal', quantity: 1 },
            { name: 'Toxic Residue', quantity: 1 }
        ],
        description: '25% chance on hit to apply Corroded for 5 seconds. Increases all chemical damage.'
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
                    damageType: 'electric',
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
        description: '30% chance on hit to deal 10 Kinetic, or 10 Electric damage, or both, ignoring defense.',
        isDisassembleable: true,
    },

    {
        name: "Fire Spewer Mk1",
        type: "Weapon",
        weaponType: "Pistol",
        icon: "icons/flame_thrower.png",
        slot: 'mainHand',
        bAttackSpeed: 4,
        damageTypes: {
            pyro: { min: 17, max: 25 },
        },
        statModifiers: {
            damageTypes: {
                pyro: { min: 40, max: 45 },
            },
        },
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
            slashing: { min: 210, max: 270
        }
        },
        statModifiers: {
            damageTypes: {
                slashing: { min: 100, max: 125 },
            },
        },
        effects: [
            {
                trigger: 'onHit',
                chance: 1,
                action: 'dealDamage',
                parameters: {
                    damageType: 'slashing',
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
                let damageTypes = { slashing: 10 };
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
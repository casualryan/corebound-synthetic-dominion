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
    },

    {
        name: "Phase Reaver",
        type: "Weapon",
        weaponType: "Sword",
        icon: "icons/phase_reaver.png",
        level: 10,
        bAttackSpeed: 2.5,
        damageTypes: {
            kinetic: { min: 18, max: 25 },
            slashing: { min: 8, max: 12 }
        },
        statModifiers: {
            damageTypes: {
                slashing: { min: 25, max: 40 },
            },
            damageGroups: {
                physical: { min: 15, max: 20 }
            }
        },
        attackSpeedModifierRange: { min: 10, max: 20 },
        criticalChanceModifierRange: { min: 15, max: 25 },
        criticalMultiplierModifierRange: { min: 30, max: 40 },
        deflection: { min: 10, max: 15 },
        defenseTypes: {},
        slot: 'mainHand',
        effects: [
            {
                trigger: 'onCritical',
                chance: 0.4,
                action: 'applyStatusEffect',
                parameters: {
                    effect: 'Phased',
                    duration: 3
                }
            }
        ],
        isDisassembleable: true,
        disassembleResults: [
            { name: 'Unstable Phase Core', quantity: 1 },
            { name: 'Advanced Alloy', quantity: 2 }
        ],
        description: 'A fast-striking blade that occasionally phases targets out of reality. 40% chance on critical hits to apply Phased status for 3 seconds.'
    },

    {
        name: "Frost Cannon",
        type: "Weapon",
        weaponType: "Rifle",
        icon: "icons/frost_cannon.png",
        level: 10,
        bAttackSpeed: 1.0,
        damageTypes: {
            cryo: { min: 35, max: 45 }
        },
        statModifiers: {
            damageTypes: {
                cryo: { min: 30, max: 50 }
            },
            damageGroups: {
                elemental: { min: 10, max: 15 }
            }
        },
        criticalChanceModifierRange: { min: 10, max: 15 },
        criticalMultiplierModifierRange: { min: 20, max: 30 },
        defenseTypes: {
            cryo: { min: 10, max: 15 }
        },
        slot: 'mainHand',
        effects: [
            {
                trigger: 'onHit',
                chance: 0.3,
                action: 'applyStatusEffect',
                parameters: {
                    effect: 'Frozen',
                    duration: 2,
                    stacks: 1,
                    maxStacks: 3
                }
            }
        ],
        isDisassembleable: true,
        disassembleResults: [
            { name: 'Cryo Cell', quantity: 2 },
            { name: 'Advanced Barrel', quantity: 1 }
        ],
        description: 'Slow but powerful cryo weapon. 30% chance to apply stacking Frozen effect, slowing enemies and increasing damage taken.'
    },

    {
        name: "Neurotoxin Needler",
        type: "Weapon",
        weaponType: "Crossbow",
        icon: "icons/needler.png",
        level: 10,
        bAttackSpeed: 3.0,
        damageTypes: {
            kinetic: { min: 8, max: 12 },
            corrosive: { min: 12, max: 18 }
        },
        statModifiers: {
            damageTypes: {
                corrosive: { min: 35, max: 45 },
                kinetic: { min: 15, max: 25 }
            },
            damageGroups: {
                chemical: { min: 15, max: 25 }
            }
        },
        attackSpeedModifierRange: { min: 15, max: 25 },
        criticalChanceModifierRange: { min: 20, max: 30 },
        defenseTypes: {},
        slot: 'mainHand',
        effects: [
            {
                trigger: 'onHit',
                chance: 0.65,
                action: 'applyStatusEffect',
                parameters: {
                    effect: 'Corroded',
                    duration: 4,
                    dotDamage: {
                        corrosive: 8
                    },
                    statReduction: {
                        attackSpeed: 10
                    }
                }
            }
        ],
        isDisassembleable: true,
        disassembleResults: [
            { name: 'Toxic Residue', quantity: 2 },
            { name: 'Precision Mechanism', quantity: 1 }
        ],
        description: 'Rapidly fires toxic darts. 65% chance to apply Corroded for 4 seconds, dealing corrosive damage over time and reducing attack speed.'
    },

    {
        name: "Pyro Blaster",
        type: "Weapon",
        weaponType: "Energy Cannon",
        icon: "icons/pyro_blaster.png",
        level: 10,
        bAttackSpeed: 0.8,
        damageTypes: {
            pyro: { min: 40, max: 55 }
        },
        statModifiers: {
            damageTypes: {
                pyro: { min: 40, max: 50 }
            },
            damageGroups: {
                elemental: { min: 20, max: 25 }
            }
        },
        criticalChanceModifierRange: { min: 15, max: 20 },
        criticalMultiplierModifierRange: { min: 40, max: 60 },
        defenseTypes: {},
        slot: 'mainHand',
        effects: [
            {
                trigger: 'onHit',
                chance: 0.4,
                action: 'areaEffect',
                parameters: {
                    radius: 2,
                    damageType: 'pyro',
                    damageAmount: { min: 15, max: 20 }
                }
            }
        ],
        isDisassembleable: true,
        disassembleResults: [
            { name: 'Pyro Core', quantity: 1 },
            { name: 'Advanced Electronic Circuit', quantity: 2 }
        ],
        description: 'Slow but devastating fire weapon. 40% chance to create a fiery explosion that damages nearby enemies.'
    },

    {
        name: "Lightning Gauntlet",
        type: "Weapon",
        weaponType: "Gauntlet",
        icon: "icons/lightning_gauntlet.png",
        level: 10,
        bAttackSpeed: 2.2,
        damageTypes: {
            electric: { min: 15, max: 28 }
        },
        statModifiers: {
            damageTypes: {
                electric: { min: 45, max: 60 }
            },
            damageGroups: {
                elemental: { min: 15, max: 20 }
            }
        },
        attackSpeedModifierRange: { min: 20, max: 30 },
        criticalChanceModifierRange: { min: 5, max: 15 },
        criticalMultiplierModifierRange: { min: 10, max: 20 },
        defenseTypes: {
            electric: { min: 15, max: 25 }
        },
        slot: 'mainHand',
        effects: [
            {
                trigger: 'onHit',
                chance: 0.25,
                action: 'chainLightning',
                parameters: {
                    jumps: 3,
                    damageReduction: 0.3,
                    damageType: 'electric',
                    baseAmount: { min: 12, max: 18 }
                }
            }
        ],
        isDisassembleable: true,
        disassembleResults: [
            { name: 'Lightning Cell', quantity: 2 },
            { name: 'Conductive Alloy', quantity: 1 }
        ],
        description: 'Fast-striking electric gauntlet. 25% chance to release chain lightning that jumps to nearby enemies with reduced damage.'
    },

    {
        name: "Acidic Ripper",
        type: "Weapon",
        weaponType: "Claws",
        icon: "icons/acid_claws.png",
        level: 10,
        bAttackSpeed: 3.5,
        damageTypes: {
            slashing: { min: 6, max: 10 },
            corrosive: { min: 10, max: 15 }
        },
        statModifiers: {
            damageTypes: {
                corrosive: { min: 35, max: 50 }
            },
            damageGroups: {
                physical: { min: 10, max: 15 },
                chemical: { min: 15, max: 20 }
            }
        },
        attackSpeedModifierRange: { min: 25, max: 40 },
        criticalChanceModifierRange: { min: 15, max: 25 },
        defenseTypes: {
            corrosive: { min: 20, max: 30 }
        },
        slot: 'mainHand',
        effects: [
            {
                trigger: 'onHit',
                chance: 0.45,
                action: 'applyStatusEffect',
                parameters: {
                    effect: 'Corroded',
                    duration: 3,
                    stacks: 1,
                    maxStacks: 5,
                    defenseReduction: {
                        physical: 5,
                        stacking: true
                    }
                }
            }
        ],
        isDisassembleable: true,
        disassembleResults: [
            { name: 'Corrosive Fluid', quantity: 2 },
            { name: 'Enhanced Cutting Edge', quantity: 1 }
        ],
        description: 'Extremely fast acid-coated claws. 45% chance to apply Corroded for 3 seconds, reducing physical defenses with each stack.'
    },

    {
        name: "Radiation Scepter",
        type: "Weapon",
        weaponType: "Staff",
        icon: "icons/rad_scepter.png",
        level: 10,
        bAttackSpeed: 1.8,
        damageTypes: {
            radiation: { min: 20, max: 30 }
        },
        statModifiers: {
            damageTypes: {
                radiation: { min: 40, max: 60 }
            },
            damageGroups: {
                chemical: { min: 15, max: 25 }
            }
        },
        attackSpeedModifierRange: { min: 10, max: 20 },
        criticalChanceModifierRange: { min: 20, max: 30 },
        criticalMultiplierModifierRange: { min: 25, max: 35 },
        defenseTypes: {
            radiation: { min: 15, max: 25 }
        },
        slot: 'mainHand',
        effects: [
            {
                trigger: 'onCritical',
                chance: 0.5,
                action: 'applyStatusEffect',
                parameters: {
                    effect: 'Irradiated',
                    duration: 2,
                    dotDamage: {
                        radiation: 10
                    },
                    statReduction: {
                        allDefenses: 30,
                        duration: 3
                    }
                }
            }
        ],
        isDisassembleable: true,
        disassembleResults: [
            { name: 'Radiation Core', quantity: 1 },
            { name: 'Energy Focuser', quantity: 1 }
        ],
        description: 'A staff that channels deadly radiation. 50% chance on critical hits to apply Irradiated, dealing radiation damage over time and reducing all defenses.'
    },
];

// Export the weapons array
window.weapons = weapons; 
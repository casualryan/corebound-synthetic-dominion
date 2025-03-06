const passives = [
    // TIER 1 PASSIVES
    {
        name: "Swift Strikes",
        description: "Increases your attack speed.",
        icon: "icons/swift_strikes.png",
        statChanges: {
            attackSpeed: [0, 5, 12, 20, 30, 45, 75]  // Percentage increases
        },
        passiveTier: 1
    },
    {
        name: "Kinetic Focus",
        description: "Increases your kinetic damage.",
        icon: "icons/kinetic_focus.png",
        statChanges: {
            damageTypes: {
                kinetic: [0, 15, 35, 65, 100, 140, 210]  // Percentage increases
            }
        },
        passiveTier: 1
    },
    {
        name: "Mental Prowess",
        description: "Increases your mental damage.",
        icon: "icons/mental_prowess.png",
        statChanges: {
            damageTypes: {
                mental: [0, 15, 35, 65, 100, 140, 210]  // Percentage increases
            }
        },
        passiveTier: 1
    },
    {
        name: "Pyromancer",
        description: "Increases your pyro damage.",
        icon: "icons/pyromancer.png",
        statChanges: {
            damageTypes: {
                pyro: [0, 15, 35, 65, 100, 140, 210]  // Percentage increases
            }
        },
        passiveTier: 1
    },
    {
        name: "Toxicologist",
        description: "Increases your chemical damage.",
        icon: "icons/toxicologist.png",
        statChanges: {
            damageTypes: {
                chemical: [0, 15, 35, 65, 100, 140, 210]  // Percentage increases
            }
        },
        passiveTier: 1
    },
    {
        name: "Electromagnetic",
        description: "Increases your magnetic damage.",
        icon: "icons/electromagnetic.png",
        statChanges: {
            damageTypes: {
                magnetic: [0, 15, 35, 65, 100, 140, 210]  // Percentage increases
            }
        },
        passiveTier: 1
    },
    

    // TIER 2 PASSIVES
    {
        name: "Critical Precision",
        description: "Increases your critical strike chance.",
        icon: "icons/critical_precision.png",
        statChanges: {
            criticalChance: [0, 5, 10, 15, 20, 25, 30]  // Percentage points (not percent increase)
        },
        passiveTier: 2
    },
    {
        name: "Devastating Precision",
        description: "Increases your critical strike multiplier.",
        icon: "icons/devastating_blows.png",
        statChanges: {
            criticalMultiplier: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6]  // Flat increases to multiplier
        },
        passiveTier: 2
    },    
    {
        name: "Impenetrable Fortification",
        description: "Increases your maximum health.",
        icon: "icons/fortification.png",
        statChanges: {
            healthPercent: [0, 5, 10, 15, 20, 25, 30],  // Percentage increases
            flatHealth: [0, 10, 20, 30, 40, 50, 60]  // Flat increases
        },
        passiveTier: 2
    },
    {
        name: "Sustained Vitality",
        description: "Increases your health regeneration.",
        icon: "icons/vitality.png",
        statChanges: {
            healthRegen: [0, 0.5, 1.0, 2, 2.5, 3.5, 5]  // Flat increases
        },
        passiveTier: 2
    },
    

    // TIER 3 PASSIVES
    {
        name: "Energy Barrier",
        description: "Increases your maximum energy shield.",
        icon: "icons/energy_barrier.png",
        statChanges: {
            energyShieldPercent: [0, 5, 10, 15, 20, 25, 30]  // Percentage increases
        },
        passiveTier: 3
    },
    {
        name: "Toughness",
        description: "Increases your toughness defense.",
        icon: "icons/toughness.png",
        statChanges: {
            defenseTypes: {
                toughness: [0, 5, 10, 15, 20, 25, 30]  // Flat increases
            }
        },
        passiveTier: 3
    },
    {
        name: "Mental Fortitude",
        description: "Increases your fortitude defense.",
        icon: "icons/mental_fortitude.png",
        statChanges: {
            defenseTypes: {
                fortitude: [0, 5, 10, 15, 20, 25, 30]  // Flat increases
            }
        },
        passiveTier: 3
    },
    {
        name: "Thermal Regulation",
        description: "Increases your heat resistance defense.",
        icon: "icons/thermal_regulation.png",
        statChanges: {
            defenseTypes: {
                heatResistance: [0, 5, 10, 15, 20, 25, 30]  // Flat increases
            }
        },
        passiveTier: 3
    },
    {
        name: "Immunology",
        description: "Increases your immunity defense.",
        icon: "icons/immunology.png",
        statChanges: {
            defenseTypes: {
                immunity: [0, 5, 10, 15, 20, 25, 30]  // Flat increases
            }
        },
        passiveTier: 3
    },
    {
        name: "Faraday Protection",
        description: "Increases your antimagnet defense.",
        icon: "icons/faraday_protection.png",
        statChanges: {
            defenseTypes: {
                antimagnet: [0, 5, 10, 15, 20, 25, 30]  // Flat increases
            }
        },
        passiveTier: 3
    },
    
    // TIER 4 PASSIVES
    {
        name: "Raw Power",
        description: "Adds flat kinetic damage to your attacks.",
        icon: "icons/raw_power.png",
        statChanges: {
            flatDamageTypes: {
                kinetic: [0, 3, 6, 9, 12, 15, 18]  // Flat increases
            }
        },
        passiveTier: 4
    },
    {
        name: "Mind Blast",
        description: "Adds flat mental damage to your attacks.",
        icon: "icons/mind_blast.png",
        statChanges: {
            flatDamageTypes: {
                mental: [0, 3, 6, 9, 12, 15, 18]  // Flat increases
            }
        },
        passiveTier: 4
    },
    {
        name: "Firestarter",
        description: "Adds flat pyro damage to your attacks.",
        icon: "icons/firestarter.png",
        statChanges: {
            flatDamageTypes: {
                pyro: [0, 3, 6, 9, 12, 15, 18]  // Flat increases
            }
        },
        passiveTier: 4
    },
    {
        name: "Toxin Expert",
        description: "Adds flat chemical damage to your attacks.",
        icon: "icons/toxin_expert.png",
        statChanges: {
            flatDamageTypes: {
                chemical: [0, 3, 6, 9, 12, 15, 18]  // Flat increases
            }
        },
        passiveTier: 4
    },
    {
        name: "Field Generator",
        description: "Adds flat magnetic damage to your attacks.",
        icon: "icons/field_generator.png",
        statChanges: {
            flatDamageTypes: {
                magnetic: [0, 3, 6, 9, 12, 15, 18]  // Flat increases
            }
        },
        passiveTier: 4
    },
    {
        name: "Vitality Core",
        description: "Increases your maximum health with flat values.",
        icon: "icons/vitality_core.png",
        statChanges: {
            flatHealth: [0, 10, 20, 30, 40, 50, 60]  // Flat increases
        },
        passiveTier: 4
    },
    {
        name: "Shield Generator",
        description: "Increases your maximum energy shield with flat values.",
        icon: "icons/shield_generator.png",
        statChanges: {
            flatEnergyShield: [0, 5, 10, 15, 20, 25, 30]  // Flat increases
        },
        passiveTier: 4
    },
    {
        name: "Precision System", 
        description: "Increases your precision.",
        icon: "icons/precision_system.png",
        statChanges: {
            precision: [0, 3, 6, 9, 12, 15, 18]  // Flat increases
        },
        passiveTier: 4
    },
    {
        name: "Deflection Field",
        description: "Increases your deflection.",
        icon: "icons/deflection_field.png",
        statChanges: {
            deflection: [0, 3, 6, 9, 12, 15, 18]  // Flat increases
        },
        passiveTier: 4
    }
];
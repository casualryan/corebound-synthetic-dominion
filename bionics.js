const bionics = [
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
    }
];

// Export the bionics array
window.bionics = bionics; 
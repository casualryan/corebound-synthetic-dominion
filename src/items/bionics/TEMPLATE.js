// src/items/bionics/TEMPLATE.js
// Copy this file to create a new bionic
// Rename the file to match your bionic's name (camelCase)
// After creating the file, make sure to import and add it to index.js

export default {
    name: 'Your Bionic Name',
    type: 'Bionic',
    icon: 'icons/your_icon.png',
    slot: 'bionic',
    
    // Defense properties (optional)
    defenseTypes: {
        // toughness: { min: 10, max: 20 },
        // immunity: { min: 10, max: 20 },
        // heatResistance: { min: 5, max: 10 },
        // antimagnet: { min: -5, max: -10 } // negative values decrease defense
    },
    
    // Health and shield bonuses (optional)
    healthBonus: { min: 20, max: 50 },
    healthBonusPercentRange: { min: 10, max: 25 },
    energyShieldBonus: { min: 30, max: 60 },
    energyShieldBonusPercentRange: { min: 10, max: 15 },
    healthRegen: { min: 1, max: 3 },
    
    // Combat modifiers (optional)
    attackSpeedModifierRange: { min: 10, max: 25 },
    criticalChanceModifierRange: { min: 5, max: 15 },
    criticalMultiplierModifierRange: { min: 10, max: 20 },
    precision: { min: 2, max: 5 },
    deflection: { min: 2, max: 5 },
    // New stats - remove if not needed
    bionicEfficiency: { min: 5, max: 20 }, // Increases bionic proc effect chances
    bionicSync: { min: 10, max: 30 }, // Increases stats gained from ALL bionics
    
    // Stat modifiers (optional)
    statModifiers: {
        damageTypes: {
            // kinetic: { min: 25, max: 50 },
            // pyro: { min: 30, max: 60 }
        },
        damageGroups: {
            // physical: { min: 15, max: 30 },
            // elemental: { min: 20, max: 40 }
        }
    },
    
    // Special effects (optional)
    effects: [
        // {
        //     trigger: 'whenHit', // whenHit, onHit, onCritical, etc.
        //     chance: 100, // Percentage (100 = always, 50 = 50% chance)
        //     action: 'dealDamage', // dealDamage, heal, applyBuff, etc.
        //     parameters: {
        //         damageType: 'kinetic',
        //         amount: 5,
        //         ignoreDefenses: true
        //     }
        // }
    ],
    
    // Passive bonuses (optional)
    passiveBonuses: {
        // Add passive skill bonuses if any
        // 'Swift Strikes': 2,
        // 'Kinetic Focus': 1
    },
    
    // Disassembly settings
    isDisassembleable: true,
    disassembleResults: [
        { name: 'Scrap Metal', quantity: 1 },
        // Add more materials...
    ],
    
    description: 'Bionic description goes here.'
}; 
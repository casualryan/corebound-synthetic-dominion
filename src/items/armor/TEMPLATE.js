// src/items/armor/TEMPLATE.js
// Copy this file to create a new armor piece
// Rename the file to match your armor's name (camelCase)
// After creating the file, make sure to import and add it to index.js

export default {
    name: "Your Armor Name",
    type: "Armor", // Or Helmet, Boots, Gloves, Shield, etc.
    icon: "icons/your_icon.png",
    
    // Optional damage properties
    damageTypes: {
        // Add if armor provides damage (like gauntlets)
        // kinetic: { min: 3, max: 6 }
    },
    attackSpeed: 0, // Modifier to attack speed (negative for heavy armor)
    criticalChance: 0,
    criticalMultiplier: 0,
    
    // Defense properties
    defenseTypes: {
        sturdiness: { min: 10, max: 20 }, // Physical defense
        structure: { min: 5, max: 15 },   // Elemental defense
        stability: { min: 5, max: 10 }    // Chemical defense
    },
    
    // Health and shield bonuses
    healthBonus: { min: 20, max: 50 },
    healthBonusPercentRange: { min: 10, max: 15 },
    energyShieldBonus: { min: 30, max: 60 },
    energyShieldBonusPercentRange: { min: 5, max: 10 },
    healthRegen: { min: 1, max: 3 },
    
    // Combat stats
    precision: { min: 2, max: 5 },
    deflection: { min: 2, max: 5 },
    
    // Equipment slot
    slot: 'chest', // head, chest, legs, feet, gloves, offHand
    
    // Special effects
    effects: [
        // {
        //     trigger: 'whenHit', // whenHit, onHit, etc.
        //     chance: 0.1, // 10% chance
        //     action: 'heal', // heal, dealDamage, applyBuff, etc.
        //     parameters: {
        //         // Parameters specific to the action
        //         amount: 25
        //     }
        // }
    ],
    
    // Disassembly settings
    isDisassembleable: true,
    disassembleResults: [
        { name: 'Scrap Metal', quantity: 2 },
        // Add more materials...
    ],
    
    description: 'Armor description goes here.'
}; 
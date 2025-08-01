// src/items/weapons/TEMPLATE.js
// Copy this file to create a new weapon
// Rename the file to match your weapon's name (camelCase)
// After creating the file, make sure to import and add it to index.js

export default {
    name: "Your Weapon Name",
    type: "Weapon",
    weaponType: "Sword", // Sword, Staff, Dagger, Pistol, etc.
    icon: "icons/your_icon.png",
    bAttackSpeed: 1.0, // Base attack speed
    damageTypes: {
        // Add appropriate damage types with min/max values
        kinetic: { min: 10, max: 20 },
        // Additional damage types...
    },
    statModifiers: {
        damageTypes: {
            // Specific damage type modifiers
            kinetic: { min: 5, max: 10 },
        },
        damageGroups: {
            // Group modifiers (physical, elemental, chemical)
            physical: { min: 5, max: 10 }
        }
    },
    // Optional fields - remove if not needed
    attackSpeedModifierRange: { min: 5, max: 10 },
    criticalChanceModifierRange: { min: 5, max: 10 },
    criticalMultiplierModifierRange: { min: 10, max: 20 },
    deflection: { min: 0, max: 0 },
    defenseTypes: {
        // Add defense types if the weapon provides them
    },
    slot: 'mainHand', // mainHand, offHand, etc.
    passiveBonuses: {
        // Add passive bonuses if any
    },
    // Special effects
    effects: [
        // {
        //     trigger: 'onHit', // onHit, onCritical, etc.
        //     chance: 0.2, // 20% chance
        //     action: 'dealDamage', // dealDamage, applyStatusEffect, etc.
        //     parameters: {
        //         // Parameters specific to the action
        //     }
        // }
    ],
    // Disassembly settings
    isDisassembleable: true,
    disassembleResults: [
        { name: 'Item Name', quantity: 1 },
        // Add more items...
    ],
    description: 'Weapon description goes here.'
}; 
// src/items/weapons/acidicRipper.js
export default {
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
    };
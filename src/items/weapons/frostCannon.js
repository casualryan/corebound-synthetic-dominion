// src/items/weapons/frostCannon.js
export default {
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
    };
// src/items/weapons/phaseReaver.js
export default {
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
    };
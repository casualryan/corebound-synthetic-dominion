// src/items/weapons/neurotoxinNeedler.js
export default {
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
    };
// src/items/weapons/toxicBlade.js
export default {
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
    };
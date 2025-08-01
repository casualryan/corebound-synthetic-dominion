// src/items/weapons/orrDevastatingCarbine.js
export default {
        name: "Orr, Devastating Carbine",
        type: "Weapon",
        weaponType: "Rifle",
        icon: "icons/orr.png",
        level: 10,
        bAttackSpeed: 1.1,
        damageTypes: {
            kinetic: { min: 210, max: 230 },
        },
        statModifiers: {
            damageTypes: {
                kinetic: { min: 100, max: 125 },
            },
        },
        attackSpeedModifierRange: { min: 20, max: 20},
        criticalChanceModifierRange: { min: 60, max: 70},
        criticalMultiplierModifierRange: { min: 40, max: 50},
        defenseTypes: {},
        slot: 'mainHand',
        effects: [
            {
                trigger: 'onHit',
                chance: 0.33,
                action: 'dealDamage',
                parameters: {
                    damageType: 'kinetic',
                    amount: 200,
                    ignoreDefense: true
                }
            }
        ],
        isDisassembleable: true,
        disassembleResults: [
            { name: 'Advanced Alloy', quantity: 1 }
        ],
    };
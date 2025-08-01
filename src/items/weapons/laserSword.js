// src/items/weapons/laserSword.js
export default {
        name: "Laser Sword",
        type: "Weapon",
        weaponType: "Sword",
        icon: "icons/lasersword.png",
        damageTypes: {
            kinetic: { min: 12, max: 25 },
        },
        statModifiers: {
            damageTypes: {
                kinetic: { min: 10, max: 25 },
            },
        },
        attackSpeedModifierRange: { min: 10, max: 30 },
        criticalChanceModifierRange: { min: 20, max: 40 },
        criticalMultiplierModifierRange: { min: 5, max: 15 },
        defenseTypes: {},
        effects: [
            {
                trigger: 'onHit',
                chance: .3,
                action: 'dealDamage',
                parameters: {
                    damageType: 'kinetic',
                    amount: 10,
                    ignoreDefense: true
                } 
            },
            {
                trigger: 'onHit',
                chance: .3,
                action: 'dealDamage',
                parameters: {
                    damageType: 'electric',
                    amount: 10,
                    ignoreDefense: true
                }
            }
        ],
        slot: 'mainHand',
        disassembleResults: [
            { name: 'Crystalized Light', quantity: 1 },
            { name: 'Minor Electronic Circuit', quantity: 1 }
        ],
        description: '30% chance on hit to deal 10 Kinetic, or 10 Electric damage, or both, ignoring defense.',
        isDisassembleable: true,
    };
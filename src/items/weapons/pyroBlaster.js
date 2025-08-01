// src/items/weapons/pyroBlaster.js
export default {
        name: "Pyro Blaster",
        type: "Weapon",
        weaponType: "Energy Cannon",
        icon: "icons/pyro_blaster.png",
        level: 10,
        bAttackSpeed: 0.8,
        damageTypes: {
            pyro: { min: 40, max: 55 }
        },
        statModifiers: {
            damageTypes: {
                pyro: { min: 40, max: 50 }
            },
            damageGroups: {
                elemental: { min: 20, max: 25 }
            }
        },
        criticalChanceModifierRange: { min: 15, max: 20 },
        criticalMultiplierModifierRange: { min: 40, max: 60 },
        defenseTypes: {},
        slot: 'mainHand',
        effects: [
            {
                trigger: 'onHit',
                chance: 0.4,
                action: 'areaEffect',
                parameters: {
                    radius: 2,
                    damageType: 'pyro',
                    damageAmount: { min: 15, max: 20 }
                }
            }
        ],
        isDisassembleable: true,
        disassembleResults: [
            { name: 'Pyro Core', quantity: 1 },
            { name: 'Advanced Electronic Circuit', quantity: 2 }
        ],
        description: 'Slow but devastating fire weapon. 40% chance to create a fiery explosion that damages nearby enemies.'
    };
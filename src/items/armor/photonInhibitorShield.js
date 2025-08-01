export default {
    name: "Photon Inhibitor Shield",
    type: "Armor",
    icon: "icons/energy_shield.png",
    damageTypes: {},
    attackSpeed: 0,
    criticalChance: 0,
    criticalMultiplier: 0,
    defenseTypes: {
        structure: { min: 30, max: 40 }, // Good against Elemental (pyro, cryo, electric)
        stability: { min: 10, max: 15 }, // Some Chemical resistance
        sturdiness: { min: 5, max: 10 }  // Minor Physical resistance
    },
    energyShieldBonus: { min: 100, max: 150 },
    energyShieldBonusPercentRange: { min: 10, max: 15 },
    slot: 'offHand',
    isDisassembleable: true,
    disassembleResults: [
        {
            name: 'Unstable Photon', quantity: 1
        },
    ],
    description: 'Defensive shield, increases Energy Shield, Health, and Defenses.'
}; 
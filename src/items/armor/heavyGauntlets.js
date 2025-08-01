export default {
    name: "Heavy Gauntlets",
    type: "Armor",
    icon: "icons/heavy_gauntlets.png",
    damageTypes: {
        kinetic: { min: 3, max: 6 }
    },
    defenseTypes: {
        sturdiness: { min: 10, max: 15 }
    },
    healthBonus: { min: 30, max: 30 },
    healthBonusPercentRange: { min: 10, max: 15 },
    slot: 'gloves',
    isDisassembleable: true,
    disassembleResults: [
        {
            name: 'Scrap Metal', quantity: 2
        },
    ],
    description: 'Defensive gloves.'
}; 
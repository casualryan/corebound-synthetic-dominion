export default {
    name: "Heavy Metal Gloves",
    type: "Gloves",
    icon: "icons/heavy_metal_gloves.png",
    defenseTypes: {
        toughness: { min: 5, max: 10 },
        immunity: { min: 5, max: 10 },
        antimagnet: { min: 5, max: 10 }
    },
    healthBonus: { min: 30, max: 30 },
    healthBonusPercentRange: { min: 10, max: 15 },
    deflection: { min: 3, max: 3 },
    slot: 'gloves',
    isDisassembleable: true,
    disassembleResults: [
        {
            name: 'Scrap Metal', quantity: 2
        },
    ],
    description: 'Defensive gloves.'
}; 
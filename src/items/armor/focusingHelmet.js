export default {
    name: "Focusing Helmet",
    type: "Helmet",
    icon: "icons/focusing_helmet.png",
    defenseTypes: {
        fortitude: { min: 5, max: 5 },
        immunity: { min: 5, max: 5 },
        antimagnet: { min: 5, max: 5 },
        chemical: { min: 5, max: 5 },
        heatResistance: { min: 5, max: 5 }
    },
    healthBonus: { min: 20, max: 20 },
    healthBonusPercentRange: { min: 8, max: 10 },
    precision: { min: 5, max: 5 },
    slot: 'head',
    isDisassembleable: true,
    disassembleResults: [
        {
            name: 'Scrap Metal', quantity: 2
        },
    ],
    description: 'Light defensive helmet, adds some Precision.'
}; 
export default {
    name: "Anti-Radiation Helmet",
    type: "Armor",
    icon: "icons/anti_radiation_helmet.png",
    defenseTypes: {
        stability: { min: 20, max: 30 } // Good against corrosive, radiation
    },
    healthBonus: { min: 20, max: 20 },
    healthBonusPercentRange: { min: 8, max: 10 },
    slot: 'head',
    isDisassembleable: true,
    disassembleResults: [
        {
            name: 'Scrap Metal', quantity: 2
        },
    ],
    description: 'Light defensive helmet, adds some Precision.'
}; 
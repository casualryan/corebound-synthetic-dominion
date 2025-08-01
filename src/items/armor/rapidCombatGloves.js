export default {
    name: "Rapid Combat Gloves",
    type: "Gloves",
    icon: "icons/rapid_strike_gloves.png",
    attackSpeedModifierRange: { min: 30, max: 40 },
    precision: { min: 3, max: 3 },
    deflection: { min: 3, max: 3 },
    slot: 'gloves',
    isDisassembleable: true,
    disassembleResults: [
        {
            name: 'Scrap Metal', quantity: 2
        },
    ],
    description: 'Offensive Gloves.'
}; 
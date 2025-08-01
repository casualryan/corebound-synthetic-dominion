export default {
    name: 'Epidermis Alloy',
    type: 'Bionic',
    icon: 'icons/epidermis_alloy.png',
    defenseTypes: {
        toughness: { min: 20, max: 20 },
        immunity: { min: 20, max: 20 },
        heatResistance: { min: 5, max: 5 },
        antimagnet: { min: -10, max: -10 }
    },
    slot: 'bionic',
    isDisassembleable: true,
    disassembleResults: [
        {
            name: 'Scrap Metal', quantity: 1
        },
    ],
    description: 'Increases Toughness, Immunity, and Heat Resistance, but decreases Antimagnet.'
}; 
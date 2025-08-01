export default {
    name: 'Health Enhancer',
    type: 'Bionic',
    icon: 'icons/healthenhancer.png',
    healthBonusPercentRange: { min: 20, max: 25 },
    slot: 'bionic',
    isDisassembleable: true,
    disassembleResults: [
        {
            name: 'Scrap Metal', quantity: 1
        },
    ],
    description: 'Increases Max Health.'
}; 
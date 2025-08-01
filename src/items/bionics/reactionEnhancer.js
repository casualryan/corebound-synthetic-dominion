export default {
    name: 'Reaction Enhancer',
    type: 'Bionic',
    icon: 'icons/reactionenhancer.png',
    slot: 'bionic',
    attackSpeedModifierRange: { min: 20, max: 35 },
    isDisassembleable: true,
    disassembleResults: [
        {
            name: 'Scrap Metal', quantity: 1
        },
    ],
    description: 'Increases Attack Speed by 20%-35%.'
}; 
export default {
    name: "Spiked Reactor Shield",
    type: "Shield",
    icon: "icons/spiked_reactor_shield.png",
    defenseTypes: {
        toughness: { min: 5, max: 5 },
        heatResistance: { min: 5, max: 5 },
        immunity: { min: 5, max: 5 },
        fortitude: { min: 5, max: 5 },
        antimagnet: { min: 5, max: 5 }
    },
    effects: [
        {
            trigger: 'whenHit',
            chance: 0.2,
            action: 'dealDamage',
            parameters: {
                damageType: 'kinetic',
                amount: 20,
                ignoreDefenses: true
            }
        }
    ],
    slot: 'offHand',
    isDisassembleable: true,
    disassembleResults: [
        {
            name: 'Titanium Thorn', quantity: 3
        },
    ],
    description: '20% chance when hit to deal 20 Kinetic damage, ignoring defense.'
}; 
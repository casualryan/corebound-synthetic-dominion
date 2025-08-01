export default {
    name: "Big 'Ol Bucket",
    type: 'Helmet',
    icon: 'icons/big_ol_bucket.png',
    defenseTypes: {
        toughness: { min: 20, max: 20 },
        heatResistance: { min: 20, max: 20 },
        immunity: { min: 10, max: 10 },
        fortitude: { min: 20, max: 20 },    
        antimagnet: { min: -10, max: -10 }
    },
    slot: 'head',
    isDisassembleable: true,
    disassembleResults: [
        {
            name: 'Scrap Metal', quantity: 1
        },
    ],
    effects: [
            {
            trigger: 'whenHit',
            chance: 0.1,
            action: 'applyBuff',
            parameters: {
                buff: 'Cracked',
            }
        }
    ],     
    description: 'A large metal bucket. May crack when damaged.'
}; 
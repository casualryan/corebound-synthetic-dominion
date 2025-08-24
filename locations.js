const locations = [
    {
        name: "Training Chamber (1)",
        recommendedLevel: 1,
        enemies: [
            { name: "Training Dummy Mk. I", spawnRate: 3, empoweredChance: 0 },
            { name: "Training Dummy Mk. II", spawnRate: 1, empoweredChance: 0 }
        ],
        numFights: 4,
        description: "Basic training dummies for combat practice.",
        locationCategory: "training"
    },
    {
        name: "Training Chamber (2)",
        recommendedLevel: 3,
        enemies: [
            { name: "Training Dummy Mk. II", spawnRate: 3, empoweredChance: 0 },
            { name: "Training Dummy Mk. III", spawnRate: 1, empoweredChance: 0 }
        ],
        numFights: 4,
        description: "Advanced dummies for tougher training.",
        locationCategory: "training"
    },
    {
        name: "Metal Forest",
        recommendedLevel: 5,
        enemies: [
            { name: "Roachbot", spawnRate: 2, empoweredChance: 0.1 },
            { name: "Spiderbot", spawnRate: 1, empoweredChance: 0.1 },
            // { name: "Electro Wasp", spawnRate: 1, empoweredChance: 0.02 }
        ],
        numFights: 4,
        description: "Robotic insects roam these woods.",
        locationCategory: "wilderness"
    },
    {
        name: "Testing Grounds",
        recommendedLevel: 10,
        enemies: [
            { name: "Big Bertha", spawnRate: 1, empoweredChance: 0 }
        ],
        numFights: 1,
        description: "A testing ground for new weapons and equipment.",
        locationCategory: "industrial"
    }
];

// Example for adding more areas/enemies:
/*
{
    name: "Crystal Caverns",
    enemies: [
        { name: "Ice Elemental", spawnRate: 2, empoweredChance: 0.05 },
        { name: "Pyro Beetle", spawnRate: 1, empoweredChance: 0.02 }
    ],
    numFights: 6,
    description: "A cavern filled with rare minerals and dangerous elementals.",
    locationCategory: "wilderness"
}
*/

// lootPools.js - Defines the loot tiers, pools, and their contents

// Loot Tier Configuration
const LOOT_TIERS = {
    TIER_1: { id: 1, name: "Common", chance: 0.6 },
    TIER_2: { id: 2, name: "Uncommon", chance: 0.3 },
    TIER_3: { id: 3, name: "Rare", chance: 0.05 },
    TIER_4: { id: 4, name: "Very Rare", chance: 0.03 },
    TIER_5: { id: 5, name: "Epic", chance: 0.015 },
    TIER_6: { id: 6, name: "Legendary", chance: 0.005 }
};

// Loot Pools
// Each pool represents a collection of items with weights
// Higher weight = higher chance of being selected
const LOOT_POOLS = {
    // Tier 1 Pools (Common)
    lowRoboParts: {
        tier: 1,
        items: [
            { itemName: "Scrap Metal", weight: 150 },
            { itemName: "Minor Electronic Circuit", weight: 20 },
        ]
    },
    arachnidParts: {
        tier: 1,
        items: [
            { itemName: "Synthetic Poison Gland", weight: 20 },
            { itemName: "Spider Leg Segment", weight: 300 },
        ]
    },
    genericCommon: {
        tier: 1,
        items: [
            { itemName: "Scrap Metal", weight: 100 },
        ]
    },
    
    // Tier 2 Pools (Uncommon)
    basicComponents: {
        tier: 2,
        items: [
            { itemName: "Minor Electronic Circuit", weight: 100 },
            { itemName: "Basic Servo", weight: 80 },
            { itemName: "Small Power Cell", weight: 60 },
            { itemName: "Copper Coil", weight: 70 }
        ]
    },
    genericUncommon: {
        tier: 2,
        items: [
            { itemName: "Memory Chip", weight: 60 },
            { itemName: "Stabilizer", weight: 70 },
            { itemName: "Basic Sensor Array", weight: 50 }
        ]
    },
    
    // Tier 3 Pools (Rare)
    midRobotParts: {
        tier: 3,
        items: [
            { itemName: "Advanced Servo", weight: 70 },
            { itemName: "Targeting Module", weight: 50 },
            { itemName: "Power Converter", weight: 60 }
        ]
    },
    genericRare: {
        tier: 3,
        items: [
            { itemName: "Partical Fuser", weight: 60 },

        ]
    },
    
    // Tier 4 Pools (Very Rare)
    advancedComponents: {
        tier: 4,
        items: [
            { itemName: "Quantum Capacitor", weight: 70 },
            { itemName: "High-Density Power Cell", weight: 60 },
            { itemName: "Neural Network Module", weight: 50 }
        ]
    },
    
    // Tier 5 Pools (Epic)
    epicTech: {
        tier: 5,
        items: [
            { itemName: "Phase Converter", weight: 60 },
            { itemName: "AI Core Fragment", weight: 50 },
            { itemName: "Synthetic Biofluid", weight: 40 }
        ]
    },
    
    // Tier 6 Pools (Legendary)
    legendaryComponents: {
        tier: 6,
        items: [
            { itemName: "Quantum Core", weight: 50 },
            { itemName: "Temporal Stabilizer", weight: 40 },
            { itemName: "Nanite Cluster", weight: 30 }
        ]
    }
};

// Export the data structures
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        LOOT_TIERS,
        LOOT_POOLS
    };
} else {
    // For browser environment
} 
window.currentScreen = '';

console.log('global.js loaded');
console.log('window.inventory at the start:', window.inventory);

let playerCurrency = 500;

// Add this near the top of the file with other constants
const MAX_PLAYER_LEVEL = 51;

//Console.log the XP requirements for the first 50 levels
// document.addEventListener('DOMContentLoaded', () => {
//     debugFirstFiftyLevelsXP();
// });
// function debugFirstFiftyLevelsXP() {
//     console.log("XP Requirements for first 50 levels:");
//     for (let i = 1; i <= 50; i++) {
//         let req = getXPForNextLevel(i);
//         console.log(`Level ${i}: ${req} XP`);
//     }
// }

// Helper function to cleanly remove and reapply all passive bonuses from gear
function resetGearPassiveBonuses() {
    // Clear all gear passive bonuses
    player.gearPassiveBonuses = {};
    
    // Reapply from all equipped items
    const equipSlots = ['mainHand', 'offHand', 'head', 'chest', 'legs', 'feet', 'gloves'];
    
    // Apply from normal equipment slots
    for (const slot of equipSlots) {
        if (player.equipment[slot] && player.equipment[slot].passiveBonuses) {
            for (const passiveName in player.equipment[slot].passiveBonuses) {
                const bonusValue = player.equipment[slot].passiveBonuses[passiveName];
                if (typeof bonusValue === 'number' && bonusValue > 0) {
                    if (!player.gearPassiveBonuses[passiveName]) {
                        player.gearPassiveBonuses[passiveName] = bonusValue;
                    } else {
                        player.gearPassiveBonuses[passiveName] += bonusValue;
                    }
                }
            }
        }
    }
    
    // Apply from bionic slots
    if (player.equipment.bionicSlots) {
        for (const bionicItem of player.equipment.bionicSlots) {
            if (bionicItem && bionicItem.passiveBonuses) {
                for (const passiveName in bionicItem.passiveBonuses) {
                    const bonusValue = bionicItem.passiveBonuses[passiveName];
                    if (typeof bonusValue === 'number' && bonusValue > 0) {
                        if (!player.gearPassiveBonuses[passiveName]) {
                            player.gearPassiveBonuses[passiveName] = bonusValue;
                        } else {
                            player.gearPassiveBonuses[passiveName] += bonusValue;
                        }
                    }
                }
            }
        }
    }
}

// Function to apply item modifiers to stats
function applyItemModifiers(stats, item) {
    // Apply flat damage types
    if (!stats || !item) return;
    
    // Flat Damage Types
    if (item.damageTypes) {
        if (!stats.damageTypes) stats.damageTypes = {};
        for (let damageType in item.damageTypes) {
            if (stats.damageTypes[damageType] === undefined) {
                stats.damageTypes[damageType] = 0;
            }
            let val = item.damageTypes[damageType];
            if (typeof val !== "number") { val = 0; }
            stats.damageTypes[damageType] += val;
        }
    }
    
    // Percentage Damage Modifiers
    if (item.statModifiers && item.statModifiers.damageTypes) {
        if (!stats.damageTypeModifiers) stats.damageTypeModifiers = {};
        for (let damageType in item.statModifiers.damageTypes) {
            if (stats.damageTypeModifiers[damageType] === undefined) {
                stats.damageTypeModifiers[damageType] = 1;
            }
            let modVal = item.statModifiers.damageTypes[damageType];
            if (typeof modVal !== "number") { modVal = 0; }
            // Apply additively instead of multiplicatively
            stats.damageTypeModifiers[damageType] += modVal / 100;
        }
    }
    
    // Note: We no longer directly apply passive bonuses here
    // Instead, we use resetGearPassiveBonuses() to rebuild the bonuses completely
    
    // Defense Types
    if (item.defenseTypes) {
        if (!stats.defenseTypes) stats.defenseTypes = {};
        for (let defenseType in item.defenseTypes) {
            if (stats.defenseTypes[defenseType] === undefined) {
                stats.defenseTypes[defenseType] = 0;
            }
            let defVal = item.defenseTypes[defenseType];
            if (typeof defVal !== "number") { defVal = 0; }
            stats.defenseTypes[defenseType] += defVal;
        }
    }
    
    // Health Bonus
    if (item.healthBonus !== undefined) {
        stats.healthBonus = (stats.healthBonus || 0) + item.healthBonus;
    }
    // Energy Shield Bonus
    if (item.energyShieldBonus !== undefined) {
        stats.energyShieldBonus = (stats.energyShieldBonus || 0) + item.energyShieldBonus;
    }
    // Percentage Health Bonus
    if (item.healthBonusPercent !== undefined) {
        stats.healthBonusPercent = (stats.healthBonusPercent || 0) + item.healthBonusPercent;
    }
    // Percentage Energy Shield Bonus
    if (item.energyShieldBonusPercent !== undefined) {
        stats.energyShieldBonusPercent = (stats.energyShieldBonusPercent || 0) + item.energyShieldBonusPercent;
    }
    // Attack Speed Modifier (flat percentage; e.g., 0.5 means +50%)
    if (item.attackSpeedModifier !== undefined) {
        stats.attackSpeedMultiplier *= (1 + item.attackSpeedModifier);
    }
    // Critical Chance Modifier
    if (item.criticalChanceModifier !== undefined) {
        stats.criticalChance = (stats.criticalChance || 0) + item.criticalChanceModifier;
    }
    // Critical Multiplier Modifier
    if (item.criticalMultiplierModifier !== undefined) {
        stats.criticalMultiplier = (stats.criticalMultiplier || 1) * (1 + item.criticalMultiplierModifier);
    }
    // Precision and Deflection
    if (item.precision !== undefined) {
        stats.precision = (stats.precision || 0) + item.precision;
    }
    if (item.deflection !== undefined) {
        stats.deflection = (stats.deflection || 0) + item.deflection;
    }
    if (item.healthRegen) {
        stats.healthRegen += item.healthRegen;
    }

    // Apply other stat modifiers, avoiding direct assignment to stats.attackSpeed
    if (item.statModifiers) {
        for (let stat in item.statModifiers) {
            // Skip stats that are already handled or could conflict
            if (
                stat === 'damageTypes' ||
                stat === 'defenseTypes' ||
                stat === 'damageTypeModifiers' ||
                stat === 'attackSpeedModifier' ||
                stat === 'criticalChanceModifier' ||
                stat === 'criticalMultiplierModifier' ||
                stat === 'attackSpeed' ||           // Avoid direct assignment to stats.attackSpeed
                stat === 'attackSpeedMultiplier'    // Avoid direct assignment
            ) {
                continue; // Already handled or should be skipped
            } else if (stat in stats) {
                stats[stat] += item.statModifiers[stat];
            } else {
                stats[stat] = item.statModifiers[stat];
            }
        }
    }
}

// Helper function to capitalize the first letter
// Remove duplicate capitalize() and use the one from combat.js
// function capitalize(str) {
//     return str.charAt(0).toUpperCase() + str.slice(1);
// }

// Updated playerBaseStats (removed inherent attackSpeed)
let playerBaseStats = {
    health: 100,
    healthRegen: 1,
    energyShield: 0,
    criticalChance: 0,
    criticalMultiplier: 1.5,
    precision: 0,
    deflection: 0,
    damageTypes: {
        kinetic: 0,
        mental: 0,
        pyro: 0,
        chemical: 0,
        magnetic: 0
    },
    defenseTypes: {
        toughness: 0,
        fortitude: 0,
        heatResistance: 0,
        immunity: 0,
        antimagnet: 0
    }
};

let player = {
    name: 'Player',
    level: 1,
    experience: 0,
    currentHealth: null,
    currentShield: null,
    baseStats: JSON.parse(JSON.stringify(playerBaseStats)),
    totalStats: {},
    statusEffects: [],
    equipment: {
        mainHand: null,
        offHand: null,
        head: null,
        chest: null,
        legs: null,
        feet: null,
        gloves: null,
        bionicSlots: [null, null, null, null],
    },
    gatheringSkills: {
        Mining: {
            level: 1,
            experience: 0,
        },
        Medtek: {
            level: 1,
            experience: 0,
        },
        // Add other skills as needed
    },
    activeBuffs: [],
    effects: [],
    // This property holds the cumulative passive bonus (e.g., 0.30 for +30%)
    passiveAttackSpeedBonus: 0,

    applyBuff: function (buffName) {
        const buffDef = buffs.find(b => b.name === buffName);
        if (!buffDef) {
            console.error(`Buff '${buffName}' not found.`);
            return;
        }
        const buff = JSON.parse(JSON.stringify(buffDef));
        buff.remainingDuration = buff.duration;
        const existingBuff = this.activeBuffs.find(b => b.name === buff.name);
        if (existingBuff) {
            existingBuff.remainingDuration = buff.duration;
        } else {
            this.activeBuffs.push(buff);
        }
        updatePlayerStatsDisplay();
        console.log(`Applied buff: ${buff.name}`);
        logMessage(`${this.name} gains buff: ${buff.name}`);
        this.calculateStats();
    },

    calculateStats: function() {
        // Start with a fresh copy of base stats.
        let stats = JSON.parse(JSON.stringify(playerBaseStats));
        
        // Initialize bonus fields
        stats.healthBonus = 0;
        stats.healthBonusPercent = 0;
        stats.energyShieldBonus = 0;
        stats.energyShieldBonusPercent = 0;
        stats.damageTypeModifiers = {}; // Initialize as empty object to avoid inheriting modifiers
        
        // Initialize each damage type modifier to base value of 1.0 (100%)
        for (let damageType in stats.damageTypes) {
            stats.damageTypeModifiers[damageType] = 1.0;
        }
        
        // Apply passive bonuses to stats
        if (this.passiveBonuses) {
            // Apply flat bonuses
            if (this.passiveBonuses.flatHealth > 0) {
                stats.healthBonus += this.passiveBonuses.flatHealth;
            }
            
            if (this.passiveBonuses.flatEnergyShield > 0) {
                stats.energyShieldBonus += this.passiveBonuses.flatEnergyShield;
            }
            
            if (this.passiveBonuses.healthRegen > 0) {
                stats.healthRegen += this.passiveBonuses.healthRegen;
            }
            
            if (this.passiveBonuses.precision > 0) {
                stats.precision += this.passiveBonuses.precision;
            }
            
            if (this.passiveBonuses.deflection > 0) {
                stats.deflection += this.passiveBonuses.deflection;
            }
            
            // Apply percentage bonuses
            if (this.passiveBonuses.healthPercent > 0) {
                stats.healthBonusPercent += this.passiveBonuses.healthPercent / 100;
            }
            
            if (this.passiveBonuses.energyShieldPercent > 0) {
                stats.energyShieldBonusPercent += this.passiveBonuses.energyShieldPercent / 100;
            }
            
            // Apply critical chance and multiplier
            if (this.passiveBonuses.criticalChance > 0) {
                stats.criticalChance += this.passiveBonuses.criticalChance / 100;
            }
            
            if (this.passiveBonuses.criticalMultiplier > 0) {
                stats.criticalMultiplier += this.passiveBonuses.criticalMultiplier;
            }
            
            // Apply flat damage bonuses
            for (const damageType in this.passiveBonuses.flatDamageTypes) {
                if (!stats.damageTypes[damageType]) {
                    stats.damageTypes[damageType] = 0;
                }
                stats.damageTypes[damageType] += this.passiveBonuses.flatDamageTypes[damageType];
            }
            
            // Apply defense bonuses
            for (const defenseType in this.passiveBonuses.defenseTypes) {
                if (!stats.defenseTypes[defenseType]) {
                    stats.defenseTypes[defenseType] = 0;
                }
                stats.defenseTypes[defenseType] += this.passiveBonuses.defenseTypes[defenseType];
            }
            
            // Apply percentage damage bonuses (will be merged with gear bonuses later)
            for (const damageType in this.passiveBonuses.damageTypes) {
                if (!stats.damageTypeModifiers[damageType]) {
                    stats.damageTypeModifiers[damageType] = 1.0; // Base 100%
                }
                // Add percentage as decimal (e.g., +15% becomes +0.15)
                stats.damageTypeModifiers[damageType] += this.passiveBonuses.damageTypes[damageType] / 100;
            }
        }
        
        // Determine base attack speed from equipped weapon (default 1.0)
        let baseAttackSpeed = 1.0;
        if (this.equipment.mainHand && this.equipment.mainHand.bAttackSpeed !== undefined) {
            baseAttackSpeed = this.equipment.mainHand.bAttackSpeed;
        }
        
        // Sum equipment attack speed bonus from items.
        let equipmentASBonus = 0;
        Object.keys(this.equipment).forEach(slot => {
            if (slot === 'bionicSlots') {
                this.equipment[slot].forEach(bionic => {
                    if (bionic) {
                        if (bionic.attackSpeedModifier !== undefined) {
                            equipmentASBonus += bionic.attackSpeedModifier;
                        }
                        applyItemModifiers(stats, bionic);
                    }
                });
            } else if (this.equipment[slot]) {
                if (this.equipment[slot].attackSpeedModifier !== undefined) {
                    equipmentASBonus += this.equipment[slot].attackSpeedModifier;
                }
                applyItemModifiers(stats, this.equipment[slot]);
            }
        });
        
        // Sum buffs that affect attack speed.
        if (this.activeBuffs) {
            this.activeBuffs.forEach(buff => {
                if (buff.statChanges && buff.statChanges.attackSpeed !== undefined) {
                    equipmentASBonus += buff.statChanges.attackSpeed;
                }
                if (buff.statChanges) {
                    for (let stat in buff.statChanges) {
                        if (stat !== 'attackSpeed' && stat in stats) {
                            stats[stat] += buff.statChanges[stat];
                        }
                    }
                }
            });
        }
        
        // Get the passive bonus (already stored in player.passiveAttackSpeedBonus)
        let passiveBonus = this.passiveAttackSpeedBonus || 0;
        
        // Final attack speed = baseAttackSpeed * (1 + (equipment bonus + passive bonus))
        stats.attackSpeed = baseAttackSpeed * (1 + equipmentASBonus + passiveBonus);
        stats.attackSpeed = Math.min(Math.max(stats.attackSpeed, 0.1), 10);
        
        // Process damage type modifiers (using modifiers that now include both passive and equipment bonuses)
        for (let dt in stats.damageTypes) {
            if (stats.damageTypeModifiers[dt]) {
                stats.damageTypes[dt] *= stats.damageTypeModifiers[dt];
            }
            stats.damageTypes[dt] = Math.round(stats.damageTypes[dt]);
        }
        
        // Apply health and energy shield bonuses.
        stats.health += stats.healthBonus;
        stats.health *= 1 + stats.healthBonusPercent;
        stats.health = Math.round(stats.health);
        
        stats.energyShield += stats.energyShieldBonus;
        stats.energyShield *= 1 + stats.energyShieldBonusPercent;
        stats.energyShield = Math.round(stats.energyShield);
        
        this.totalStats = stats;
        
        if (this.currentHealth === null || this.currentHealth === undefined) {
            this.currentHealth = stats.health;
        }
        if (this.currentShield === null || this.currentShield === undefined) {
            this.currentShield = stats.energyShield;
        }
    },
};




// Function to log messages
function logMessage(message) {
    const logElement = document.getElementById("log-messages");
    const messageElement = document.createElement("div");

    // Process the message for color codes
    const processedMessage = processColorCodes(message);
    messageElement.innerHTML = processedMessage;

    logElement.appendChild(messageElement);

    // Auto-scroll to the bottom
    logElement.scrollTop = logElement.scrollHeight;
}

function processColorCodes(message) {
    // Define color codes and their corresponding HTML styles
    const colorStyles = {
        'red': 'color: red;',
        'blue': 'color: blue;',
        'green': 'color: green;',
        'yellow': 'color: yellow;',
        'flashing': 'animation: flash 1s infinite;',
        // Add more colors or styles as needed
    };

    // Regular expression to match color codes
    const regex = /\{([^\}]+)\}/g;

    let result;
    let lastIndex = 0;
    let finalMessage = '';

    while ((result = regex.exec(message)) !== null) {
        const [fullMatch, code] = result;
        const index = result.index;

        // Append the text before the code
        finalMessage += message.substring(lastIndex, index);

        // Check if the code is an end tag
        if (code === 'end') {
            finalMessage += '</span>';
        } else if (colorStyles[code]) {
            // Start a new span with the corresponding style
            finalMessage += `<span style="${colorStyles[code]}">`;
        } else if (code.startsWith('rainbow')) {
            // Handle rainbow or alternating colors
            const text = code.substring('rainbow '.length);
            finalMessage += applyRainbowText(text);
            // Since we consumed the text, move lastIndex forward
            lastIndex = regex.lastIndex + text.length + 1;
            regex.lastIndex = lastIndex;
            continue;
        } else {
            // If the code is not recognized, include it as plain text
            finalMessage += fullMatch;
        }

        lastIndex = regex.lastIndex;
    }

    // Append any remaining text after the last code
    finalMessage += message.substring(lastIndex);

    return finalMessage;
}

function applyRainbowText(text) {
    const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];
    let result = '';
    for (let i = 0; i < text.length; i++) {
        const color = colors[i % colors.length];
        result += `<span style="color: ${color};">${text[i]}</span>`;
    }
    return result;
}


// Function to gain experience and handle leveling up
function gainExperience(amount) {
    player.experience += amount;
    logMessage(`You gained ${amount} experience points.`);
    updatePlayerStatsDisplay(); // Update the experience display
    checkLevelUp(); // Check if the player leveled up
}

function checkLevelUp() {
    // Don't level up if already at max level
    if (player.level >= MAX_PLAYER_LEVEL) {
        return;
    }
    
    const xpForNextLevel = getXPForNextLevel(player.level);
    
    if (player.experience >= xpForNextLevel) {
        player.level++;
        player.experience -= xpForNextLevel;
        player.passivePoints = (player.passivePoints||0) + 2;  // Award 2 passive points per level
        
        // Play level up sound
        if (window.playSound) {
            playSound('LEVEL_UP', 0.5);
        }
        
        logMessage(`Congratulations! You've reached level ${player.level} and gained 2 passive points!`);
        
        // If we've reached max level, cap experience and show a message
        if (player.level >= MAX_PLAYER_LEVEL) {
            player.experience = 0;
            logMessage(`You've reached the maximum level of ${MAX_PLAYER_LEVEL}!`);
        }
        
        // Increase base stats upon leveling up (optional)
        updatePlayerStatsDisplay(); // Update the level display
        
        // Check for more level ups
        checkLevelUp();
    }
}


function getXPForNextLevel(level) {
    // If level is 1, next level requires 100 XP
    if (level <= 1) {
        return 100;
    }
    // Recursively get XP for (level - 1), then apply the formula
    const prevReq = getXPForNextLevel(level - 1);
    return Math.round((prevReq + 15) * 1.15);
}

// Save game function
function saveGame(isAutoSave = false) {
    try {
        // Create a game state object
        const gameState = {
            player: {
                baseStats: player.baseStats,
                currentHealth: player.currentHealth,
                currentShield: player.currentShield,
                statusEffects: player.statusEffects,
                experience: player.experience,
                level: player.level,
                gatheringSkills: player.gatheringSkills,
                activeBuffs: player.activeBuffs,
                equipment: player.equipment,
                currency: playerCurrency,
                passives: {
                    allocations: player.passiveAllocations,
                    points: player.passivePoints,
                    gearBonuses: player.gearPassiveBonuses
                }
            },
            inventory: window.inventory,
            shopRefresh: {
                nextShopRefreshTime: nextShopRefreshTime
            },
            isDelveInProgress: isDelveInProgress,
            currentDelveLocation: currentDelveLocation,
            currentMonsterIndex: currentMonsterIndex,
            delveBag: delveBag
        };
        
        // Convert to JSON and save to localStorage
        localStorage.setItem('idleCombatGameSave', JSON.stringify(gameState));
        console.log('Game saved successfully.');
        
        // Play save sound unless it's an auto-save
        if (window.playSound && !isAutoSave) {
            playSound('SAVE_GAME', 0.3);
        }
        
        // Only show the message if it's a manual save
        if (!isAutoSave) {
            logMessage('Game saved successfully.');
        }
    } catch (e) {
        console.error('Error saving game:', e);
        logMessage('Error saving game!');
    }
}

function loadGame() {
    const savedState = localStorage.getItem('idleCombatGameSave');
    if (savedState) {
        try {
            // Stop any active systems before loading
            if (isCombatActive) stopCombat('gameLoad');
            if (isGathering) stopGatheringActivity();
            
            const gameState = JSON.parse(savedState);
            player.baseStats = gameState.player.baseStats || JSON.parse(JSON.stringify(playerBaseStats));
            player.currentHealth = gameState.player.currentHealth;
            player.currentShield = gameState.player.currentShield;
            player.statusEffects = gameState.player.statusEffects || [];
            player.experience = gameState.player.experience;
            player.level = gameState.player.level;
            player.gatheringSkills = gameState.player.gatheringSkills || player.gatheringSkills;
            player.activeBuffs = gameState.player.activeBuffs || [];
            player.equipment = restoreEquipment(gameState.player.equipment);
            playerCurrency = (typeof gameState.player.currency === 'number') ? gameState.player.currency : playerCurrency;
            
            // Restore passives data and immediately reapply them.
            if (gameState.player.passives) {
                player.passiveAllocations = gameState.player.passives.allocations || {};
                player.passivePoints = gameState.player.passives.points || 0;
                player.gearPassiveBonuses = gameState.player.passives.gearBonuses || {};
            } else {
                player.passiveAllocations = {};
                player.passivePoints = 1; // New player starts with 1 point
                player.gearPassiveBonuses = {};
            }
            applyAllPassivesToPlayer();
            
            window.inventory = gameState.inventory.map(savedItem => restoreItem(savedItem));
            if (gameState.shopRefresh && typeof gameState.shopRefresh.nextShopRefreshTime === 'number') {
                nextShopRefreshTime = gameState.shopRefresh.nextShopRefreshTime;
            } else {
                nextShopRefreshTime = Date.now() + SHOP_REFRESH_INTERVAL;
            }
            player.calculateStats();
            updatePlayerStatsDisplay();
            updateInventoryDisplay();
            updateEquipmentDisplay();
            console.log('Game loaded successfully.');
            logMessage('Game loaded successfully.');
        } catch (error) {
            console.error('Error loading saved game:', error);
            logMessage('Failed to load saved game. Starting a new game.');
            resetGame();
        }
    } else {
        console.log('No saved game found.');
        logMessage('No saved game found.');
    }
    const event = new Event('gameLoaded');
    window.dispatchEvent(event);
}

function restoreItem(savedItem) {
    // Find the item template
    const itemTemplate = items.find(item => item.name === savedItem.name);
    if (itemTemplate) {
        // Create a new item instance from the template
        const itemInstance = generateItemInstance(itemTemplate);

        // Copy over properties from the saved item
        Object.assign(itemInstance, savedItem);

        return itemInstance;
    } else {
        console.warn(`Item template not found for ${savedItem.name}`);
        return savedItem; // Return the saved item as is
    }
}

function restoreEquipment(savedEquipment) {
    const equipment = {};

    // Restore standard slots
    ['mainHand', 'offHand', 'head', 'chest', 'legs', 'feet', 'gloves'].forEach(slot => {
        if (savedEquipment[slot]) {
            equipment[slot] = restoreItem(savedEquipment[slot]);
        } else {
            equipment[slot] = null;
        }
    });

    // Restore bionic slots
    equipment.bionicSlots = [];
    if (Array.isArray(savedEquipment.bionicSlots)) {
        savedEquipment.bionicSlots.forEach(savedItem => {
            if (savedItem) {
                equipment.bionicSlots.push(restoreItem(savedItem));
            } else {
                equipment.bionicSlots.push(null);
            }
        });
    }

    return equipment;
}

// Add missing function
function stopDelveWithFailure() {
    if (isDelveInProgress) {
        logMessage("Your delve fails, and you lose all items you found!");
        delveBag = { items: [], credits: 0 };
        isDelveInProgress = false;
        currentDelveLocation = null;
        currentMonsterIndex = 0;
        
        // Ensure combat is fully stopped
        if (isCombatActive) {
            stopCombat('delveFailure');
        }
        
        // Update UI
        displayAdventureLocations();
    }
}

// Reset game function
function resetGame() {
    if (confirm('Are you sure you want to reset your save? This action cannot be undone.')) {
        // Clear localStorage
        localStorage.removeItem('idleCombatGameSave');

        // Reset player, inventory, and equipped items to initial state
        player.baseStats = JSON.parse(JSON.stringify(playerBaseStats));
        player.totalStats = {};
        player.currentHealth = null;
        player.currentShield = null;
        player.statusEffects = [];
        player.activeBuffs = [];
        player.effects = [];
        player.experience = 0;
        player.level = 1;
        
        // Reset passive system
        player.passivePoints = 1; // Start with 1 point as a new player
        player.passiveAllocations = {}; // Clear all allocations
        player.gearPassiveBonuses = {}; // Clear all gear bonuses
        player.passiveAttackSpeedBonus = 0; // Reset cumulative passive bonus
        
        player.gatheringSkills = {
            Mining: { level: 1, experience: 0 },
            Medtek: { level: 1, experience: 0 },
            Foraging: { level: 1, experience: 0 },
            // Add other skills as needed
        };

        // Reset equipment
        player.equipment = {
            mainHand: null,
            offHand: null,
            head: null,
            chest: null,
            legs: null,
            feet: null,
            gloves: null,
            bionicSlots: [null, null, null, null]
        };

        // Clear inventory
        window.inventory = []; // Start with an empty inventory

        // Add a starting item
        const startingItemTemplate = items.find(item => item.name === 'Broken Phase Sword');
        if (startingItemTemplate) {
            const startingItem = generateItemInstance(startingItemTemplate);
            window.inventory.push(startingItem);
        } else {
            console.warn('Starting item template not found.');
        }

        playerCurrency = 500;

        // Recalculate player stats and update UI
        player.calculateStats();
        updateInventoryDisplay();
        updateEquipmentDisplay();
        updatePlayerStatsDisplay();
        displayPassivesScreen(); // Make sure passive screen is also updated
        
        // Re-initialize equipment slots
        initializeEquipmentSlots();
        
        // Show the updated UI
        showScreen('inventory-screen');
        
        logMessage('Game has been reset!');
    } else {
        console.log('Reset cancelled.');
        logMessage('Reset cancelled.');
    }
}


// Auto-save interval (saves every 5 seconds)
setInterval(() => saveGame(true), 5000); // Adjust the interval as needed

// Function to display adventure locations
function displayAdventureLocations() {
    const adventureDiv = document.getElementById('adventure-locations');

    // Ensure the adventure locations div exists
    if (!adventureDiv) {
        console.error("Adventure locations div not found in the DOM.");
        return;
    }

    adventureDiv.innerHTML = ''; // Clear existing content

    if (!isCombatActive) {
        // Display location buttons when not in combat
        locations.forEach(location => {
            const locationButton = document.createElement('button');
            locationButton.textContent = location.name;
            locationButton.title = location.description;
            locationButton.addEventListener('click', () => {
                startAdventure(location);
            });
            adventureDiv.appendChild(locationButton);
        });
    } else {
        // Display "Flee" button when in combat
        const fleeButton = document.createElement('button');
        fleeButton.textContent = 'Flee';
        fleeButton.addEventListener('click', () => {
            stopCombat();
        });
        adventureDiv.appendChild(fleeButton);
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('save-game').addEventListener('click', () => saveGame(false));
    document.getElementById('load-game').addEventListener('click', loadGame);
    document.getElementById('reset-game').addEventListener('click', resetGame);
    document.addEventListener('DOMContentLoaded', () => {

        document.querySelectorAll('.sidebar-menu li').forEach(menuItem => {
            menuItem.addEventListener('click', () => {
                const screenId = menuItem.getAttribute('data-screen');
                const skillName = menuItem.getAttribute('data-skill');

                // Stop any ongoing activities
                if (isGathering) {
                    stopGatheringActivity();
                }
                if (isCombatActive) {
                    stopCombat();
                }

                if (screenId) {
                    showScreen(screenId);
                } else if (skillName) {
                    const skillScreenId = getSkillScreenId(skillName);
                    showScreen(skillScreenId);

                    if (skillName === 'Fabrication') {
                        displayFabricationRecipes(); // Function from fabrication.js
                    } else {
                        // Display activities for gathering skills
                        displaySkillActivities(skillName);
                    }
                }
            });
        });
    });
    function getSkillScreenId(skillName) {
        if (skillName === 'Fabrication') {
            return 'fabrication-screen';
        } else {
            return `${skillName.toLowerCase()}-screen`;
        }
    }

    // Event listener for settings button
    document.getElementById('settings-button').addEventListener('click', () => {
        // Open settings modal
        document.getElementById('settings-menu').style.display = 'block';
    });

    // Event listener for closing settings modal
    document.getElementById('close-settings').addEventListener('click', () => {
        document.getElementById('settings-menu').style.display = 'none';
    });

    // Automatically load the game when the page is loaded
    loadGame();

    // Initial display updates
    updatePlayerStatsDisplay();
    updateInventoryDisplay();
    updateEquipmentDisplay();
});


// Function to show the appropriate screen
function showScreen(screenId) {
    // Hide all screens
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.classList.remove('active');
    });

    // Show the selected screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        window.currentScreen = screenId;
        
        // Update sidebar menu to show active item
        updateSidebarActiveItem(screenId);
    } else {
        console.error(`Screen with ID ${screenId} not found.`);
        return;
    }
    
    if (screenId !== 'adventure-screen') {
        // Clear any pending combat restart
        if (combatRestartTimeout) {
            clearTimeout(combatRestartTimeout);
            combatRestartTimeout = null;
            console.log("Pending combat restart canceled due to screen change.");
        }
    }

    // Dispatch screenChanged event
    const event = new CustomEvent('screenChanged', { detail: { screenId } });
    window.dispatchEvent(event);

    // Stop any ongoing activities when switching screens
    if (isGathering) {
        stopGatheringActivity();
    }
    if (isCombatActive && screenId !== 'adventure-screen') {
        stopCombat();
    }
    if (screenId === 'adventure-screen') {
        stopCombat();
        updatePlayerStatsDisplay();
        updateEnemyStatsDisplay();
    }
}

// Function to update the active sidebar menu item
function updateSidebarActiveItem(screenId) {
    // Remove active class from all menu items
    document.querySelectorAll('.sidebar-menu li').forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active class to the matching menu item
    const menuItem = document.querySelector(`.sidebar-menu li[data-screen="${screenId}"]`);
    if (menuItem) {
        menuItem.classList.add('active');
    } else {
        // Handle skill screens (convert mining-screen to Mining skill)
        const skillName = screenId.replace('-screen', '');
        const skillItem = document.querySelector(`.sidebar-menu li[data-skill="${skillName.charAt(0).toUpperCase() + skillName.slice(1)}"]`);
        if (skillItem) {
            skillItem.classList.add('active');
        }
    }
}

// Event listeners for sidebar menu items
document.querySelectorAll('.sidebar-menu li').forEach(menuItem => {
    menuItem.addEventListener('click', () => {
        const screenId = menuItem.getAttribute('data-screen');
        const skillName = menuItem.getAttribute('data-skill');

        if (screenId) {
            showScreen(screenId);
            // Stop gathering or combat if needed
            if (screenId === 'adventure-screen') {
                // Handle adventure screen setup
                if (isGathering) {
                    stopGatheringActivity();
                }
                displayAdventureLocations(); // Ensure locations are displayed
            } else {
                // For other screens, stop combat
                if (isCombatActive) {
                    stopCombat();
                }
                if (isGathering) {
                    stopGatheringActivity();
                }
            }
        } else if (skillName) {
            // Show the skill screen
            showScreen(`${skillName.toLowerCase()}-screen`);
            // Start gathering activity if applicable
            startSkillActivity(skillName);
        }
    });
});
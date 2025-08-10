window.currentScreen = '';

console.log('global.js loaded');
console.log('window.inventory at the start:', window.inventory);

let playerCurrency = 1000000;

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

// applyItemModifiers function moved to stats.js

// Helper function to capitalize the first letter moved to stats.js
// function capitalize(str) {
//     return str.charAt(0).toUpperCase() + str.slice(1);
// }

// Updated playerBaseStats (removed inherent attackSpeed)
const playerBaseStats = {
    level: 1,
    maxHealth: 100,
    maxEnergyShield: 0,
    healthRegen: 1, // Health regenerated per second
    attackSpeed: 1,
    criticalChance: 0.05,
    criticalMultiplier: 1.5,
    precision: 0,
    deflection: 0,
    // Efficiency stats - increase proc effect chances
    armorEfficiency: 0,     // Affects armor slot proc effects
    weaponEfficiency: 0,    // Affects weapon and offhand proc effects
    bionicEfficiency: 0,    // Affects bionic slot proc effects
    // Bionic enhancement
    bionicSync: 0,          // Increases stats gained from bionics
    // Combo attack system
    comboAttack: 0,         // % chance to strike additional time after initial hit
    comboEffectiveness: 0,  // Increases damage dealt by combo attacks (base 20%)
    additionalComboAttacks: 0, // Number of additional combo hits beyond the first
    // Mastery system - increases damage for specific damage types
    kineticMastery: 0,      // Increases kinetic damage
    slashingMastery: 0,     // Increases slashing damage
    // Severed limb system
    severedLimbChance: 0,   // % chance to sever limbs on critical strikes
    maxSeveredLimbs: 1,     // Maximum limbs that can be severed on opponent
    damageTypes: {
        
    },
    // New defense types
    defenseTypes: {
        sturdiness: 0,  // Counters Physical damage (kinetic, slashing)
        structure: 0,   // Counters Elemental damage (pyro, cryo, electric)
        stability: 0    // Counters Chemical damage (corrosive, radiation)
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
    effects: [],
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
    // This property holds the cumulative passive bonus (e.g., 0.30 for +30%)
    passiveAttackSpeedBonus: 0,
    // Inventory management
    maxInventorySlots: 30,

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

    // calculateStats implementation moved to stats.js
    calculateStats: function() {
        // Call the centralized function from stats.js
        // It will modify this.totalStats, this.currentHealth, this.currentShield directly
        if (typeof calculatePlayerStats === 'function') {
            calculatePlayerStats(this);
        } else {
            console.error("calculatePlayerStats function not found! Make sure stats.js is loaded.");
        }
        // Return the calculated stats (optional, as the function modifies 'this')
        return this.totalStats;
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
        player.passivePoints = (player.passivePoints||0) + 1;  // Award 1 passive point per level (changed from 2)
        
        // Play level up sound
        if (window.playSound) {
            playSound('LEVEL_UP', 0.5);
        }
        
        logMessage(`Congratulations! You've reached level ${player.level} and gained 1 passive point!`);
        
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
                maxInventorySlots: player.maxInventorySlots,
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

// Function to migrate from old defense types to new ones
function migrateDefenseTypes(entity) {
    // Skip if entity doesn't exist or already has new defense types
    if (!entity || !entity.totalStats || !entity.totalStats.defenseTypes) return;

    const defenseTypes = entity.totalStats.defenseTypes;
    
    // Check if we need to migrate (if any old defense type exists)
    const needsMigration = defenseTypes.toughness !== undefined || 
                         defenseTypes.fortitude !== undefined || 
                         defenseTypes.heatResistance !== undefined || 
                         defenseTypes.immunity !== undefined || 
                         defenseTypes.antimagnet !== undefined;
    
    if (!needsMigration) return;
    
    // Initialize new defense types if they don't exist
    if (defenseTypes.sturdiness === undefined) defenseTypes.sturdiness = 0;
    if (defenseTypes.structure === undefined) defenseTypes.structure = 0;
    if (defenseTypes.stability === undefined) defenseTypes.stability = 0;
    
    // Migrate old values to new ones
    // Physical Group
    if (defenseTypes.toughness !== undefined) {
        defenseTypes.sturdiness += defenseTypes.toughness;
    }
    if (defenseTypes.fortitude !== undefined) {
        defenseTypes.sturdiness += defenseTypes.fortitude / 2; // Split mental defense
    }
    
    // Elemental Group
    if (defenseTypes.heatResistance !== undefined) {
        defenseTypes.structure += defenseTypes.heatResistance;
    }
    if (defenseTypes.antimagnet !== undefined) {
        defenseTypes.structure += defenseTypes.antimagnet;
    }
    
    // Chemical Group
    if (defenseTypes.immunity !== undefined) {
        defenseTypes.stability += defenseTypes.immunity;
    }
    
    // Remove old defense types
    delete defenseTypes.toughness;
    delete defenseTypes.fortitude;
    delete defenseTypes.heatResistance;
    delete defenseTypes.immunity;
    delete defenseTypes.antimagnet;
    
    console.log("Defense types migrated to new system");
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
            
            // Migrate new stats if they're missing from old saves
            if (player.baseStats.armorEfficiency === undefined) player.baseStats.armorEfficiency = 0;
            if (player.baseStats.weaponEfficiency === undefined) player.baseStats.weaponEfficiency = 0;
            if (player.baseStats.bionicEfficiency === undefined) player.baseStats.bionicEfficiency = 0;
            if (player.baseStats.bionicSync === undefined) player.baseStats.bionicSync = 0;
            if (player.baseStats.comboAttack === undefined) player.baseStats.comboAttack = 0;
            if (player.baseStats.comboEffectiveness === undefined) player.baseStats.comboEffectiveness = 0;
            if (player.baseStats.additionalComboAttacks === undefined) player.baseStats.additionalComboAttacks = 0;
            player.currentHealth = gameState.player.currentHealth;
            player.currentShield = gameState.player.currentShield;
            player.statusEffects = gameState.player.statusEffects || [];
            player.experience = gameState.player.experience;
            player.level = gameState.player.level;
            player.gatheringSkills = gameState.player.gatheringSkills || player.gatheringSkills;
            player.activeBuffs = gameState.player.activeBuffs || [];
            player.equipment = restoreEquipment(gameState.player.equipment);
            playerCurrency = (typeof gameState.player.currency === 'number') ? gameState.player.currency : playerCurrency;
            player.maxInventorySlots = gameState.player.maxInventorySlots || 30; // Default to 30 if not saved
            
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
            
            // Apply migration for the new defense system
            migrateDefenseTypes(player);
            
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

// Function to migrate item defense types
function migrateItemDefenseTypes(item) {
    if (!item || !item.defenseTypes) return item;
    
    // Check if we need to migrate
    const needsMigration = item.defenseTypes.toughness !== undefined || 
                         item.defenseTypes.fortitude !== undefined || 
                         item.defenseTypes.heatResistance !== undefined || 
                         item.defenseTypes.immunity !== undefined || 
                         item.defenseTypes.antimagnet !== undefined;
    
    if (!needsMigration) return item;
    
    // Initialize new defense types
    if (item.defenseTypes.sturdiness === undefined) item.defenseTypes.sturdiness = 0;
    if (item.defenseTypes.structure === undefined) item.defenseTypes.structure = 0;
    if (item.defenseTypes.stability === undefined) item.defenseTypes.stability = 0;
    
    // Migrate values
    if (item.defenseTypes.toughness !== undefined) {
        item.defenseTypes.sturdiness += item.defenseTypes.toughness;
        delete item.defenseTypes.toughness;
    }
    
    if (item.defenseTypes.fortitude !== undefined) {
        item.defenseTypes.sturdiness += Math.ceil(item.defenseTypes.fortitude / 2);
        delete item.defenseTypes.fortitude;
    }
    
    if (item.defenseTypes.heatResistance !== undefined) {
        item.defenseTypes.structure += item.defenseTypes.heatResistance;
        delete item.defenseTypes.heatResistance;
    }
    
    if (item.defenseTypes.antimagnet !== undefined) {
        item.defenseTypes.structure += item.defenseTypes.antimagnet;
        delete item.defenseTypes.antimagnet;
    }
    
    if (item.defenseTypes.immunity !== undefined) {
        item.defenseTypes.stability += item.defenseTypes.immunity;
        delete item.defenseTypes.immunity;
    }
    
    return item;
}

function restoreItem(savedItem) {
    if (!savedItem) return null;
    
    console.log(`Trying to restore item: ${savedItem.name}`);
    
    // Migrate defense types if needed
    savedItem = migrateItemDefenseTypes(savedItem);
    
    // Migrate damageTypes as well (if it has old damage types)
    if (savedItem.damageTypes) {
        // Check for and convert old damage types to new ones
        if (savedItem.damageTypes.mental !== undefined) {
            savedItem.damageTypes.slashing = savedItem.damageTypes.mental;
            delete savedItem.damageTypes.mental;
        }
        
        if (savedItem.damageTypes.magnetic !== undefined) {
            savedItem.damageTypes.electric = savedItem.damageTypes.magnetic;
            delete savedItem.damageTypes.magnetic;
        }
        
        if (savedItem.damageTypes.chemical !== undefined) {
            savedItem.damageTypes.corrosive = savedItem.damageTypes.chemical;
            delete savedItem.damageTypes.chemical;
        }
    }
    
    // Find the template for this item
    const itemTemplate = window.items.find(item => item.name === savedItem.name);
    
    if (itemTemplate) {
        console.log(`Template found for ${savedItem.name}, type: ${itemTemplate.type}`);
        
        // Create a new item instance from the template
        const itemInstance = generateItemInstance(itemTemplate);

        // Copy over properties from the saved item
        Object.assign(itemInstance, savedItem);

        return itemInstance;
    } else {
        console.warn(`Item template not found for ${savedItem.name}`);
        console.log(`Available weapons: ${window.weapons ? window.weapons.length : 'no weapons'}`);
        if (window.weapons && window.weapons.length > 0) {
            console.log(`First few weapon names: ${window.weapons.slice(0, 3).map(w => w.name).join(', ')}`);
            // Check if the name exists but has a slight mismatch
            const similarWeapon = window.weapons.find(w => 
                w.name.toLowerCase().includes(savedItem.name.toLowerCase()) || 
                savedItem.name.toLowerCase().includes(w.name.toLowerCase())
            );
            if (similarWeapon) {
                console.log(`Found similar weapon name: "${similarWeapon.name}" vs "${savedItem.name}"`);
            }
        }
        return savedItem; // Return the saved item as is
    }
}

function restoreEquipment(savedEquipment) {
    if (!savedEquipment) return {
        mainHand: null,
        offHand: null,
        head: null,
        chest: null,
        legs: null,
        feet: null,
        gloves: null,
        bionicSlots: [null, null, null, null],
    };
    
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

        playerCurrency = 1000000;

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
        // Display cards when not in combat
        const grid = document.createElement('div');
        grid.className = 'adventure-grid';
        adventureDiv.appendChild(grid);

        locations.forEach(location => {
            const card = document.createElement('div');
            card.className = 'adventure-card';

            // Header
            const header = document.createElement('div');
            header.className = 'adventure-card-header';
            const title = document.createElement('div');
            title.className = 'adventure-card-title';
            title.textContent = location.name;
            header.appendChild(title);
            if (location.recommendedLevel) {
                const badge = document.createElement('span');
                badge.className = 'adventure-badge';
                badge.textContent = `Rec. Lv ${location.recommendedLevel}`;
                header.appendChild(badge);
            }
            card.appendChild(header);

            // Body
            const body = document.createElement('div');
            body.className = 'adventure-card-body';
            const desc = document.createElement('div');
            desc.className = 'adventure-card-desc';
            desc.textContent = location.description || '';
            body.appendChild(desc);

            const meta = document.createElement('div');
            meta.className = 'adventure-card-meta';
            const fights = document.createElement('span');
            fights.textContent = `${location.numFights || 0} fights`;
            meta.appendChild(fights);
            if (location.locationCategory) {
                const sep = document.createElement('span');
                sep.textContent = ' • ';
                meta.appendChild(sep);
                const cat = document.createElement('span');
                cat.textContent = location.locationCategory;
                meta.appendChild(cat);
            }
            body.appendChild(meta);
            card.appendChild(body);

            // Footer actions
            const startBtn = document.createElement('button');
            startBtn.className = 'adventure-start-btn';
            startBtn.textContent = 'Delve';
            startBtn.addEventListener('click', () => {
                startAdventure(location);
            });
            card.appendChild(startBtn);

            // Tooltip
            card.setAttribute('data-has-tooltip', 'true');
            card.setAttribute('data-tooltip-source', 'adventure-card');
            card.setAttribute('data-tooltip-content', location.description || '');

            grid.appendChild(card);
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
    // Initialize items from the split item files
    if (typeof loadItems === 'function') {
        window.items = loadItems();
        console.log('Items loaded from separate category files');
        
        // Double-check if weapons were properly loaded
        if (window.items && window.weapons && window.weapons.length > 0 && 
            !window.items.find(item => item.type === 'Weapon')) {
            console.log('Weapons available but not in items array - reloading items');
            window.items = loadItems();
        }
    }
    
    // Add a 2-second delayed check to make sure weapons are included in items
    setTimeout(() => {
        if (window.loadItems && window.items && window.weapons && 
            window.weapons.length > 0 && 
            !window.items.find(item => item.type === 'Weapon')) {
            console.log('FINAL CHECK: Weapons still missing from items - forcing reload');
            window.items = window.loadItems();
            console.log(`After final reload: ${window.items.length} items, including ${window.items.filter(i => i.type === 'Weapon').length} weapons`);
        }
    }, 2000);
    
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

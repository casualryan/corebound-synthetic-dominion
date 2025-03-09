// combat.js

let currentLocation = null;
let enemy = null; 
let combatInterval;
let playerAttackTimer = 0;
let enemyAttackTimer = 0;
let playerHasFled = false;
let combatRestartTimeout;
let isCombatActive = false; 
let lastCombatLoopTime;
let adventureStartCountdownInterval;
let healthRegenInterval = null;

// ------------------- NEW Delve Variables -------------------
let isDelveInProgress = false;
let currentDelveLocation = null;
let currentMonsterIndex = 0; // which monster in the sequence
let interFightPauseTimer = null;
let delveBag = { items: [], credits: 0 };


document.addEventListener('DOMContentLoaded', () => {
    updatePlayerStatsDisplay();
    initializeEnemyStatsDisplay(); 
    displayAdventureLocations();
    updateDelveBagUI(); // Initialize the UI

    // We'll use this as the "Flee" button
    const fleeButton = document.getElementById('stop-combat');
    if (fleeButton) {
        fleeButton.addEventListener('click', () => {
            stopCombat('playerFled');
        });
        fleeButton.style.display = 'none'; // Hidden by default, shown when delve starts
    } else {
        console.error("Flee/Stop Combat button not found in the DOM.");
    }

    createShieldPulseAnimation();
});

function displayAdventureLocations() {
    const delveControlsDiv = document.getElementById('delve-controls');
    const adventureDiv = document.getElementById('adventure-locations');
    if (!delveControlsDiv || !adventureDiv) {
        console.error("div#delve-controls or div#adventure-locations not found in the DOM.");
        return;
    }

    // Clear previous UI
    delveControlsDiv.innerHTML = '';
    adventureDiv.innerHTML = '';

    // If a delve is currently in progress, show a "Flee" button and hide location buttons
    if (isDelveInProgress) {
        // Create a stylish Flee button
        const fleeButton = document.createElement('button');
        fleeButton.textContent = "Flee Delve";
        fleeButton.className = 'delve-button danger';
        fleeButton.style.fontSize = '16px';
        fleeButton.style.padding = '12px 24px';
        fleeButton.style.margin = '10px 0';
        fleeButton.style.background = 'linear-gradient(135deg, #d62828, #f94144)';
        fleeButton.style.color = 'white';
        fleeButton.style.border = 'none';
        fleeButton.style.borderRadius = '4px';
        fleeButton.style.boxShadow = '0 0 15px rgba(249, 65, 68, 0.5)';
        fleeButton.style.fontWeight = 'bold';
        fleeButton.style.cursor = 'pointer';
        fleeButton.style.transition = 'all 0.2s ease';
        
        // Add hover effect
        fleeButton.addEventListener('mouseover', function() {
            this.style.background = 'linear-gradient(135deg, #f94144, #d62828)';
            this.style.boxShadow = '0 0 20px rgba(249, 65, 68, 0.7)';
        });
        
        fleeButton.addEventListener('mouseout', function() {
            this.style.background = 'linear-gradient(135deg, #d62828, #f94144)';
            this.style.boxShadow = '0 0 15px rgba(249, 65, 68, 0.5)';
        });
        
        fleeButton.addEventListener('click', () => {
            stopCombat('playerFled');
        });

        // Add it to the delveControls area
        delveControlsDiv.appendChild(fleeButton);

        // Stylish warning note
        const note = document.createElement('p');
        note.innerHTML = '<span style="color: #ff6b6b; font-weight: bold; text-shadow: 0 0 5px rgba(255, 107, 107, 0.3);">⚠️ You are currently delving.</span> <span style="color: #e0f2ff;">Fleeing will forfeit your Delve Bag loot!</span>';
        note.style.padding = '10px';
        note.style.background = 'rgba(0, 15, 40, 0.7)';
        note.style.borderRadius = '4px';
        note.style.border = '1px solid #ff6b6b';
        delveControlsDiv.appendChild(note);

    } else {
        // Create section title
        const locationsTitle = document.createElement('h3');
        locationsTitle.textContent = 'Available Locations';
        locationsTitle.style.color = '#00ffcc';
        locationsTitle.style.textShadow = '0 0 5px rgba(0, 255, 204, 0.5)';
        locationsTitle.style.marginBottom = '15px';
        adventureDiv.appendChild(locationsTitle);
        
        // Create button container for better layout
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.flexWrap = 'wrap';
        buttonContainer.style.gap = '10px';
        adventureDiv.appendChild(buttonContainer);
        
        // No delve in progress, show the location buttons
        locations.forEach(loc => {
            const btn = document.createElement('button');
            btn.textContent = loc.name;
            btn.title = loc.description || "No description";
            
            // Apply sci-fi styling to buttons
            btn.className = 'delve-location-button';
            btn.style.padding = '12px 20px';
            btn.style.background = 'linear-gradient(135deg, #003559, #005f73)';
            btn.style.color = '#e0f2ff';
            btn.style.border = '1px solid #00a6fb';
            btn.style.borderRadius = '4px';
            btn.style.boxShadow = '0 0 10px rgba(0, 166, 251, 0.3)';
            btn.style.fontWeight = 'bold';
            btn.style.minWidth = '150px';
            btn.style.textAlign = 'center';
            btn.style.cursor = 'pointer';
            btn.style.transition = 'all 0.2s ease';
            
            // Add hover effect
            btn.addEventListener('mouseover', function() {
                this.style.background = 'linear-gradient(135deg, #005f73, #003559)';
                this.style.boxShadow = '0 0 15px rgba(0, 166, 251, 0.5)';
                this.style.transform = 'translateY(-2px)';
            });
            
            btn.addEventListener('mouseout', function() {
                this.style.background = 'linear-gradient(135deg, #003559, #005f73)';
                this.style.boxShadow = '0 0 10px rgba(0, 166, 251, 0.3)';
                this.style.transform = 'translateY(0)';
            });

            btn.addEventListener('click', () => {
                startAdventure(loc);
            });

            buttonContainer.appendChild(btn);
        });
    }
}

function startAdventure(location) {
    if (isGathering) {
        stopGatheringActivity();
    }

    if (isCombatActive || isDelveInProgress) {
        logMessage("You are already on an adventure!");
        return;
    }

    // Reset and prepare for adventure
    clearLog();
    logMessage(`You begin your delve into ${location.name}.`);
    currentLocation = location;
    
    // Make sure health regen is properly initialized before entering delve mode
    // This ensures it's ready to work when the delve ends
    // stopHealthRegen(); // Clear any existing timers
    startHealthRegen(); // Initialize the health regeneration system
    
    // Now set up the delve
    currentDelveLocation = location;
    currentMonsterIndex = 0;
    isDelveInProgress = true;
    delveBag = { items: [], credits: 0 };
    updateDelveBagUI(); // Update UI when adventure starts
    
    // We rely on displayAdventureLocations() to hide the location buttons 
    // and show the "Flee" button instead.
    displayAdventureLocations();
    
    // Begin with the first monster
    beginNextMonsterInSequence();
}

function beginNextMonsterInSequence() {
    // If we're out of monsters, the delve is complete
    if (currentMonsterIndex >= currentDelveLocation.monsterSequence.length) {
        finalizeDelveLoot();
        logMessage(`You have cleared all monsters in ${currentDelveLocation.name}!`);

        // First mark delve as completed so health regen can work
        isDelveInProgress = false;
        
        // Restore player's HP/shield only when delve is completed
        player.currentHealth = player.totalStats.health;
        player.currentShield = player.totalStats.energyShield;
        
        // Clear buffs at the end of a delve (except for future medtek injectors)
        clearBuffs(player, true);
        
        // Now restart health regeneration
        stopHealthRegen();
        startHealthRegen();
        updatePlayerStatsDisplay();

        // End the delve with a success reason
        stopCombat('delveCompleted');
        return;
    }

    // Make sure the Flee button is visible during the inter-fight pause
    const fleeButton = document.getElementById('stop-combat');
    if (fleeButton) {
        fleeButton.style.display = 'block';
        fleeButton.disabled = false;
    }

    const monsterData = currentDelveLocation.monsterSequence[currentMonsterIndex];
    let isEmpowered = false;
    if (monsterData.empoweredChance && Math.random() < monsterData.empoweredChance) {
        isEmpowered = true;
    }
    spawnEnemyForSequence(monsterData.name, isEmpowered);
}

function addMonsterLootToDelveBag(monster) {
    // Skip if monster doesn't have loot config
    if (!monster.lootConfig) return;

    // Generate loot items using the new loot system
    const player = window.player || {}; // Get player for modifiers
    const lootItems = generateLoot(monster, player);
    
    // Add the items to the delve bag
    lootItems.forEach(itemInstance => {
        // Add the fully generated item to the delve bag
        delveBag.items.push(itemInstance);
        
        logMessage(`Item added to delve bag: ${itemInstance.name} x${itemInstance.quantity || 1}`);
    });
    
    // Handle currency drops
    if (monster.currencyDrop) {
        if (Math.random() < monster.currencyDrop.dropRate) {
            const amt = getRandomInt(monster.currencyDrop.min, monster.currencyDrop.max);
            
            // Apply player currency modifiers if they exist
            let finalAmount = amt;
            if (player && player.stats && player.stats.currencyFind) {
                finalAmount = Math.floor(amt * (1 + player.stats.currencyFind / 100));
            }
            
            delveBag.credits += finalAmount;
            logMessage(`Credits added to delve bag: ${finalAmount}`);
        }
    }
    
    // Update the delve bag UI
    updateDelveBagUI();
}

function finalizeDelveLoot() {
    isDelveInProgress = false;
    
    // Clear all buffs except medtek injectors when completing a delve
    clearBuffs(player, true);
    
    logMessage("You successfully cleared the delve and collect your spoils!");

    delveBag.items.forEach(loot => {
        const itemTemplate = items.find(i => i.name === loot.name);
        if (itemTemplate) {
            const instance = generateItemInstance(itemTemplate);
            instance.quantity = loot.quantity;
            addItemToInventory(instance);
            logMessage(`Acquired ${loot.quantity} x ${loot.name}.`);
        }
    });
    if (delveBag.credits > 0) {
        playerCurrency += delveBag.credits;
        logMessage(`Gained ${delveBag.credits} credits!`);
    }
    delveBag = { items: [], credits: 0 };
    updateDelveBagUI(); // Update UI when loot is finalized
}

function stopDelveWithFailure() {
    if (isDelveInProgress) {
        logMessage("Your delve fails, and you lose all items you found!");
        delveBag = { items: [], credits: 0 };
        isDelveInProgress = false;
        currentDelveLocation = null;
        currentMonsterIndex = 0;
    }
    updateDelveBagUI(); // Update UI when delve fails
}

function clearLog() {
    const logElement = document.getElementById("log-messages");
    logElement.innerHTML = "";
}

// Add this function to ensure entities are properly initialized
function ensureEntityInitialization(entity, isPlayer) {
    if (!entity) {
        console.error(`Attempted to initialize ${isPlayer ? 'player' : 'enemy'} but entity is null`);
        return false;
    }

    // Ensure basic properties exist
    if (!entity.effects) entity.effects = [];
    if (!entity.statusEffects) entity.statusEffects = [];
    if (!entity.activeBuffs) entity.activeBuffs = [];
    
    // Ensure health values
    if (entity.currentHealth === undefined || entity.currentHealth === null) {
        console.warn(`Initializing ${isPlayer ? 'player' : 'enemy'} currentHealth`);
        if (isPlayer) {
            entity.currentHealth = entity.totalStats?.health || 100;
        } else {
            entity.currentHealth = entity.health || 100;
        }
    }
    
    if (entity.currentShield === undefined || entity.currentShield === null) {
        console.warn(`Initializing ${isPlayer ? 'player' : 'enemy'} currentShield`);
        if (isPlayer) {
            entity.currentShield = entity.totalStats?.energyShield || 0;
        } else {
            entity.currentShield = entity.energyShield || 0;
        }
    }
    
    // Ensure totalStats
    if (isPlayer) {
        // For player, use calculateStats method
        if (typeof entity.calculateStats === 'function') {
            entity.calculateStats();
        } else {
            console.error("Player's calculateStats method is missing!");
        }
    } else {
        // For enemy, use our custom function
        updateEnemyTotalStats();
    }
    
    return true;
}

// Define spawnEnemy function
function spawnEnemy() {
    if (!currentLocation || !currentLocation.enemies || currentLocation.enemies.length === 0) {
        console.error("No enemies defined for current location.");
        return null;
    }

    // Create a pool of enemies based on spawn rates
    let enemyPool = [];
    for (let locEnemy of currentLocation.enemies) {
        // Use weight/spawnRate to determine how many copies go into the pool
        const weight = locEnemy.spawnRate || 1;
        for (let i = 0; i < weight; i++) {
            enemyPool.push(locEnemy.name);
        }
    }

    if (enemyPool.length === 0) {
        console.error("Enemy pool is empty.");
        return null;
    }

    // Select a random enemy from the pool
    const randomIndex = Math.floor(Math.random() * enemyPool.length);
    const selectedEnemyName = enemyPool[randomIndex];
    
    // Now spawn this enemy
    spawnEnemyForSequence(selectedEnemyName, false);
}

// Fix startCombat function to avoid recursive issues
function startCombat() {
    if (isCombatActive) {
        console.log("Combat already active");
        return;
    }
    
    if (!currentLocation) {
        console.error("No current location set. Cannot start combat.");
        return;
    }
    
    if (isGathering) {
        stopGatheringActivity();
    }
    
    // Full player stats reset and initialization
    console.log("Starting combat - full player stats initialization");
    resetPlayerStats();
    
    isCombatActive = true;

    // Initialize enemy (but don't call spawnEnemy recursively from spawnEnemyForSequence)
    if (!enemy) {
        spawnEnemy();
    }
    
    // Don't need to clear buffs again since resetPlayerStats already did it
    
    if (enemy) {
        clearBuffs(enemy);
        ensureEntityInitialization(enemy, false);
    } else {
        console.error("Failed to spawn enemy");
        stopCombat('enemySpawnFailed');
        return;
    }
    
    // Ensure both attack timers are reset
    playerAttackTimer = 0;
    enemyAttackTimer = 0;
    
    startHealthRegen();
    
    // Start combat loop
    lastCombatLoopTime = Date.now();
    combatInterval = setInterval(combatLoop, 100);
    console.log("Combat started.");

    // Safely access the stop-combat button
    const stopCombatButton = document.getElementById('stop-combat');
    if (stopCombatButton) {
        stopCombatButton.style.display = 'block';
    } else {
        console.warn("'stop-combat' button not found in the DOM");
    }

    // Debug output player stats
    console.log("Player stats at combat start:", {
        currentHealth: player.currentHealth,
        totalHealth: player.totalStats.health,
        currentShield: player.currentShield,
        totalShield: player.totalStats.energyShield
    });

    // Force update displays immediately
    updatePlayerStatsDisplay();
    updateEnemyStatsDisplay();

    // Update the adventure locations display (e.g., change to 'Flee' button)
    displayAdventureLocations();
}

function spawnEnemyForSequence(monsterName, isEmpowered = false) {
    // Reset attack timers
    playerAttackTimer = 0;
    enemyAttackTimer = 0;
    
    // Look up the enemy template
    const enemyTemplate = enemies.find(e => e.name === monsterName);
    if (!enemyTemplate) {
        console.error(`Enemy template not found: ${monsterName}`);
        stopCombat('enemyTemplateNotFound');
        return;
    }
    
    // Clone from the template
    enemy = JSON.parse(JSON.stringify(enemyTemplate));

    // Initialize basic properties
    enemy.statusEffects = [];
    enemy.activeBuffs = [];
    enemy.effects = enemy.effects || [];
    
    // Initialize enemy's current health
    enemy.currentHealth = enemy.health;
    enemy.currentShield = enemy.energyShield || 0;
    
    // Update totalStats
    updateEnemyTotalStats();
    
    // Apply empowered bonuses if applicable
    if (isEmpowered) {
        // Boost stats
        enemy.health = Math.round(enemy.health * 1.5);
        enemy.currentHealth = enemy.health; // Reset current health to new max
        
        if (enemy.energyShield) {
            enemy.energyShield = Math.round(enemy.energyShield * 1.5);
            enemy.currentShield = enemy.energyShield;
        }
        
        // Boost all damage types by 50%
        if (enemy.damageTypes) {
            for (let damageType in enemy.damageTypes) {
                enemy.damageTypes[damageType] = Math.round(enemy.damageTypes[damageType] * 1.5);
            }
        }
        
        // Add 'Empowered' to the name
        enemy.name = "Empowered " + enemy.name;
        
        // Update totalStats again after these changes
        updateEnemyTotalStats();
        
        // Add a visual indicator
        logMessage(`An empowered ${monsterName} appears!`);
    }
    
    clearLog();
    updateEnemyStatsDisplay();
    
    if (!isCombatActive) {
        startCombat();
    }
    
    // Make the Flee button clickable
    const fleeButton = document.getElementById('stop-combat');
    if (fleeButton) {
        fleeButton.disabled = false;
    }
    
    logMessage(`A ${enemy.name} appears!`);
    
    // Debug info
    console.log("Enemy spawned:", enemy);
}

// Update the HP and ES bar display and formatting
function updateHPESBars(entity, isPlayer) {
    // First, make sure entity exists
    if (!entity) {
        console.warn(`updateHPESBars called with ${isPlayer ? 'player' : 'enemy'} entity that is null or undefined`);
        return;
    }

    // Get entity display values with safe defaults
    const currentHealth = Math.max(0, Math.round(entity.currentHealth || 0));
    const totalHealth = Math.max(1, Math.round((entity.totalStats?.health) || 100));
    const currentShield = Math.max(0, Math.round(entity.currentShield || 0));
    const totalShield = Math.max(0, Math.round((entity.totalStats?.energyShield) || 0));
    
    // Set prefix for DOM element IDs
    const prefix = isPlayer ? 'player' : 'enemy';
    
    // Update HP bar width and color
    const hpBar = document.getElementById(`${prefix}-hp-bar`);
    if (hpBar) {
        // Calculate HP percentage (capped between 0-100%)
        const hpPercent = Math.min(100, Math.max(0, (currentHealth / totalHealth) * 100)) || 0;
        
        // Update bar width
        hpBar.style.width = `${hpPercent}%`;
        
        // Update bar color based on health percentage
        if (hpPercent < 25) {
            hpBar.style.background = 'linear-gradient(90deg, #ff5959, #ff8080)';
        } else if (hpPercent < 50) {
            hpBar.style.background = 'linear-gradient(90deg, #ffaa5e, #ffc179)';
        } else {
            hpBar.style.background = 'linear-gradient(90deg, #48bf91, #64dfdf)';
        }
    }
    
    // Update HP text display
    const hpText = document.getElementById(`${prefix}-hp-text`);
    if (hpText) {
        hpText.textContent = `${currentHealth} / ${totalHealth}`;
    }
    
    // Update ES bar width
    const esBar = document.getElementById(`${prefix}-es-bar`);
    if (esBar) {
        // Calculate ES percentage (with safety checks)
        const esPercent = totalShield > 0 ? Math.min(100, Math.max(0, (currentShield / totalShield) * 100)) : 0;
        
        // Update bar width
        esBar.style.width = `${esPercent}%`;
        
        // Update bar color/effect
        esBar.style.background = 'linear-gradient(90deg, #5465ff, #788bff)';
    }
    
    // Update ES text display
    const esText = document.getElementById(`${prefix}-es-text`);
    if (esText) {
        esText.textContent = `${currentShield} / ${totalShield}`;
    }
}

// Update the player stats display function to use the new HP/ES function
function updatePlayerStatsDisplay() {
    // Basic stats
    document.getElementById("player-name").textContent = player.name;
    document.getElementById("player-level").textContent = player.level || 1;
    
    // NEW: Show XP until next level with percentage
    const xpElement = document.getElementById('player-experience');
    if (xpElement) {
        const currentLevel = player.level;
        const currentXP = player.experience;
        const xpNeededForNext = getXPForNextLevel(currentLevel);
        const ratio = Math.min(currentXP / xpNeededForNext, 1);
        const percent = (ratio * 100).toFixed(1);
        
        if (currentLevel >= MAX_PLAYER_LEVEL) {
            xpElement.innerHTML = `<span style="color: #00ffcc; text-shadow: 0 0 5px rgba(0, 255, 204, 0.5);">Maximum Level</span>`;
        } else {
            xpElement.innerHTML = `<span style="color: #7fdbff;">${currentXP} / ${xpNeededForNext}</span> <span style="color: #00ffcc;">(${percent}%)</span>`;
        }
    }
    
    // Update HP and ES bars
    updateHPESBars(player, true);
    
    // Calculate total DPS (sum of all damage types * attack speed)
    let totalDamage = 0;
    for (let type in player.totalStats.damageTypes) {
        let baseDamage = player.totalStats.damageTypes[type];
        
        // Apply damage type modifier if available
        if (player.totalStats.damageTypeModifiers && player.totalStats.damageTypeModifiers[type]) {
            baseDamage *= player.totalStats.damageTypeModifiers[type];
        }
        
        totalDamage += baseDamage;
    }
    const totalDPS = totalDamage * player.totalStats.attackSpeed;
    
    // Create DPS display element if it doesn't exist
    let dpsElement = document.getElementById('player-total-dps');
    if (!dpsElement) {
        dpsElement = document.createElement('div');
        dpsElement.id = 'player-total-dps';
        dpsElement.style.margin = '10px 0';
        dpsElement.style.padding = '8px';
        dpsElement.style.borderRadius = '4px';
        dpsElement.style.background = 'linear-gradient(90deg, rgba(0, 40, 70, 0.7), rgba(0, 60, 100, 0.7))';
        dpsElement.style.boxShadow = '0 0 10px rgba(0, 255, 204, 0.3)';
        dpsElement.style.borderLeft = '3px solid #00ffcc';
        
        // Find the right place to insert it - after attack progress bar
        const progressBarContainer = document.querySelector('#player-stats .progress-container');
        if (progressBarContainer && progressBarContainer.nextSibling) {
            progressBarContainer.parentNode.insertBefore(dpsElement, progressBarContainer.nextSibling);
        }
    }
    
    // Update DPS content with flashy styling
    dpsElement.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 3px; color: #e0f2ff;">Total DPS:</div>
        <div style="font-size: 130%; color: #00ffcc; text-shadow: 0 0 8px rgba(0, 255, 204, 0.7);">
            ${totalDPS.toFixed(1)}
        </div>
    `;
    
    // Enhanced stat displays with sci-fi styling
    document.getElementById("player-attack-speed").innerHTML = `<span style="color: #ffd166; text-shadow: 0 0 3px rgba(255, 209, 102, 0.5);">${player.totalStats.attackSpeed.toFixed(2)}</span>`;
    document.getElementById("player-crit-chance").innerHTML = `<span style="color: #ff6b6b; text-shadow: 0 0 3px rgba(255, 107, 107, 0.5);">${(player.totalStats.criticalChance * 100).toFixed(2)}%</span>`;
    document.getElementById("player-crit-multiplier").innerHTML = `<span style="color: #ff6b6b; text-shadow: 0 0 3px rgba(255, 107, 107, 0.5);">${player.totalStats.criticalMultiplier.toFixed(2)}x</span>`;
    document.getElementById("player-precision").innerHTML = `<span style="color: #64dfdf;">${player.totalStats.precision || 0}</span>`;
    document.getElementById("player-deflection").innerHTML = `<span style="color: #64dfdf;">${player.totalStats.deflection || 0}</span>`;
    document.getElementById("player-health-regen").innerHTML = `<span style="color: #48bf91;">${player.totalStats.healthRegen.toFixed(2) || 0}</span>`;

    // Stylish damage types list
    const damageTypesList = document.getElementById('player-damage-types');
    damageTypesList.innerHTML = '';
    let hasDamageTypes = false;
    
    for (let type in player.totalStats.damageTypes) {
        hasDamageTypes = true;
        const li = document.createElement('li');
        li.style.padding = '4px 8px';
        li.style.margin = '3px 0';
        li.style.background = 'rgba(0, 15, 40, 0.5)';
        li.style.borderRadius = '3px';
        li.style.borderLeft = '2px solid #ff6b6b';
        
        li.innerHTML = `<span style="color: #ff6b6b; font-weight: bold;">${capitalize(type)}:</span> <span style="color: #ffffff;">${player.totalStats.damageTypes[type]}</span>`;
        damageTypesList.appendChild(li);
    }
    
    if (!hasDamageTypes) {
        const li = document.createElement('li');
        li.style.padding = '4px 8px';
        li.style.color = '#888';
        li.style.fontStyle = 'italic';
        li.textContent = 'No damage types';
        damageTypesList.appendChild(li);
    }

    // Stylish damage modifiers
    const damageTypeModifiersList = document.getElementById('player-damage-type-modifiers');
    damageTypeModifiersList.innerHTML = '';
    let hasModifiers = false;
    
    for (let type in player.totalStats.damageTypeModifiers) {
        hasModifiers = true;
        const li = document.createElement('div');
        li.style.padding = '4px 8px';
        li.style.margin = '3px 0';
        li.style.background = 'rgba(0, 15, 40, 0.5)';
        li.style.borderRadius = '3px';
        li.style.borderLeft = '2px solid #ffd166';
        
        let modifier = (player.totalStats.damageTypeModifiers[type] - 1) * 100;
        li.innerHTML = `<span style="color: #ffd166; font-weight: bold;">${capitalize(type)} Damage:</span> <span style="color: #ffffff;">+${modifier.toFixed(2)}%</span>`;
        damageTypeModifiersList.appendChild(li);
    }
    
    if (!hasModifiers) {
        const li = document.createElement('div');
        li.style.padding = '4px 8px';
        li.style.color = '#888';
        li.style.fontStyle = 'italic';
        li.textContent = 'No damage modifiers';
        damageTypeModifiersList.appendChild(li);
    }

    // Update Defense Types display
    const defenseTypesList = document.getElementById('player-defense-types');
    defenseTypesList.innerHTML = '';
    let hasDefenseTypes = false;

    // Check if defenseTypes object exists
    if (player.totalStats.defenseTypes) {
        // Add the three new defense types with proper descriptions
        const defenseMapping = {
            'sturdiness': 'Sturdiness (vs Physical)',
            'structure': 'Structure (vs Elemental)',
            'stability': 'Stability (vs Chemical)'
        };

        for (let type in defenseMapping) {
            const value = player.totalStats.defenseTypes[type] || 0;
            hasDefenseTypes = true;
            const li = document.createElement('li');
            li.innerHTML = `${defenseMapping[type]}: <span style="color: #ffffff;">${value}</span>`;
            defenseTypesList.appendChild(li);
        }
    }

    if (!hasDefenseTypes) {
        const li = document.createElement('li');
        li.textContent = 'None';
        defenseTypesList.appendChild(li);
    }

    // Stylish active effects list
    const activeEffectsList = document.getElementById('player-active-effects');
    activeEffectsList.innerHTML = '';
    
    if (player.activeBuffs && player.activeBuffs.length > 0) {
        player.activeBuffs.forEach(buff => {
            const li = document.createElement('li');
            li.style.padding = '4px 8px';
            li.style.margin = '3px 0';
            li.style.background = 'rgba(0, 15, 40, 0.5)';
            li.style.borderRadius = '3px';
            li.style.borderLeft = '2px solid #00ffcc';
            
            li.innerHTML = `<span style="color: #00ffcc; font-weight: bold;">${buff.name}:</span> <span style="color: #ffffff;">${(buff.remainingDuration / 1000).toFixed(1)}s</span>`;
            activeEffectsList.appendChild(li);
        });
    } else {
        const li = document.createElement('li');
        li.style.padding = '4px 8px';
        li.style.color = '#888';
        li.style.fontStyle = 'italic';
        li.textContent = 'No active effects';
        activeEffectsList.appendChild(li);
    }
}

// Update the enemy stats display function to use the new HP/ES function
function updateEnemyStatsDisplay() {
    if (!enemy) {
        console.log("updateEnemyStatsDisplay called but no enemy is defined.");
        return;
    }
    
    // Make enemy name visible
    document.getElementById("enemy-name").textContent = enemy.name || "Unknown";
    
    // Update HP and ES bars
    updateHPESBars(enemy, false);
    
    // Calculate total DPS (sum of all damage types * attack speed)
    let totalDamage = 0;
    for (let type in enemy.totalStats.damageTypes) {
        let baseDamage = enemy.totalStats.damageTypes[type];
        
        // Apply damage type modifier if available
        if (enemy.totalStats.damageTypeModifiers && enemy.totalStats.damageTypeModifiers[type]) {
            baseDamage *= enemy.totalStats.damageTypeModifiers[type];
        }
        
        totalDamage += baseDamage;
    }
    const totalDPS = totalDamage * enemy.totalStats.attackSpeed;
    
    // Create DPS display element if it doesn't exist
    let dpsElement = document.getElementById('enemy-total-dps');
    if (!dpsElement) {
        dpsElement = document.createElement('div');
        dpsElement.id = 'enemy-total-dps';
        dpsElement.style.margin = '10px 0';
        dpsElement.style.padding = '8px';
        dpsElement.style.borderRadius = '4px';
        dpsElement.style.background = 'linear-gradient(90deg, rgba(70, 20, 20, 0.7), rgba(100, 30, 30, 0.7))';
        dpsElement.style.boxShadow = '0 0 10px rgba(255, 107, 107, 0.3)';
        dpsElement.style.borderLeft = '3px solid #ff6b6b';
        
        // Find the right place to insert it - after attack progress bar
        const progressBarContainer = document.querySelector('#enemy-stats .progress-container');
        if (progressBarContainer && progressBarContainer.nextSibling) {
            progressBarContainer.parentNode.insertBefore(dpsElement, progressBarContainer.nextSibling);
        }
    }
    
    // Update DPS content with flashy styling
    dpsElement.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 3px; color: #e0f2ff;">Total DPS:</div>
        <div style="font-size: 130%; color: #ff6b6b; text-shadow: 0 0 8px rgba(255, 107, 107, 0.7);">
            ${totalDPS.toFixed(1)}
        </div>
    `;
    
    // Enhanced stat displays with sci-fi styling
    document.getElementById("enemy-attack-speed").innerHTML = `<span style="color: #ffd166; text-shadow: 0 0 3px rgba(255, 209, 102, 0.5);">${enemy.totalStats.attackSpeed.toFixed(2)}</span>`;
    document.getElementById("enemy-crit-chance").innerHTML = `<span style="color: #ff6b6b; text-shadow: 0 0 3px rgba(255, 107, 107, 0.5);">${(enemy.totalStats.criticalChance * 100).toFixed(2)}%</span>`;
    document.getElementById("enemy-crit-multiplier").innerHTML = `<span style="color: #ff6b6b; text-shadow: 0 0 3px rgba(255, 107, 107, 0.5);">${enemy.totalStats.criticalMultiplier.toFixed(2)}x</span>`;

    // Stylish damage types list
    const damageTypesList = document.getElementById('enemy-damage-types');
    damageTypesList.innerHTML = '';
    let hasDamageTypes = false;
    
    for (let type in enemy.totalStats.damageTypes) {
        hasDamageTypes = true;
        const li = document.createElement('li');
        li.style.padding = '4px 8px';
        li.style.margin = '3px 0';
        li.style.background = 'rgba(0, 15, 40, 0.5)';
        li.style.borderRadius = '3px';
        li.style.borderLeft = '2px solid #ff6b6b';
        
        li.innerHTML = `<span style="color: #ff6b6b; font-weight: bold;">${capitalize(type)}:</span> <span style="color: #ffffff;">${enemy.totalStats.damageTypes[type]}</span>`;
        damageTypesList.appendChild(li);
    }
    
    if (!hasDamageTypes) {
        const li = document.createElement('li');
        li.style.padding = '4px 8px';
        li.style.color = '#888';
        li.style.fontStyle = 'italic';
        li.textContent = 'No damage types';
        damageTypesList.appendChild(li);
    }

    // Update Defense Types display
    const defenseTypesList = document.getElementById('enemy-defense-types');
    defenseTypesList.innerHTML = '';
    let hasDefenseTypes = false;

    // Check if enemy and its defense types exist
    if (enemy && enemy.totalStats && enemy.totalStats.defenseTypes) {
        // Add the three new defense types with proper descriptions
        const defenseMapping = {
            'sturdiness': 'Sturdiness (vs Physical)',
            'structure': 'Structure (vs Elemental)',
            'stability': 'Stability (vs Chemical)'
        };

        for (let type in defenseMapping) {
            const value = enemy.totalStats.defenseTypes[type] || 0;
            if (value > 0) {
                hasDefenseTypes = true;
                const li = document.createElement('li');
                li.innerHTML = `${defenseMapping[type]}: <span style="color: #ffffff;">${value}</span>`;
                defenseTypesList.appendChild(li);
            }
        }
    }

    if (!hasDefenseTypes) {
        const li = document.createElement('li');
        li.textContent = 'None';
        defenseTypesList.appendChild(li);
    }

    // Stylish active effects list
    const activeEffectsList = document.getElementById('enemy-active-effects');
    activeEffectsList.innerHTML = '';
    
    if (enemy.activeBuffs && enemy.activeBuffs.length > 0) {
        enemy.activeBuffs.forEach(buff => {
            const li = document.createElement('li');
            li.style.padding = '4px 8px';
            li.style.margin = '3px 0';
            li.style.background = 'rgba(0, 15, 40, 0.5)';
            li.style.borderRadius = '3px';
            li.style.borderLeft = '2px solid #00ffcc';
            
            li.innerHTML = `<span style="color: #00ffcc; font-weight: bold;">${buff.name}:</span> <span style="color: #ffffff;">${(buff.remainingDuration / 1000).toFixed(1)}s</span>`;
            activeEffectsList.appendChild(li);
        });
    } else {
        const li = document.createElement('li');
        li.style.padding = '4px 8px';
        li.style.color = '#888';
        li.style.fontStyle = 'italic';
        li.textContent = 'No active effects';
        activeEffectsList.appendChild(li);
    }
}

function resetPlayerStats() {
    // First initialize base stats
    player.baseStats = JSON.parse(JSON.stringify(playerBaseStats));
    
    // Calculate total stats
    player.calculateStats();
    
    // Set current health and shield to full
    player.currentHealth = player.totalStats.health;
    player.currentShield = player.totalStats.energyShield;
    
    // Clear status effects
    player.statusEffects = [];
    
    // Update display
    updatePlayerStatsDisplay();
    
    // Clear any buffs
    clearBuffs(player);
    
    console.log("Player stats reset:", player);
}

// Function to flee combat
function fleeCombat() {
    if (isCombatActive) {
        stopCombat('playerFled');
        logMessage("You have fled from combat.");
        currentLocation = null;
    } else {
        logMessage("You are not in combat.");
        // If not in combat, but a countdown is active, cancel it
        if (adventureStartCountdownInterval) {
            clearInterval(adventureStartCountdownInterval);
            adventureStartCountdownInterval = null;
            const timerElement = document.getElementById('next-enemy-timer');
            timerElement.style.display = 'none';
            logMessage("You have canceled the adventure.");
            currentLocation = null;
            displayAdventureLocations();
        }
    }

    // Update the adventure locations display
    displayAdventureLocations();
}

function startHealthRegen() {
    // Clear any existing interval to prevent multiple intervals
    if (healthRegenInterval) {
        clearInterval(healthRegenInterval);
        healthRegenInterval = null;
        console.log("Clearing existing health regeneration timer");
    }

    console.log("Starting health regeneration timer. isDelveInProgress: " + isDelveInProgress);
    console.log("Player health regen rate: " + player.totalStats.healthRegen + " per second");

    // Regenerate health every 200 milliseconds, but with special rules for delves
    healthRegenInterval = setInterval(() => {
        
        // Otherwise apply normal health regeneration
        if (player.currentHealth < player.totalStats.health) {
            const regenPerTick = player.totalStats.healthRegen / 5; 
            // (Assuming healthRegen is per second, 5 ticks/sec -> 200ms each)

            player.currentHealth += regenPerTick;
            if (player.currentHealth > player.totalStats.health) {
                player.currentHealth = player.totalStats.health;
            }
            updatePlayerStatsDisplay();
        }
    }, 200);
}


function stopHealthRegen() {
    if (healthRegenInterval) {
        clearInterval(healthRegenInterval);
        healthRegenInterval = null;
        console.log("Health regeneration stopped");
    }
}


function skewedRandom(min, max, skew) {
    let range = max - min;
    let num = Math.random();

    // Apply skew
    num = Math.pow(num, skew);

    // Scale to the desired range
    num = num * range + min;

    // Cap the result to ensure it's within [min, max]
    num = Math.max(min, Math.min(num, max));

    return num;
}

function combatLoop() {
    if (!isCombatActive) return;

    let now = Date.now();
    let deltaTime = (now - lastCombatLoopTime) / 1000;
    lastCombatLoopTime = now;
    
    // Make sure both player and enemy are properly initialized
    if (!player || !ensureEntityInitialization(player, true) || 
        !enemy || !ensureEntityInitialization(enemy, false)) {
        console.error("Combat loop running with invalid entities, attempting to recover...");
        
        // If still missing crucial data after reinitialization attempt, stop combat
        if (!player || !player.totalStats || !enemy || !enemy.totalStats) {
            console.error("Failed to recover from missing entity data, stopping combat loop");
            stopCombat('missingEntityData');
            return;
        }
    }
    
    // Force update player and enemy display before any combat calculations
    updatePlayerStatsDisplay();
    updateEnemyStatsDisplay();

    // Player Attack Progress
    playerAttackTimer += deltaTime;
    const playerAttackSpeed = player.totalStats.attackSpeed || 1; // Default to 1 if undefined
    const playerAttackInterval = 3 / playerAttackSpeed;
    const playerProgress = Math.min((playerAttackTimer / playerAttackInterval) * 100, 100);
    
    const playerProgressBar = document.getElementById('player-attack-progress-bar');
    if (playerProgressBar) {
        playerProgressBar.style.width = playerProgress + '%';
        
        // Add gradient based on progress
        if (playerProgress < 33) {
            playerProgressBar.style.background = 'linear-gradient(90deg, #3a7ca5, #4e9bcf)';
        } else if (playerProgress < 66) {
            playerProgressBar.style.background = 'linear-gradient(90deg, #4e9bcf, #6aabe0)';
        } else {
            playerProgressBar.style.background = 'linear-gradient(90deg, #6aabe0, #81d4fa)';
        }
        
        // Add pulsing effect when close to full
        if (playerProgress > 90) {
            playerProgressBar.style.animation = 'pulse 0.5s infinite';
        } else {
            playerProgressBar.style.animation = 'none';
        }
    }

    if (playerAttackTimer >= playerAttackInterval) {
        playerAttackTimer = 0; // Reset timer BEFORE attack to prevent recursion issues
        try {
            playerAttack();
        } catch (error) {
            console.error("Error in playerAttack:", error);
            // Try to recover
            if (!player.effects) player.effects = [];
            if (!enemy.effects) enemy.effects = [];
        }
    }

    // Enemy Attack Progress - only if enemy exists and has health
    if (enemy && enemy.currentHealth > 0) {
        enemyAttackTimer += deltaTime;
        const enemyAttackSpeed = enemy.totalStats.attackSpeed || 1; // Default to 1 if undefined
        const enemyAttackInterval = 3 / enemyAttackSpeed;
        const enemyProgress = Math.min((enemyAttackTimer / enemyAttackInterval) * 100, 100);
        
        const enemyProgressBar = document.getElementById('enemy-attack-progress-bar');
        if (enemyProgressBar) {
            enemyProgressBar.style.width = enemyProgress + '%';
            
            // Add gradient based on progress
            if (enemyProgress < 33) {
                enemyProgressBar.style.background = 'linear-gradient(90deg, #a33a3a, #cf4e4e)';
            } else if (enemyProgress < 66) {
                enemyProgressBar.style.background = 'linear-gradient(90deg, #cf4e4e, #e06a6a)';
            } else {
                enemyProgressBar.style.background = 'linear-gradient(90deg, #e06a6a, #fa8181)';
            }
            
            // Add pulsing effect when close to full
            if (enemyProgress > 90) {
                enemyProgressBar.style.animation = 'pulse 0.5s infinite';
            } else {
                enemyProgressBar.style.animation = 'none';
            }
        }

        if (enemyAttackTimer >= enemyAttackInterval) {
            enemyAttackTimer = 0; // Reset timer BEFORE attack to prevent recursion
            try {
                enemyAttack();
            } catch (error) {
                console.error("Error in enemyAttack:", error);
                // Try to recover
                if (!player.effects) player.effects = [];
                if (!enemy.effects) enemy.effects = [];
            }
        }
    }

    // Safely process entity buffs and status effects
    try {
        processBuffs(player, deltaTime);
        if (player.currentHealth > 0) {
            processStatusEffects(player, deltaTime);
        }
        
        if (enemy) {
            if (enemy.activeBuffs) {
                processBuffs(enemy, deltaTime);
            }
            if (enemy.currentHealth > 0) {
                processStatusEffects(enemy, deltaTime);
            }
        }
    } catch (error) {
        console.error("Error processing effects:", error);
    }

    // Check end conditions
    if (player.currentHealth <= 0) {
        stopCombat('playerDefeated');
        return;
    }
    else if (enemy && enemy.currentHealth <= 0) {
        // We handle that in applyDamage
    }

    // Update displays at end of loop
    updatePlayerStatsDisplay();
    updateEnemyStatsDisplay();
}

function clearBuffs(entity, preserveMedtekInjectors = false) {
    console.log(`clearBuffs called for ${entity.name || 'unnamed entity'} (clearbuffs)`);
    
    // Safely handle undefined activeBuffs
    if (!entity.activeBuffs) {
        entity.activeBuffs = [];
    }
    
    if (preserveMedtekInjectors && entity === player) {
        // Filter out all buffs except medtek injectors
        // This is a placeholder for when medtek injectors are implemented
        // Currently, they don't exist, so all buffs will be cleared
        // When implemented, this should be: entity.activeBuffs = entity.activeBuffs.filter(buff => buff.isMedtekInjector);
        entity.activeBuffs = [];
        logMessage(`${entity.name || 'Entity'}'s buffs cleared (except for medtek injectors).`);
    } else {
        // Clear all buffs
        entity.activeBuffs = [];
        logMessage(`${entity.name || 'Entity'}'s buffs cleared.`);
    }
    
    console.log(`${entity.name || 'Entity'} activeBuffs length after clearing: ${entity.activeBuffs.length} (clearbuffs)`);
    
    // Safely call calculateStats only if it exists
    if (entity.calculateStats && typeof entity.calculateStats === 'function') {
        entity.calculateStats();
    } else if (entity === enemy) {
        // If enemy doesn't have calculateStats method, manually update its stats
        updateEnemyTotalStats();
    }
}

// Add this helper function to update enemy stats
function updateEnemyTotalStats() {
    if (!enemy) return;
    
    // Create totalStats if it doesn't exist
    if (!enemy.totalStats) {
        enemy.totalStats = {};
    }
    
    // Initialize with base stats
    enemy.totalStats.health = enemy.health || 100;
    enemy.totalStats.energyShield = enemy.energyShield || 0;
    enemy.totalStats.attackSpeed = enemy.attackSpeed || 1;
    enemy.totalStats.criticalChance = enemy.criticalChance || 0.05;
    enemy.totalStats.criticalMultiplier = enemy.criticalMultiplier || 1.5;
    
    // Damage types
    enemy.totalStats.damageTypes = {};
    if (enemy.damageTypes) {
        for (const type in enemy.damageTypes) {
            enemy.totalStats.damageTypes[type] = enemy.damageTypes[type];
        }
    }
    
    // Defense types
    enemy.totalStats.defenseTypes = {};
    if (enemy.defenseTypes) {
        for (const type in enemy.defenseTypes) {
            enemy.totalStats.defenseTypes[type] = enemy.defenseTypes[type];
        }
    }
    
    // Process active buffs
    if (enemy.activeBuffs && enemy.activeBuffs.length > 0) {
        for (const buff of enemy.activeBuffs) {
            if (buff.statChanges) {
                for (const stat in buff.statChanges) {
                    if (stat === 'health' || stat === 'energyShield' || 
                        stat === 'attackSpeed' || stat === 'criticalChance' || 
                        stat === 'criticalMultiplier') {
                        enemy.totalStats[stat] += buff.statChanges[stat];
                    }
                }
            }
        }
    }
}

// Function to stop combat
function stopCombat(reason) {
    if (!isCombatActive && !isDelveInProgress) {
        console.log("Combat already inactive. stopCombat() aborted.");
        return;
    }
    
    if (isCombatActive) {
        isCombatActive = false;
        clearInterval(combatInterval);
        combatInterval = null;
    }
    
    // Clear any inter-fight timers
    if (interFightPauseTimer) {
        clearTimeout(interFightPauseTimer);
        interFightPauseTimer = null;
    }

    // Log the reason combat was stopped
    if (reason) {
        logMessage(`Combat stopped due to: ${reason}`);
    }

    // Reset combat UI
    playerAttackTimer = 0;
    enemyAttackTimer = 0;
    document.getElementById('player-attack-progress-bar').style.width = '0%';
    document.getElementById('enemy-attack-progress-bar').style.width = '0%';
    
    // Hide the flee button
    const fleeButton = document.getElementById('stop-combat');
    if (fleeButton) {
        fleeButton.style.display = 'none';
        fleeButton.disabled = false; // Make sure it's enabled for next time
    }

    // Only restore player health when fleeing or completing a delve
    // NOT between delve fights
    if (reason === 'playerFled' || reason === 'delveCompleted' || reason === 'playerDefeated') {
        player.currentHealth = player.totalStats.health;
        player.currentShield = player.totalStats.energyShield;
        updatePlayerStatsDisplay();
        
        // Always restart health regeneration after combat ends with fleeing, defeat, or delve completion
        startHealthRegen();
    }

    // Handle delve state based on reason
    if (isDelveInProgress) {
        if (reason === 'playerFled' || reason === 'playerDefeated') {
            stopDelveWithFailure();
            
            // Return to adventure location selection
            isDelveInProgress = false;
            currentDelveLocation = null;
            currentMonsterIndex = 0;
            displayAdventureLocations();
            
            // Restart health regeneration as we're no longer in a delve
            stopHealthRegen();
            startHealthRegen();
        }
        else if (reason === 'delveCompleted') {
            // Mark success
            isDelveInProgress = false;
            currentDelveLocation = null;
            currentMonsterIndex = 0;
            displayAdventureLocations();
            
            // Restart health regeneration as we're no longer in a delve
            stopHealthRegen();
            startHealthRegen();
        }
        else if (reason === 'enemyDefeated') {
            // Don't end the delve, we'll handle the next monster
            currentMonsterIndex++;
            
            // Clear buffs between fights, but preserve any future medtek injectors
            clearBuffs(player, true);
            if (enemy) {
                clearBuffs(enemy);
            }
            
            // Don't restore health between delve fights
            // Wait 3 seconds before beginning the next fight
            interFightPauseTimer = setTimeout(() => {
                beginNextMonsterInSequence();
            }, 3000);
        }
    }
    
    // Clean up combat state
    if (enemy) clearBuffs(enemy);
    enemy = null;
    updateEnemyStatsDisplay();
    initializeEnemyStatsDisplay();
    
    // Stop health regeneration if we're completely stopping combat, but not for inter-fight pauses
    if (!isDelveInProgress || reason === 'playerFled' || reason === 'playerDefeated' || reason === 'delveCompleted') {
        stopHealthRegen();
    }
}


// Function for player attack
function playerAttack() {
    // Exit early if combat is no longer active
    if (!isCombatActive) {
        console.log("playerAttack called but combat is not active");
        return;
    }
    
    // Additional safety checks
    if (!player || !enemy) {
        console.warn("playerAttack called but player or enemy is null");
        return;
    }
    
    // Ensure entities are properly initialized
    ensureEntityInitialization(player, true);
    ensureEntityInitialization(enemy, false);
    
    try {
        let totalDamage = calculateDamage(player, enemy);
        applyDamage(enemy, totalDamage, enemy.name);

        // Process effects with explicit empty array check
        if (Array.isArray(player.effects) && player.effects.length > 0) {
            processEffects(player, 'onHit', enemy);
        }
        
        if (Array.isArray(enemy.effects) && enemy.effects.length > 0) {
            processEffects(enemy, 'whenHit', player);
        }
    } catch (error) {
        console.error("Error in playerAttack:", error);
    }
}

function enemyAttack() {
    // Exit early if combat is no longer active
    if (!isCombatActive) {
        console.log("enemyAttack called but combat is not active");
        return;
    }
    
    // Additional safety checks
    if (!player || !enemy) {
        console.warn("enemyAttack called but player or enemy is null");
        return;
    }
    
    // Ensure entities are properly initialized
    ensureEntityInitialization(player, true);
    ensureEntityInitialization(enemy, false);
    
    try {
        let totalDamage = calculateDamage(enemy, player);
        applyDamage(player, totalDamage, "Player");

        // Process effects with explicit empty array check
        if (Array.isArray(enemy.effects) && enemy.effects.length > 0) {
            processEffects(enemy, 'onHit', player);
        }
        
        if (Array.isArray(player.effects) && player.effects.length > 0) {
            processEffects(player, 'whenHit', enemy);
        }
    } catch (error) {
        console.error("Error in enemyAttack:", error);
    }
}

function processEffects(entity, trigger, target) {
    // Comprehensive safety check
    if (!entity || !target) {
        console.warn(`processEffects: entity or target is null/undefined (trigger: ${trigger})`);
        return;
    }
    
    if (!entity.effects || !Array.isArray(entity.effects) || entity.effects.length === 0) {
        // No effects to process
        return;
    }

    const entityName = entity.name || 'Unknown entity';
    console.log(`Processing effects for ${entityName} with trigger '${trigger}'`);

    // Create a safe copy of the effects array to iterate through
    // in case effects are modified during processing
    const effectsCopy = [...entity.effects];
    
    for (const effect of effectsCopy) {
        // Skip invalid effects
        if (!effect || typeof effect !== 'object') {
            console.warn('Skipping invalid effect:', effect);
            continue;
        }
        
        if (effect.trigger === trigger) {
            // Make sure effect has a chance property
            const chance = effect.chance || 0;
            
            try {
                // Check if the effect activates based on chance
                if (Math.random() < chance) {
                    console.log(`Effect triggered:`, effect);
                    executeEffectAction(effect, entity, target);
                } else {
                    console.log(`Effect did not trigger due to chance.`);
                }
            } catch (error) {
                console.error(`Error processing effect:`, effect, error);
            }
        }
    }
}

function executeEffectAction(effect, source, target) {
    const params = effect.parameters;

    switch (effect.action) {
        case 'dealDamage':
            let damage = params.amount;
            const damageType = params.damageType;
            const ignoreDefense = params.ignoreDefense || false;

            // Adjust damage by source's damage type modifiers
            if (source.totalStats.damageTypeModifiers && source.totalStats.damageTypeModifiers[damageType]) {
                const modifier = source.totalStats.damageTypeModifiers[damageType];
                damage *= modifier; // Modifiers are multiplicative
            }

            // Round the damage to avoid fractional damage
            damage = Math.round(damage);

            applyEffectDamage(target, damage, damageType, ignoreDefense);
            break;

        case 'heal':
            const healAmount = params.amount;
            healEntity(source, healAmount);
            break;

        case 'applyBuff':
            const buffName = params.buffName;
            source.applyBuff(buffName);
            break;

        case 'conditionalRestoreShield':
            const maxShieldThreshold = params.maxShieldThreshold;
            if (source.totalStats.energyShield <= maxShieldThreshold) {
                source.currentShield = source.totalStats.energyShield;
                logMessage(`${source.name}'s energy shield is fully restored!`);
                if (source === player) {
                    updatePlayerStatsDisplay();
                } else if (source === enemy) {
                    updateEnemyStatsDisplay();
                }
            }
            break;

        case 'conditionalRestoreHealth':
            const maxHealthThreshold = params.maxHealthThreshold;
            if (source.totalStats.health <= maxHealthThreshold) {
                source.currentHealth = source.totalStats.health;
                logMessage(`${source.name}'s health is fully restored!`);
                if (source === player) {
                    updatePlayerStatsDisplay();
                } else if (source === enemy) {
                    updateEnemyStatsDisplay();
                }
            }
            break;

        // Add more cases as needed

        default:
            console.warn(`Unknown effect action: ${effect.action}`);
    }
}


function applyEffectDamage(target, amount, damageType, ignoreDefense) {
    let actualDamage = amount;

    if (!ignoreDefense) {
        const defenseStat = matchDamageToDefense(damageType);
        const defenseValue = target.totalStats.defenseTypes[defenseStat] || 0;
        actualDamage = Math.max(0, amount - defenseValue);
    }

    applyDamage(target, actualDamage, target.name, { [damageType]: actualDamage });
}

function healEntity(entity, amount) {
    entity.currentHealth = Math.min(entity.totalStats.health, entity.currentHealth + amount);
    logMessage(`{green} ${entity.name} heals for ${amount} HP.{end}`);
    if (entity === player) {
        updatePlayerStatsDisplay();
    } else if (entity === enemy) {
        updateEnemyStatsDisplay();
    }
}

// Function to process status effects and buffs
function processStatusEffects(entity, deltaTime) {
    // Process status effects (e.g., debuffs)
    for (let i = entity.statusEffects.length - 1; i >= 0; i--) {
        const effect = entity.statusEffects[i];
        if (effect.duration > 0) {
            effect.remainingDuration -= deltaTime;
            if (effect.onTick) effect.onTick(effect);

            if (effect.remainingDuration <= 0) {
                if (effect.onExpire) effect.onExpire(effect);
                entity.statusEffects.splice(i, 1); // Remove expired effect
            }
        }
    }
}

function calculateDamage(attacker, defender) {
    // Object to store adjusted base damages per damage type (after modifiers but before critical hits)
    let adjustedBaseDamages = {};

    // Define a map to determine which group each damage type belongs to
    const damageTypeToGroup = {
        // Physical group
        'kinetic': 'physical',
        'slashing': 'physical',
        // Elemental group
        'pyro': 'elemental',
        'cryo': 'elemental',
        'electric': 'elemental',
        // Chemical group
        'corrosive': 'chemical',
        'radiation': 'chemical'
    };

    // Use attacker's totalStats.damageTypes directly since modifiers have already been applied
    for (let damageType in attacker.totalStats.damageTypes) {
        let baseDamage = attacker.totalStats.damageTypes[damageType];

        // Apply specific damage type modifiers
        if (attacker.totalStats.damageTypeModifiers && attacker.totalStats.damageTypeModifiers[damageType]) {
            const typeModifier = attacker.totalStats.damageTypeModifiers[damageType];
            baseDamage *= typeModifier;
        }
        
        // Apply damage group modifiers
        const group = damageTypeToGroup[damageType];
        if (group && attacker.totalStats.damageGroupModifiers && attacker.totalStats.damageGroupModifiers[group]) {
            const groupModifier = attacker.totalStats.damageGroupModifiers[group];
            baseDamage *= groupModifier;
        }

        // Apply weapon type modifiers if attacker is player
        if (attacker === player && player.equipment.mainHand) {
            const weapon = player.equipment.mainHand;
            const weaponType = weapon.weaponType;
            if (attacker.totalStats.weaponTypeModifiers && attacker.totalStats.weaponTypeModifiers[weaponType]) {
                const weaponTypeModifier = attacker.totalStats.weaponTypeModifiers[weaponType];
                baseDamage *= (1 + weaponTypeModifier);
            }
        }

        adjustedBaseDamages[damageType] = baseDamage;
    }

    // Sum up maxDamage before critical hits
    let maxDamage = 0;
    for (let damageType in adjustedBaseDamages) {
        maxDamage += adjustedBaseDamages[damageType];
    }

    // Handle case where maxDamage is zero (to prevent division by zero)
    if (maxDamage <= 0) {
        return 0; // No damage can be dealt
    }

    // Get attacker's Precision and defender's Deflection
    let attackerPrecision = attacker.totalStats.precision || 0; // Default to 0 if not defined
    let defenderDeflection = defender.totalStats.deflection || 0; // Default to 0 if not defined

    // Calculate skew based on Precision and Deflection
    let skew = 1 + (defenderDeflection - attackerPrecision) * 0.05; // Adjust skew factor
    skew = Math.max(0.1, skew); // Ensure skew is not less than 0.1

    // Generate skewed random damage between 0 and maxDamage
    let randomDamage = skewedRandom(0, maxDamage, skew);

    // Cap randomDamage to maxDamage to prevent floating-point errors
    randomDamage = Math.min(randomDamage, maxDamage);

    // Apply critical hit multiplier if critical hit
    let isCriticalHit = Math.random() < attacker.totalStats.criticalChance;
    if (defender.statusEffects.some(effect => effect.name === "Zapped")) {
        isCriticalHit = true; // Force a critical hit
        defender.statusEffects = defender.statusEffects.filter(effect => effect.name !== "Zapped");
        logMessage(`${defender === player ? "Player" : defender.name} was Zapped! The attack is a guaranteed critical hit!`);
    }
    if (isCriticalHit) {
        randomDamage *= attacker.totalStats.criticalMultiplier;
        logMessage(`${attacker === player ? "Player" : attacker.name} lands a critical hit!`);
    }

    // Apply defender's resistance (defense types)
    let totalReducedDamage = 0;
    let totalDamageAmount = 0; // Sum of damage amounts before resistance
    for (let damageType in adjustedBaseDamages) {
        let adjustedBaseDamage = adjustedBaseDamages[damageType];

        // Proportion of damage type in total max damage
        let damageProportion = adjustedBaseDamage / maxDamage;

        // Damage of this type after randomization
        let damageAmount = randomDamage * damageProportion;

        // Apply defender's resistance
        let resistanceStat = matchDamageToDefense(damageType);
        let resistance = defender.totalStats.defenseTypes[resistanceStat] || 0;
        let reducedDamage = damageAmount * (1 - (resistance / 100));

        // Ensure reducedDamage does not exceed damageAmount
        reducedDamage = Math.min(reducedDamage, damageAmount);

        // Accumulate damage amounts
        totalDamageAmount += damageAmount;
        totalReducedDamage += reducedDamage;
    }

    // Ensure totalReducedDamage does not exceed randomDamage (after critical hits)
    totalReducedDamage = Math.min(totalReducedDamage, randomDamage);

    // Round total damage to nearest whole number
    totalReducedDamage = Math.round(totalReducedDamage);
    return totalReducedDamage;
}





// Function to apply damage to target
function applyDamage(target, damage, targetName, damageTypes = null) {
    damage = Math.round(damage);

    let shieldAbsorbed = 0;
    if (target.currentShield > 0) {
        shieldAbsorbed = Math.min(target.currentShield, damage);
        target.currentShield -= shieldAbsorbed;
        damage -= shieldAbsorbed;

        animateShieldBarChunk(target, shieldAbsorbed);
        displayDamagePopup(`-${shieldAbsorbed}`, (target === player));
        logMessage(`${targetName} absorbs ${shieldAbsorbed} damage with their shield.`);
    }

    if (damage > 0) {
        target.currentHealth = Math.max(0, target.currentHealth - damage);
        animateHpBarChunk(target, damage);
        displayDamagePopup(`-${damage}`, (target === player));
        logMessage(`${targetName} takes {red}${damage} damage.{end}`);
    }

    if (target === enemy) {
        updateEnemyStatsDisplay();
    } else {
        updatePlayerStatsDisplay();
    }

    // check for defeat
    if (target.currentHealth <= 0) {
        logMessage(`${targetName} has been defeated!`);
        target.statusEffects = [];

        // If enemy is defeated
        if (target === enemy) {
            // Delve approach
            if (isDelveInProgress) {
                // 1) award XP immediately
                gainExperience(enemy.experienceValue || 0);

                // 2) add loot to delveBag
                addMonsterLootToDelveBag(enemy);

                // 3) Stop combat with the enemyDefeated reason to handle the inter-fight pause
                stopCombat('enemyDefeated');
            } 
        }
        // If player is defeated
        else if (target === player) {
            stopCombat('playerDefeated');
        }
    }
}




function animateHpBarChunk(target, damageAmount) {
    let hpBar, hpContainer, totalHp, currentHp;

    if (target === player) {
        hpBar = document.getElementById('player-hp-bar');
        hpContainer = hpBar.parentElement;
        totalHp = player.totalStats.health;
        currentHp = player.currentHealth;
    } else if (target === enemy) {
        hpBar = document.getElementById('enemy-hp-bar');
        hpContainer = hpBar.parentElement;
        totalHp = enemy.totalStats.health;
        currentHp = enemy.currentHealth;
    } else {
        console.error('Unknown target for HP bar animation.');
        return;
    }

    // Get container width in pixels
    const containerWidth = hpContainer.offsetWidth;

    // Get current HP width in pixels
    const currentWidth = hpBar.offsetWidth;

    // Calculate damage width in pixels
    const damageWidth = (damageAmount / totalHp) * containerWidth;

    // Calculate new HP width
    let newWidth = currentWidth - damageWidth;
    if (newWidth < 0) newWidth = 0;

    // Position for the slice (start at the new HP width)
    const slicePosition = newWidth;

    // Create the HP slice
    const slice = document.createElement('div');
    slice.classList.add('hp-slice');
    slice.style.width = `${damageWidth}px`;
    slice.style.left = `${slicePosition}px`; // Position the slice at the new HP level
    hpContainer.appendChild(slice);

    // Update the HP bar width
    hpBar.style.width = `${(currentHp / totalHp) * 100}%`;

    // Create the damage number
    const damageNumber = document.createElement('div');
    damageNumber.classList.add('damage-number');
    damageNumber.textContent = `-${Math.round(damageAmount)}`;
    damageNumber.style.left = `${slicePosition + damageWidth / 2 - 10}px`; // Center above the slice
    damageNumber.style.top = `-25px`; // Position above the HP bar
    hpContainer.appendChild(damageNumber);

    // Remove slice after animation completes
    slice.addEventListener('animationend', () => {
        hpContainer.removeChild(slice);
    });

    // Remove damage number after animation completes
    damageNumber.addEventListener('animationend', () => {
        hpContainer.removeChild(damageNumber);
    });
}

function animateShieldBarChunk(target, shieldDamageAmount) {
    let esBar, esContainer, totalEs, currentEs;

    if (target === player) {
        esBar = document.getElementById('player-es-bar');
        esContainer = esBar.parentElement;
        totalEs = player.totalStats.energyShield;
        currentEs = player.currentShield;
    } else if (target === enemy) {
        esBar = document.getElementById('enemy-es-bar');
        esContainer = esBar.parentElement;
        totalEs = enemy.totalStats.energyShield;
        currentEs = enemy.currentShield;
    } else {
        console.error('Unknown target for energy shield bar animation.');
        return;
    }

    // Get container width in pixels
    const containerWidth = esContainer.offsetWidth;

    // Get current ES width in pixels
    const currentWidth = esBar.offsetWidth;

    // Calculate damage width in pixels
    const damageWidth = (shieldDamageAmount / totalEs) * containerWidth;

    // Calculate new ES width
    let newWidth = currentWidth - damageWidth;
    if (newWidth < 0) newWidth = 0;

    // Position for the slice (start at the new ES width)
    const slicePosition = newWidth;

    // Create the ES slice
    const slice = document.createElement('div');
    slice.classList.add('es-slice');
    slice.style.width = `${damageWidth}px`;
    slice.style.left = `${slicePosition}px`; // Position the slice at the new ES level
    esContainer.appendChild(slice);

    // Update the ES bar width
    esBar.style.width = `${(currentEs / totalEs) * 100}%`;

    // Create the damage number
    const damageNumber = document.createElement('div');
    damageNumber.classList.add('damage-number');
    damageNumber.textContent = `-${Math.round(shieldDamageAmount)}`;
    damageNumber.style.left = `${slicePosition + damageWidth / 2 - 10}px`; // Center above the slice
    damageNumber.style.top = `-25px`; // Position above the shield bar
    esContainer.appendChild(damageNumber);

    // Remove slice after animation completes
    slice.addEventListener('animationend', () => {
        esContainer.removeChild(slice);
    });

    // Remove damage number after animation completes
    damageNumber.addEventListener('animationend', () => {
        esContainer.removeChild(damageNumber);
    });
}


// Function to handle loot drops
function dropLoot(enemy) {
    // Use the new loot handler
    handleLootDrop(enemy);
}


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function displayLootPopup(message) {
    // Remove any formatting codes like {flashing} and {end}
    // This regex removes any text enclosed in braces { ... }
    message = message.replace(/\{[^}]+\}/g, '');

    const container = document.getElementById('loot-popups-container');
    if (!container) {
        console.error('Loot popups container not found in the DOM.');
        return;
    }

    const popup = document.createElement('div');
    popup.classList.add('loot-popup');
    popup.textContent = message;

    // Add the popup to the container
    container.appendChild(popup);

    // Remove the popup after 3 seconds
    setTimeout(() => {
        popup.style.opacity = '0';
        popup.style.transition = 'opacity 0.5s';
        // Remove the popup from the DOM after the transition
        setTimeout(() => {
            container.removeChild(popup);
        }, 500);
    }, 3000);
}


// Function to match damage types to defense stats
function matchDamageToDefense(damageType) {
    // Physical Group
    if (damageType === 'kinetic' || damageType === 'slashing') {
        return 'sturdiness';
    }
    // Elemental Group
    else if (damageType === 'pyro' || damageType === 'cryo' || damageType === 'electric') {
        return 'structure';
    }
    // Chemical Group
    else if (damageType === 'corrosive' || damageType === 'radiation') {
        return 'stability';
    }
    // Legacy support for old saves/items
    else if (damageType === 'mental') {
        return 'sturdiness'; // Map mental to sturdiness as fallback
    }
    else if (damageType === 'chemical') {
        return 'stability'; // Map chemical to stability as fallback
    }
    else if (damageType === 'magnetic') {
        return 'structure'; // Map magnetic to structure as fallback
    }
    
    return '';
}

// Function to display damage popup
function displayDamagePopup(message, isPlayer) {
    const container = document.getElementById('damage-popups-container');
    if (!container) {
        console.error('Damage popups container not found in the DOM.');
        return;
    }

    const popup = document.createElement('div');
    popup.classList.add('damage-popup');
    popup.textContent = message;

    // Add appropriate class based on who took damage
    if (isPlayer) {
        popup.classList.add('player-damage');
    } else {
        popup.classList.add('enemy-damage');
    }

    // Add the popup to the container
    container.appendChild(popup);

    // Remove the popup after 3 seconds
    setTimeout(() => {
        popup.style.opacity = '0';
        popup.style.transition = 'opacity 0.5s';
        // Remove the popup from the DOM after the transition
        setTimeout(() => {
            container.removeChild(popup);
        }, 500);
    }, 3000);
}

function initializeEnemyStatsDisplay() {
    document.getElementById("enemy-name").textContent = "No Enemy";
    document.getElementById("enemy-attack-speed").textContent = "N/A";
    document.getElementById("enemy-crit-chance").textContent = "N/A";
    document.getElementById("enemy-crit-multiplier").textContent = "N/A";
    document.getElementById('enemy-attack-progress-bar').style.width = '0%';
    document.getElementById('enemy-hp-bar').style.width = '0%';
    document.getElementById('enemy-hp-text').textContent = '0 / 0';
    document.getElementById('enemy-es-bar').style.width = '0%';
    document.getElementById('enemy-es-text').textContent = '0 / 0';

    // Clear damage and defense types
    document.getElementById('enemy-damage-types').innerHTML = '';
    document.getElementById('enemy-defense-types').innerHTML = '';
    document.getElementById('enemy-active-effects').innerHTML = '';
}

// Helper function to capitalize the first letter
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function createShieldPulseAnimation() {
    // Check if the animation already exists
    if (!document.getElementById('shield-pulse-animation')) {
        const styleElement = document.createElement('style');
        styleElement.id = 'shield-pulse-animation';
        styleElement.textContent = `
            @keyframes shieldPulse {
                0% { opacity: 0.8; }
                50% { opacity: 1; }
                100% { opacity: 0.8; }
            }
        `;
        document.head.appendChild(styleElement);
    }
}

// Add this new function to create and update the Delve Bag UI
function updateDelveBagUI() {
    // Find or create the delve bag container
    let delveBagContainer = document.getElementById('delve-bag-container');
    
    if (!delveBagContainer) {
        // Create the container if it doesn't exist
        delveBagContainer = document.createElement('div');
        delveBagContainer.id = 'delve-bag-container';
        delveBagContainer.className = 'delve-bag';
        
        // Create header
        const header = document.createElement('h3');
        header.textContent = 'Delve Bag';
        delveBagContainer.appendChild(header);
        
        // Create credits display
        const creditsDiv = document.createElement('div');
        creditsDiv.id = 'delve-bag-credits';
        creditsDiv.className = 'delve-bag-credits';
        delveBagContainer.appendChild(creditsDiv);
        
        // Create items list
        const itemsList = document.createElement('ul');
        itemsList.id = 'delve-bag-items';
        delveBagContainer.appendChild(itemsList);
        
        // Add to the DOM - place it after enemy stats
        const enemyStats = document.getElementById('enemy-stats');
        if (enemyStats && enemyStats.parentNode) {
            enemyStats.parentNode.insertBefore(delveBagContainer, enemyStats.nextSibling);
        }
    }
    
    // Update credits display
    const creditsDiv = document.getElementById('delve-bag-credits');
    if (creditsDiv) {
        creditsDiv.textContent = `Credits: ${delveBag.credits}`;
    }
    
    // Update items list
    const itemsList = document.getElementById('delve-bag-items');
    if (itemsList) {
        // Clear current items
        itemsList.innerHTML = '';
        
        // Add each item with a tooltip
        delveBag.items.forEach(item => {
            const listItem = document.createElement('li');
            listItem.textContent = `${item.name} x${item.quantity}`;
            
            // Create an actual tooltip element (the old-fashioned way)
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.style.display = 'none'; // Initially hidden
            tooltip.innerHTML = getItemTooltipContent(item);
            listItem.appendChild(tooltip);
            
            // Also add data attributes for the global tooltip system as a backup
            listItem.dataset.hasTooltip = 'true';
            
            // Set unique ID to help debug
            const uniqueId = `delve-item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
            listItem.id = uniqueId;
            
            // Old hover handler (fallback method)
            listItem.addEventListener('mouseenter', () => {
                console.log(`Mouse entered delve bag item: ${item.name}`);
                tooltip.style.display = 'block';
            });
            
            listItem.addEventListener('mouseleave', () => {
                tooltip.style.display = 'none';
            });
            
            itemsList.appendChild(listItem);
        });
        
        // Show "empty" message if no items
        if (delveBag.items.length === 0) {
            const emptyMessage = document.createElement('li');
            emptyMessage.textContent = 'Empty';
            emptyMessage.className = 'empty-bag';
            itemsList.appendChild(emptyMessage);
        }
    }
    
    // Show/hide based on delve status
    if (delveBagContainer) {
        delveBagContainer.style.display = isDelveInProgress ? 'block' : 'none';
    }
}

function applyStatusEffect(target, effectName) {
    // Create the status effect instance using the factory function
    let effectFactory = statusEffects[effectName];
    if (effectFactory) {
        let effect = effectFactory(target);
        target.statusEffects.push(effect);
    } else {
        console.error(`Status effect '${effectName}' not found.`);
    }
}

function processBuffs(entity, deltaTime) {
    let buffsChanged = false;
    for (let i = entity.activeBuffs.length - 1; i >= 0; i--) {
        const buff = entity.activeBuffs[i];
        buff.remainingDuration -= deltaTime * 1000; // Convert deltaTime to milliseconds
        if (buff.remainingDuration <= 0) {
            entity.activeBuffs.splice(i, 1);
            buffsChanged = true;
            logMessage(`${entity.name}'s buff ${buff.name} has expired.`);
        }
    }
    if (buffsChanged) {
        entity.calculateStats();
        if (entity === player) {
            updatePlayerStatsDisplay();
        } else if (entity === enemy) {
            updateEnemyStatsDisplay();
        }
    }
}

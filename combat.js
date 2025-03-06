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
        // Create a big Flee button
        const fleeButton = document.createElement('button');
        fleeButton.textContent = "Flee Delve";
        fleeButton.style.fontSize = '16px';
        fleeButton.style.marginBottom = '10px';
        fleeButton.addEventListener('click', () => {
            stopCombat('playerFled');
        });

        // Add it to the delveControls area
        delveControlsDiv.appendChild(fleeButton);

        // Optionally, show a note
        const note = document.createElement('p');
        note.textContent = "You are currently delving. You can flee now, but lose your Delve Bag loot!";
        note.style.color = 'red';
        delveControlsDiv.appendChild(note);

    } else {
        // No delve in progress, show the location buttons
        locations.forEach(loc => {
            const btn = document.createElement('button');
            btn.textContent = loc.name;
            btn.title = loc.description || "No description";
            btn.style.display = 'inline-block';
            btn.style.margin = '5px';
            btn.addEventListener('click', () => {
                startAdventure(loc);
            });

            adventureDiv.appendChild(btn);
        });
    }
}

function startAdventure(location) {
    if (isDelveInProgress) {
        logMessage("You are already on an adventure!");
        return;
    }

    clearLog();
    logMessage(`You begin your delve into ${location.name}.`);

    isDelveInProgress = true;
    currentDelveLocation = location;
    currentMonsterIndex = 0;
    delveBag = { items: [], credits: 0 };
    updateDelveBagUI(); // Update UI when adventure starts

    // We rely on displayAdventureLocations() to hide the location buttons 
    // and show the "Flee" button instead.
    displayAdventureLocations();
    startHealthRegen();
    beginNextMonsterInSequence();
}

function beginNextMonsterInSequence() {
    // If we're out of monsters, the delve is complete
    if (currentMonsterIndex >= currentDelveLocation.monsterSequence.length) {
        finalizeDelveLoot();
        logMessage(`You have cleared all monsters in ${currentDelveLocation.name}!`);

        // Immediately reset the player's HP/shield for UI
        player.currentHealth = player.totalStats.health;
        player.currentShield = player.totalStats.energyShield;
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

    isCombatActive = true;

    // Initialize enemy
    spawnEnemy();
    clearBuffs(player);
    if (enemy) {
        clearBuffs(enemy);
    }
    
    startHealthRegen();

    // Start combat loop
    lastCombatLoopTime = Date.now();
    combatInterval = setInterval(combatLoop, 100);
    console.log("Combat started.");

    document.getElementById('stop-combat').style.display = 'block';

    // Update the adventure locations display (e.g., change to 'Flee' button)
    displayAdventureLocations();
}

function spawnEnemyForSequence(monsterName, isEmpowered) {
    const enemyData = enemies.find(e => e.name === monsterName);
    if (!enemyData) {
        console.error(`Enemy "${monsterName}" not found in enemies.js!`);
        stopDelveWithFailure();
        return;
    }

    enemy = JSON.parse(JSON.stringify(enemyData));

    // Optionally empower
    if (isEmpowered) {
        enemy.name = "Viral " + enemy.name;
        enemy.health = Math.round(enemy.health * 1.3);
        // scale damage or any other stats
    }

    // We do NOT reset the player's HP/shield
    // but we DO reset attack timers so the new fight starts fresh
    playerAttackTimer = 0;
    enemyAttackTimer = 0;

    // Basic enemy set up
    enemy.currentHealth = enemy.health;
    enemy.currentShield = enemy.energyShield;
    enemy.statusEffects = [];
    enemy.effects = enemy.effects || [];
    enemy.activeBuffs = [];

    // Add a quick "calculateStats" method
    enemy.calculateStats = function () {
        let stats = JSON.parse(JSON.stringify(this));
        stats.attackSpeedMultiplier = 1.0;
        stats.criticalMultiplierMultiplier = 1.0;
        stats.damageTypes = stats.damageTypes || {};
        stats.damageTypeModifiers = stats.damageTypeModifiers || {};
        stats.defenseTypes = stats.defenseTypes || {};
        stats.effects = this.effects || [];

        if (this.activeBuffs) {
            this.activeBuffs.forEach(buff => {
                if (buff.statChanges) {
                    for (let stat in buff.statChanges) {
                        if (stat === 'attackSpeed') {
                            stats.attackSpeedMultiplier *= 1 + buff.statChanges[stat];
                        } else if (stat === 'criticalMultiplier') {
                            stats.criticalMultiplierMultiplier *= 1 + buff.statChanges[stat];
                        } else if (stat in stats) {
                            stats[stat] += buff.statChanges[stat];
                        } else if (stats.damageTypes[stat] !== undefined) {
                            stats.damageTypes[stat] += buff.statChanges[stat];
                        } else if (stats.defenseTypes[stat] !== undefined) {
                            stats.defenseTypes[stat] += buff.statChanges[stat];
                        }
                    }
                }
            });
        }

        // Apply multipliers
        stats.attackSpeed *= stats.attackSpeedMultiplier;
        stats.attackSpeed = Math.min(Math.max(stats.attackSpeed, 0.1), 10);
        stats.criticalMultiplier *= stats.criticalMultiplierMultiplier;

        // round damage
        for (let dt in stats.damageTypes) {
            if (stats.damageTypeModifiers[dt]) {
                stats.damageTypes[dt] *= stats.damageTypeModifiers[dt];
            }
            stats.damageTypes[dt] = Math.round(stats.damageTypes[dt]);
        }
        this.totalStats = stats;
    };
    enemy.calculateStats();

    logMessage(`${enemy.name} stands before you!`);
    updateEnemyStatsDisplay();

    // Start the combat loop if not already
    if (!isCombatActive) {
        isCombatActive = true;
        lastCombatLoopTime = Date.now();
        combatInterval = setInterval(combatLoop, 100);
    }
}

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

    // Enhanced HP bar with gradient
    const playerHpBar = document.getElementById('player-hp-bar');
    const hpPercent = (player.currentHealth / player.totalStats.health) * 100;
    playerHpBar.style.width = hpPercent + '%';
    
    // Change HP bar color based on percentage
    if (hpPercent < 25) {
        playerHpBar.style.background = 'linear-gradient(90deg, #ff5959, #ff8080)';
    } else if (hpPercent < 50) {
        playerHpBar.style.background = 'linear-gradient(90deg, #ffaa5e, #ffc179)';
    } else {
        playerHpBar.style.background = 'linear-gradient(90deg, #48bf91, #64dfdf)';
    }

    // Enhanced HP text
    const playerHpText = document.getElementById('player-hp-text');
    playerHpText.innerHTML = `<span style="color: #e0f2ff; text-shadow: 0 0 5px rgba(0, 255, 204, 0.5);">${Math.round(player.currentHealth)} / ${Math.round(player.totalStats.health)}</span>`;

    // Enhanced ES text
    const playerEsText = document.getElementById('player-es-text');
    playerEsText.innerHTML = `<span style="color: #56cfe1; text-shadow: 0 0 5px rgba(86, 207, 225, 0.5);">${Math.round(player.currentShield)} / ${Math.round(player.totalStats.energyShield)}</span>`;

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

    // Stylish defense types list
    const defenseTypesList = document.getElementById('player-defense-types');
    defenseTypesList.innerHTML = '';
    let hasDefenseTypes = false;
    
    for (let type in player.totalStats.defenseTypes) {
        hasDefenseTypes = true;
        const li = document.createElement('li');
        li.style.padding = '4px 8px';
        li.style.margin = '3px 0';
        li.style.background = 'rgba(0, 15, 40, 0.5)';
        li.style.borderRadius = '3px';
        li.style.borderLeft = '2px solid #64dfdf';
        
        li.innerHTML = `<span style="color: #64dfdf; font-weight: bold;">${capitalize(type)}:</span> <span style="color: #ffffff;">${player.totalStats.defenseTypes[type]}</span>`;
        defenseTypesList.appendChild(li);
    }
    
    if (!hasDefenseTypes) {
        const li = document.createElement('li');
        li.style.padding = '4px 8px';
        li.style.color = '#888';
        li.style.fontStyle = 'italic';
        li.textContent = 'No defense types';
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

function updateEnemyStatsDisplay() {
    if (!enemy) {
        initializeEnemyStatsDisplay();
        return;
    }

    // Enemy name with stylish formatting
    document.getElementById("enemy-name").innerHTML = `<span style="color: #ff6b6b; text-shadow: 0 0 5px rgba(255, 107, 107, 0.3); font-weight: bold;">${enemy.name}</span>`;
    
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

    // Enhanced HP bar with dynamic gradient
    const enemyHpBar = document.getElementById('enemy-hp-bar');
    const enemyHpPercentage = (enemy.currentHealth / enemy.totalStats.health) * 100;
    enemyHpBar.style.width = enemyHpPercentage + '%';
    
    // Change enemy HP bar color based on percentage
    if (enemyHpPercentage < 25) {
        enemyHpBar.style.background = 'linear-gradient(90deg, #ff5959, #ff8080)';
    } else if (enemyHpPercentage < 50) {
        enemyHpBar.style.background = 'linear-gradient(90deg, #ffaa5e, #ffc179)';
    } else {
        enemyHpBar.style.background = 'linear-gradient(90deg, #ff6b6b, #ff9e9e)'; // Reddish for enemy
    }

    // Enhanced HP text
    const enemyHpText = document.getElementById('enemy-hp-text');
    enemyHpText.innerHTML = `<span style="color: #e0f2ff; text-shadow: 0 0 5px rgba(255, 107, 107, 0.3);">${Math.round(enemy.currentHealth)} / ${Math.round(enemy.totalStats.health)}</span>`;

    // Energy Shield bar with pulsing effect
    const enemyEsBar = document.getElementById('enemy-es-bar');
    const enemyEsPercentage = (enemy.currentShield / enemy.totalStats.energyShield) * 100 || 0;
    enemyEsBar.style.width = enemyEsPercentage + '%';
    
    if (enemyEsPercentage > 0) {
        enemyEsBar.style.background = 'linear-gradient(90deg, #56cfe1, #7fdbff)';
        
        // Add subtle pulsing animation to shield - No longer try to modify existing stylesheets
        if (!enemyEsBar.style.animation) {
            enemyEsBar.style.animation = 'shieldPulse 2s infinite';
            // Animation is now created by createShieldPulseAnimation() function
        }
    } else {
        enemyEsBar.style.animation = '';
    }

    // Enhanced Energy Shield text
    const enemyEsText = document.getElementById('enemy-es-text');
    enemyEsText.innerHTML = `<span style="color: #56cfe1; text-shadow: 0 0 5px rgba(86, 207, 225, 0.5);">${Math.round(enemy.currentShield)} / ${Math.round(enemy.totalStats.energyShield)}</span>`;

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

    // Stylish defense types list
    const defenseTypesList = document.getElementById('enemy-defense-types');
    defenseTypesList.innerHTML = '';
    let hasDefenseTypes = false;
    
    for (let type in enemy.totalStats.defenseTypes) {
        hasDefenseTypes = true;
        const li = document.createElement('li');
        li.style.padding = '4px 8px';
        li.style.margin = '3px 0';
        li.style.background = 'rgba(0, 15, 40, 0.5)';
        li.style.borderRadius = '3px';
        li.style.borderLeft = '2px solid #64dfdf';
        
        li.innerHTML = `<span style="color: #64dfdf; font-weight: bold;">${capitalize(type)}:</span> <span style="color: #ffffff;">${enemy.totalStats.defenseTypes[type]}</span>`;
        defenseTypesList.appendChild(li);
    }
    
    if (!hasDefenseTypes) {
        const li = document.createElement('li');
        li.style.padding = '4px 8px';
        li.style.color = '#888';
        li.style.fontStyle = 'italic';
        li.textContent = 'No defense types';
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
    player.totalStats = JSON.parse(JSON.stringify(player.baseStats));
    player.currentHealth = player.totalStats.health;
    player.currentShield = player.totalStats.energyShield;
    player.statusEffects = [];
    updatePlayerStatsDisplay();
    clearBuffs(player);
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
    // If we are delving, skip health regeneration entirely
    // if (isDelveInProgress) {
    //     return;
    // }

    // Clear any existing interval to prevent multiple intervals
    if (healthRegenInterval) {
        clearInterval(healthRegenInterval);
    }

    // Regenerate health every 200 milliseconds
    healthRegenInterval = setInterval(() => {
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

    // Player
    playerAttackTimer += deltaTime;
    const playerAttackInterval = 3 / player.totalStats.attackSpeed;
    const playerProgress = Math.min((playerAttackTimer / playerAttackInterval) * 100, 100);
    document.getElementById('player-attack-progress-bar').style.width = playerProgress + '%';

    if (playerAttackTimer >= playerAttackInterval) {
        playerAttack();
        playerAttackTimer = 0;
    }

    // Enemy
    enemyAttackTimer += deltaTime;
    const enemyAttackInterval = 3 / enemy.totalStats.attackSpeed;
    const enemyProgress = Math.min((enemyAttackTimer / enemyAttackInterval) * 100, 100);
    document.getElementById('enemy-attack-progress-bar').style.width = enemyProgress + '%';

    if (enemyAttackTimer >= enemyAttackInterval) {
        enemyAttack();
        enemyAttackTimer = 0;
    }

    // Buffs, status effects
    processBuffs(player, deltaTime);
    if (enemy.activeBuffs) {
        processBuffs(enemy, deltaTime);
    }
    if (player.currentHealth > 0) {
        processStatusEffects(player, deltaTime);
    }
    if (enemy.currentHealth > 0) {
        processStatusEffects(enemy, deltaTime);
    }

    // Check end
    if (player.currentHealth <= 0) {
        stopCombat('playerDefeated');
    }
    else if (enemy.currentHealth <= 0) {
        // We handle that in applyDamage
    }

    updatePlayerStatsDisplay();
    updateEnemyStatsDisplay();
}

function clearBuffs(entity) {
    console.log(`clearBuffs called for ${entity.name} (clearbuffs)`);
    entity.activeBuffs = [];
    console.log(`${entity.name} activeBuffs length after clearing: ${entity.activeBuffs.length} (clearbuffs)`);
    entity.calculateStats();
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

    // ALWAYS restore player health to full no matter what
    player.currentHealth = player.totalStats.health;
    player.currentShield = player.totalStats.energyShield;
    updatePlayerStatsDisplay();

    // Handle delve state based on reason
    if (isDelveInProgress) {
        if (reason === 'playerFled' || reason === 'playerDefeated') {
            stopDelveWithFailure();
            
            // Return to adventure location selection
            isDelveInProgress = false;
            currentDelveLocation = null;
            currentMonsterIndex = 0;
            displayAdventureLocations();
        }
        else if (reason === 'delveCompleted') {
            // Mark success
            isDelveInProgress = false;
            currentDelveLocation = null;
            currentMonsterIndex = 0;
            displayAdventureLocations();
        }
        else if (reason === 'enemyDefeated') {
            // Don't end the delve, we'll handle the next monster
            currentMonsterIndex++;
            
            // Make sure player's health doesn't continue to drop
            clearBuffs(player);
            clearBuffs(enemy);
            
            // Health has already been restored above
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
    let totalDamage = calculateDamage(player, enemy);
    applyDamage(enemy, totalDamage, enemy.name);

    // triggers
    processEffects(player, 'onHit', enemy);
    processEffects(enemy, 'whenHit', player);
}

function enemyAttack() {
    let totalDamage = calculateDamage(enemy, player);
    applyDamage(player, totalDamage, "Player");

    // triggers
    processEffects(enemy, 'onHit', player);
    processEffects(player, 'whenHit', enemy);
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

function processEffects(entity, trigger, target) {
    if (!entity.effects) {
        console.log(`Entity ${entity.name} has no effects.`);
        return;
    }

    console.log(`Processing effects for ${entity.name} with trigger '${trigger}'`);

    entity.effects.forEach(effect => {
        if (effect.trigger === trigger) {
            console.log(`Effect found:`, effect);
            // Check if the effect activates based on chance
            if (Math.random() < effect.chance) {
                console.log(`Effect triggered:`, effect);
                executeEffectAction(effect, entity, target);
            } else {
                console.log(`Effect did not trigger due to chance.`);
            }
        }
    });
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

    // Use attacker's totalStats.damageTypes directly since modifiers have already been applied
    for (let damageType in attacker.totalStats.damageTypes) {
        let baseDamage = attacker.totalStats.damageTypes[damageType];

        // No need to apply damage type modifiers again
        // baseDamage is already adjusted in calculateStats

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
    switch (damageType) {
        case 'kinetic': return 'toughness';
        case 'mental': return 'fortitude';
        case 'pyro': return 'heatResistance';
        case 'chemical': return 'immunity';
        case 'magnetic': return 'antimagnet';
        default: return '';
    }
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

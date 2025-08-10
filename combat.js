// combat.js

// Import debuffs.js at the top of the file (add this line at the very beginning)
document.addEventListener('DOMContentLoaded', function() {
    loadScript('debuffs.js');
});

// Helper function to load scripts
function loadScript(src) {
    return new Promise(function(resolve, reject) {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

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
let playerNextAttackTime = 0; // Add this line to define playerNextAttackTime
let enemyNextAttackTime = 0; // Add this line to define enemyNextAttackTime

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

    console.log("displayAdventureLocations - isDelveInProgress:", isDelveInProgress);

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
        // Create a sci-fi themed holographic location selection interface
        
        // Main section title with futuristic styling
        const mainTitle = document.createElement('h3');
        mainTitle.textContent = 'NEXUS DEPLOYMENT TERMINAL';
        mainTitle.className = 'locations-main-title';
        mainTitle.style.color = '#00ffcc';
        mainTitle.style.textShadow = '0 0 8px rgba(0, 255, 204, 0.7)';
        mainTitle.style.marginBottom = '5px';
        mainTitle.style.textAlign = 'center';
        mainTitle.style.fontFamily = '"Rajdhani", "Orbitron", sans-serif';
        mainTitle.style.letterSpacing = '2px';
        mainTitle.style.fontSize = '24px';
        adventureDiv.appendChild(mainTitle);
        
        // Subtitle with blinking cursor effect
        const subtitle = document.createElement('div');
        subtitle.className = 'locations-subtitle';
        subtitle.innerHTML = 'SELECT DESTINATION<span class="blink-cursor">_</span>';
        subtitle.style.color = '#7fdbff';
        subtitle.style.textAlign = 'center';
        subtitle.style.marginBottom = '20px';
        subtitle.style.fontSize = '14px';
        subtitle.style.fontFamily = '"Rajdhani", "Courier New", monospace';
        adventureDiv.appendChild(subtitle);
        
        // Create blinking cursor animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes blink-cursor {
                0%, 100% { opacity: 1; }
                50% { opacity: 0; }
            }
            .blink-cursor {
                animation: blink-cursor 1s infinite;
                font-weight: bold;
                color: #00ffcc;
            }
        `;
        document.head.appendChild(style);
        
        // Create main interface container
        const interfaceContainer = document.createElement('div');
        interfaceContainer.className = 'locations-interface';
        interfaceContainer.style.display = 'flex';
        interfaceContainer.style.flexDirection = 'column';
        interfaceContainer.style.background = 'rgba(0, 20, 40, 0.7)';
        interfaceContainer.style.borderRadius = '8px';
        interfaceContainer.style.border = '1px solid #00a6fb';
        interfaceContainer.style.boxShadow = '0 0 20px rgba(0, 166, 251, 0.3), inset 0 0 10px rgba(0, 255, 204, 0.2)';
        interfaceContainer.style.padding = '15px';
        interfaceContainer.style.position = 'relative';
        interfaceContainer.style.overflow = 'hidden'; // For the scanner effect
        adventureDiv.appendChild(interfaceContainer);
        
        // Add scanner effect
        const scannerEffect = document.createElement('div');
        scannerEffect.className = 'scanner-effect';
        scannerEffect.style.position = 'absolute';
        scannerEffect.style.top = '0';
        scannerEffect.style.left = '0';
        scannerEffect.style.width = '100%';
        scannerEffect.style.height = '2px';
        scannerEffect.style.background = 'linear-gradient(90deg, transparent, #00ffcc, transparent)';
        scannerEffect.style.boxShadow = '0 0 15px rgba(0, 255, 204, 0.7)';
        scannerEffect.style.opacity = '0.7';
        scannerEffect.style.zIndex = '1';
        interfaceContainer.appendChild(scannerEffect);
        
        // Add scanner animation
        const scannerAnimation = document.createElement('style');
        scannerAnimation.textContent = `
            @keyframes scanner {
                0% { top: 0; }
                100% { top: 100%; }
            }
            .scanner-effect {
                animation: scanner 2.5s linear infinite;
            }
        `;
        document.head.appendChild(scannerAnimation);
        
        // Add search and filter controls
        const controlsRow = document.createElement('div');
        controlsRow.className = 'locations-controls';
        controlsRow.style.display = 'flex';
        controlsRow.style.justifyContent = 'space-between';
        controlsRow.style.marginBottom = '15px';
        controlsRow.style.zIndex = '2';
        controlsRow.style.position = 'relative';
        interfaceContainer.appendChild(controlsRow);
        
        // Search input
        const searchContainer = document.createElement('div');
        searchContainer.style.flex = '1';
        searchContainer.style.marginRight = '15px';
        searchContainer.style.position = 'relative';
        searchContainer.style.maxWidth = 'calc(100% - 200px)'; // Prevent overlap with dropdown
        
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'SEARCH LOCATIONS...';
        searchInput.className = 'location-search';
        searchInput.style.width = '93%';
        searchInput.style.padding = '8px 10px 8px 35px';
        searchInput.style.background = 'rgba(0, 40, 60, 0.7)';
        searchInput.style.border = '1px solid #0096c7';
        searchInput.style.borderRadius = '4px';
        searchInput.style.color = '#e0f2ff';
        searchInput.style.outline = 'none';
        searchInput.style.fontFamily = '"Rajdhani", "Courier New", monospace';
        
        // Search icon
        const searchIcon = document.createElement('span');
        searchIcon.innerHTML = '🔍';
        searchIcon.style.position = 'absolute';
        searchIcon.style.left = '10px';
        searchIcon.style.top = '50%';
        searchIcon.style.transform = 'translateY(-50%)';
        searchIcon.style.color = '#7fdbff';
        searchIcon.style.fontSize = '14px';
        
        searchContainer.appendChild(searchIcon);
        searchContainer.appendChild(searchInput);
        controlsRow.appendChild(searchContainer);
        
        // Add filter dropdown
        const filterContainer = document.createElement('div');
        filterContainer.style.width = '180px';
        filterContainer.style.position = 'relative';
        filterContainer.style.flexShrink = '0'; // Prevent shrinking
        
        const filterSelect = document.createElement('select');
        filterSelect.className = 'location-filter';
        filterSelect.style.width = '100%';
        filterSelect.style.padding = '8px 10px';
        filterSelect.style.background = 'rgba(0, 40, 60, 0.7)';
        filterSelect.style.border = '1px solid #0096c7';
        filterSelect.style.borderRadius = '4px';
        filterSelect.style.color = '#e0f2ff';
        filterSelect.style.outline = 'none';
        filterSelect.style.cursor = 'pointer';
        filterSelect.style.fontFamily = '"Rajdhani", "Courier New", monospace';
        filterSelect.style.appearance = 'none';
        
        // Get unique categories from all locations
        const uniqueCategories = ['all sectors'];
        locations.forEach(loc => {
            if (loc.locationCategory && !uniqueCategories.includes(loc.locationCategory.toLowerCase())) {
                uniqueCategories.push(loc.locationCategory.toLowerCase());
            }
        });
        
        // Create options from unique categories
        uniqueCategories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category === 'all sectors' ? 'ALL SECTORS' : category.toUpperCase();
            filterSelect.appendChild(option);
        });
        
        // Custom dropdown arrow
        const filterArrow = document.createElement('div');
        filterArrow.innerHTML = '▼';
        filterArrow.style.position = 'absolute';
        filterArrow.style.right = '10px';
        filterArrow.style.top = '50%';
        filterArrow.style.transform = 'translateY(-50%)';
        filterArrow.style.color = '#7fdbff';
        filterArrow.style.fontSize = '10px';
        filterArrow.style.pointerEvents = 'none';
        
        filterContainer.appendChild(filterSelect);
        filterContainer.appendChild(filterArrow);
        controlsRow.appendChild(filterContainer);
        
        // Function to update displayed locations based on search and filter
        function updateLocationDisplay() {
            const searchTerm = searchInput.value.toLowerCase();
            const selectedCategory = filterSelect.value.toLowerCase();
            
            // Show all locations in grid that match search and filter
            Array.from(locationGrid.children).forEach(locationCard => {
                const locName = locationCard.getAttribute('data-name').toLowerCase();
                const locCategory = locationCard.getAttribute('data-category').toLowerCase() || '';
                
                const matchesSearch = locName.includes(searchTerm);
                const matchesCategory = selectedCategory === 'all sectors' || locCategory === selectedCategory;
                
                locationCard.style.display = (matchesSearch && matchesCategory) ? 'flex' : 'none';
            });
        }
        
        // Add event listeners for search and filter
        searchInput.addEventListener('input', updateLocationDisplay);
        filterSelect.addEventListener('change', updateLocationDisplay);
        
        // Now create the scrollable location grid
        const locationScrollContainer = document.createElement('div');
        locationScrollContainer.className = 'locations-scroll-container';
        locationScrollContainer.style.overflow = 'auto';
        locationScrollContainer.style.maxHeight = '400px';
        locationScrollContainer.style.paddingRight = '5px';
        locationScrollContainer.style.zIndex = '2';
        locationScrollContainer.style.position = 'relative';
        
        // Custom scrollbar styling
        const scrollbarStyle = document.createElement('style');
        scrollbarStyle.textContent = `
            .locations-scroll-container::-webkit-scrollbar {
                width: 8px;
            }
            .locations-scroll-container::-webkit-scrollbar-track {
                background: rgba(0, 20, 40, 0.5);
                border-radius: 4px;
            }
            .locations-scroll-container::-webkit-scrollbar-thumb {
                background: #0096c7;
                border-radius: 4px;
                box-shadow: 0 0 5px rgba(0, 150, 199, 0.5);
            }
            .locations-scroll-container::-webkit-scrollbar-thumb:hover {
                background: #00b4d8;
            }
        `;
        document.head.appendChild(scrollbarStyle);
        
        interfaceContainer.appendChild(locationScrollContainer);
        
        // Create the actual grid for locations
        const locationGrid = document.createElement('div');
        locationGrid.className = 'locations-grid';
        locationGrid.style.display = 'grid';
        locationGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(250px, 1fr))';
        locationGrid.style.gap = '15px';
        locationGrid.style.padding = '5px';
        locationScrollContainer.appendChild(locationGrid);
        
        // Create location cards for each location
        locations.forEach(loc => {
            // Get the category from the locationCategory property, with a fallback to "industrial"
            const category = loc.locationCategory || "industrial";
            
            // Create location card
            const locationCard = document.createElement('div');
            locationCard.className = 'location-card';
            locationCard.setAttribute('data-name', loc.name);
            locationCard.setAttribute('data-category', category);
            locationCard.style.display = 'flex';
            locationCard.style.flexDirection = 'column';
            locationCard.style.background = 'rgba(0, 30, 60, 0.8)';
            locationCard.style.borderRadius = '6px';
            locationCard.style.border = '1px solid #0077b6';
            locationCard.style.padding = '12px';
            locationCard.style.transition = 'all 0.2s ease';
            locationCard.style.cursor = 'pointer';
            locationCard.style.position = 'relative';
            locationCard.style.overflow = 'hidden';
            
            // Category indicator
            const categoryTag = document.createElement('div');
            categoryTag.className = 'category-tag';
            categoryTag.textContent = category.toUpperCase();
            categoryTag.style.position = 'absolute';
            categoryTag.style.top = '8px';
            categoryTag.style.right = '8px';
            categoryTag.style.fontSize = '8px'; // Smaller font
            categoryTag.style.padding = '2px 4px';
            categoryTag.style.borderRadius = '3px';
            categoryTag.style.textTransform = 'uppercase';
            categoryTag.style.letterSpacing = '0.5px';
            categoryTag.style.zIndex = '1'; // Ensure it's above other elements
            
            // Set color based on category
            switch(category) {
                case 'training':
                    categoryTag.style.background = 'rgba(0, 176, 255, 0.3)';
                    categoryTag.style.border = '1px solid #00b0ff';
                    categoryTag.style.color = '#90e0ef';
                    break;
                case 'industrial':
                    categoryTag.style.background = 'rgba(255, 159, 28, 0.3)';
                    categoryTag.style.border = '1px solid #ff9f1c';
                    categoryTag.style.color = '#ffbd59';
                    break;
                case 'wilderness':
                    categoryTag.style.background = 'rgba(76, 187, 23, 0.3)';
                    categoryTag.style.border = '1px solid #4cbb17';
                    categoryTag.style.color = '#90ee90';
                    break;
                case 'residential':
                    categoryTag.style.background = 'rgba(147, 112, 219, 0.3)';
                    categoryTag.style.border = '1px solid #9370db';
                    categoryTag.style.color = '#b19cd9';
                    break;
                case 'dangerous':
                    categoryTag.style.background = 'rgba(220, 53, 69, 0.3)';
                    categoryTag.style.border = '1px solid #dc3545';
                    categoryTag.style.color = '#f08080';
                    break;
                default:
                    categoryTag.style.background = 'rgba(108, 117, 125, 0.3)';
                    categoryTag.style.border = '1px solid #6c757d';
                    categoryTag.style.color = '#adb5bd';
            }
            
            locationCard.appendChild(categoryTag);
            
            // Location name
            const locationName = document.createElement('h4');
            locationName.textContent = loc.name;
            locationName.style.color = '#e0f2ff';
            locationName.style.margin = '5px 0 8px 0';
            locationName.style.fontSize = '16px';
            locationName.style.fontWeight = 'bold';
            locationName.style.fontFamily = '"Rajdhani", sans-serif';
            locationName.style.paddingRight = '65px'; // Add padding to avoid overlap with tag
            locationCard.appendChild(locationName);
            
            // Location description
            const locationDesc = document.createElement('p');
            locationDesc.textContent = loc.description || "No description available.";
            locationDesc.style.color = '#a0c5e8';
            locationDesc.style.fontSize = '12px';
            locationDesc.style.margin = '0 0 10px 0';
            locationDesc.style.flex = '1';
            locationDesc.style.lineHeight = '1.4';
            locationCard.appendChild(locationDesc);
            
            // Recommended level (optional)
            if (typeof loc.recommendedLevel === 'number' && !isNaN(loc.recommendedLevel)) {
                const rec = document.createElement('div');
                rec.textContent = `Recommended Lv ${loc.recommendedLevel}`;
                rec.style.display = 'inline-block';
                rec.style.alignSelf = 'flex-start';
                rec.style.color = '#ffcc00';
                rec.style.fontSize = '11px';
                rec.style.border = '1px solid rgba(255, 204, 0, 0.4)';
                rec.style.background = 'rgba(255, 204, 0, 0.08)';
                rec.style.borderRadius = '10px';
                rec.style.padding = '2px 8px';
                rec.style.margin = '0 0 8px 0';
                rec.style.textShadow = '0 0 5px rgba(255, 204, 0, 0.4)';
                locationCard.appendChild(rec);
            }
            
            // Enemy count and fight info 
            const enemyInfo = document.createElement('div');
            enemyInfo.style.display = 'flex';
            enemyInfo.style.flexDirection = 'column';
            enemyInfo.style.gap = '3px';
            enemyInfo.style.marginTop = '5px';
            locationCard.appendChild(enemyInfo);
            
            const enemyCount = document.createElement('span');
            enemyCount.textContent = `${loc.enemies.length} Known Entities`;
            enemyCount.style.color = '#7fdbff';
            enemyCount.style.fontSize = '11px';
            enemyInfo.appendChild(enemyCount);
            
            const fightCount = document.createElement('span');
            fightCount.textContent = `${loc.numFights} Fights`;
            fightCount.style.color = '#7fdbff';
            fightCount.style.fontSize = '11px';
            enemyInfo.appendChild(fightCount);
            
            // Action button
            const actionButton = document.createElement('button');
            actionButton.textContent = "DEPLOY";
            actionButton.className = 'location-action-button';
            actionButton.style.marginTop = '15px';
            actionButton.style.padding = '8px';
            actionButton.style.background = 'linear-gradient(135deg, #003559, #005f73)';
            actionButton.style.color = '#e0f2ff';
            actionButton.style.border = '1px solid #00a6fb';
            actionButton.style.borderRadius = '4px';
            actionButton.style.boxShadow = '0 0 10px rgba(0, 166, 251, 0.3)';
            actionButton.style.fontWeight = 'bold';
            actionButton.style.cursor = 'pointer';
            actionButton.style.fontFamily = '"Rajdhani", sans-serif';
            actionButton.style.transition = 'all 0.2s ease';
            locationCard.appendChild(actionButton);
            
            // Hover effects
            locationCard.addEventListener('mouseover', function() {
                this.style.transform = 'translateY(-5px)';
                this.style.boxShadow = '0 5px 15px rgba(0, 166, 251, 0.4)';
                this.style.borderColor = '#00b4d8';
                
                // Add glowing border effect
                this.style.boxShadow = '0 0 15px rgba(0, 180, 216, 0.5), 0 5px 15px rgba(0, 166, 251, 0.4)';
            });
            
            locationCard.addEventListener('mouseout', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = 'none';
                this.style.borderColor = '#0077b6';
            });
            
            // Click event to start adventure
            locationCard.addEventListener('click', () => {
                startAdventure(loc);
            });
            
            // Also add click event to button
            actionButton.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent triggering the card's click event
                startAdventure(loc);
            });
            
            locationGrid.appendChild(locationCard);
        });
        
        // Add "Connecting to network..." animation effect during load
        const loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'location-loading-overlay';
        loadingOverlay.style.position = 'absolute';
        loadingOverlay.style.top = '0';
        loadingOverlay.style.left = '0';
        loadingOverlay.style.width = '100%';
        loadingOverlay.style.height = '100%';
        loadingOverlay.style.background = 'rgba(0, 15, 30, 0.9)';
        loadingOverlay.style.display = 'flex';
        loadingOverlay.style.flexDirection = 'column';
        loadingOverlay.style.alignItems = 'center';
        loadingOverlay.style.justifyContent = 'center';
        loadingOverlay.style.zIndex = '10';
        loadingOverlay.style.transition = 'opacity 0.5s ease';
        
        const loadingText = document.createElement('div');
        loadingText.textContent = 'CONNECTING TO NETWORK';
        loadingText.style.color = '#00ffcc';
        loadingText.style.fontFamily = '"Rajdhani", "Courier New", monospace';
        loadingText.style.marginBottom = '15px';
        loadingText.style.fontSize = '18px';
        loadingOverlay.appendChild(loadingText);
        
        const loadingDots = document.createElement('div');
        loadingDots.className = 'loading-dots';
        loadingDots.style.display = 'flex';
        loadingDots.style.gap = '8px';
        
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.style.width = '10px';
            dot.style.height = '10px';
            dot.style.background = '#00ffcc';
            dot.style.borderRadius = '50%';
            dot.style.animation = `loading-dot 1.5s infinite ${i * 0.2}s`;
            loadingDots.appendChild(dot);
        }
        
        const loadingDotsAnimation = document.createElement('style');
        loadingDotsAnimation.textContent = `
            @keyframes loading-dot {
                0%, 100% { opacity: 0.3; transform: scale(0.8); }
                50% { opacity: 1; transform: scale(1.2); }
            }
        `;
        document.head.appendChild(loadingDotsAnimation);
        
        loadingOverlay.appendChild(loadingDots);
        interfaceContainer.appendChild(loadingOverlay);
        
        // Hide loading overlay after a delay
        setTimeout(() => {
            loadingOverlay.style.opacity = '0';
            setTimeout(() => {
                interfaceContainer.removeChild(loadingOverlay);
            }, 500);
        }, 1200); // 1.2 seconds loading animation
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
    // If we've completed all fights for this location, the delve is complete
    if (currentMonsterIndex >= currentDelveLocation.numFights) {
        console.log("Delve complete - before finalizeDelveLoot - isDelveInProgress:", isDelveInProgress);
        finalizeDelveLoot();
        logMessage(`You have cleared all monsters in ${currentDelveLocation.name}!`);

        // Make sure the isDelveInProgress flag is set to false before stopping combat
        isDelveInProgress = false;
        console.log("Delve complete - after setting flag - isDelveInProgress:", isDelveInProgress);

        // Restore player's HP/shield only when delve is completed
        player.currentHealth = player.totalStats.health;
        player.currentShield = player.totalStats.energyShield;

        // Clear buffs at the end of a delve (except for future medtek injectors)
        clearBuffs(player, true);

        // Now restart health regeneration
        stopHealthRegen();
        startHealthRegen();
        updatePlayerStatsDisplay();
        
        // Ensure adventure locations are displayed
        displayAdventureLocations();

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

    // Create a pool of enemies based on spawn rates
    let enemyPool = [];
    for (let locEnemy of currentDelveLocation.enemies) {
        // Use weight/spawnRate to determine how many copies go into the pool
        const weight = locEnemy.spawnRate || 1;
        for (let i = 0; i < weight; i++) {
            enemyPool.push(locEnemy);
        }
    }

    if (enemyPool.length === 0) {
        console.error("Enemy pool is empty.");
        stopCombat('enemyPoolEmpty');
        return;
    }

    // Select a random enemy from the pool
    const randomIndex = Math.floor(Math.random() * enemyPool.length);
    const selectedEnemy = enemyPool[randomIndex];
    
    // Check if this enemy should be empowered
    let isEmpowered = false;
    if (selectedEnemy.empoweredChance && Math.random() < selectedEnemy.empoweredChance) {
        isEmpowered = true;
    }

    // Spawn the selected enemy
    spawnEnemyForSequence(selectedEnemy.name, isEmpowered);
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
    console.log("finalizeDelveLoot - before setting flag - isDelveInProgress:", isDelveInProgress);
    isDelveInProgress = false;
    console.log("finalizeDelveLoot - after setting flag - isDelveInProgress:", isDelveInProgress);

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
    if (!entity.activeDebuffs) entity.activeDebuffs = [];

    // Ensure totalStats exists
    if (!entity.totalStats) {
        entity.totalStats = {};
    }

    // Ensure damage types and defense types exist in totalStats
    if (!entity.totalStats.damageTypes) {
        entity.totalStats.damageTypes = {};
    }

    if (!entity.totalStats.defenseTypes) {
        entity.totalStats.defenseTypes = {};
    }

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

    // Ensure attack speed is set
    if (!entity.totalStats.attackSpeed) {
        if (isPlayer) {
            entity.totalStats.attackSpeed = 1; // Default value if not set
        } else {
            // For enemy, use base attackSpeed or default to 1
            entity.totalStats.attackSpeed = entity.attackSpeed || 1;
        }
    }

    // Ensure totalStats
    if (isPlayer) {
        // For player, use calculateStats method
        if (typeof entity.calculateStats === 'function') {
            entity.calculateStats();
        } else {
            console.error("Player's calculateStats method is missing!");
            return false;
        }
    } else {
        // For enemy, use the new centralized function
        try {
            // Ensure calculateEnemyStats is available (from stats.js)
            if (typeof calculateEnemyStats === 'function') {
                calculateEnemyStats(enemy);
            } else {
                 console.error("calculateEnemyStats function not found!");
                 return false;
            }
        } catch (error) {
            console.error("Error calculating enemy stats:", error);
            return false;
        }
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

    // Initialize attack times based on attack speeds
    playerNextAttackTime = 1 / (player.totalStats.attackSpeed || 1);
    enemyNextAttackTime = 1 / (enemy.totalStats.attackSpeed || 1);

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

    // Calculate initial totalStats using the centralized function
    if (typeof calculateEnemyStats === 'function') {
        calculateEnemyStats(enemy);
    } else {
        console.error("calculateEnemyStats function not found during enemy spawn!");
    }

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

        // Update totalStats again after empowerment using the centralized function
        if (typeof calculateEnemyStats === 'function') {
            calculateEnemyStats(enemy);
        } else {
            console.error("calculateEnemyStats function not found after empowerment!");
        }

        // Add a visual indicator
        logMessage(`An empowered ${monsterName} appears!`);
    }

    clearLog();
    updateEnemyStatsDisplay();

    // Initialize attack timers if combat is already active
    if (isCombatActive) {
        playerNextAttackTime = 1 / (player.totalStats.attackSpeed || 1);
        enemyNextAttackTime = 1 / (enemy.totalStats.attackSpeed || 1);
    }

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
    
    // New stats - Efficiency (ensure they're numbers)
    const armorEff = Number(player.totalStats.armorEfficiency || 0);
    const weaponEff = Number(player.totalStats.weaponEfficiency || 0);
    const bionicEff = Number(player.totalStats.bionicEfficiency || 0);
    const bionicSync = Number(player.totalStats.bionicSync || 0);
    const comboAttack = Number(player.totalStats.comboAttack || 0);
    const comboEffectiveness = Number(player.totalStats.comboEffectiveness || 0);
    const additionalCombo = Number(player.totalStats.additionalComboAttacks || 0);
    
    document.getElementById("player-armor-efficiency").innerHTML = `<span style="color: #a8e6cf;">${armorEff.toFixed(1)}</span>`;
    document.getElementById("player-weapon-efficiency").innerHTML = `<span style="color: #ffd3a5;">${weaponEff.toFixed(1)}</span>`;
    document.getElementById("player-bionic-efficiency").innerHTML = `<span style="color: #c5a3ff;">${bionicEff.toFixed(1)}</span>`;
    
    // Bionic Enhancement
    document.getElementById("player-bionic-sync").innerHTML = `<span style="color: #b19cd9;">${bionicSync.toFixed(1)}</span>`;
    
    // Combo System
    document.getElementById("player-combo-attack").innerHTML = `<span style="color: #ff9999;">${comboAttack.toFixed(1)}</span>`;
    document.getElementById("player-combo-effectiveness").innerHTML = `<span style="color: #ffb366;">${comboEffectiveness.toFixed(1)}</span>`;
    document.getElementById("player-additional-combo-attacks").innerHTML = `<span style="color: #ff6b6b;">${Math.floor(additionalCombo)}</span>`;
    
    // Mastery System
    const kineticMastery = Number(player.totalStats.kineticMastery || 0);
    const slashingMastery = Number(player.totalStats.slashingMastery || 0);
    document.getElementById("player-kinetic-mastery").innerHTML = `<span style="color: #ffa500;">${kineticMastery}</span>`;
    document.getElementById("player-slashing-mastery").innerHTML = `<span style="color: #dc143c;">${slashingMastery}</span>`;
    
    // Combat Mechanics
    const severedLimbChance = Number(player.totalStats.severedLimbChance || 0);
    const maxSeveredLimbs = Number(player.totalStats.maxSeveredLimbs || 1);
    document.getElementById("player-severed-limb-chance").innerHTML = `<span style="color: #8b0000;">${severedLimbChance.toFixed(1)}</span>`;
    document.getElementById("player-max-severed-limbs").innerHTML = `<span style="color: #8b0000;">${maxSeveredLimbs}</span>`;

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

        // Use capitalize from stats.js if available
        let capType = typeof capitalize === 'function' ? capitalize(type) : type;
        li.innerHTML = `<span style="color: #ff6b6b; font-weight: bold;">${capType}:</span> <span style="color: #ffffff;">${player.totalStats.damageTypes[type]}</span>`;
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
        // Use capitalize from stats.js if available
        let capType = typeof capitalize === 'function' ? capitalize(type) : type;
        li.innerHTML = `<span style="color: #ffd166; font-weight: bold;">${capType} Damage:</span> <span style="color: #ffffff;">+${modifier.toFixed(2)}%</span>`;
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

    // After updating all other elements, also update debuffs UI
    if (typeof updatePlayerDebuffsUI === 'function') {
        updatePlayerDebuffsUI();
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

        // Use capitalize from stats.js if available
        let capType = typeof capitalize === 'function' ? capitalize(type) : type;
        li.innerHTML = `<span style="color: #ff6b6b; font-weight: bold;">${capType}:</span> <span style="color: #ffffff;">${enemy.totalStats.damageTypes[type]}</span>`;
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

    // After updating all other elements, also update debuffs UI
    if (typeof updateEnemyDebuffsUI === 'function') {
        updateEnemyDebuffsUI();
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

// skewedRandom function moved to stats.js

function combatLoop() {
    if (!isCombatActive) return;

    let now = Date.now();
    let deltaTime = (now - lastCombatLoopTime) / 1000;
    lastCombatLoopTime = now;

    // Process attack timers
    if (player) {
        // Initialize player attack time if needed
        if (playerNextAttackTime <= 0) {
            playerNextAttackTime = 1 / (player.totalStats?.attackSpeed || 1);
        }

        // Player attack timer
        playerAttackTimer += deltaTime;
        if (playerAttackTimer >= playerNextAttackTime) {
            playerAttackTimer = 0;
            playerNextAttackTime = 1 / (player.totalStats?.attackSpeed || 1);

            // Only call playerAttack if player and enemy both exist
            if (player && enemy) {
                playerAttack();
            }
        }

        // Update player progress bar
        let playerProgress = Math.min((playerAttackTimer / playerNextAttackTime) * 100, 100);
        document.getElementById('player-attack-progress-bar').style.width = `${playerProgress}%`;
    }

    // Process enemy attack timer separately to avoid null issues
    if (enemy && enemy.totalStats) {
        // Initialize enemy attack time if needed
        if (enemyNextAttackTime <= 0) {
            enemyNextAttackTime = 1 / (enemy.totalStats.attackSpeed || 1);
        }

        // Enemy attack timer
        enemyAttackTimer += deltaTime;
        if (enemyAttackTimer >= enemyNextAttackTime) {
            enemyAttackTimer = 0;
            enemyNextAttackTime = 1 / (enemy.totalStats.attackSpeed || 1);

            // Only call enemyAttack if player and enemy both exist
            if (player && enemy) {
                enemyAttack();
            }
        }

        // Update enemy progress bar
        let enemyProgress = Math.min((enemyAttackTimer / enemyNextAttackTime) * 100, 100);
        document.getElementById('enemy-attack-progress-bar').style.width = `${enemyProgress}%`;
    }

    // Safely process entity buffs and status effects
    try {
        if (player) {
            processBuffs(player, deltaTime);
            if (player.currentHealth > 0) {
                processStatusEffects(player, deltaTime);
            }
        }

        if (enemy) {
            if (enemy.activeBuffs) {
                processBuffs(enemy, deltaTime);
            }
            if (enemy.currentHealth > 0) {
                processStatusEffects(enemy, deltaTime);

                // Process debuffs on the enemy
                if (window.processDebuffs && typeof window.processDebuffs === 'function' && enemy.activeDebuffs) {
                    window.processDebuffs(enemy, deltaTime);
                }
            }
        }
    } catch (error) {
        console.error("Error processing effects:", error);
    }

    // Check end conditions
    if (player && player.currentHealth <= 0) {
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
    if (!entity) return;

    // Clear buffs
    if (entity.activeBuffs && entity.activeBuffs.length > 0) {
        if (preserveMedtekInjectors) {
            entity.activeBuffs = entity.activeBuffs.filter(buff =>
                buff.name && buff.name.includes('Medtek Injector'));
        } else {
            entity.activeBuffs = [];
        }
    }

    // Clear debuffs if they exist
    if (entity.activeDebuffs && entity.activeDebuffs.length > 0) {
        // Call onRemove for each debuff before clearing
        for (const debuff of entity.activeDebuffs) {
            if (debuff.onRemove) {
                debuff.onRemove(entity);
            }
        }
        entity.activeDebuffs = [];
    }

    // Recalculate stats for the entity
    if (entity === player) {
        entity.calculateStats();
        updatePlayerStatsDisplay();
    } else if (entity === enemy) {
        // Use the centralized function to recalculate enemy stats
        if (typeof calculateEnemyStats === 'function') {
            calculateEnemyStats(enemy);
        } else {
            console.error("calculateEnemyStats function not found during clearBuffs!");
        }
        updateEnemyStatsDisplay();
    }
}

// updateEnemyTotalStats function moved to stats.js

// Function to stop combat
function stopCombat(reason) {
    // Allow delveCompleted to proceed even if combat is already inactive
    if (!isCombatActive && !isDelveInProgress && reason !== 'delveCompleted') {
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

    // Reset combat UI and timers
    playerAttackTimer = 0;
    enemyAttackTimer = 0;
    playerNextAttackTime = 0;  // Reset playerNextAttackTime
    enemyNextAttackTime = 0;   // Reset enemyNextAttackTime
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

    // Clear any active debuffs on the player and enemy
    if (player && player.activeDebuffs && player.activeDebuffs.length > 0) {
        for (const debuff of player.activeDebuffs) {
            if (debuff.onRemove) {
                debuff.onRemove(player);
            }
        }
        player.activeDebuffs = [];
    }

    if (enemy && enemy.activeDebuffs && enemy.activeDebuffs.length > 0) {
        for (const debuff of enemy.activeDebuffs) {
            if (debuff.onRemove) {
                debuff.onRemove(enemy);
            }
        }
        enemy.activeDebuffs = [];
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
    
    // Handle delve completion outside the isDelveInProgress condition
    if (reason === 'delveCompleted') {
        console.log("stopCombat - delveCompleted - before setting flags - isDelveInProgress:", isDelveInProgress);
        // Mark success regardless of current isDelveInProgress flag value
        isDelveInProgress = false;
        currentDelveLocation = null;
        currentMonsterIndex = 0;
        console.log("stopCombat - delveCompleted - after setting flags - isDelveInProgress:", isDelveInProgress);
        
        // Call displayAdventureLocations to refresh the UI
        displayAdventureLocations();
        console.log("stopCombat - delveCompleted - after displayAdventureLocations");

        // Restart health regeneration as we're no longer in a delve
        stopHealthRegen();
        startHealthRegen();
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
    if (!ensureEntityInitialization(player, true) || !ensureEntityInitialization(enemy, false)) {
        console.warn("Entity initialization failed in playerAttack");
        return;
    }

    try {
        // Process any debuffs that might prevent the attack
        if (enemy.activeDebuffs && Array.isArray(enemy.activeDebuffs)) {
            for (const debuff of enemy.activeDebuffs) {
                if (debuff && debuff.onAttack) {
                    const result = debuff.onAttack(enemy, player);
                    if (result === false) {
                        // Attack was prevented by a debuff
                        return;
                    }
                }
            }
        }

        // Get damage calculation with breakdown using the centralized function
        let damageResult;
        if (typeof calculateDamage === 'function') {
            damageResult = calculateDamage(player, enemy);
        } else {
            console.error("calculateDamage function not found!");
            damageResult = { total: 0, damageBreakdown: {}, isCritical: false }; // Default to no damage
        }

        // Log detailed damage calculation in dev console (now done within calculateDamage in stats.js)
        // console.log(`Player attack damage calculation:`, damageResult); // Removed as logging is now in stats.js

        // Add combat log entry for damage info
        if (typeof addToCombatLog === 'function' && damageResult.total > 0) {
            const critText = damageResult.isCritical ? ' <span style="color: yellow; font-weight: bold;">(CRITICAL!)</span>' : '';
            addToCombatLog(`Player attacks for ${damageResult.total} damage${critText}`, '#ffffff', false);
        }

        // Check again if enemy is null before proceeding
        if (!enemy) {
            console.warn("Enemy became null during playerAttack");
            return;
        }

        applyDamage(enemy, damageResult.total, enemy.name, damageResult.damageBreakdown);

        // Check again after damage application if entities still exist
        if (!player || !enemy) {
            console.warn("Entity became null after damage application");
            return;
        }

        // Ensure both player and enemy have their effects arrays properly initialized
        player.effects = player.effects || [];
        enemy.effects = enemy.effects || [];

        // Process effects with explicit empty array check
        if (player && player.effects && Array.isArray(player.effects) && player.effects.length > 0) {
            processEffects(player, 'onHit', enemy);
            // Also process critical hit effects if this was a critical strike
            if (damageResult.isCritical) {
                processEffects(player, 'onCritical', enemy, damageResult.total);
            }
        }

        // Check if enemy is still valid before proceeding
        if (!enemy) {
            console.warn("Enemy became null during effect processing");
            return;
        }

        if (enemy && enemy.effects && Array.isArray(enemy.effects) && enemy.effects.length > 0) {
            processEffects(enemy, 'whenHit', player);
        }

        // Process debuffs that trigger when the enemy is hit
        if (enemy && enemy.activeDebuffs && Array.isArray(enemy.activeDebuffs)) {
            for (const debuff of enemy.activeDebuffs) {
                if (debuff && debuff.onReceiveHit) {
                    debuff.onReceiveHit(enemy, { total: damageResult.total, ...damageResult.damageBreakdown }, player);
                }
            }
        }
        
        // Process combo attacks
        processComboAttacks(player, enemy, damageResult);
        
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
    if (!ensureEntityInitialization(player, true) || !ensureEntityInitialization(enemy, false)) {
        console.warn("Entity initialization failed in enemyAttack");
        return;
    }

    try {
        // Process any debuffs that might prevent the attack
        if (enemy.activeDebuffs && Array.isArray(enemy.activeDebuffs)) {
            for (const debuff of enemy.activeDebuffs) {
                if (debuff && debuff.onAttack) {
                    const result = debuff.onAttack(enemy, player);
                    if (result === false) {
                        // Attack was prevented by a debuff
                        return;
                    }
                }
            }
        }

        // Get damage calculation with breakdown using the centralized function
        let damageResult;
         if (typeof calculateDamage === 'function') {
             damageResult = calculateDamage(enemy, player);
         } else {
             console.error("calculateDamage function not found!");
             damageResult = { total: 0, damageBreakdown: {}, isCritical: false }; // Default to no damage
         }

        // Log detailed damage calculation in dev console (now done within calculateDamage in stats.js)
        // console.log(`Enemy attack damage calculation:`, damageResult); // Removed as logging is now in stats.js

        // Add combat log entry for damage info
        if (typeof addToCombatLog === 'function' && damageResult.total > 0) {
            const critText = damageResult.isCritical ? ' <span style="color: yellow; font-weight: bold;">(CRITICAL!)</span>' : '';
            addToCombatLog(`${enemy.name} attacks for ${damageResult.total} damage${critText}`, '#ffffff', false);
        }

        // Check again if player is null before proceeding
        if (!player) {
            console.warn("Player became null during enemyAttack");
            return;
        }

        applyDamage(player, damageResult.total, "Player", damageResult.damageBreakdown);

        // Check again after damage application if entities still exist
        if (!player || !enemy) {
            console.warn("Entity became null after damage application in enemyAttack");
            return;
        }

        // Ensure both player and enemy have their effects arrays properly initialized
        player.effects = player.effects || [];
        enemy.effects = enemy.effects || [];

        // Process effects with explicit empty array check
        if (enemy && enemy.effects && Array.isArray(enemy.effects) && enemy.effects.length > 0) {
            processEffects(enemy, 'onHit', player);
        }

        // Check if player is still valid before proceeding
        if (!player) {
            console.warn("Player became null during effect processing");
            return;
        }

        if (player && player.effects && Array.isArray(player.effects) && player.effects.length > 0) {
            processEffects(player, 'whenHit', enemy);
        }
        
        // Process combo attacks for enemy
        processComboAttacks(enemy, player, damageResult);
        
    } catch (error) {
        console.error("Error in enemyAttack:", error);
    }
}

function processComboAttacks(attacker, defender, originalDamageResult) {
    // Safety checks
    if (!attacker || !defender || !attacker.totalStats) {
        return;
    }
    
    // Check if attacker has combo attack chance
    const comboChance = attacker.totalStats.comboAttack || 0;
    if (comboChance <= 0) {
        return; // No combo attack chance
    }
    
    // Check if combo attack triggers
    if (Math.random() * 100 > comboChance) {
        return; // Combo attack didn't trigger
    }
    
    // Calculate number of combo hits
    const baseComboHits = 1; // Base 1 additional hit
    const additionalHits = Number(attacker.totalStats.additionalComboAttacks || 0);
    const totalComboHits = baseComboHits + additionalHits;
    
    // Calculate combo damage (base 20% of original damage)
    const baseComboDamagePercent = 20;
    const comboEffectiveness = attacker.totalStats.comboEffectiveness || 0;
    const finalComboDamagePercent = baseComboDamagePercent + comboEffectiveness;
    
    const attackerName = attacker.name || 'Unknown';
    const defenderName = defender.name || 'Unknown';
    
    console.log(`${attackerName} triggers combo attack! ${totalComboHits} additional hit(s) for ${finalComboDamagePercent}% damage each.`);
    
    // Add combat log entry
    if (typeof addToCombatLog === 'function') {
        addToCombatLog(`${attackerName} triggers combo attack! (${totalComboHits} hit${totalComboHits > 1 ? 's' : ''})`, '#ffaa00', false);
    }
    
    // Execute combo hits
    for (let i = 0; i < totalComboHits; i++) {
        // Check if combat is still active and entities exist
        if (!isCombatActive || !attacker || !defender) {
            break;
        }
        
        // Calculate combo damage for each hit type
        let totalComboDamage = 0;
        const comboDamageBreakdown = {};
        
        for (const damageType in originalDamageResult.damageBreakdown) {
            const originalDamage = originalDamageResult.damageBreakdown[damageType];
            const comboDamage = Math.round(originalDamage * finalComboDamagePercent / 100);
            
            if (comboDamage > 0) {
                comboDamageBreakdown[damageType] = comboDamage;
                totalComboDamage += comboDamage;
            }
        }
        
        // Apply combo damage (no proc effects for combo attacks)
        if (totalComboDamage > 0) {
            console.log(`Combo hit ${i + 1}/${totalComboHits}: ${totalComboDamage} damage`);
            
            // Add combat log entry for each combo hit
            if (typeof addToCombatLog === 'function') {
                addToCombatLog(`Combo hit ${i + 1}: ${totalComboDamage} damage`, '#ffcc66', false);
            }
            
            applyDamage(defender, totalComboDamage, defenderName, comboDamageBreakdown);
        }
        
        // Note: Combo attacks explicitly cannot trigger proc effects as per requirements
    }
}

function processEffects(entity, trigger, target, sourceDamage = 0) {
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
            let baseChance = effect.chance || 0;
            
            // Apply efficiency modifiers based on trigger type and entity stats
            let efficiencyBonus = 0;
            if (entity.totalStats) {
                // Determine efficiency type based on the source of the effect
                if (trigger === 'onHit' || trigger === 'onCritical') {
                    // Weapon/attack effects - use weapon efficiency
                    efficiencyBonus = entity.totalStats.weaponEfficiency || 0;
                } else if (trigger === 'whenHit') {
                    // Defensive effects - use armor efficiency
                    efficiencyBonus = entity.totalStats.armorEfficiency || 0;
                } else if (trigger === 'bionic') {
                    // Bionic effects - use bionic efficiency
                    efficiencyBonus = entity.totalStats.bionicEfficiency || 0;
                }
            }
            
            // Apply efficiency bonus (additive percentage)
            const modifiedChance = baseChance + (baseChance * efficiencyBonus / 100);
            const finalChance = Math.min(modifiedChance, 1.0); // Cap at 100%

            try {
                // Check if the effect activates based on modified chance
                if (Math.random() < finalChance) {
                    console.log(`Effect triggered with ${(finalChance * 100).toFixed(1)}% chance (base: ${(baseChance * 100).toFixed(1)}%, efficiency bonus: ${efficiencyBonus}%):`, effect);
                    executeEffectAction(effect, entity, target, sourceDamage);
                } else {
                    console.log(`Effect did not trigger (${(finalChance * 100).toFixed(1)}% chance).`);
                }
            } catch (error) {
                console.error(`Error processing effect:`, effect, error);
            }
        }
    }
}

function executeEffectAction(effect, source, target, sourceDamage = 0) {
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

        case 'applyDebuff':
            const debuffName = params.debuffName;
            const duration = params.duration;
            const useSourceDamage = params.useSourceDamage || false;
            let debuffSourceDamage = 0;
            
            // If useSourceDamage is true, use the damage from the current attack
            if (useSourceDamage) {
                debuffSourceDamage = sourceDamage || 0;
            }
            
            // Apply the debuff to the target
            if (typeof applyDebuff === 'function') {
                applyDebuff(target, debuffName, source, debuffSourceDamage);
                console.log(`Applied ${debuffName} debuff to ${target.name} with source damage: ${debuffSourceDamage}`);
            } else {
                console.warn('applyDebuff function not found');
            }
            break;

        // Add more cases as needed

        default:
            console.warn(`Unknown effect action: ${effect.action}`);
    }
}


function applyEffectDamage(target, amount, damageType, ignoreDefense = false, sourceInfo = null) {
    if (!target) return;

    // Ensure amount is a number
    amount = parseFloat(amount) || 0;
    if (amount <= 0) return;

    // Round to 1 decimal place for display
    const displayAmount = Math.round(amount * 10) / 10;

    // Apply defense calculations if not ignoring defense
    if (!ignoreDefense && target.totalStats && target.totalStats.defenseTypes) {
        // Use the centralized function from stats.js if available
        const defenseType = typeof matchDamageToDefense === 'function' ? matchDamageToDefense(damageType) : '';
        if (defenseType && target.totalStats.defenseTypes[defenseType]) {
            const defense = target.totalStats.defenseTypes[defenseType];
            amount = Math.max(0, amount * (1 - (defense / 100)));
        }
    }

    // Apply the damage
    if (target.currentShield > 0) {
        const shieldDamage = Math.min(target.currentShield, amount);
        target.currentShield -= shieldDamage;
        amount -= shieldDamage;

        // Animate shield damage
        animateShieldBarChunk(target, shieldDamage);
    }

    if (amount > 0) {
        target.currentHealth = Math.max(0, target.currentHealth - amount);

        // Animate health damage
        animateHpBarChunk(target, amount);
    }

    // Create a source description for the log
    let sourceDesc = "";
    if (sourceInfo) {
        sourceDesc = ` from ${sourceInfo}`;
    } else if (damageType) {
        // Use capitalize from stats.js if available
        let capType = typeof capitalize === 'function' ? capitalize(damageType) : damageType;
        sourceDesc = ` from ${capType} effect`;
    }

    // Log the damage with source information
    const targetName = target.name || (target.isPlayer ? "Player" : "Enemy");

    // Format the message with damage type color (use function from stats.js if available)
    let damageTypeColor = typeof getDamageTypeColor === 'function' ? getDamageTypeColor(damageType) : '#FFFFFF';
    // Use capitalize from stats.js if available
    let capType = typeof capitalize === 'function' ? capitalize(damageType || "unknown") : (damageType || "unknown");

    const message = `${targetName} takes <span style="color: ${damageTypeColor}; font-weight: bold;">${displayAmount} ${capType}</span> damage${sourceDesc}`;

    // Add to the combat log
    addToCombatLog(message);

    // Update UI
    updateHPESBars(target, target.isPlayer);

    // Check if target died
    if (target.currentHealth <= 0) {
        if (target.isPlayer) {
            stopCombat("playerDefeated");
        } else {
            stopCombat("enemyDefeated");
        }
    }
}

// getDamageTypeColor function moved to stats.js

function healEntity(entity, amount) {
    if (!entity || !entity.totalStats) return; // Safety check
    entity.currentHealth = Math.min(entity.totalStats.health, entity.currentHealth + amount);
    // Use addToCombatLog for consistency
    addToCombatLog(`${entity.name} heals for ${Math.round(amount)} HP.`, '#48bf91'); // Green color
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

// calculateDamage function moved to stats.js

// Function to apply damage to target
function applyDamage(target, damage, targetName, damageTypes = null) {
    if (!target) return 0;

    // Handle the case where damage is not a number (might be an object or null)
    if (typeof damage !== 'number' || isNaN(damage)) {
        console.error("Invalid damage value in applyDamage:", damage);
        damage = 0;
    }

    // Apply damage to shield first if available
    let remainingDamage = damage;
    let shieldDamage = 0;

    if (target.currentShield > 0) {
        shieldDamage = Math.min(target.currentShield, remainingDamage);
        target.currentShield -= shieldDamage;
        remainingDamage -= shieldDamage;

        // Animate shield damage
        animateShieldBarChunk(target, shieldDamage);
    }

    // Then apply remaining damage to health
    if (remainingDamage > 0) {
        target.currentHealth = Math.max(0, target.currentHealth - remainingDamage);

        // Animate health damage
        animateHpBarChunk(target, remainingDamage);
    }

    // Format damage types for display
    let damageMessage = '';
    const totalDamage = shieldDamage + (remainingDamage > 0 ? remainingDamage : 0);

    if (damageTypes && typeof damageTypes === 'object') {
        // Create a damage breakdown message
        let parts = [];
        for (const type in damageTypes) {
            if (type !== 'total' && damageTypes[type] > 0) {
                // Use getDamageTypeColor and capitalize from stats.js if available
                const typeColor = typeof getDamageTypeColor === 'function' ? getDamageTypeColor(type) : '#FFFFFF';
                const capType = typeof capitalize === 'function' ? capitalize(type) : type;
                parts.push(`<span style="color: ${typeColor};">${Math.round(damageTypes[type])} ${capType}</span>`);
            }
        }

        if (parts.length > 0) {
            damageMessage = parts.join(' + ');
        } else {
            damageMessage = `${Math.round(totalDamage)}`;
        }
    } else {
        damageMessage = `${Math.round(totalDamage)}`;
    }

    // Display damage in combat log
    if (typeof addToCombatLog === 'function') {
        addToCombatLog(`${targetName} takes ${damageMessage} damage!`, null, false);
    } else {
        logMessage(`${targetName} takes ${damageMessage} damage!`);
    }

    // Display popup
    displayDamagePopup(`${Math.round(totalDamage)}`, target.isPlayer);

    // Update HP/Shield UI
    updateHPESBars(target, target.isPlayer);

    // Try to apply a debuff based on the damage type that was dealt
    if (window.tryApplyDebuffFromDamage && damageTypes) {
        // Get the attacker (source) based on which entity is taking damage
        const source = target.isPlayer ? enemy : player;

        // Add total damage to the damageTypes object
        if (typeof damageTypes === 'object') {
            const damageInfo = { ...damageTypes, total: totalDamage };

            // Call the debuff application function with proper damage info
            window.tryApplyDebuffFromDamage(source, target, damageInfo);
        }
    }

    // Check if entity died
    if (target.currentHealth <= 0) {
        if (target.isPlayer) {
            stopCombat("playerDefeated");
        } else {
            stopCombat("enemyDefeated");
        }
    }

    return totalDamage;
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
    // Ensure min and max are integers
    min = Math.ceil(min);
    max = Math.floor(max);
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


// matchDamageToDefense function moved to stats.js

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

// capitalize function moved to stats.js

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

    // Always show the delve bag (removed conditional display)
    if (delveBagContainer) {
        delveBagContainer.style.display = 'block';
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
            // Use calculateEnemyStats if available
            if (typeof calculateEnemyStats === 'function') {
                calculateEnemyStats(enemy);
            }
            updateEnemyStatsDisplay();
        }
    }
}

// Function to format and add messages to the combat log
function addToCombatLog(message, color = null, isBold = false) {
    let formattedMessage = message;

    // Highlight key words with better formatting (case-insensitive)
    const keywordHighlights = [
        // Combat keywords
        { word: 'CRITICAL', style: 'font-weight: bold; color: #ffff00; text-shadow: 0 0 5px rgba(255, 255, 0, 0.7);' },
        { word: 'critical', style: 'font-weight: bold; color: #ffff00; text-shadow: 0 0 3px rgba(255, 255, 0, 0.5);' },
        { word: 'combo attack', style: 'font-weight: bold; color: #ff8800; text-shadow: 0 0 3px rgba(255, 136, 0, 0.7);' },
        { word: 'Combo hit', style: 'font-weight: bold; color: #ffaa44;' },
        { word: 'triggers', style: 'font-weight: bold; color: #66ffcc;' },
        { word: 'effect', style: 'font-weight: bold; color: #88ddff;' },
        { word: 'Effect', style: 'font-weight: bold; color: #88ddff;' },
        // Damage keywords
        { word: 'damage', style: 'font-weight: bold; color: #ff6666;' },
        { word: 'attacks', style: 'font-weight: bold; color: #ffaa88;' },
        { word: 'heals', style: 'font-weight: bold; color: #66ff88;' },
        { word: 'dies', style: 'font-weight: bold; color: #ff4444; text-shadow: 0 0 3px rgba(255, 68, 68, 0.7);' },
        { word: 'defeated', style: 'font-weight: bold; color: #ff4444; text-shadow: 0 0 3px rgba(255, 68, 68, 0.7);' },
        // Status effects
        { word: 'inflicted', style: 'font-weight: bold; color: #cc88ff;' },
        { word: 'applies', style: 'font-weight: bold; color: #cc88ff;' },
        { word: 'expires', style: 'font-weight: bold; color: #88ffcc;' },
        { word: 'ticks', style: 'font-weight: bold; color: #ffcc88;' }
    ];

    // Apply keyword highlighting
    keywordHighlights.forEach(highlight => {
        // Use global case-insensitive replace with word boundaries
        const regex = new RegExp(`\\b${highlight.word}\\b`, 'gi');
        formattedMessage = formattedMessage.replace(regex, (match) => {
            return `<span style="${highlight.style}">${match}</span>`;
        });
    });

    // Apply color if provided (applied after keyword highlighting to override)
    if (color) {
        formattedMessage = `<span style="color: ${color};">${formattedMessage}</span>`;
    }

    // Apply bold if requested
    if (isBold) {
        formattedMessage = `<strong>${formattedMessage}</strong>`;
    }

    // Add to the log
    logMessage(formattedMessage);
}

// Expose the function globally so it can be accessed from other scripts like debuffs.js
window.addToCombatLog = addToCombatLog;

// Function to update the player debuffs UI
function updatePlayerDebuffsUI() {
    const debuffsContainer = document.getElementById('player-debuffs');
    if (!debuffsContainer) return;

    // Clear existing debuffs
    debuffsContainer.innerHTML = '';

    // If player has no debuffs, exit
    if (!player || !player.activeDebuffs || player.activeDebuffs.length === 0) {
        debuffsContainer.style.display = 'none';
        return;
    }

    // Show the container
    debuffsContainer.style.display = 'flex';

    // Add each debuff icon
    player.activeDebuffs.forEach(debuff => {
        if (!debuff) return;

        const debuffElement = document.createElement('div');
        debuffElement.className = 'debuff-icon';

        // Set background color based on debuff type
        let bgColor = '#ff6b6b'; // Default red for harmful debuffs
        if (debuff.type === 'crowd_control') {
            bgColor = '#9775fa'; // Purple for CC
        } else if (debuff.type === 'damage_over_time') {
            bgColor = '#ff9966'; // Orange for DoT
        }

        debuffElement.style.backgroundColor = bgColor;

        // Add debuff name
        const nameSpan = document.createElement('span');
        // Use capitalize from stats.js if available
        let capName = typeof capitalize === 'function' ? capitalize(debuff.name) : debuff.name;
        nameSpan.textContent = capName.substring(0, 1); // Just the first letter for the icon
        debuffElement.appendChild(nameSpan);

        // Add tooltip with debuff info
        debuffElement.title = `${capName}: ${debuff.description || ''}`;

        // Add to container
        debuffsContainer.appendChild(debuffElement);
    });
}

// Function to update the enemy debuffs UI
function updateEnemyDebuffsUI() {
    const debuffsContainer = document.getElementById('enemy-debuffs');
    if (!debuffsContainer) return;

    // Clear existing debuffs
    debuffsContainer.innerHTML = '';

    // If enemy has no debuffs, exit
    if (!enemy || !enemy.activeDebuffs || enemy.activeDebuffs.length === 0) {
        debuffsContainer.style.display = 'none';
        return;
    }

    // Show the container
    debuffsContainer.style.display = 'flex';

    // Add each debuff icon
    enemy.activeDebuffs.forEach(debuff => {
        if (!debuff) return;

        const debuffElement = document.createElement('div');
        debuffElement.className = 'debuff-icon';

        // Set background color based on debuff type
        let bgColor = '#ff6b6b'; // Default red for harmful debuffs
        if (debuff.type === 'crowd_control') {
            bgColor = '#9775fa'; // Purple for CC
        } else if (debuff.type === 'damage_over_time') {
            bgColor = '#ff9966'; // Orange for DoT
        }

        debuffElement.style.backgroundColor = bgColor;

        // Add debuff name
        const nameSpan = document.createElement('span');
        // Use capitalize from stats.js if available
        let capName = typeof capitalize === 'function' ? capitalize(debuff.name) : debuff.name;
        nameSpan.textContent = capName.substring(0, 1); // Just the first letter for the icon
        debuffElement.appendChild(nameSpan);

        // Add tooltip with debuff info
        debuffElement.title = `${capName}: ${debuff.description || ''}`;

        // Add to container
        debuffsContainer.appendChild(debuffElement);
    });
}

// Make these functions available globally
window.updatePlayerDebuffsUI = updatePlayerDebuffsUI;
window.updateEnemyDebuffsUI = updateEnemyDebuffsUI;

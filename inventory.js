window.inventory = [];
window.inventoryChangeListeners = [];

console.log('inventory.js loaded');
console.log('window.inventory at the start:', window.inventory);

function addInventoryChangeListener(listener) {
    window.inventoryChangeListeners.push(listener);
}

function notifyInventoryChange() {
    window.inventoryChangeListeners.forEach(listener => listener());
}

// Function to get current number of used inventory slots
function getUsedInventorySlots() {
    return window.inventory.length;
}

// Function to check if inventory has space for new items
function hasInventorySpace(slotsNeeded = 1) {
    return getUsedInventorySlots() + slotsNeeded <= player.maxInventorySlots;
}

// Function to add an item to the inventory, handling stackable items
function addItemToInventory(newItem) {
    console.log('Adding item to inventory:', newItem);
    
    if (newItem.stackable) {
        const existingItem = window.inventory.find(item => item.name === newItem.name);
        if (existingItem) {
            // Stacking with existing item - no slot check needed
            existingItem.quantity += newItem.quantity;
            console.log(`Updated quantity of ${existingItem.name} to ${existingItem.quantity}`);
        } else {
            // Adding new stackable item - check slots
            if (!hasInventorySpace(1)) {
                logMessage(`Inventory full! Cannot add ${newItem.name}. (${getUsedInventorySlots()}/${player.maxInventorySlots} slots used)`);
                return false;
            }
            window.inventory.push(newItem);
            console.log(`Added new stackable item: ${newItem.name}`);
        }
    } else {
        // Adding non-stackable item - check slots
        if (!hasInventorySpace(1)) {
            logMessage(`Inventory full! Cannot add ${newItem.name}. (${getUsedInventorySlots()}/${player.maxInventorySlots} slots used)`);
            return false;
        }
        window.inventory.push(newItem);
        console.log(`Added new non-stackable item: ${newItem.name}`);
    }

    console.log('Current inventory:', inventory);

    if (currentScreen === 'fabrication-screen') {
        displayFabricationRecipes();
    }
    updateInventoryDisplay();
    notifyInventoryChange();

    // Play pickup sound
    if (window.playSound && !window.isSilentItemAdd) {
        playSound('ITEM_PICKUP', 0.2);
    }
    
    return true; // Successfully added item
}

// Function to remove an item from the inventory
function removeItemFromInventory(itemName, quantity = 1) {
    const inventoryItem = window.inventory.find(item => item.name === itemName);
    if (inventoryItem) {
        if (inventoryItem.stackable) {
            inventoryItem.quantity -= quantity;
            if (inventoryItem.quantity <= 0) {
                const index = window.inventory.indexOf(inventoryItem);
                if (index > -1) {
                    window.inventory.splice(index, 1);
                }
            }
        } else {
            const index = window.inventory.indexOf(inventoryItem);
            if (index > -1) {
                window.inventory.splice(index, 1);
            }
        }
    } else {
        console.warn(`Item ${itemName} not found in inventory when attempting to remove.`);
    }
    if (window.currentScreen === 'fabrication-screen') {
        displayFabricationRecipes();
    }

    updateInventoryDisplay();
    notifyInventoryChange();
}


// Function to update the inventory header with slot count
function updateInventoryHeader() {
    const inventoryHeader = document.getElementById('inventory-header');
    if (inventoryHeader) {
        const usedSlots = getUsedInventorySlots();
        const maxSlots = player.maxInventorySlots;
        inventoryHeader.textContent = `Inventory (${usedSlots}/${maxSlots} slots)`;
    }
}

// Function to update the inventory display
function updateInventoryDisplay() {
    // Update the header first
    updateInventoryHeader();
    
    const inventoryList = document.getElementById('inventory');
    inventoryList.innerHTML = '';  // Clear current inventory list

    // Check if inventory is an array
    if (!Array.isArray(inventory)) {
        console.error('Inventory is not an array:', inventory);
        return;
    }

    // Loop through each item in the inventory
    window.inventory.forEach((item, index) => {
        if (item) {
            const listItem = document.createElement('li');
            listItem.style.position = 'relative'; // Required for quantity badge positioning
            
            // Set the item index for staggered animations
            listItem.style.setProperty('--item-index', index);

            // Create item icon
            const itemIcon = document.createElement('img');
            itemIcon.src = item.icon || 'default-icon.png'; // Use a default icon if none provided
            itemIcon.alt = item.name || 'Unknown Item';
            itemIcon.width = 50; // Set icon size
            itemIcon.height = 50;

            // Quantity badge
            if (item.quantity > 1) {
                const quantityBadge = document.createElement('div');
                quantityBadge.className = 'quantity-badge';
                quantityBadge.textContent = 'x' + item.quantity;
                listItem.appendChild(quantityBadge);
            }

            // Set tooltip content via data attribute
            listItem.setAttribute('data-has-tooltip', 'true');
            listItem.setAttribute('data-tooltip-source', 'inventory-item');
            listItem.setAttribute('data-tooltip-content', getItemTooltipContent(item));
            
            // Append icon to list item
            listItem.appendChild(itemIcon);
            
            inventoryList.appendChild(listItem);

            // Click event to handle item actions
            itemIcon.addEventListener('click', () => {
                if (item.effect) {
                    showUseItemPopup(item);
                } else {
                    showItemOptionsPopup(item, event);
                }
            });
        } else {
            console.warn('Undefined item found in inventory. Skipping...');
        }
    });
}

// Function to equip an item from inventory
function equipItem(item) {
    if (!item || !item.slot) {
        console.error('Invalid item or slot.');
        return;
    }
    
    // Additional check to prevent non-equippable items (like materials) from being equipped
    if (!isEquippableItem(item)) {
        console.error(`Cannot equip ${item.name}: not an equippable item type.`);
        logMessage(`${item.name} cannot be equipped.`);
        return;
    }

    // Check if player meets level requirement
    if (item.levelRequirement && player.level < item.levelRequirement) {
        logMessage(`You need to be level ${item.levelRequirement} to equip this item.`);
        return;
    }

    // Handle equipping based on slot
    let previousItem = null;
    switch (item.slot) {
        case 'mainHand':
        case 'offHand':
        case 'head':
        case 'chest':
        case 'legs':
        case 'feet':
        case 'gloves':
            previousItem = player.equipment[item.slot];
            player.equipment[item.slot] = item;
            break;
        case 'bionic':
            // Find the first empty bionic slot
            const emptySlotIndex = player.equipment.bionicSlots.findIndex(slot => slot === null);
            if (emptySlotIndex !== -1) {
                player.equipment.bionicSlots[emptySlotIndex] = item;
            } else {
                logMessage('No empty bionic slots available.');
                return;
            }
            break;
        default:
            console.warn(`Unknown slot type: ${item.slot}`);
            return;
    }

    // Update inventory and UI
    removeItemFromInventory(item);
    
    if (previousItem) {
        addItemToInventory(previousItem);
    }
    
    // Reset and reapply all passive bonuses from gear
    resetGearPassiveBonuses();
    
    // Recalculate player stats
    player.calculateStats();
    
    // Reapply passives since gear bonuses may have changed
    applyAllPassivesToPlayer();
    
    updateInventoryDisplay();
    updateEquipmentDisplay();
    updatePlayerStatsDisplay();

    // Play equip sound
    if (window.playSound) {
        playSound('ITEM_EQUIP');
    }
}


// Function to update the equipped items display
function updateEquipmentDisplay() {
    // Ensure player and player.equipment are defined
    if (!player || !player.equipment) {
        console.error('Player or player.equipment is undefined');
        return;
    }

    // Add a subtle animation to the paper doll
    const paperDoll = document.getElementById('equipment-paper-doll');
    paperDoll.classList.add('updating');
    setTimeout(() => paperDoll.classList.remove('updating'), 500);

    // Update equipment slots
    const slots = ['mainHand', 'offHand', 'head', 'chest', 'legs', 'feet', 'gloves'];
    slots.forEach((slotName, index) => {
        const slotElement = document.getElementById(`${slotName}-slot`);
        const equippedItem = player.equipment[slotName];

        // Add a slight delay to each slot update for a cascading effect
        setTimeout(() => {
            slotElement.innerHTML = ''; // Clear current content
            
            if (equippedItem) {
                // Create a wrapper div to hold icon and tooltip data
                const wrapper = document.createElement('div');
                wrapper.setAttribute('data-has-tooltip', 'true');
                wrapper.setAttribute('data-tooltip-source', 'equipment-slot');
                wrapper.setAttribute('data-tooltip-content', getItemTooltipContent(equippedItem));
                wrapper.style.width = '100%';
                wrapper.style.height = '100%';
                wrapper.style.display = 'flex';
                wrapper.style.alignItems = 'center';
                wrapper.style.justifyContent = 'center';
                
                // Add a class for equipped items
                wrapper.classList.add('equipped-item');
                
                // Add a data attribute for item rarity if it exists
                if (equippedItem.rarity) {
                    wrapper.setAttribute('data-rarity', equippedItem.rarity);
                    slotElement.setAttribute('data-rarity', equippedItem.rarity);
                }

                // Create item icon
                const itemIcon = document.createElement('img');
                itemIcon.src = equippedItem.icon || "icons/default-icon.png";
                itemIcon.alt = equippedItem.name || 'Unknown Item';
                itemIcon.style.maxWidth = '100%';
                itemIcon.style.maxHeight = '100%';

                // Append element
                wrapper.appendChild(itemIcon);
                slotElement.appendChild(wrapper);

                // Add click handler to the wrapper
                wrapper.addEventListener('click', (event) => {
                    // Add a visual feedback effect when clicked
                    wrapper.classList.add('clicked');
                    setTimeout(() => wrapper.classList.remove('clicked'), 300);
                    
                    showEquipmentSelectionWindow(slotName);
                });
                
                // Add a subtle entrance animation
                wrapper.style.opacity = '0';
                wrapper.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    wrapper.style.transition = 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)';
                    wrapper.style.opacity = '1';
                    wrapper.style.transform = 'scale(1)';
                }, 50);
            } else {
                slotElement.textContent = capitalize(slotName.replace('Hand', ' Hand'));
                
                // Add a subtle pulse effect to empty slots
                slotElement.classList.add('pulse-empty');
                setTimeout(() => slotElement.classList.remove('pulse-empty'), 1000);
                
                // Add click handler for empty slots
                slotElement.addEventListener('click', () => {
                    showEquipmentSelectionWindow(slotName);
                });
                slotElement.style.cursor = 'pointer';
            }
        }, index * 100); // Stagger the updates by 100ms per slot
    });

    // Update bionic slots with same structure
    player.equipment.bionicSlots.forEach((item, index) => {
        const slotElement = document.getElementById(`bionic-slot-${index}`);
        
        // Add a slight delay for cascading effect, continuing from regular equipment
        setTimeout(() => {
            slotElement.innerHTML = '';

            if (item) {
                const wrapper = document.createElement('div');
                wrapper.setAttribute('data-has-tooltip', 'true');
                wrapper.setAttribute('data-tooltip-source', 'bionic-slot');
                wrapper.setAttribute('data-tooltip-content', getItemTooltipContent(item));
                wrapper.style.width = '100%';
                wrapper.style.height = '100%';
                wrapper.style.display = 'flex';
                wrapper.style.alignItems = 'center';
                wrapper.style.justifyContent = 'center';
                
                // Add a class for equipped bionics
                wrapper.classList.add('equipped-bionic');
                
                // Add a data attribute for item rarity if it exists
                if (item.rarity) {
                    wrapper.setAttribute('data-rarity', item.rarity);
                    slotElement.setAttribute('data-rarity', item.rarity);
                }

                const itemIcon = document.createElement('img');
                itemIcon.src = item.icon || "icons/default-icon.png";
                itemIcon.alt = item.name || 'Unknown Item';
                itemIcon.style.maxWidth = '100%';
                itemIcon.style.maxHeight = '100%';

                wrapper.appendChild(itemIcon);
                slotElement.appendChild(wrapper);

                wrapper.addEventListener('click', (event) => {
                    // Add a visual feedback effect when clicked
                    wrapper.classList.add('clicked');
                    setTimeout(() => wrapper.classList.remove('clicked'), 300);
                    
                    showEquipmentSelectionWindow('bionic', index);
                });
                
                // Add a subtle entrance animation
                wrapper.style.opacity = '0';
                wrapper.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    wrapper.style.transition = 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)';
                    wrapper.style.opacity = '1';
                    wrapper.style.transform = 'scale(1)';
                }, 50);
            } else {
                slotElement.textContent = `Bionic ${index + 1}`;
                
                // Add a subtle pulse effect to empty slots
                slotElement.classList.add('pulse-empty');
                setTimeout(() => slotElement.classList.remove('pulse-empty'), 1000);
                
                // Add click handler for empty bionic slots
                slotElement.addEventListener('click', () => {
                    showEquipmentSelectionWindow('bionic', index);
                });
                slotElement.style.cursor = 'pointer';
            }
        }, (slots.length + index) * 100); // Continue the staggered timing from regular equipment
    });
}

// Function to show confirmation popup with optional secondary action
function showConfirmationPopup(message, onConfirm, onSecondary = null) {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.id = 'overlay';
    document.body.appendChild(overlay);

    // Create popup
    const popup = document.createElement('div');
    popup.className = 'confirmation-popup';

    const msg = document.createElement('p');
    msg.textContent = message;
    popup.appendChild(msg);

    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'popup-buttons';

    const yesButton = document.createElement('button');
    yesButton.textContent = 'Yes';
    yesButton.addEventListener('click', () => {
        onConfirm();
        document.body.removeChild(popup);
        document.body.removeChild(overlay);
    });

    const noButton = document.createElement('button');
    noButton.textContent = 'No';
    noButton.addEventListener('click', () => {
        document.body.removeChild(popup);
        document.body.removeChild(overlay);
    });

    buttonsContainer.appendChild(yesButton);
    buttonsContainer.appendChild(noButton);

    // If a secondary action is provided (e.g., Disassemble)
    if (onSecondary) {
        const secondaryButton = document.createElement('button');
        secondaryButton.textContent = 'Disassemble';
        secondaryButton.addEventListener('click', () => {
            onSecondary();
            document.body.removeChild(popup);
            document.body.removeChild(overlay);
        });
        buttonsContainer.appendChild(secondaryButton);
    }

    popup.appendChild(buttonsContainer);
    document.body.appendChild(popup);
}

// Function to initialize equipment slots with click event listeners
function initializeEquipmentSlots() {
    // We no longer need to add click listeners here
    // This was causing double popups with the listeners in updateEquipmentDisplay
    
    // If we need to do other initialization for equipment slots in the future,
    // we can add it here
}

// Function to unequip an item with confirmation
function unequipItemWithConfirmation(slotName, event) {
    const equippedItem = getEquippedItemBySlot(slotName);
    if (!equippedItem) {
        logMessage('No item equipped in this slot.');
        return;
    }

    // Create overlay
    const overlay = document.createElement('div');
    overlay.id = 'overlay';
    document.body.appendChild(overlay);

    // Create popup
    const popup = document.createElement('div');
    popup.className = 'confirmation-popup';

    const msg = document.createElement('p');
    msg.textContent = `Unequip ${equippedItem.name}?`;
    popup.appendChild(msg);

    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'popup-buttons';

    const yesButton = document.createElement('button');
    yesButton.textContent = 'Yes';
    yesButton.addEventListener('click', () => {
        unequipItem(slotName);
        document.body.removeChild(popup);
        document.body.removeChild(overlay);
    });

    const noButton = document.createElement('button');
    noButton.textContent = 'No';
    noButton.addEventListener('click', () => {
        document.body.removeChild(popup);
        document.body.removeChild(overlay);
    });

    buttonsContainer.appendChild(yesButton);
    buttonsContainer.appendChild(noButton);
    popup.appendChild(buttonsContainer);
    
    // Add to DOM first so we can measure it
    document.body.appendChild(popup);
    
    // Position the popup near the equipment slot
    const slotElement = document.getElementById(slotName);
    const rect = slotElement ? slotElement.getBoundingClientRect() : { top: 0, left: 0 };
    
    // Get window dimensions
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    // Get popup dimensions
    const popupRect = popup.getBoundingClientRect();
    
    // Calculate position (near the slot)
    let left = rect.right + 10;
    let top = rect.top;
    
    // Make sure it doesn't go off the right edge
    if (left + popupRect.width > windowWidth - 20) {
        left = rect.left - popupRect.width - 10;
        
        // If that would go off the left edge, position it below
        if (left < 20) {
            left = Math.max(20, Math.min(windowWidth - popupRect.width - 20, rect.left));
            top = rect.bottom + 10;
        }
    }
    
    // Make sure it doesn't go off the bottom
    if (top + popupRect.height > windowHeight - 20) {
        top = Math.max(20, windowHeight - popupRect.height - 20);
    }
    
    // Apply position
    popup.style.position = 'fixed';
    popup.style.top = `${top}px`;
    popup.style.left = `${left}px`;
}

// Function to get the equipped item by slot name
function getEquippedItemBySlot(slotName) {
    if (slotName.startsWith('bionic-slot-')) {
        const index = parseInt(slotName.split('-')[2]);
        return player.equipment.bionicSlots[index];
    } else {
        return player.equipment[slotName];
    }
}

// Function to unequip an item
function unequipItem(slotName) {
    // Validate the slot exists and has an item
    if (!player.equipment[slotName]) {
        return false;
    }

    // If the slot is a bionic slot, handle differently
    if (slotName.startsWith('bionic-slot-')) {
        const slotIndex = parseInt(slotName.split('-')[2]);
        if (isNaN(slotIndex) || slotIndex < 0 || slotIndex >= player.equipment.bionicSlots.length) {
            return false;
        }
        // Add the bionic back to inventory
        addItemToInventory(player.equipment.bionicSlots[slotIndex]);
        
        // Play sound
        if (window.playSound) {
            playSound('ITEM_DROP');
        }
        
        // Remove from equipment
        player.equipment.bionicSlots[slotIndex] = null;
    } else {
        // Regular equipment slot
        // Add back to inventory
        addItemToInventory(player.equipment[slotName]);
        
        // Play sound
        if (window.playSound) {
            playSound('ITEM_DROP');
        }
        
        // Remove from equipment
        player.equipment[slotName] = null;
    }

    // Reset and reapply all passive bonuses from gear
    resetGearPassiveBonuses();
    
    // Recalculate player stats after unequipping the item
    player.currentHealth = null;
    player.currentShield = null;
    player.calculateStats();
    
    // Reapply passives since gear bonuses changed
    applyAllPassivesToPlayer();

    // Update displays
    updateInventoryDisplay();
    updateEquipmentDisplay();
    updatePlayerStatsDisplay();
    
    return true;
}

// Function to disassemble an item
function disassembleItem(item) {
    if (!item) {
        console.error('No item provided for disassembly.');
        return;
    }

    // Remove the item from inventory
    removeItemFromInventory(item);

    // Determine materials received based on item definition
    const materialsReceived = getMaterialsFromItem(item);

    if (materialsReceived.length === 0) {
        logMessage(`You disassembled ${item.name} but received no materials.`);
    } else {
        // Add materials to inventory
        materialsReceived.forEach(material => {
            addItemToInventory(material);
        });
        logMessage(`You disassembled ${item.name} and received materials.`);
    }

    updateInventoryDisplay();
}

// Function to get materials from an item based on its definition
function getMaterialsFromItem(item) {
    const materials = [];

    if (item.disassembleResults) {
        item.disassembleResults.forEach(result => {
            const materialTemplate = items.find(i => i.name === result.name);
            if (materialTemplate) {
                const material = generateItemInstance(materialTemplate);
                material.quantity = result.quantity;
                materials.push(material);
            } else {
                console.warn(`Material not found: ${result.name}`);
            }
        });
    } else {
        console.warn(`No disassemble results defined for item: ${item.name}`);
    }

    return materials;
}

// Function to show use item popup
function showUseItemPopup(item) {
    showConfirmationPopup(`Use ${item.name}?`, () => {
        useItem(item);
    });
}

// Function to use an item
function useItem(item) {
    if (item.effect) {
        player.applyBuff(item.effect);
        removeItemFromInventory(item);
        logMessage(`You used: ${item.name}`);
        updateInventoryDisplay();
    } else {
        logMessage(`Cannot use item: ${item.name}`);
    }
}

// Function to show equipment selection window for a specific slot
function showEquipmentSelectionWindow(slotName, bionicIndex = null) {
    // Check if overlay already exists and remove it
    const existingOverlay = document.getElementById('equipment-selection-overlay');
    if (existingOverlay) {
        existingOverlay.remove();
    }
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.id = 'equipment-selection-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        z-index: 100000;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    document.body.appendChild(overlay);

    // Create main window
    const window = document.createElement('div');
    window.className = 'equipment-selection-window';
    window.style.cssText = `
        background: linear-gradient(to bottom, #001a33, #000d1a);
        border: 2px solid #00ffcc;
        border-radius: 8px;
        padding: 20px;
        max-width: 500px;
        max-height: 70vh;
        overflow-y: auto;
        box-shadow: 0 0 20px rgba(0, 255, 204, 0.3);
    `;

    // Title
    const title = document.createElement('h3');
    title.style.cssText = `
        color: #00ffcc;
        margin: 0 0 15px 0;
        text-align: center;
        font-family: 'Orbitron', sans-serif;
    `;
    
    if (slotName === 'bionic') {
        title.textContent = `Select Bionic for Slot ${bionicIndex + 1}`;
    } else {
        title.textContent = `Select ${capitalize(slotName.replace('Hand', ' Hand'))} Equipment`;
    }
    window.appendChild(title);

    // Check if there's currently equipped item and add unequip button
    let currentItem = null;
    if (slotName === 'bionic') {
        currentItem = player.equipment.bionicSlots[bionicIndex];
    } else {
        currentItem = player.equipment[slotName];
    }

    if (currentItem) {
        const unequipSection = document.createElement('div');
        unequipSection.style.cssText = `
            margin-bottom: 15px;
            padding: 10px;
            background: rgba(255, 100, 100, 0.1);
            border-radius: 4px;
            border-left: 3px solid #ff6464;
        `;

        const currentItemLabel = document.createElement('p');
        currentItemLabel.style.cssText = `
            margin: 0 0 10px 0;
            color: #ffffff;
            font-weight: bold;
        `;
        currentItemLabel.textContent = `Currently equipped: ${currentItem.name}`;
        unequipSection.appendChild(currentItemLabel);

        const unequipButton = document.createElement('button');
        unequipButton.textContent = 'Unequip';
        unequipButton.style.cssText = `
            background: linear-gradient(to bottom, #cc3333, #aa1111);
            color: white;
            border: 1px solid #ff6464;
            border-radius: 4px;
            padding: 8px 15px;
            cursor: pointer;
            font-family: 'Orbitron', sans-serif;
            transition: all 0.2s ease;
        `;
        unequipButton.addEventListener('mouseover', () => {
            unequipButton.style.background = 'linear-gradient(to bottom, #ff4444, #cc3333)';
        });
        unequipButton.addEventListener('mouseout', () => {
            unequipButton.style.background = 'linear-gradient(to bottom, #cc3333, #aa1111)';
        });
        unequipButton.addEventListener('click', () => {
            if (slotName === 'bionic') {
                unequipBionic(bionicIndex);
            } else {
                unequipItem(slotName);
            }
            document.body.removeChild(overlay);
            updateEquipmentDisplay();
        });
        unequipSection.appendChild(unequipButton);
        window.appendChild(unequipSection);
    }

    // Get available items for this slot
    const availableItems = inventory.filter(item => {
        if (slotName === 'bionic') {
            return item.slot === 'bionic' && item.type === 'Bionic';
        } else {
            return item.slot === slotName && isEquippableItem(item);
        }
    });

    // Items container
    const itemsContainer = document.createElement('div');
    itemsContainer.style.cssText = `
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
        gap: 10px;
        margin-bottom: 15px;
    `;

    if (availableItems.length === 0) {
        const noItemsMsg = document.createElement('p');
        noItemsMsg.style.cssText = `
            color: #888888;
            text-align: center;
            font-style: italic;
            margin: 20px 0;
        `;
        noItemsMsg.textContent = 'No compatible items in inventory';
        itemsContainer.appendChild(noItemsMsg);
    } else {
        availableItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.style.cssText = `
                background: linear-gradient(to bottom, #003366, #001133);
                border: 1px solid #00306e;
                border-radius: 4px;
                padding: 8px;
                cursor: pointer;
                text-align: center;
                transition: all 0.2s ease;
                position: relative;
            `;

            const itemIcon = document.createElement('img');
            itemIcon.src = item.icon || 'icons/default-icon.png';
            itemIcon.style.cssText = `
                width: 40px;
                height: 40px;
                display: block;
                margin: 0 auto 5px auto;
            `;
            itemElement.appendChild(itemIcon);

            const itemName = document.createElement('div');
            itemName.style.cssText = `
                color: #ffffff;
                font-size: 12px;
                word-wrap: break-word;
            `;
            itemName.textContent = item.name;
            itemElement.appendChild(itemName);

            // Add quantity if stackable
            if (item.stackable && item.quantity > 1) {
                const quantityLabel = document.createElement('div');
                quantityLabel.style.cssText = `
                    position: absolute;
                    top: 2px;
                    right: 2px;
                    background: rgba(0, 255, 204, 0.8);
                    color: #000;
                    font-size: 10px;
                    padding: 1px 3px;
                    border-radius: 2px;
                    font-weight: bold;
                `;
                quantityLabel.textContent = item.quantity;
                itemElement.appendChild(quantityLabel);
            }

            // Hover effects
            itemElement.addEventListener('mouseover', () => {
                itemElement.style.background = 'linear-gradient(to bottom, #004080, #002255)';
                itemElement.style.borderColor = '#00ffcc';
                itemElement.style.boxShadow = '0 0 8px rgba(0, 255, 204, 0.4)';
            });
            itemElement.addEventListener('mouseout', () => {
                itemElement.style.background = 'linear-gradient(to bottom, #003366, #001133)';
                itemElement.style.borderColor = '#00306e';
                itemElement.style.boxShadow = 'none';
            });

            // Click to equip
            itemElement.addEventListener('click', () => {
                equipItem(item);
                document.body.removeChild(overlay);
                updateEquipmentDisplay();
            });

            itemsContainer.appendChild(itemElement);
        });
    }

    window.appendChild(itemsContainer);

    // Close button
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.style.cssText = `
        background: linear-gradient(to bottom, #003366, #001133);
        color: #00ffcc;
        border: 1px solid #00ffcc;
        border-radius: 4px;
        padding: 10px 20px;
        cursor: pointer;
        font-family: 'Orbitron', sans-serif;
        width: 100%;
        transition: all 0.2s ease;
    `;
    closeButton.addEventListener('mouseover', () => {
        closeButton.style.background = 'linear-gradient(to bottom, #004080, #002255)';
        closeButton.style.boxShadow = '0 0 8px rgba(0, 255, 204, 0.6)';
    });
    closeButton.addEventListener('mouseout', () => {
        closeButton.style.background = 'linear-gradient(to bottom, #003366, #001133)';
        closeButton.style.boxShadow = 'none';
    });
    closeButton.addEventListener('click', () => {
        document.body.removeChild(overlay);
    });
    window.appendChild(closeButton);

    // Close on overlay click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            document.body.removeChild(overlay);
        }
    });

    overlay.appendChild(window);
}

// Function to check if an item is actually equippable
function isEquippableItem(item) {
    // Define valid equipment slots
    const validEquipmentSlots = [
        'mainHand', 'offHand',           // Weapons
        'head', 'chest', 'legs', 'feet', 'gloves',  // Armor
        'bionic'                         // Bionics
    ];
    
    // Item must have a valid equipment slot and not be a material
    return item.slot && 
           validEquipmentSlots.includes(item.slot) && 
           item.type !== 'Material';
}

// Function to show item options popup
function showItemOptionsPopup(item, clickEvent) {
    // Check if overlay already exists and remove it
    const existingOverlay = document.getElementById('overlay');
    if (existingOverlay) {
        existingOverlay.remove();
    }
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.id = 'overlay';
    document.body.appendChild(overlay);

    // Create popup
    const popup = document.createElement('div');
    popup.className = 'confirmation-popup';

    const msg = document.createElement('p');
    msg.textContent = `What would you like to do with ${item.name}?`;
    popup.appendChild(msg);

    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'popup-buttons';

    // Equip Button (only if item is actually equippable - not materials)
    if (item.slot && item.type !== 'Material' && isEquippableItem(item)) {
        const equipButton = document.createElement('button');
        equipButton.textContent = 'Equip';
        equipButton.addEventListener('click', () => {
            equipItem(item);
            document.body.removeChild(popup);
            document.body.removeChild(overlay);
        });
        buttonsContainer.appendChild(equipButton);
    }

    // Disassemble Button (if applicable)
    if (item.isDisassembleable) {
        const disassembleButton = document.createElement('button');
        disassembleButton.textContent = 'Disassemble';
        disassembleButton.addEventListener('click', () => {
            disassembleItem(item);
            document.body.removeChild(popup);
            document.body.removeChild(overlay);
        });
        buttonsContainer.appendChild(disassembleButton);
    }

    // Cancel Button
    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.addEventListener('click', () => {
        document.body.removeChild(popup);
        document.body.removeChild(overlay);
    });
    buttonsContainer.appendChild(cancelButton);

    // Add the buttons container to the popup
    popup.appendChild(buttonsContainer);
    
    // Add to DOM first so we can calculate size
    document.body.appendChild(popup);
    
    // Position the popup near the clicked item
    if (clickEvent && clickEvent.clientX && clickEvent.clientY) {
        // Get window dimensions
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        // Get popup dimensions
        const popupRect = popup.getBoundingClientRect();
        
        // Calculate position (start at click position)
        let left = clickEvent.clientX + 10;
        let top = clickEvent.clientY;
        
        // Make sure it doesn't go off the right edge
        if (left + popupRect.width > windowWidth - 20) {
            left = windowWidth - popupRect.width - 20;
        }
        
        // Make sure it doesn't go off the bottom
        if (top + popupRect.height > windowHeight - 20) {
            top = windowHeight - popupRect.height - 20;
        }
        
        // Make sure it doesn't go off the top
        if (top < 20) {
            top = 20;
        }
        
        // Apply position
        popup.style.position = 'fixed';
        popup.style.top = `${top}px`;
        popup.style.left = `${left}px`;
    }
}


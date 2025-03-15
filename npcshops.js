// npcshops.js
console.log('npcshops.js loaded');

// How often to reset NPC stock (in milliseconds)
const SHOP_REFRESH_INTERVAL = 60_000_0; // e.g., 60 seconds

// We'll track when the next refresh is due
let nextShopRefreshTime = Date.now() + SHOP_REFRESH_INTERVAL;

// Example NPC array with new properties:
// - defaultStock: resets to this after timer
// - levelReq: The player's level must be >= this to buy (but we still show it locked)
const npcs = [
    {
        name: "Mech Marty",
        inventory: [
            {
                itemName: "Scrap Metal",
                price: 10,
                stock: 999,
                defaultStock: 999,
                levelReq: 1
            },
            {
                itemName: "Minor Electronic Circuit",
                price: 25,
                stock: 20,
                defaultStock: 20,
                levelReq: 2
            },
            {
                itemName: "Reaction Enhancer",
                price: 1,
                stock: 10,
                defaultStock: 1,
                levelReq: 1
            }
        ]
    },
    {
        name: "Shady Dealer",
        inventory: [
            {
                itemName: "Broken Phase Sword",
                price: 1,
                stock: 1,
                defaultStock: 1,
                levelReq: 1
            },
            {
                itemName: "Unstable Photon",
                price: 100,
                stock: 10,
                defaultStock: 10,
                levelReq: 3
            }
        ]
    },
    {
        name: "Clarissa",
        inventory: [
            {
                itemName: "Fire Spewer Mk1",
                price: 1,
                stock: 5,
                defaultStock: 5,
                levelReq: 1
            },
            {
                itemName: "Phase Reaver",
                price: 1,
                stock: 5,
                defaultStock: 5,
                levelReq: 1
            },
            {
                itemName: "Minor Electronic Circuit",
                price: 20,
                stock: 10,
                defaultStock: 10,
                levelReq: 1
            }
        ]
    }
];

// Start the timer that periodically resets NPC stocks
function startShopRefreshTimer() {
    // Refresh every second to update countdown & possibly do a stock reset
    setInterval(() => {
        const now = Date.now();
        if (now >= nextShopRefreshTime) {
            resetNPCStocks(); 
            nextShopRefreshTime = now + SHOP_REFRESH_INTERVAL;
        }
        updateShopTimerDisplay(); 
    }, 1000);
}

// Resets each item's stock to its defaultStock
function resetNPCStocks() {
    console.log("Resetting all NPC shop stocks to default...");
    npcs.forEach(npc => {
        npc.inventory.forEach(invItem => {
            invItem.stock = invItem.defaultStock;
        });
    });
    // If a shop is currently open, refresh it
    if (window.currentNPC) {
        displayNPCShop(window.currentNPC);
    }
}

// Updates the "time until next refresh" display
function updateShopTimerDisplay() {
    const timerElement = document.getElementById('shop-timer');
    if (!timerElement) return;

    const now = Date.now();
    let remaining = nextShopRefreshTime - now;

    if (remaining <= 0) {
        timerElement.textContent = "Shop Refresh: Now!";
    } else {
        // Convert to total seconds
        let totalSeconds = Math.floor(remaining / 1000);
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = totalSeconds % 60;
        // Pad seconds with a leading zero if < 10
        let secondsString = seconds < 10 ? `0${seconds}` : `${seconds}`;
        timerElement.textContent = `Shop Refresh in: ${minutes}:${secondsString}`;
    }
}

// Display NPC list in #npc-list
function displayNPCList() {
    const npcListDiv = document.getElementById('npc-list');
    if (!npcListDiv) {
        console.error("Element with ID 'npc-list' not found.");
        return;
    }
    npcListDiv.innerHTML = '';

    npcs.forEach(npc => {
        const npcButton = document.createElement('button');
        npcButton.textContent = npc.name;
        npcButton.style.margin = '5px';
        npcButton.addEventListener('click', () => {
            displayNPCShop(npc);
        });
        npcListDiv.appendChild(npcButton);
    });
}

// Display a single NPC's shop in #npc-shop-container
function displayNPCShop(npc) {
    window.currentNPC = npc; // Save reference if we need to refresh after stock reset
    const shopContainer = document.getElementById('npc-shop-container');
    if (!shopContainer) {
        console.error("Element with ID 'npc-shop-container' not found.");
        return;
    }
    shopContainer.innerHTML = '';

    const heading = document.createElement('h3');
    heading.textContent = `Welcome to ${npc.name}'s shop!`;
    shopContainer.appendChild(heading);

    // Show player's currency
    const currencyP = document.createElement('p');
    currencyP.textContent = `Credits Available: ${playerCurrency}`;
    shopContainer.appendChild(currencyP);

    // Timer info (optional, if you want it displayed inside each NPC's shop)
    const timerP = document.createElement('p');
    timerP.id = 'shop-timer'; // So updateShopTimerDisplay can find it
    shopContainer.appendChild(timerP);
    updateShopTimerDisplay(); // Immediately show current countdown

    // List items for sale
    npc.inventory.forEach((invItem, index) => {
        const itemTemplate = items.find(i => i.name === invItem.itemName);
        const itemName = itemTemplate ? itemTemplate.name : invItem.itemName;
        const itemPrice = invItem.price;
        const itemStock = invItem.stock;
        const itemLevelReq = invItem.levelReq || 1; 

        // Outer item box
        const itemDiv = document.createElement('div');
        itemDiv.className = 'shop-item';
        itemDiv.style.border = '1px solid #333';
        itemDiv.style.borderRadius = '5px';
        itemDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        itemDiv.style.width = '220px';
        itemDiv.style.padding = '5px';
        itemDiv.style.margin = '10px';
        itemDiv.style.display = 'inline-block';
        itemDiv.style.verticalAlign = 'top';
        itemDiv.style.position = 'relative';

        // Item name
        const itemNameP = document.createElement('p');
        itemNameP.textContent = itemName;
        itemNameP.style.fontWeight = 'bold';

        // Price
        const priceP = document.createElement('p');
        priceP.textContent = `Price: ${itemPrice} credits`;

        // Stock
        const stockP = document.createElement('p');
        stockP.textContent = `Stock: ${itemStock}`;

        // Level requirement
        const levelReqP = document.createElement('p');
        levelReqP.textContent = `Req. Level: ${itemLevelReq}`;

        // Buy button
        const buyButton = document.createElement('button');
        buyButton.textContent = 'Buy 1';

        // If player's level < itemLevelReq, lock the item
        if (player.level < itemLevelReq) {
            buyButton.disabled = true;
            buyButton.textContent = 'Locked';
            buyButton.title = `Requires level ${itemLevelReq}`;
        } else {
            // Normal buy behavior
            buyButton.addEventListener('click', () => {
                buyItemFromNPC(npc, index, 1);
            });
        }

        // Setup tooltip using global system
        itemDiv.setAttribute('data-has-tooltip', 'true');
        itemDiv.setAttribute('data-tooltip-source', 'shop-item');
        itemDiv.setAttribute('data-tooltip-content', getItemTooltipContent(itemTemplate || {}, true));

        // Append everything
        itemDiv.appendChild(itemNameP);
        itemDiv.appendChild(priceP);
        itemDiv.appendChild(stockP);
        itemDiv.appendChild(levelReqP);
        itemDiv.appendChild(buyButton);

        shopContainer.appendChild(itemDiv);
    });
}

// Handle purchasing an item from an NPC
function buyItemFromNPC(npc, itemIndex, quantity) {
    const invItem = npc.inventory[itemIndex];
    if (!invItem) {
        console.error("Item not found in NPC inventory.");
        return;
    }
    const cost = invItem.price * quantity;

    // Check if player has enough currency
    if (playerCurrency < cost) {
        logMessage(`You don't have enough credits to buy ${quantity} of ${invItem.itemName}!`);
        return;
    }
    // Check if stock is sufficient
    if (invItem.stock < quantity) {
        logMessage(`${npc.name} doesn't have enough stock of ${invItem.itemName}.`);
        return;
    }

    // Deduct currency & reduce stock
    playerCurrency -= cost;
    invItem.stock -= quantity;

    // Add the item(s) to player's inventory
    const itemTemplate = items.find(i => i.name === invItem.itemName);
    if (itemTemplate) {
        const purchasedItem = generateItemInstance(itemTemplate);
        purchasedItem.quantity = quantity;
        addItemToInventory(purchasedItem);
        logMessage(`You bought ${quantity}x ${invItem.itemName} for ${cost} credits.`);
    } else {
        logMessage(`Error: item template for ${invItem.itemName} not found in items.js.`);
    }

    // Refresh NPC shop display
    displayNPCShop(npc);
}

// Make sure to clean up when screen changes
function cleanupShopUI() {
    window.currentNPC = null;
    const shopContainer = document.getElementById('npc-shop-container');
    if (shopContainer) {
        shopContainer.innerHTML = '';
    }
}

// Initialize shops
document.addEventListener('DOMContentLoaded', () => {
    // Start the auto-refresh timer
    startShopRefreshTimer();

    // Listen for screen changes so we can show NPC list and clean up shop UI
    window.addEventListener('screenChanged', (e) => {
        if (e.detail.screenId === 'shops-screen') {
            displayNPCList();
        } else if (window.currentNPC) {
            // Clean up shop UI when leaving shops screen
            cleanupShopUI();
        }
    });

    // If you want the NPC list loaded from the start:
    // displayNPCList();
});

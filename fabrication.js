// fabricating.js
console.log('fabricating.js loaded');
console.log('window.inventory at the start:', window.inventory);
console.log('addInventoryChangeListener at the start:', typeof addInventoryChangeListener);

const ongoingFabrications = {}; // Tracks active fabrications by recipe name

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded event fired in fabricating.js');
    console.log('window.inventory inside DOMContentLoaded:', window.inventory);
    console.log('addInventoryChangeListener inside DOMContentLoaded:', typeof addInventoryChangeListener);

    // Add the inventory change listener
    addInventoryChangeListener(() => {
        if (currentScreen === 'fabrication-screen') {
            displayFabricationRecipes();
        }
    });

    // Display the recipes on the Fabrication screen
    displayFabricationRecipes();
});

// Listen for screen changes to update fabrication recipes
window.addEventListener('screenChanged', (event) => {
    if (event.detail.screenId === 'fabrication-screen') {
        displayFabricationRecipes();
    }
});

// Global variable to track selected category
let selectedCategory = null;

// Function to start fabrication for a specific recipe
function startFabrication(recipe, button) {
    console.log("Starting fabrication:", recipe.name, button);
    
    // If a fabrication for this recipe is already in progress, do nothing
    if (ongoingFabrications[recipe.name]) {
        logMessage(`Already fabricating ${recipe.name}.`);
        return;
    }

    // Check if player has required materials
    if (!hasRequiredMaterials(recipe.ingredients)) {
        logMessage('You do not have the required materials to fabricate this item.');
        return;
    }

    // Deduct materials
    removeMaterialsFromInventory(recipe.ingredients);
    updateInventoryDisplay();

    // Switch button to "Cancel Fabrication" mode and reset progress
    button.buttonText.textContent = 'Cancel Fabrication';
    
    // Make sure the progress bar is visible and starts at 0%
    console.log("Setting up progress bar...");
    button.progressBar.style.display = 'block';
    button.progressBar.style.width = '0%';
    
    // Explicitly set z-index for progress bar and ensure it's visible
    const progressBg = button.progressBar.parentElement;
    if (progressBg) {
        progressBg.style.display = 'block';
        progressBg.style.zIndex = '1';
        button.progressBar.style.zIndex = '2';
    }
    
    console.log("Progress bar initial setup:", button.progressBar);

    // Duration
    const fabricationDuration = (recipe.craftingTime || 5) * 1000;
    const startTime = Date.now();

    function updateProgress() {
        const elapsed = Date.now() - startTime;
        const progressPercent = Math.min((elapsed / fabricationDuration) * 100, 100);
        
        // Update progress bar width with debugging
        console.log(`Updating progress: ${progressPercent.toFixed(1)}%`);
        button.progressBar.style.width = `${progressPercent}%`;
        
        if (progressPercent >= 100) {
            completeFabrication(recipe, button);
        }
    }

    // Update progress every 100ms
    const intervalId = setInterval(updateProgress, 100);

    // Store the state
    ongoingFabrications[recipe.name] = {
        intervalId: intervalId,
        button: button
    };

    logMessage(`Started fabricating: ${recipe.name}`);
}


// Function to stop fabrication for a specific recipe
function stopFabrication(recipe, button) {
    const fabrication = ongoingFabrications[recipe.name];
    if (fabrication) {
        clearInterval(fabrication.intervalId);
        delete ongoingFabrications[recipe.name];

        // Reset button
        button.buttonText.textContent = 'Fabricate';
        button.progressBar.style.width = '0%';
        button.progressBar.style.display = 'none';

        // Refund
        refundMaterials(recipe.ingredients);

        logMessage(`Fabrication of ${recipe.name} has been stopped. Materials refunded.`);
    }
}



// Function to complete fabrication for a specific recipe
function completeFabrication(recipe, button) {
    console.log("Completing fabrication:", recipe.name);
    
    const fabrication = ongoingFabrications[recipe.name];
    if (fabrication) {
        clearInterval(fabrication.intervalId);
        delete ongoingFabrications[recipe.name];
    }

    // Reset button
    button.buttonText.textContent = 'Fabricate';
    button.progressBar.style.width = '0%';
    button.progressBar.style.display = 'none';

    // Create the crafted item
    const itemTemplate = window.items ? window.items.find(i => i.name === recipe.name) : null;
    if (itemTemplate) {
        console.log("Found item template:", itemTemplate);
        
        try {
            const craftedItem = generateItemInstance(itemTemplate);
            console.log("Generated item:", craftedItem);
            
            // Add to inventory
            addItemToInventory(craftedItem);
            logMessage(`You have fabricated: ${craftedItem.name}`);
            
            // Play success sound if available
            if (window.playSound) {
                playSound('ITEM_PICKUP', 0.4);
            }
        } catch (error) {
            console.error("Error generating item:", error);
            logMessage(`Error fabricating ${recipe.name}. Please try again.`);
            // Refund materials as a fallback
            refundMaterials(recipe.ingredients);
        }
    } else {
        console.error(`Item template not found for ${recipe.name}`);
        logMessage(`Fabrication completed, but item template for ${recipe.name} was not found.`);
        // Refund materials since we couldn't find the template
        refundMaterials(recipe.ingredients);
    }

    // Update displays
    updateInventoryDisplay();
    displayFabricationRecipes();
}




// Function to display fabrication recipes
function displayFabricationRecipes() {
    const fabricationCategories = document.getElementById('fabrication-categories');
    if (!fabricationCategories) {
        console.error("fabrication-categories div not found");
        return;
    }
    
    fabricationCategories.innerHTML = '';
    
    // Group recipes by category
    const categories = {};
    
    // Use window.recipes instead of recipes directly
    if (window.recipes) {
        window.recipes.forEach(recipe => {
            const category = recipe.category || "Uncategorized";
            if (!categories[category]) {
                categories[category] = [];
            }
            categories[category].push(recipe);
        });
    } else {
        console.error("Recipes not found: window.recipes is undefined");
    }
    
    // Create category tabs
    const tabsContainer = document.createElement('div');
    tabsContainer.className = 'fabrication-tabs';
    
    // Get selected category or use the first one
    if (!selectedCategory || !categories[selectedCategory]) {
        selectedCategory = Object.keys(categories)[0];
    }
    
    // Create tabs for each category
    Object.keys(categories).forEach(category => {
        const tab = document.createElement('button');
        tab.className = `fab-category-tab ${category === selectedCategory ? 'active' : ''}`;
        tab.textContent = category;
        tab.addEventListener('click', () => {
            // Update selected tab
            document.querySelectorAll('.fab-category-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Update selected category and refresh display
            selectedCategory = category;
            displayCategoryRecipes(category);
            
            // Play select sound if available
            if (window.playSound) {
                playSound('UI_SELECT');
            }
        });
        tabsContainer.appendChild(tab);
    });
    
    fabricationCategories.appendChild(tabsContainer);
    
    // Display recipes for currently selected category
    displayCategoryRecipes(selectedCategory);
}

// Function to display recipes for a specific category
function displayCategoryRecipes(category) {
    const recipeContainer = document.getElementById('recipe-container');
    recipeContainer.innerHTML = '';
    
    // Filter recipes by category - ensure case-insensitive matching
    const categoryRecipes = window.recipes ? window.recipes.filter(recipe => 
        recipe.category && recipe.category.toLowerCase() === category.toLowerCase()
    ) : [];
    
    console.log(`Displaying ${categoryRecipes.length} recipes for category: ${category}`);
    
    if (categoryRecipes.length === 0) {
        recipeContainer.innerHTML = '<div class="no-recipes">No recipes available in this category.</div>';
        return;
    }
    
    categoryRecipes.forEach(recipe => {
        const recipeCard = createRecipeCard(recipe);
        recipeContainer.appendChild(recipeCard);
    });
}

// Function to create a recipe card
function createRecipeCard(recipe) {
    const card = document.createElement('div');
    card.className = 'recipe-card';
    
    // Card header
    const header = document.createElement('div');
    header.className = 'recipe-header';
    header.innerHTML = `
        <div class="recipe-name">${recipe.name}</div>
        <div class="recipe-type">${recipe.type || 'Item'}</div>
    `;
    card.appendChild(header);
    
    // Card body
    const body = document.createElement('div');
    body.className = 'recipe-body';
    
    // Description if available
    if (recipe.description) {
        const description = document.createElement('div');
        description.className = 'recipe-description';
        description.textContent = recipe.description;
        body.appendChild(description);
    }
    
    // Ingredients section
    const ingredients = document.createElement('div');
    ingredients.className = 'recipe-ingredients';
    ingredients.innerHTML = `<div class="recipe-ingredients-title">Required Materials:</div>`;
    
    const ingredientsList = document.createElement('ul');
    ingredientsList.className = 'ingredients-list';
    
    // Handle ingredients as an object (not an array)
    for (const itemName in recipe.ingredients) {
        const quantity = recipe.ingredients[itemName];
        const hasIngredient = hasRequiredMaterial(itemName, quantity);
        
        const li = document.createElement('li');
        li.className = `ingredient-item ${hasIngredient ? '' : 'missing'}`;
        li.innerHTML = `
            <span>${itemName} × ${quantity}</span>
            <span>${hasIngredient ? '✓' : '✗'}</span>
        `;
        ingredientsList.appendChild(li);
    }
    
    ingredients.appendChild(ingredientsList);
    body.appendChild(ingredients);
    
    // Crafting time
    const craftingTime = document.createElement('div');
    craftingTime.className = 'recipe-time';
    craftingTime.textContent = `Crafting Time: ${recipe.craftingTime || 5} seconds`;
    body.appendChild(craftingTime);
    
    // Add fabricate button with progress bar
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'fab-button-container';
    
    // Create background for progress bar
    const progressBg = document.createElement('div');
    progressBg.className = 'fab-progress-bg';
    const progressBar = document.createElement('div');
    progressBar.className = 'fab-progress-bar';
    progressBg.appendChild(progressBar);
    buttonContainer.appendChild(progressBg);
    
    // Create button
    const button = document.createElement('button');
    button.className = 'fab-button';
    button.textContent = 'Fabricate';
    
    // Disable button if ingredients are missing
    const canCraft = hasRequiredMaterials(recipe.ingredients);
    button.disabled = !canCraft;
    
    // Button click handler
    button.addEventListener('click', () => {
        const fabricationInProgress = ongoingFabrications[recipe.name];
        
        if (fabricationInProgress) {
            // Cancel fabrication
            stopFabrication(recipe, { 
                buttonText: button, 
                progressBar: progressBar 
            });
            button.textContent = 'Fabricate';
            
            // Play cancel sound if available
            if (window.playSound) {
                playSound('UI_BACK');
            }
        } else {
            // Start fabrication
            startFabrication(recipe, { 
                buttonText: button, 
                progressBar: progressBar 
            });
            button.textContent = 'Cancel Fabrication';
            
            // Play start sound if available
            if (window.playSound) {
                playSound('UI_SELECT');
            }
        }
    });
    
    buttonContainer.appendChild(button);
    body.appendChild(buttonContainer);
    card.appendChild(body);
    
    // Add data for tooltip if needed
    if (window.items) {
        const itemTemplate = window.items.find(i => i.name === recipe.name);
        if (itemTemplate) {
            card.setAttribute('data-has-tooltip', 'true');
            card.setAttribute('data-tooltip-content', getItemTooltipContent(itemTemplate));
        }
    }
    
    return card;
}

// Helper function to check if the player has a specific material
function hasRequiredMaterial(itemName, quantity) {
    // Find all instances of the item in inventory
    const items = window.inventory.filter(item => item.name === itemName);
    
    // Calculate total quantity
    const totalQuantity = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
    
    return totalQuantity >= quantity;
}

// Function to check if player has required materials
function hasRequiredMaterials(ingredients) {
    for (let materialName in ingredients) {
        const requiredQuantity = ingredients[materialName];
        const inventoryItem = window.inventory.find(item => item.name === materialName);
        const playerQuantity = inventoryItem && inventoryItem.quantity ? inventoryItem.quantity : 0;
        if (playerQuantity < requiredQuantity) {
            return false;
        }
    }
    return true;
}

// Function to remove materials from inventory
function removeMaterialsFromInventory(ingredients) {
    for (let materialName in ingredients) {
        const requiredQuantity = ingredients[materialName];
        removeItemQuantityFromInventory(materialName, requiredQuantity);
    }
}

// Function to remove a specific quantity of an item from inventory
function removeItemQuantityFromInventory(itemName, quantity) {
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
        console.warn(`Attempted to remove ${itemName} which is not in inventory.`);
    }
    updateInventoryDisplay();
    notifyInventoryChange();
}

// Function to refund materials
function refundMaterials(ingredients) {
    console.log("Refunding materials:", ingredients);
    
    for (let materialName in ingredients) {
        const quantity = ingredients[materialName];
        const materialTemplate = window.items.find(i => i.name === materialName);
        
        if (materialTemplate) {
            console.log(`Refunding ${quantity}x ${materialName}`);
            
            try {
                const materialItem = generateItemInstance(materialTemplate);
                materialItem.quantity = quantity;
                addItemToInventory(materialItem);
            } catch (error) {
                console.error(`Error refunding ${materialName}:`, error);
                logMessage(`Error refunding ${materialName}.`);
            }
        } else {
            console.warn(`Material template not found: ${materialName}`);
        }
    }
    
    updateInventoryDisplay();
    logMessage("Materials have been refunded.");
}

// Helper function to capitalize the first letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

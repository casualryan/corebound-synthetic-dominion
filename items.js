// Import item categories from separate files
// These files will automatically add their arrays to the window object

console.log('items.js - Starting to load items');
console.log('items.js - Current window.weapons:', window.weapons ? `Array with ${window.weapons.length} items` : 'undefined');
console.log('items.js - Current window.materials:', window.materials ? `Array with ${window.materials.length} items` : 'undefined');
console.log('items.js - Current window.armor:', window.armor ? `Array with ${window.armor.length} items` : 'undefined');
console.log('items.js - Current window.bionics:', window.bionics ? `Array with ${window.bionics.length} items` : 'undefined');
console.log('items.js - Current window.components:', window.components ? `Array with ${window.components.length} items` : 'undefined');

// Load all item definitions
function loadItems() {
    console.log('loadItems() called - checking all item types:');
    console.log('- weapons available:', window.weapons ? window.weapons.length : 'none');
    console.log('- materials available:', window.materials ? window.materials.length : 'none');
    console.log('- armor available:', window.armor ? window.armor.length : 'none');
    console.log('- bionics available:', window.bionics ? window.bionics.length : 'none');
    console.log('- components available:', window.components ? window.components.length : 'none');
    
    // Warning for missing item types
    if (!window.weapons || window.weapons.length === 0) {
        console.log('WARNING: window.weapons is empty or undefined - this will cause item loading issues');
    }
    if (!window.materials || window.materials.length === 0) {
        console.log('WARNING: window.materials is empty or undefined - this will cause item loading issues');
    }
    if (!window.armor || window.armor.length === 0) {
        console.log('WARNING: window.armor is empty or undefined - this will cause item loading issues');
    }
    if (!window.bionics || window.bionics.length === 0) {
        console.log('WARNING: window.bionics is empty or undefined - this will cause item loading issues');
    }
    if (!window.components || window.components.length === 0) {
        console.log('NOTE: window.components is empty or undefined - this is expected as components are not yet implemented');
    }
    
    // Create a master array that combines all item types
    const allItems = [
        ...window.weapons || [],
        ...window.armor || [],
        ...window.bionics || [],
        ...window.materials || [],
        ...window.components || []
    ];

    console.log('Combined items length:', allItems.length);
    if (window.weapons && window.weapons.length) {
        console.log('First weapon in window.weapons:', window.weapons[0].name);
        console.log('First weapon in allItems:', allItems.find(item => item.type === 'Weapon')?.name || 'No weapons found in allItems');
    }
    if (window.armor && window.armor.length) {
        console.log('First armor in window.armor:', window.armor[0].name);
        console.log('First armor in allItems:', allItems.find(item => item.type === 'Armor')?.name || 'No armor found in allItems');
    }

    // Make the combined array available globally
    window.items = allItems;
    
    console.log(`Loaded ${allItems.length} items total:`);
    console.log(`- Weapons: ${(window.weapons || []).length}`);
    console.log(`- Armor: ${(window.armor || []).length}`);
    console.log(`- Bionics: ${(window.bionics || []).length}`);
    console.log(`- Materials: ${(window.materials || []).length}`);
    console.log(`- Components: ${(window.components || []).length}`);
    
    return allItems;
}

// Export the loadItems function for potential external use, though it's called internally now
window.loadItems = loadItems;

// Wait for all item types to be loaded before calling loadItems
function waitForAllItemTypesAndLoad() {
    if (window.weapons && window.weapons.length > 0 && 
        window.materials && window.materials.length > 0 &&
        window.armor && window.armor.length > 0 &&
        window.bionics && window.bionics.length > 0 &&
        window.components !== undefined) { // Components can be empty array
        console.log('About to call loadItems() from items.js - all item types are ready');
        const items = loadItems();
        console.log('items.js - loadItems() completed, window.items.length:', window.items.length);
    } else {
        console.log('items.js - Waiting for all item types to load...');
        console.log('  - Weapons:', window.weapons ? window.weapons.length : 'not loaded');
        console.log('  - Materials:', window.materials ? window.materials.length : 'not loaded');
        console.log('  - Armor:', window.armor ? window.armor.length : 'not loaded');
        console.log('  - Bionics:', window.bionics ? window.bionics.length : 'not loaded');
        console.log('  - Components:', window.components ? 'loaded' : 'not loaded');
        setTimeout(waitForAllItemTypesAndLoad, 50); // Check again in 50ms
    }
}

// Start the waiting process
waitForAllItemTypesAndLoad();

// Add a fallback reload mechanism
window.addEventListener('load', () => {
    // Check if all item types are loaded but not included in the items array
    if (window.weapons && window.weapons.length > 0 && 
        window.materials && window.materials.length > 0 &&
        window.armor && window.armor.length > 0 &&
        window.bionics && window.bionics.length > 0 &&
        (!window.items.find(item => item.type === 'Weapon') || 
         !window.items.find(item => item.type === 'Material') ||
         !window.items.find(item => item.type === 'Armor') ||
         !window.items.find(item => item.type === 'Bionic'))) {
        console.log('items.js load event: All item types available but not in items array - reloading');
        window.items = loadItems();
    }
});

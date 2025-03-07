// Import item categories from separate files
// These files will automatically add their arrays to the window object

// Load all item definitions
function loadItems() {
    // Create a master array that combines all item types
    const allItems = [
        ...window.weapons || [],
        ...window.armor || [],
        ...window.bionics || [],
        ...window.materials || [],
        ...window.components || []
    ];

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

// You can call this function after all item files have been loaded
// loadItems();

// Export the loadItems function
window.loadItems = loadItems;

// src/itemsVerifier.js
// This script runs after everything else to verify items loaded correctly

console.log('itemsVerifier.js - Starting verification');

function verifyItemsLoaded() {
  // Check if weapons are available
  if (!window.weapons || window.weapons.length === 0) {
    console.error('VERIFICATION FAILED: window.weapons is empty or missing');
    return false;
  }
  
  // Check if items array exists and contains weapons
  if (!window.items) {
    console.error('VERIFICATION FAILED: window.items is missing');
    return false;
  }
  
  // Count weapons in the items array
  const weaponsInItems = window.items.filter(item => item.type === 'Weapon').length;
  
  if (weaponsInItems === 0 && window.weapons.length > 0) {
    console.error('VERIFICATION FAILED: window.weapons has items but they are not in window.items');
    console.log('Attempting to fix by reloading items...');
    
    if (typeof window.loadItems === 'function') {
      window.items = window.loadItems();
      console.log('Items reloaded. New count:', window.items.length);
      
      // Check again
      const newWeaponsCount = window.items.filter(item => item.type === 'Weapon').length;
      console.log('Weapons in items after reload:', newWeaponsCount);
      
      return newWeaponsCount > 0;
    }
    return false;
  }
  
  console.log('VERIFICATION PASSED: Found', weaponsInItems, 'weapons in window.items');
  return true;
}

// Wait for everything else to load
window.addEventListener('load', () => {
  // Give a little extra time for modules to stabilize
  setTimeout(() => {
    console.log('Running final items verification...');
    const verified = verifyItemsLoaded();
    
    if (!verified) {
      console.error('Final verification failed. This may affect item generation and loading.');
    } else {
      console.log('All item systems verified and working correctly.');
    }
  }, 1000);
});

export default {}; 
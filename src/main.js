import weapons from './items/weapons/index.js';
import materials from './items/materials/index.js';
import armor from './items/armor/index.js';
import bionics from './items/bionics/index.js';
import components from './items/components/index.js';

console.log('Vite main.js - Starting to load all item types');
console.log('Weapons array content:', weapons);
console.log('Materials array content:', materials);
console.log('Armor array content:', armor);
console.log('Bionics array content:', bionics);
console.log('Components array content:', components);

// First, immediately make all item types available
window.weapons = weapons;
window.materials = materials;
window.armor = armor;
window.bionics = bionics;
window.components = components;

console.log('Vite main.js - All items assigned to window:');
console.log('- Weapons:', window.weapons.length);
console.log('- Materials:', window.materials.length);
console.log('- Armor:', window.armor.length);
console.log('- Bionics:', window.bionics.length);
console.log('- Components:', window.components.length);

// Then, add a failsafe loader to ensure all items are available to the rest of the system
window.addEventListener('load', () => {
  console.log('Window load event - ensuring all item types are available');
  
  // Double-check all item types are in the global scope
  if (!window.weapons || window.weapons.length === 0) {
    console.log('Re-applying weapons to window object after load');
    window.weapons = weapons;
  }
  
  if (!window.materials || window.materials.length === 0) {
    console.log('Re-applying materials to window object after load');
    window.materials = materials;
  }
  
  if (!window.armor || window.armor.length === 0) {
    console.log('Re-applying armor to window object after load');
    window.armor = armor;
  }
  
  if (!window.bionics || window.bionics.length === 0) {
    console.log('Re-applying bionics to window object after load');
    window.bionics = bionics;
  }
  
  if (!window.components || window.components.length === 0) {
    console.log('Re-applying components to window object after load');
    window.components = components;
  }
  
  // Force reload items after we know all item types are available
  if (window.loadItems && window.items && 
      (!window.items.find(item => item.type === 'Weapon') || 
       !window.items.find(item => item.type === 'Material') ||
       !window.items.find(item => item.type === 'Armor') ||
       !window.items.find(item => item.type === 'Bionic'))) {
    console.log('Reloading all items to include all modular item types');
    window.items = window.loadItems();
    console.log('Items reloaded, counts:', {
      weapons: window.items.filter(item => item.type === 'Weapon').length,
      materials: window.items.filter(item => item.type === 'Material').length,
      armor: window.items.filter(item => item.type === 'Armor').length,
      bionics: window.items.filter(item => item.type === 'Bionic').length,
      components: window.items.filter(item => item.type === 'Component').length
    });
  }
});

console.log('Vite main.js - Loaded all items successfully');
console.log('Example weapon from Vite:', window.weapons[0]?.name || 'No weapons found');
console.log('Example material from Vite:', window.materials[0]?.name || 'No materials found');
console.log('Example armor from Vite:', window.armor[0]?.name || 'No armor found');
console.log('Example bionic from Vite:', window.bionics[0]?.name || 'No bionics found');
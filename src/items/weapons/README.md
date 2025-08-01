# Weapons Directory

This directory contains all the weapon definitions for the game, organized as individual files.

## Adding a New Weapon

1. Create a new file for your weapon:
   - Copy `TEMPLATE.js` and rename it to match your weapon's name in camelCase (e.g., `myCoolWeapon.js`)
   - Fill in the weapon details

2. Update `index.js`:
   - Import your new weapon
   - Add it to the weapons array

Example:
```javascript
// In index.js
import myCoolWeapon from './myCoolWeapon.js';

// Add to the weapons array
const weapons = [
  // existing weapons...
  myCoolWeapon
];
```

## Weapon Properties

| Property | Description | Required |
|----------|-------------|----------|
| `name` | Weapon name | Yes |
| `type` | Always "Weapon" | Yes |
| `weaponType` | Type of weapon (Sword, Staff, etc.) | Yes |
| `icon` | Path to icon image | Yes |
| `bAttackSpeed` | Base attack speed | Yes |
| `damageTypes` | Damage types with min/max values | Yes |
| `statModifiers` | Stat modifiers for damage types and groups | No |
| `slot` | Equipment slot (mainHand, offHand) | Yes |
| `effects` | Special effects when used | No |
| `isDisassembleable` | Whether the weapon can be disassembled | No |
| `disassembleResults` | Items received when disassembled | No if not disassembleable |
| `description` | Weapon description | No |

## Weapon Data Structure

See the `TEMPLATE.js` file for a complete example of the weapon data structure. 
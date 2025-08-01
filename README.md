# Idle Game 2

An idle combat game with modular weapons, equipment, and various gameplay systems.

## Setup with Vite

This project now uses Vite for bundling the game's assets.

### Development

To run the development server:

```
npm run dev
```

This will start a local development server and automatically open the game in your default browser.

### Production Build

To build for production:

```
npm run build
```

This creates optimized files in the `dist` folder.

To preview the production build:

```
npm run preview
```

## File Structure

The game's assets are organized as follows:

- `src/` - Source files
  - `items/` - Game items (all modularized)
    - `weapons/` - Individual weapon files + index.js + TEMPLATE.js
    - `materials/` - Individual material files + index.js
    - `armor/` - Individual armor files + index.js + TEMPLATE.js
    - `bionics/` - Individual bionic files + index.js + TEMPLATE.js
    - `components/` - Placeholder for future component system
  - `main.js` - Main entry point (imports all item types)

## Adding New Items

All item types are now organized as individual files in their respective directories:

### Adding New Weapons
1. Copy the `TEMPLATE.js` file in `src/items/weapons/`
2. Name it according to your weapon name (in camelCase)
3. Fill in the weapon details
4. Import and add it to the weapons array in `src/items/weapons/index.js`

### Adding New Armor
1. Copy the `TEMPLATE.js` file in `src/items/armor/`
2. Name it according to your armor name (in camelCase)
3. Fill in the armor details
4. Import and add it to the armor array in `src/items/armor/index.js`

### Adding New Bionics
1. Copy the `TEMPLATE.js` file in `src/items/bionics/`
2. Name it according to your bionic name (in camelCase)
3. Fill in the bionic details
4. Import and add it to the bionics array in `src/items/bionics/index.js`

### Adding New Materials
1. Follow the existing pattern in `src/items/materials/`
2. Create a new file with the material definition
3. Import and add it to the materials array in `src/items/materials/index.js`

See the README.md files in each directory for more details.

## Migration Status

- [x] Weapons - Migrated to individual files ✅
- [x] Materials - Migrated to individual files ✅
- [x] Armor - Migrated to individual files ✅
- [x] Bionics - Migrated to individual files ✅
- [x] Components - Placeholder structure created ✅

**Migration Complete!** All item types are now using the modular ES6 structure.

## Build System

This project uses Vite for modern development and building:

- `index.html` - Main entry point using Vite
- `index.vite.html` - Backup copy (can be removed in future)

All legacy item files have been removed and the migration to modular ES6 structure is complete. 
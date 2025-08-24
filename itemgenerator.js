function generateItemInstance(template) {
    const item = JSON.parse(JSON.stringify(template));

    // Helpers
    const asNumberRange = (value) => {
        // Accepts "min-max" string, {min,max}, or number; always returns {min,max} numbers
        if (value === null || value === undefined) return null;
        if (typeof value === 'string') {
            const parts = value.split('-').map(p => p.trim());
            if (parts.length === 2 && !isNaN(parseFloat(parts[0])) && !isNaN(parseFloat(parts[1]))) {
                return { min: parseFloat(parts[0]), max: parseFloat(parts[1]) };
            }
            // If not in expected format, ignore
            return null;
        }
        if (typeof value === 'number') {
            return { min: value, max: value };
        }
        if (typeof value === 'object' && value.min !== undefined && value.max !== undefined) {
            return { min: Number(value.min), max: Number(value.max) };
        }
        return null;
    };

    const rollFrom = (value, preferFloat = false) => {
        const range = asNumberRange(value);
        if (!range) return undefined;
        if (preferFloat || (range.min % 1 !== 0) || (range.max % 1 !== 0)) {
            return getRandomFloat(range.min, range.max);
        }
        return getRandomInt(Math.round(range.min), Math.round(range.max));
    };

    const rollPercentToFraction = (value) => {
        const rolled = rollFrom(value, false);
        if (rolled === undefined) return undefined;
        return Number((rolled / 100).toFixed(4));
    };

    const parsePickCount = (pickSpec) => {
        if (pickSpec === undefined || pickSpec === null) return 1;
        if (typeof pickSpec === 'number') return Math.max(0, Math.floor(pickSpec));
        const range = asNumberRange(pickSpec);
        if (range) return getRandomInt(Math.round(range.min), Math.round(range.max));
        return 1;
    };

    const ensurePathObj = (target, pathParts) => {
        let node = target;
        for (let i = 0; i < pathParts.length - 1; i++) {
            const key = pathParts[i];
            if (node[key] === undefined || node[key] === null || typeof node[key] !== 'object') {
                node[key] = {};
            }
            node = node[key];
        }
        return node;
    };

    const percentTopLevelKeys = new Set([
        'healthBonusPercent', 'energyShieldBonusPercent',
        'attackSpeedModifier', 'criticalChanceModifier', 'criticalMultiplierModifier'
    ]);

    // 1) Base/meta fields commonly used by the rest of the system
    // Support bAttackSpeed as fixed number or range string/object
    if (template.bAttackSpeed !== undefined) {
        const maybe = rollFrom(template.bAttackSpeed, true);
        item.bAttackSpeed = (maybe !== undefined) ? Number(parseFloat(maybe).toFixed(2)) : template.bAttackSpeed;
    }

    // 2) Damage types (flat)
    if (template.damageTypes) {
        item.damageTypes = {};
        for (const type in template.damageTypes) {
            const rolled = rollFrom(template.damageTypes[type]);
            // default to 0 if invalid
            item.damageTypes[type] = (rolled !== undefined) ? rolled : Number(template.damageTypes[type]) || 0;
        }
    }

    // 3) Defense types (flat)
    if (template.defenseTypes) {
        item.defenseTypes = {};
        for (const defenseType in template.defenseTypes) {
            const rolled = rollFrom(template.defenseTypes[defenseType]);
            item.defenseTypes[defenseType] = (rolled !== undefined) ? rolled : Number(template.defenseTypes[defenseType]) || 0;
        }
    }

    // 4) Percentage damage modifiers by type/group (kept under statModifiers)
    if (template.statModifiers && (template.statModifiers.damageTypes || template.statModifiers.damageGroups)) {
        if (!item.statModifiers) item.statModifiers = {};
        // Type-specific %
        if (template.statModifiers.damageTypes) {
            item.statModifiers.damageTypes = {};
            for (const dmgType in template.statModifiers.damageTypes) {
                const rolled = rollFrom(template.statModifiers.damageTypes[dmgType]);
                item.statModifiers.damageTypes[dmgType] = (rolled !== undefined) ? rolled : Number(template.statModifiers.damageTypes[dmgType]) || 0;
            }
        }
        // Group-specific %
        if (template.statModifiers.damageGroups) {
        item.statModifiers.damageGroups = {};
            for (const group in template.statModifiers.damageGroups) {
                const rolled = rollFrom(template.statModifiers.damageGroups[group]);
                item.statModifiers.damageGroups[group] = (rolled !== undefined) ? rolled : Number(template.statModifiers.damageGroups[group]) || 0;
            }
        }
    }

    // 5) Common flat stats and percent stats at top-level
    const topLevelSpecs = [
        // [key, type] where type: 'int' | 'float' | 'percent'
        ['healthBonus', 'int'],
        ['energyShieldBonus', 'int'],
        ['healthBonusPercent', 'percent'],
        ['energyShieldBonusPercent', 'percent'],
        ['attackSpeedModifier', 'percent'],
        ['criticalChanceModifier', 'percent'],
        ['criticalMultiplierModifier', 'percent'],
        ['precision', 'int'],
        ['deflection', 'int'],
        ['healthRegen', 'float'],
        ['armorEfficiency', 'int'],
        ['weaponEfficiency', 'int'],
        ['bionicEfficiency', 'int'],
        ['bionicSync', 'int'],
        ['comboAttack', 'int'],
        ['comboEffectiveness', 'int'],
        ['additionalComboAttacks', 'int'],
        ['armorPenetration', 'int']
    ];

    for (const [key, kind] of topLevelSpecs) {
        if (template[key] !== undefined) {
            if (kind === 'percent') {
                const frac = rollPercentToFraction(template[key]);
                if (frac !== undefined) {
                    item[key] = frac;
                    // Provide display helper for UI when it makes sense
                    if (key === 'attackSpeedModifier') {
                        // store rolled percent for tooltip clarity
                        const pct = rollFrom(template[key]);
                        if (pct !== undefined) item.attackSpeedModifierPercent = pct;
                    }
                    if (key === 'healthBonusPercent') {
                        const pct = rollFrom(template[key]);
                        if (pct !== undefined) item.healthBonusPercentDisplay = pct;
                    }
                    if (key === 'energyShieldBonusPercent') {
                        const pct = rollFrom(template[key]);
                        if (pct !== undefined) item.energyShieldBonusPercentDisplay = pct;
                    }
                } else if (typeof template[key] === 'number') {
                    // Fallback: already a fraction
                    item[key] = template[key];
                }
            } else if (kind === 'float') {
                const rolled = rollFrom(template[key], true);
                if (rolled !== undefined) item[key] = Number(parseFloat(rolled).toFixed(2));
                else if (typeof template[key] === 'number') item[key] = template[key];
            } else {
                const rolled = rollFrom(template[key]);
                if (rolled !== undefined) item[key] = rolled;
                else if (typeof template[key] === 'number') item[key] = template[key];
            }
        }
    }

    // 6) General statModifiers (catch-all) - roll any numeric-like values
    if (template.statModifiers) {
        if (!item.statModifiers) item.statModifiers = {};
        const ignored = new Set(['damageTypes', 'damageGroups']);
        for (const statKey in template.statModifiers) {
            if (ignored.has(statKey)) continue;
            const value = template.statModifiers[statKey];
            // Prefer int rolls unless decimals are provided or requested
            const preferFloat = typeof value === 'string' && value.includes('.');
            const rolled = rollFrom(value, preferFloat);
            if (rolled !== undefined) item.statModifiers[statKey] = preferFloat ? Number(parseFloat(rolled).toFixed(2)) : rolled;
            else if (typeof value === 'number') item.statModifiers[statKey] = value;
        }
        // Mirror attackSpeedModifier to top-level if provided only inside statModifiers (for compatibility)
        if (item.statModifiers.attackSpeedModifier !== undefined && item.attackSpeedModifier === undefined) {
            // If provided as percent number (e.g., 10), convert to fraction
            const v = item.statModifiers.attackSpeedModifier;
            item.attackSpeedModifier = typeof v === 'number' && v > 1 ? Number((v / 100).toFixed(4)) : v;
        }
    }

    // 6b) Backward compatibility for legacy *Range fields and older names
    // - If new keys are not provided, consume the legacy ones
    const legacyPercentRanges = [
        ['attackSpeedModifier', 'attackSpeedModifierRange'],
        ['criticalChanceModifier', 'criticalChanceModifierRange'],
        ['criticalMultiplierModifier', 'criticalMultiplierModifierRange'],
        ['healthBonusPercent', 'healthBonusPercentRange'],
        ['energyShieldBonusPercent', 'energyShieldBonusPercentRange']
    ];
    for (const [newKey, legacyKey] of legacyPercentRanges) {
        if (item[newKey] === undefined && template[legacyKey] !== undefined) {
            const pct = rollFrom(template[legacyKey]);
            if (pct !== undefined) {
                const frac = Number((pct / 100).toFixed(4));
                item[newKey] = frac;
                if (newKey === 'attackSpeedModifier') item.attackSpeedModifierPercent = pct;
                if (newKey === 'healthBonusPercent') item.healthBonusPercentDisplay = pct;
                if (newKey === 'energyShieldBonusPercent') item.energyShieldBonusPercentDisplay = pct;
            }
        }
    }

    // Legacy: map attackSpeed -> attackSpeedModifier (supports fraction or percent)
    if (item.attackSpeedModifier === undefined && template.attackSpeed !== undefined) {
        const range = asNumberRange(template.attackSpeed);
        if (range) {
            const isFractionRange = Math.abs(range.min) <= 1 && Math.abs(range.max) <= 1;
            const rolled = rollFrom(template.attackSpeed, true);
            if (rolled !== undefined) {
                item.attackSpeedModifier = Number((isFractionRange ? rolled : rolled / 100).toFixed(4));
                item.attackSpeedModifierPercent = isFractionRange ? Math.round(rolled * 100) : Math.round(rolled);
            }
        } else if (typeof template.attackSpeed === 'number') {
            const v = template.attackSpeed;
            const isFraction = Math.abs(v) <= 1;
            item.attackSpeedModifier = Number((isFraction ? v : v / 100).toFixed(4));
            item.attackSpeedModifierPercent = isFraction ? Math.round(v * 100) : Math.round(v);
        }
    }

    // Legacy: map criticalChance -> criticalChanceModifier (fraction or percent)
    if (item.criticalChanceModifier === undefined && template.criticalChance !== undefined) {
        const range = asNumberRange(template.criticalChance);
        if (range) {
            const isFractionRange = Math.abs(range.min) <= 1 && Math.abs(range.max) <= 1;
            const rolled = rollFrom(template.criticalChance, true);
            if (rolled !== undefined) {
                item.criticalChanceModifier = Number((isFractionRange ? rolled : rolled / 100).toFixed(4));
            }
        } else if (typeof template.criticalChance === 'number') {
            const v = template.criticalChance;
            const isFraction = Math.abs(v) <= 1;
            item.criticalChanceModifier = Number((isFraction ? v : v / 100).toFixed(4));
        }
    }

    // Legacy: map criticalMultiplier -> criticalMultiplierModifier (fraction or percent)
    if (item.criticalMultiplierModifier === undefined && template.criticalMultiplier !== undefined) {
        const range = asNumberRange(template.criticalMultiplier);
        if (range) {
            const isFractionRange = Math.abs(range.min) <= 1 && Math.abs(range.max) <= 1;
            const rolled = rollFrom(template.criticalMultiplier, true);
            if (rolled !== undefined) {
                item.criticalMultiplierModifier = Number((isFractionRange ? rolled : rolled / 100).toFixed(4));
            }
        } else if (typeof template.criticalMultiplier === 'number') {
            const v = template.criticalMultiplier;
            const isFraction = Math.abs(v) <= 1;
            item.criticalMultiplierModifier = Number((isFraction ? v : v / 100).toFixed(4));
        }
    }

    // 7) Passive bonuses
    if (template.passiveBonuses) {
        item.passiveBonuses = {};
        for (const passiveName in template.passiveBonuses) {
            const rolled = rollFrom(template.passiveBonuses[passiveName]);
            if (rolled !== undefined) item.passiveBonuses[passiveName] = rolled;
            else if (typeof template.passiveBonuses[passiveName] === 'number') item.passiveBonuses[passiveName] = template.passiveBonuses[passiveName];
        }
    }

    // 7b) Roll groups (mod pools) - choose N from a list of possible mods
    // Schema:
    // rollGroups: [
    //   { pick: 1 | "1-2" | {min,max}, from: [ { path: 'damageTypes.kinetic', value: '10-20' }, ... ] }
    // ]
    if (Array.isArray(template.rollGroups)) {
        for (const group of template.rollGroups) {
            if (!group || !Array.isArray(group.from) || group.from.length === 0) continue;
            const pickCount = parsePickCount(group.pick);
            // Create a shallow copy and shuffle
            const options = group.from.slice();
            for (let i = options.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [options[i], options[j]] = [options[j], options[i]];
            }
            const chosen = options.slice(0, Math.min(pickCount, options.length));
            for (const choice of chosen) {
                if (!choice || typeof choice.path !== 'string') continue;
                const parts = choice.path.split('.');
                const key = parts[parts.length - 1];
                let rolledVal;
                // Convert for top-level percent keys only
                if (parts.length === 1 && percentTopLevelKeys.has(key)) {
                    rolledVal = rollPercentToFraction(choice.value);
                    if (rolledVal === undefined && typeof choice.value === 'number') {
                        rolledVal = Number((choice.value > 1 ? choice.value / 100 : choice.value).toFixed(4));
                    }
                } else if (key === 'healthRegen') {
                    const v = rollFrom(choice.value, true);
                    rolledVal = v !== undefined ? Number(parseFloat(v).toFixed(2)) : undefined;
                } else {
                    rolledVal = rollFrom(choice.value);
                }
                if (rolledVal === undefined && typeof choice.value === 'number') rolledVal = choice.value;
                if (rolledVal === undefined) continue;

                const parent = ensurePathObj(item, parts);
                parent[key] = rolledVal;
            }
        }
    }

    // 8) Level requirement support (number, "min-max", or {min,max})
    if (template.levelRequirement !== undefined) {
        const rolled = rollFrom(template.levelRequirement);
        if (rolled !== undefined) item.levelRequirement = rolled;
        else if (typeof template.levelRequirement === 'number') item.levelRequirement = template.levelRequirement;
    }

    // 9) Wires (Sockets) rolling
    if (template.wires && typeof template.wires === 'object') {
        const totalSlots = rollFrom(template.wires.totalSlots);
        const maxTotal = (typeof totalSlots === 'number' && totalSlots > 0) ? Math.floor(totalSlots) : 0;
        const colorsSpec = template.wires.colors || {};
        const colorCaps = {
            red: rollFrom(colorsSpec.red),
            green: rollFrom(colorsSpec.green),
            blue: rollFrom(colorsSpec.blue),
            black: rollFrom(colorsSpec.black)
        };
        const blackMax = rollFrom(template.wires.blackSlotsMax);
        const resolvedCap = (v) => (typeof v === 'number' ? Math.max(0, Math.floor(v)) : undefined);
        const caps = {
            red: resolvedCap(colorCaps.red),
            green: resolvedCap(colorCaps.green),
            blue: resolvedCap(colorCaps.blue),
            black: resolvedCap(colorCaps.black)
        };
        const blackLimit = resolvedCap(blackMax);

        // Build a pool of possible colors honoring per-color caps
        const chosen = [];
        const counts = { red: 0, green: 0, blue: 0, black: 0 };
        const colorList = ['red', 'green', 'blue', 'black'];
        for (let i = 0; i < maxTotal; i++) {
            // Build allowed choices for this slot
            const allowed = colorList.filter(c => (caps[c] === undefined || counts[c] < caps[c]));
            if (allowed.length === 0) break;
            // Prefer non-black if black limit reached
            const filtered = allowed.filter(c => c !== 'black' || (blackLimit === undefined || counts.black < blackLimit));
            const pool = filtered.length > 0 ? filtered : allowed;
            const pickIndex = getRandomInt(0, pool.length - 1);
            const color = pool[pickIndex];
            counts[color] += 1;
            chosen.push({ color });
        }
        item.rolledWires = chosen; // runtime sockets
        item.wires = template.wires; // keep template for reference
    }

    // Quantity default
    if (typeof item.quantity === 'undefined') {
        item.quantity = 1;
    }

    return item;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

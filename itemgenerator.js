function generateItemInstance(template) {
    const item = JSON.parse(JSON.stringify(template));

    // Explicitly copy bAttackSpeed if it exists (for weapons)
    if (template.bAttackSpeed !== undefined) {
        item.bAttackSpeed = template.bAttackSpeed;
    }

    // Roll damage types
    if (template.damageTypes) {
        item.damageTypes = {};
        for (const type in template.damageTypes) {
            const range = template.damageTypes[type];
            const min = getRandomInt(range.min, range.max);
            item.damageTypes[type] = min;
        }
    }

    // Roll defense types with ranges
    if (template.defenseTypes) {
        item.defenseTypes = {};
        for (let defenseType in template.defenseTypes) {
            const range = template.defenseTypes[defenseType];
            if (typeof range === 'object' && range.min !== undefined && range.max !== undefined) {
                item.defenseTypes[defenseType] = getRandomInt(range.min, range.max);
            } else {
                item.defenseTypes[defenseType] = range; // Fixed value
            }
        }
    }

    // Roll percentage damage modifiers
    if (template.statModifiers && template.statModifiers.damageTypes) {
        item.statModifiers = { damageTypes: {} };
        for (let damageType in template.statModifiers.damageTypes) {
            const range = template.statModifiers.damageTypes[damageType];
            if (typeof range === 'object' && range.min !== undefined && range.max !== undefined) {
                const percent = getRandomInt(range.min, range.max);
                item.statModifiers.damageTypes[damageType] = percent;
            } else {
                item.statModifiers.damageTypes[damageType] = template.statModifiers.damageTypes[damageType];
            }
        }
    }

    // Roll percentage damage group modifiers
    if (template.statModifiers && template.statModifiers.damageGroups) {
        if (!item.statModifiers) item.statModifiers = {};
        item.statModifiers.damageGroups = {};
        
        for (let groupType in template.statModifiers.damageGroups) {
            const range = template.statModifiers.damageGroups[groupType];
            if (typeof range === 'object' && range.min !== undefined && range.max !== undefined) {
                const percent = getRandomInt(range.min, range.max);
                item.statModifiers.damageGroups[groupType] = percent;
            } else {
                item.statModifiers.damageGroups[groupType] = template.statModifiers.damageGroups[groupType];
            }
        }
    }

    // Roll health bonus
    if (template.healthBonus) {
        if (typeof template.healthBonus === 'object') {
            item.healthBonus = getRandomInt(template.healthBonus.min, template.healthBonus.max);
        } else {
            item.healthBonus = template.healthBonus;
        }
    }

    // Roll energy shield bonus
    if (template.energyShieldBonus) {
        if (typeof template.energyShieldBonus === 'object') {
            item.energyShieldBonus = getRandomInt(template.energyShieldBonus.min, template.energyShieldBonus.max);
        } else {
            item.energyShieldBonus = template.energyShieldBonus;
        }
    }

    // Roll percentage health bonus
    if (template.healthBonusPercentRange) {
        const percent = getRandomInt(template.healthBonusPercentRange.min, template.healthBonusPercentRange.max);
        item.healthBonusPercent = percent / 100;
        item.healthBonusPercentDisplay = percent;
    } else if (template.healthBonusPercent !== undefined) {
        item.healthBonusPercent = template.healthBonusPercent;
        item.healthBonusPercentDisplay = item.healthBonusPercent * 100;
    }

    // Roll percentage energy shield bonus
    if (template.energyShieldBonusPercentRange) {
        const percent = getRandomInt(template.energyShieldBonusPercentRange.min, template.energyShieldBonusPercentRange.max);
        item.energyShieldBonusPercent = percent / 100;
        item.energyShieldBonusPercentDisplay = percent;
    } else if (template.energyShieldBonusPercent !== undefined) {
        item.energyShieldBonusPercent = template.energyShieldBonusPercent;
        item.energyShieldBonusPercentDisplay = item.energyShieldBonusPercent * 100;
    }

    // Roll attack speed modifier
    if (template.attackSpeedModifierRange) {
        const percent = getRandomInt(template.attackSpeedModifierRange.min, template.attackSpeedModifierRange.max);
        item.attackSpeedModifier = percent / 100;
        item.attackSpeedModifierPercent = percent;
    }

    // Roll critical chance modifier
    if (template.criticalChanceModifierRange) {
        const percent = getRandomInt(template.criticalChanceModifierRange.min, template.criticalChanceModifierRange.max);
        item.criticalChanceModifier = percent / 100;
        item.criticalChanceModifierPercent = percent;
    }

    // Roll critical multiplier modifier
    if (template.criticalMultiplierModifierRange) {
        const percent = getRandomInt(template.criticalMultiplierModifierRange.min, template.criticalMultiplierModifierRange.max);
        item.criticalMultiplierModifier = percent / 100;
        item.criticalMultiplierModifierPercent = percent;
    }

    // Roll precision
    if (template.precision) {
        if (typeof template.precision === 'object') {
            const value = getRandomInt(template.precision.min, template.precision.max);
            item.precision = value;
        } else {
            item.precision = template.precision;
        }
    }

    // Roll deflection
    if (template.deflection) {
        if (typeof template.deflection === 'object') {
            const value = getRandomInt(template.deflection.min, template.deflection.max);
            item.deflection = value;
        } else {
            item.deflection = template.deflection;
        }
    }

    // Roll health regeneration
    if (template.healthRegen) {
        if (typeof template.healthRegen === 'object') {
            const value = getRandomFloat(template.healthRegen.min, template.healthRegen.max);
            item.healthRegen = parseFloat(value.toFixed(2));
        } else {
            item.healthRegen = template.healthRegen;
        }
    }

    // Add passive skill bonuses if specified in template
    if (template.passiveBonuses) {
        item.passiveBonuses = {};
        
        // Apply exact passive bonuses if specified as fixed numbers
        for (const passiveName in template.passiveBonuses) {
            const bonusValue = template.passiveBonuses[passiveName];
            if (typeof bonusValue === 'number') {
                item.passiveBonuses[passiveName] = bonusValue;
            } 
            // Or apply random passive bonuses if specified as a range
            else if (typeof bonusValue === 'object' && bonusValue.min !== undefined && bonusValue.max !== undefined) {
                item.passiveBonuses[passiveName] = getRandomInt(bonusValue.min, bonusValue.max);
            }
        }
    }

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

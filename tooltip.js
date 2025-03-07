// ===============================
// TOOLTIP SYSTEM - GLOBAL APPROACH
// ===============================

// Keep the getItemTooltipContent function as it is since it just generates the content
function getItemTooltipContent(item, showRanges = false) {
    // Style the tooltip with sci-fi colors and modern formatting
    let content = `<div style="color: #e0f2ff; font-family: 'Orbitron', sans-serif; text-shadow: 0 0 5px rgba(0, 255, 204, 0.5); max-width: 300px;">`;
    
    // Item name with gradient background - fixed to prevent awkward wrapping
    content += `<div style="background: linear-gradient(to right, #00306e, #003f8f); padding: 5px; margin-bottom: 6px; border-left: 3px solid #00ffcc; border-radius: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                <strong style="font-size: 110%; color: #ffffff;">${item.name}</strong>
                </div>`;
    
    // Item type info with subtle background
    content += `<div style="background: rgba(0, 15, 40, 0.5); padding: 4px; margin-bottom: 6px; border-radius: 2px;">`;
    content += `<span style="color: #7fdbff;">Type:</span> ${item.type}<br>`;
    if (item.weaponType) {
        content += `<span style="color: #7fdbff;">Weapon Type:</span> ${item.weaponType}<br>`;
        if (item.bAttackSpeed !== undefined) {
            content += `<span style="color: #7fdbff;">Attack Speed:</span> ${item.bAttackSpeed}<br>`;
        }
    }
    content += `</div>`;
    
    // Show passive bonuses if any - only create section if there are bonuses
    if (item.passiveBonuses && Object.keys(item.passiveBonuses).length > 0) {
        let hasPassives = false;
        let passiveContent = `<div style="background: rgba(0, 255, 204, 0.1); padding: 4px; margin-bottom: 6px; border-radius: 2px; border-left: 2px solid #00ffcc;">`;
        passiveContent += `<span style="color: #00ffcc; font-weight: bold;">Passive Bonuses:</span><br>`;
        
        for (const passiveName in item.passiveBonuses) {
            const bonusValue = item.passiveBonuses[passiveName];
            // Ensure we're displaying a number and not an object
            const formattedValue = typeof bonusValue === 'object' ? 
                                  (bonusValue.value || bonusValue.min || 0) : 
                                  bonusValue;
            
            if (formattedValue > 0) {
                passiveContent += `<span style="color: #a6fff2;">+${formattedValue} to ${passiveName}</span><br>`;
                hasPassives = true;
            }
        }
        
        passiveContent += `</div>`;
        if (hasPassives) {
            content += passiveContent;
        }
    }
    
    // Stats section with organized formatting - only create if there are stats
    let statsContent = '';
    let hasStats = false;
    
    // Damage Types
    if (item.damageTypes && Object.keys(item.damageTypes).length > 0) {
        if (!hasStats) {
            statsContent += `<div style="background: rgba(0, 15, 40, 0.5); padding: 4px; margin-bottom: 6px; border-radius: 2px;">`;
            hasStats = true;
        }
        
        for (let damageType in item.damageTypes) {
            const damageValue = item.damageTypes[damageType];
            if (showRanges && typeof damageValue === 'object' && damageValue.min !== undefined && damageValue.max !== undefined) {
                statsContent += `<span style="color: #ff6b6b;">${capitalize(damageType)} Damage:</span> ${damageValue.min} - ${damageValue.max}<br>`;
            } else if (typeof damageValue === 'object') {
                // Handle cases where damageValue is an object without min/max
                statsContent += `<span style="color: #ff6b6b;">${capitalize(damageType)} Damage:</span> ${damageValue.value || 0}<br>`;
            } else {
                statsContent += `<span style="color: #ff6b6b;">${capitalize(damageType)} Damage:</span> ${damageValue}<br>`;
            }
        }
    }

    // Percentage Damage Modifiers
    if (item.statModifiers && item.statModifiers.damageTypes && Object.keys(item.statModifiers.damageTypes).length > 0) {
        if (!hasStats) {
            statsContent += `<div style="background: rgba(0, 15, 40, 0.5); padding: 4px; margin-bottom: 6px; border-radius: 2px;">`;
            hasStats = true;
        }
        
        for (let damageType in item.statModifiers.damageTypes) {
            const modifierValue = item.statModifiers.damageTypes[damageType];
            if (showRanges && typeof modifierValue === 'object' && modifierValue.min !== undefined && modifierValue.max !== undefined) {
                statsContent += `<span style="color: #ffd166;">+${modifierValue.min}% - +${modifierValue.max}% ${capitalize(damageType)} Damage</span><br>`;
            } else if (typeof modifierValue === 'object') {
                // Handle cases where modifierValue is an object without min/max
                statsContent += `<span style="color: #ffd166;">+${modifierValue.value || 0}% ${capitalize(damageType)} Damage</span><br>`;
            } else {
                statsContent += `<span style="color: #ffd166;">+${modifierValue}% ${capitalize(damageType)} Damage</span><br>`;
            }
        }
    }

    // Other Stat Modifiers
    if (item.statModifiers) {
        const percentageStats = ['attackSpeed', 'criticalChance', 'criticalMultiplier'];
        let hasOtherStats = false;
        
        for (let stat in item.statModifiers) {
            if (stat !== 'damageTypes') {
                hasOtherStats = true;
                break;
            }
        }
        
        if (hasOtherStats) {
            if (!hasStats) {
                statsContent += `<div style="background: rgba(0, 15, 40, 0.5); padding: 4px; margin-bottom: 6px; border-radius: 2px;">`;
                hasStats = true;
            }
            
            for (let stat in item.statModifiers) {
                if (stat !== 'damageTypes') {
                    const statValue = item.statModifiers[stat];
                    const statName = capitalize(stat);
                    if (
                        showRanges &&
                        typeof statValue === 'object' &&
                        statValue.min !== undefined &&
                        statValue.max !== undefined
                    ) {
                        if (percentageStats.includes(stat)) {
                            statsContent += `<span style="color: #56cfe1;">${statName}:</span> +${statValue.min}% - +${statValue.max}%<br>`;
                        } else {
                            statsContent += `<span style="color: #56cfe1;">${statName}:</span> +${statValue.min} - +${statValue.max}<br>`;
                        }
                    } else if (typeof statValue === 'object') {
                        // Handle cases where statValue is an object without min/max
                        if (percentageStats.includes(stat)) {
                            statsContent += `<span style="color: #56cfe1;">${statName}:</span> +${statValue.value || 0}%<br>`;
                        } else {
                            statsContent += `<span style="color: #56cfe1;">${statName}:</span> +${statValue.value || 0}<br>`;
                        }
                    } else if (typeof statValue === 'number' || typeof statValue === 'string') {
                        if (percentageStats.includes(stat)) {
                            statsContent += `<span style="color: #56cfe1;">${statName}:</span> +${statValue}%<br>`;
                        } else {
                            statsContent += `<span style="color: #56cfe1;">${statName}:</span> +${statValue}<br>`;
                        }
                    }
                }
            }
        }
    }

    // Defense Types
    if (item.defenseTypes && Object.keys(item.defenseTypes).length > 0) {
        if (!hasStats) {
            statsContent += `<div style="background: rgba(0, 15, 40, 0.5); padding: 4px; margin-bottom: 6px; border-radius: 2px;">`;
            hasStats = true;
        }
        
        for (let defenseType in item.defenseTypes) {
            const defenseValue = item.defenseTypes[defenseType];
            if (
                showRanges &&
                typeof defenseValue === 'object' &&
                defenseValue.min !== undefined &&
                defenseValue.max !== undefined
            ) {
                statsContent += `<span style="color: #64dfdf;">+${defenseValue.min} - +${defenseValue.max} ${capitalize(defenseType)}</span><br>`;
            } else if (typeof defenseValue === 'object') {
                // Fix for [object Object] display - show min value if available
                const minVal = defenseValue.min !== undefined ? defenseValue.min : 0;
                const maxVal = defenseValue.max !== undefined ? defenseValue.max : minVal;
                
                if (minVal === maxVal) {
                    statsContent += `<span style="color: #64dfdf;">+${minVal} ${capitalize(defenseType)}</span><br>`;
                } else {
                    statsContent += `<span style="color: #64dfdf;">+${minVal} - +${maxVal} ${capitalize(defenseType)}</span><br>`;
                }
            } else {
                statsContent += `<span style="color: #64dfdf;">+${defenseValue} ${capitalize(defenseType)}</span><br>`;
            }
        }
    }
    
    if (hasStats) {
        statsContent += `</div>`;
        content += statsContent;
    }

    // Health and shield section - only create if there are stats
    let healthShieldContent = '';
    let hasHealthShield = false;
    
    // Health Bonuses
    if (item.healthBonus !== undefined) {
        if (!hasHealthShield) {
            healthShieldContent += `<div style="background: rgba(0, 15, 40, 0.5); padding: 4px; margin-bottom: 6px; border-radius: 2px;">`;
            hasHealthShield = true;
        }
        
        if (
            showRanges &&
            typeof item.healthBonus === 'object' &&
            item.healthBonus.min !== undefined &&
            item.healthBonus.max !== undefined
        ) {
            healthShieldContent += `<span style="color: #48bf91;">+${item.healthBonus.min} - +${item.healthBonus.max} Health</span><br>`;
        } else if (typeof item.healthBonus === 'object') {
            // Fix for [object Object] display
            const minVal = item.healthBonus.min !== undefined ? item.healthBonus.min : 0;
            const maxVal = item.healthBonus.max !== undefined ? item.healthBonus.max : minVal;
            
            if (minVal === maxVal) {
                healthShieldContent += `<span style="color: #48bf91;">+${minVal} Health</span><br>`;
            } else {
                healthShieldContent += `<span style="color: #48bf91;">+${minVal} - +${maxVal} Health</span><br>`;
            }
        } else {
            healthShieldContent += `<span style="color: #48bf91;">+${item.healthBonus} Health</span><br>`;
        }
    }
    if (item.healthBonusPercentRange !== undefined) {
        if (!hasHealthShield) {
            healthShieldContent += `<div style="background: rgba(0, 15, 40, 0.5); padding: 4px; margin-bottom: 6px; border-radius: 2px;">`;
            hasHealthShield = true;
        }
        
        if (
            showRanges &&
            typeof item.healthBonusPercentRange === 'object' &&
            item.healthBonusPercentRange.min !== undefined &&
            item.healthBonusPercentRange.max !== undefined
        ) {
            healthShieldContent += `<span style="color: #48bf91;">+${item.healthBonusPercentRange.min}% - +${item.healthBonusPercentRange.max}% Health</span><br>`;
        } else if (typeof item.healthBonusPercentRange === 'object') {
            // Fix for [object Object] display
            const minVal = item.healthBonusPercentRange.min !== undefined ? item.healthBonusPercentRange.min : 0;
            const maxVal = item.healthBonusPercentRange.max !== undefined ? item.healthBonusPercentRange.max : minVal;
            
            if (minVal === maxVal) {
                healthShieldContent += `<span style="color: #48bf91;">+${minVal}% Health</span><br>`;
            } else {
                healthShieldContent += `<span style="color: #48bf91;">+${minVal}% - +${maxVal}% Health</span><br>`;
            }
        } else {
            healthShieldContent += `<span style="color: #48bf91;">+${item.healthBonusPercentRange}% Health</span><br>`;
        }
    }

    // Health Regen
    if (item.healthRegen !== undefined) {
        if (!hasHealthShield) {
            healthShieldContent += `<div style="background: rgba(0, 15, 40, 0.5); padding: 4px; margin-bottom: 6px; border-radius: 2px;">`;
            hasHealthShield = true;
        }
        
        if (
            showRanges &&
            typeof item.healthRegen === 'object' &&
            item.healthRegen.min !== undefined &&
            item.healthRegen.max !== undefined
        ) {
            healthShieldContent += `<span style="color: #48bf91;">Health Regeneration:</span> +${item.healthRegen.min.toFixed(2)} - +${item.healthRegen.max.toFixed(2)} per second<br>`;
        } else {
            healthShieldContent += `<span style="color: #48bf91;">Health Regeneration:</span> +${item.healthRegen.toFixed(2)} per second<br>`;
        }
    }
    
    // If we have health/shield content, close the div and add it to the main content
    if (hasHealthShield) {
        healthShieldContent += `</div>`;
        content += healthShieldContent;
    }

    // Energy Shield Bonuses
    if (item.energyShieldBonus !== undefined) {
        if (!hasHealthShield) {
            healthShieldContent += `<div style="background: rgba(0, 15, 40, 0.5); padding: 4px; margin-bottom: 6px; border-radius: 2px;">`;
            hasHealthShield = true;
        }
        
        if (
            showRanges &&
            typeof item.energyShieldBonus === 'object' &&
            item.energyShieldBonus.min !== undefined &&
            item.energyShieldBonus.max !== undefined
        ) {
            healthShieldContent += `<span style="color: #06d6a0;">+${item.energyShieldBonus.min} - +${item.energyShieldBonus.max} Energy Shield</span><br>`;
        } else if (typeof item.energyShieldBonus === 'object') {
            // Fix for [object Object] display
            const minVal = item.energyShieldBonus.min !== undefined ? item.energyShieldBonus.min : 0;
            const maxVal = item.energyShieldBonus.max !== undefined ? item.energyShieldBonus.max : minVal;
            
            if (minVal === maxVal) {
                healthShieldContent += `<span style="color: #06d6a0;">+${minVal} Energy Shield</span><br>`;
            } else {
                healthShieldContent += `<span style="color: #06d6a0;">+${minVal} - +${maxVal} Energy Shield</span><br>`;
            }
        } else {
            healthShieldContent += `<span style="color: #06d6a0;">+${item.energyShieldBonus} Energy Shield</span><br>`;
        }
    }
    
    // Energy Shield Percentage Bonuses
    if (item.energyShieldBonusPercentRange !== undefined) {
        if (!hasHealthShield) {
            healthShieldContent += `<div style="background: rgba(0, 15, 40, 0.5); padding: 4px; margin-bottom: 6px; border-radius: 2px;">`;
            hasHealthShield = true;
        }
        
        if (
            showRanges &&
            typeof item.energyShieldBonusPercentRange === 'object' &&
            item.energyShieldBonusPercentRange.min !== undefined &&
            item.energyShieldBonusPercentRange.max !== undefined
        ) {
            healthShieldContent += `<span style="color: #06d6a0;">+${item.energyShieldBonusPercentRange.min}% - +${item.energyShieldBonusPercentRange.max}% Energy Shield</span><br>`;
        } else if (typeof item.energyShieldBonusPercentRange === 'object') {
            // Fix for [object Object] display
            const minVal = item.energyShieldBonusPercentRange.min !== undefined ? item.energyShieldBonusPercentRange.min : 0;
            const maxVal = item.energyShieldBonusPercentRange.max !== undefined ? item.energyShieldBonusPercentRange.max : minVal;
            
            if (minVal === maxVal) {
                healthShieldContent += `<span style="color: #06d6a0;">+${minVal}% Energy Shield</span><br>`;
            } else {
                healthShieldContent += `<span style="color: #06d6a0;">+${minVal}% - +${maxVal}% Energy Shield</span><br>`;
            }
        } else {
            healthShieldContent += `<span style="color: #06d6a0;">+${item.energyShieldBonusPercentRange}% Energy Shield</span><br>`;
        }
    }

    // Attack Speed - only add section if it has content
    if (item.attackSpeedModifier !== undefined) {
        content += `<div style="background: rgba(0, 15, 40, 0.5); padding: 4px; margin-bottom: 6px; border-radius: 2px;">`;
        content += `<span style="color: #ffd166;">Attack Speed:</span> +${(item.attackSpeedModifier * 100).toFixed(2)}%<br>`;
        content += `</div>`;
    }
    
    if (showRanges && item.attackSpeedModifierRange) {
        content += `<div style="background: rgba(0, 15, 40, 0.5); padding: 4px; margin-bottom: 6px; border-radius: 2px;">`;
        content += `<span style="color: #ffd166;">Attack Speed:</span> +${item.attackSpeedModifierRange.min}% - +${item.attackSpeedModifierRange.max}%<br>`;
        content += `</div>`;
    }

    // Critical Chance - only add section if it has content
    if (item.criticalChanceModifier !== undefined) {
        content += `<div style="background: rgba(0, 15, 40, 0.5); padding: 4px; margin-bottom: 6px; border-radius: 2px;">`;
        content += `<span style="color: #ffd166;">Critical Chance:</span> +${(item.criticalChanceModifier * 100).toFixed(2)}%<br>`;
        content += `</div>`;
    }
    
    if (showRanges && item.criticalChanceModifierRange) {
        content += `<div style="background: rgba(0, 15, 40, 0.5); padding: 4px; margin-bottom: 6px; border-radius: 2px;">`;
        content += `<span style="color: #ffd166;">Critical Chance:</span> +${item.criticalChanceModifierRange.min}% - +${item.criticalChanceModifierRange.max}%<br>`;
        content += `</div>`;
    }

    // Critical Multiplier - only add section if it has content
    if (item.criticalMultiplierModifier !== undefined) {
        content += `<div style="background: rgba(0, 15, 40, 0.5); padding: 4px; margin-bottom: 6px; border-radius: 2px;">`;
        content += `<span style="color: #ffd166;">Critical Multiplier:</span> +${(item.criticalMultiplierModifier * 100).toFixed(2)}%<br>`;
        content += `</div>`;
    }
    
    if (showRanges && item.criticalMultiplierModifierRange) {
        content += `<div style="background: rgba(0, 15, 40, 0.5); padding: 4px; margin-bottom: 6px; border-radius: 2px;">`;
        content += `<span style="color: #ffd166;">Critical Multiplier:</span> +${item.criticalMultiplierModifierRange.min}% - +${item.criticalMultiplierModifierRange.max}%<br>`;
        content += `</div>`;
    }

    // Precision - only add section if it has content
    if (item.precision !== undefined) {
        content += `<div style="background: rgba(0, 15, 40, 0.5); padding: 4px; margin-bottom: 6px; border-radius: 2px;">`;
        if (
            typeof item.precision === 'object' &&
            item.precision.min !== undefined &&
            item.precision.max !== undefined
        ) {
            content += `<span style="color: #ffd166;">Precision:</span> +${item.precision.min} - +${item.precision.max}<br>`;
        } else {
            content += `<span style="color: #ffd166;">Precision:</span> +${item.precision}<br>`;
        }
        content += `</div>`;
    }

    // Deflection - only add section if it has content
    if (item.deflection !== undefined) {
        content += `<div style="background: rgba(0, 15, 40, 0.5); padding: 4px; margin-bottom: 6px; border-radius: 2px;">`;
        if (
            typeof item.deflection === 'object' &&
            item.deflection.min !== undefined &&
            item.deflection.max !== undefined
        ) {
            content += `<span style="color: #ffd166;">Deflection:</span> +${item.deflection.min} - +${item.deflection.max}<br>`;
        } else {
            content += `<span style="color: #ffd166;">Deflection:</span> +${item.deflection}<br>`;
        }
        content += `</div>`;
    }

    // Level Requirement - only add section if it has content
    if (item.levelRequirement !== undefined) {
        content += `<div style="background: rgba(0, 15, 40, 0.5); padding: 4px; margin-bottom: 6px; border-radius: 2px;">`;
        content += `<span style="color: #ffd166;">Level Requirement:</span> ${item.levelRequirement}<br>`;
        content += `</div>`;
    }

    // Description - only add section if it has content
    if (item.description) {
        content += `<div style="background: rgba(0, 15, 40, 0.5); padding: 4px; margin-bottom: 6px; border-radius: 2px;">`;
        content += `<em style="color: #7fdbff;">${item.description}</em><br>`;
        content += `</div>`;
    }
    
    content += `</div>`;
    return content;
}

// TOOLTIP DEBUGGING UTILITIES
const DEBUG_TOOLTIPS = true;

function debugTooltip(message, data = {}) {
    if (!DEBUG_TOOLTIPS) return;
    
    // Format the message with a timestamp
    const timestamp = new Date().toISOString().substr(11, 12); // HH:MM:SS.mmm format
    console.log(`[Tooltip Debug ${timestamp}] ${message}`, data);
}

// COMPLETELY NEW TOOLTIP IMPLEMENTATION
// This creates a single global tooltip that moves around instead of creating multiple tooltips
document.addEventListener('DOMContentLoaded', () => {
    debugTooltip('Initializing global tooltip system');
    
    // DETECT AND DISABLE OTHER TOOLTIP SYSTEMS
    disableCompetingTooltipSystems();
    
    // Create a single global tooltip element
    const globalTooltip = document.createElement('div');
    globalTooltip.id = 'global-tooltip';
    globalTooltip.className = 'tooltip';
    globalTooltip.style.display = 'none';
    globalTooltip.style.position = 'fixed';
    globalTooltip.style.zIndex = '99999';
    globalTooltip.style.background = 'rgba(0, 0, 0, 0.95)';
    globalTooltip.style.color = 'white';
    globalTooltip.style.border = '1px solid #00ffcc';
    globalTooltip.style.borderRadius = '4px';
    globalTooltip.style.padding = '8px';
    globalTooltip.style.maxWidth = '250px';
    globalTooltip.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.7)';
    globalTooltip.style.pointerEvents = 'none'; // Prevent tooltip from blocking mouse events
    document.body.appendChild(globalTooltip);
    
    // Track current open tooltip to prevent flicker
    let currentTarget = null;
    let isTooltipVisible = false;
    
    // Add a class to all existing tooltip elements to help identify them
    document.querySelectorAll('.tooltip').forEach(tooltip => {
        if (tooltip.id !== 'global-tooltip') {
            tooltip.classList.add('legacy-tooltip');
            tooltip.style.opacity = '0'; // Make sure they're invisible
            debugTooltip('Marked legacy tooltip', {
                element: tooltip,
                parentElement: tooltip.parentElement ? tooltip.parentElement.tagName : 'none'
            });
        }
    });
    
    // Create a MutationObserver to monitor for .tooltip elements being added to the DOM
    const tooltipObserver = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // Element node
                        // If the added node is a tooltip element
                        if (node.classList && node.classList.contains('tooltip') && node.id !== 'global-tooltip') {
                            node.classList.add('legacy-tooltip');
                            node.style.opacity = '0';
                            node.style.pointerEvents = 'none';
                            debugTooltip('Found new tooltip element, making it invisible', {
                                element: node,
                                parent: node.parentElement ? node.parentElement.tagName : 'none'
                            });
                        }
                        
                        // Check descendants for tooltip elements
                        if (node.querySelectorAll) {
                            node.querySelectorAll('.tooltip').forEach(tooltip => {
                                if (tooltip.id !== 'global-tooltip') {
                                    tooltip.classList.add('legacy-tooltip');
                                    tooltip.style.opacity = '0';
                                    tooltip.style.pointerEvents = 'none';
                                    debugTooltip('Found nested tooltip element, making it invisible', {
                                        element: tooltip,
                                        parent: tooltip.parentElement ? tooltip.parentElement.tagName : 'none'
                                    });
                                }
                            });
                        }
                    }
                });
            }
        });
    });
    
    // Start observing the document
    tooltipObserver.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // Define hideAllLegacyTooltips function
    function hideAllLegacyTooltips() {
        const tooltips = document.querySelectorAll('.legacy-tooltip, .tooltip:not(#global-tooltip)');
        if (tooltips.length > 0) {
            debugTooltip(`Hiding ${tooltips.length} legacy tooltip elements`);
            tooltips.forEach(tooltip => {
                tooltip.style.opacity = '0';
                tooltip.style.pointerEvents = 'none';
                tooltip.style.display = 'none';
            });
        }
        
        // Check for tooltips directly attached to body (which is likely the shop problem)
        const directBodyTooltips = Array.from(document.body.children).filter(
            child => child.classList && child.classList.contains('tooltip') && child.id !== 'global-tooltip'
        );
        
        if (directBodyTooltips.length > 0) {
            debugTooltip(`Found ${directBodyTooltips.length} tooltips directly attached to body - removing them`, {
                elements: directBodyTooltips
            });
            
            directBodyTooltips.forEach(tooltip => {
                document.body.removeChild(tooltip);
            });
        }
    }
    
    // Call it initially
    hideAllLegacyTooltips();
    
    // Call it periodically to catch any that might appear
    setInterval(hideAllLegacyTooltips, 100);
    
    // DEBUG: Monitor ALL tooltips that appear in the DOM
    setupTooltipDebugMonitor();

    // Use event delegation for better performance
    document.body.addEventListener('mouseenter', handleMouseEvent, true);
    document.body.addEventListener('mouseleave', handleMouseEvent, true);
    document.body.addEventListener('click', hideTooltip, true);
    
    // Handle window resize to reposition tooltip if needed
    window.addEventListener('resize', () => {
        if (currentTarget && isTooltipVisible) {
            positionTooltip(currentTarget);
        }
    });
    
    // Handle scrolling to reposition tooltip if needed
    document.addEventListener('scroll', () => {
        if (currentTarget && isTooltipVisible) {
            positionTooltip(currentTarget);
        }
    }, true);

    function handleMouseEvent(event) {
        // Find the closest element with a tooltip
        const target = findTooltipTarget(event.target);
        
        if (!target) return;
        
        if (event.type === 'mouseenter') {
            debugTooltip('Mouse enter on element with tooltip', { 
                elementId: target.id || 'no-id',
                elementClass: target.className,
                elementTagName: target.tagName
            });
            
            // Clear any pending hide operations
            if (hideTimeout) {
                clearTimeout(hideTimeout);
                hideTimeout = null;
            }
            
            // Always update currentTarget and show tooltip
            // This ensures tooltip is updated when moving between elements
            currentTarget = target;
            showTooltip(target);
        } else if (event.type === 'mouseleave') {
            debugTooltip('Mouse leave from element with tooltip', { 
                elementId: target.id || 'no-id',
                elementClass: target.className
            });
            
            // Use a short delay to allow for smooth transitions between tooltips
            hideTimeout = setTimeout(() => {
                if (target === currentTarget) {
                    hideTooltip();
                }
            }, 50);
        }
    }

    function findTooltipTarget(element) {
        let current = element;
        
        // Traverse up the DOM tree
        while (current && current !== document.body) {
            // Check if the current element has a tooltip
            if (current.dataset && current.dataset.hasTooltip === 'true') {
                return current;
            }
            
            // Special case handling for common containers
            if (current.classList) {
                // Recipe cards, passive cards, and shop items should all trigger tooltips
                // even if the data-has-tooltip is on a parent element
                if (current.classList.contains('recipe-card') || 
                    current.classList.contains('passive-card') ||
                    current.classList.contains('shop-item')) {
                    
                    if (current.hasAttribute('data-has-tooltip')) {
                        return current;
                    }
                }
            }
            
            current = current.parentElement;
        }
        
        return null;
    }

    function showTooltip(target) {
        // Find tooltip content
        let content = '';
        
        debugTooltip('Finding tooltip content for', { 
            targetElement: target,
            hasTooltipAttr: target.hasAttribute('data-has-tooltip'),
            hasTooltipContent: target.hasAttribute('data-tooltip-content'),
            hasChildTooltip: target.querySelector('.tooltip') ? true : false,
            source: target.getAttribute('data-tooltip-source') || 'unknown'
        });
        
        // First priority: data-tooltip-content attribute
        if (target.hasAttribute('data-tooltip-content')) {
            content = target.getAttribute('data-tooltip-content');
            debugTooltip('Found tooltip content in data-tooltip-content attribute', {
                contentLength: content.length,
                preview: content.substring(0, 50) + '...'
            });
        }
        // Second priority: look for a child element with tooltip class
        else {
            let tooltipElement = target.querySelector('.tooltip');
            if (tooltipElement) {
                content = tooltipElement.innerHTML;
                debugTooltip('Found tooltip content in child element', {
                    element: tooltipElement,
                    contentLength: content.length,
                    preview: content.substring(0, 50) + '...'
                });
            } else {
                debugTooltip('No tooltip content found for element', { element: target });
                return; // No content found, exit
            }
        }

        // Set the tooltip content
        globalTooltip.innerHTML = content;
        globalTooltip.style.display = 'block';
        
        // Position the tooltip
        positionTooltip(target);
        
        isTooltipVisible = true;
    }
    
    function positionTooltip(target) {
        const targetRect = target.getBoundingClientRect();
        
        // Reset tooltip position for proper size calculation
        globalTooltip.style.left = '0px';
        globalTooltip.style.top = '0px';
        
        // Get tooltip dimensions after content is set
        const tooltipRect = globalTooltip.getBoundingClientRect();
        
        // Position tooltip to the right of the target by default
        let left = targetRect.right + 5; // Small gap
        let top = targetRect.top;
        
        // Check if tooltip would go off the right edge
        if (left + tooltipRect.width > window.innerWidth - 5) {
            // Try positioning to the left
            left = targetRect.left - tooltipRect.width - 5;
            
            // If that would go off the left edge, position below
            if (left < 5) {
                left = Math.max(5, Math.min(window.innerWidth - tooltipRect.width - 5, targetRect.left));
                top = targetRect.bottom + 5;
                
                // If that would go off the bottom edge, position above
                if (top + tooltipRect.height > window.innerHeight - 5) {
                    top = targetRect.top - tooltipRect.height - 5;
                }
            }

        }
        
        // Final bounds checking
        top = Math.max(5, Math.min(window.innerHeight - tooltipRect.height - 5, top));
        
        // Apply the position
        globalTooltip.style.left = `${left}px`;
        globalTooltip.style.top = `${top}px`;
        
        debugTooltip('Positioned tooltip', { 
            left, 
            top, 
            targetRect: {
                left: targetRect.left,
                top: targetRect.top,
                right: targetRect.right,
                bottom: targetRect.bottom,
                width: targetRect.width,
                height: targetRect.height
            },
            tooltipDimensions: {
                width: tooltipRect.width,
                height: tooltipRect.height
            }
        });
    }

    function hideTooltip() {
        globalTooltip.style.display = 'none';
        isTooltipVisible = false;
        currentTarget = null;
        debugTooltip('Hiding tooltip');
    }
    
    // Scan for elements with tooltips that should be visible immediately
    function initializeImmediateTooltips() {
        const immediateTooltips = document.querySelectorAll('[data-has-tooltip-immediate]');
        debugTooltip(`Found ${immediateTooltips.length} elements with immediate tooltips`);
        
        immediateTooltips.forEach(element => {
            showTooltip(element);
        });
    }
    
    // Add a mutation observer to detect new tooltip elements
    const observer = new MutationObserver(mutations => {
        let newTooltipElements = [];
        
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) { // Element node
                    // Check if this new element should have an immediate tooltip
                    if (node.hasAttribute('data-has-tooltip-immediate')) {
                        newTooltipElements.push(node);
                    }
                    
                    // Check children of added node
                    node.querySelectorAll('[data-has-tooltip-immediate]').forEach(element => {
                        newTooltipElements.push(element);
                    });
                }
            });
        });
        
        if (newTooltipElements.length > 0) {
            debugTooltip(`Detected ${newTooltipElements.length} new elements with immediate tooltips`);
            newTooltipElements.forEach(element => {
                showTooltip(element);
            });
        }
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // Initialize any immediate tooltips that exist on page load
    initializeImmediateTooltips();
    
    // DEBUG: Create a global reference to our tooltip for debugging
    window._globalTooltip = globalTooltip;
});

// TOOLTIP DEBUG MONITOR 
// This monitors all tooltip elements that appear in the DOM
function setupTooltipDebugMonitor() {
    if (!DEBUG_TOOLTIPS) return;
    
    debugTooltip('Setting up tooltip debug monitor');
    
    // Track all tooltips that exist at startup
    const existingTooltips = document.querySelectorAll('.tooltip');
    debugTooltip(`Found ${existingTooltips.length} existing tooltip elements at startup`);
    
    // Monitor for any tooltips being added to the DOM
    const tooltipObserver = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) { // Element node
                    // If the node itself is a tooltip
                    if (node.classList && node.classList.contains('tooltip')) {
                        reportTooltipCreation(node);
                    }
                    
                    // Check for tooltips within the added node
                    const tooltipsInNode = node.querySelectorAll('.tooltip');
                    tooltipsInNode.forEach(tooltip => {
                        reportTooltipCreation(tooltip);
                    });
                }
            });
        });
    });
    
    tooltipObserver.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // Monitor style changes on all tooltips to detect when they're shown or positioned
    const tooltipStyleObserver = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'attributes' && 
                mutation.attributeName === 'style' &&
                mutation.target.classList.contains('tooltip')) {
                
                const tooltip = mutation.target;
                const display = window.getComputedStyle(tooltip).display;
                
                // Only report when tooltip becomes visible
                if (display !== 'none') {
                    reportTooltipVisibility(tooltip);
                }
            }
        });
    });
    
    tooltipStyleObserver.observe(document.body, {
        attributes: true,
        attributeFilter: ['style'],
        subtree: true
    });
    
    function reportTooltipCreation(tooltip) {
        const isGlobalTooltip = tooltip.id === 'global-tooltip';
        const parent = tooltip.parentElement;
        const position = tooltip.style.position;
        const display = tooltip.style.display;
        
        debugTooltip(`${isGlobalTooltip ? 'GLOBAL' : 'LOCAL'} tooltip created`, {
            tooltipId: tooltip.id || 'no-id',
            parent: parent ? {
                tagName: parent.tagName,
                id: parent.id || 'no-id',
                className: parent.className
            } : 'no-parent',
            position,
            display,
            content: tooltip.innerHTML.substring(0, 50) + (tooltip.innerHTML.length > 50 ? '...' : ''),
            stackTrace: new Error().stack // Get stack trace
        });
    }
    
    function reportTooltipVisibility(tooltip) {
        const isGlobalTooltip = tooltip.id === 'global-tooltip';
        const rect = tooltip.getBoundingClientRect();
        const style = window.getComputedStyle(tooltip);
        
        debugTooltip(`${isGlobalTooltip ? 'GLOBAL' : 'LOCAL'} tooltip shown`, {
            tooltipId: tooltip.id || 'no-id',
            position: {
                left: rect.left,
                top: rect.top,
                width: rect.width,
                height: rect.height
            },
            styles: {
                position: style.position,
                zIndex: style.zIndex,
                display: style.display,
                opacity: style.opacity
            }
        });
    }
}

// Helper function (keep as is)
function capitalize(str) {
    if (typeof str !== 'string' || str.length === 0) {
        return '';
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Export functions that need to be accessed from other files
window.getItemTooltipContent = getItemTooltipContent;

// Function to detect and disable any other tooltip systems
function disableCompetingTooltipSystems() {
    debugTooltip('Checking for competing tooltip systems');
    
    // 1. Check for inline tooltip event handlers on elements
    const elementsWithTooltipEvents = document.querySelectorAll('[onmouseover], [onmouseenter]');
    debugTooltip(`Found ${elementsWithTooltipEvents.length} elements with potential inline tooltip handlers`);
    
    // 2. Check for existing .tooltip elements that aren't part of our system
    const existingTooltips = document.querySelectorAll('.tooltip');
    if (existingTooltips.length > 0) {
        debugTooltip(`Found ${existingTooltips.length} existing tooltip elements`);
        
        // Mark all existing tooltips to track them
        existingTooltips.forEach((tooltip, index) => {
            if (!tooltip.id) {
                tooltip.dataset.oldTooltipId = `old-tooltip-${index}`;
            }
        });
    }
    
    // 3. Block any existing mouseover/mouseenter handlers on elements with tooltips
    const elementsWithTooltips = document.querySelectorAll('[data-has-tooltip]');
    debugTooltip(`Found ${elementsWithTooltips.length} elements with data-has-tooltip attribute`);
    
    // 4. Override any script-based tooltip systems by intercepting their event handlers
    // This is a bit aggressive, but we need to ensure our system is the only one active
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
        // If it's a mouse event that might trigger tooltips, log it for debugging
        if (type === 'mouseover' || type === 'mouseenter' || type === 'mousemove') {
            debugTooltip(`Intercepted event listener: ${type}`, {
                element: this.tagName ? `${this.tagName}${this.id ? '#'+this.id : ''}` : 'non-element',
                hasTooltip: this.hasAttribute ? this.hasAttribute('data-has-tooltip') : false
            });
            
            // If this element has our tooltip attribute, we might want to block competing handlers
            if (this.hasAttribute && this.hasAttribute('data-has-tooltip')) {
                debugTooltip('Potential competing tooltip handler detected on element with our tooltip');
                
                // Optionally wrap the listener to prevent it from showing another tooltip
                const wrappedListener = function(event) {
                    // Allow the event to propagate but log it
                    debugTooltip('Competing tooltip event fired', {
                        type: event.type,
                        target: event.target.tagName
                    });
                    
                    // Call original listener but capture any errors
                    try {
                        return listener.apply(this, arguments);
                    } catch (e) {
                        debugTooltip('Error in competing tooltip handler', { error: e.message });
                    }
                };
                
                // Call the original addEventListener with our wrapped listener
                return originalAddEventListener.call(this, type, wrappedListener, options);
            }
        }
        
        // Call original method for all other event types
        return originalAddEventListener.call(this, type, listener, options);
    };
    
    // Clear any tooltip-related CSS that might interfere with our system
    removeLegacyTooltipCSS();
}

// Remove any existing CSS rules for tooltips that might interfere
function removeLegacyTooltipCSS() {
    // Iterate through stylesheets to find and disable tooltip rules
    for (let i = 0; i < document.styleSheets.length; i++) {
        try {
            const sheet = document.styleSheets[i];
            const rules = sheet.cssRules || sheet.rules;
            
            if (!rules) continue;
            
            // Track tooltip-related rules we found
            const tooltipRuleIndices = [];
            
            for (let j = 0; j < rules.length; j++) {
                const rule = rules[j];
                // Check if this is a rule that affects tooltips
                if (rule.selectorText && 
                   (rule.selectorText.includes('.tooltip') || 
                    rule.selectorText.includes('[data-has-tooltip]') ||
                    rule.selectorText.includes(':hover'))) {
                    
                    debugTooltip('Found tooltip CSS rule', {
                        selector: rule.selectorText,
                        stylesheet: sheet.href || 'inline style'
                    });
                    
                    tooltipRuleIndices.push(j);
                }
            }
            
            // Remove rules in reverse order to avoid index shifting
            tooltipRuleIndices.reverse().forEach(index => {
                try {
                    // Don't actually delete the rules, just log them
                    debugTooltip('Would remove CSS rule', {
                        selector: rules[index].selectorText,
                        index: index
                    });
                    // Uncomment to actually remove the rules
                    // sheet.deleteRule(index);
                } catch (e) {
                    debugTooltip('Error removing CSS rule', { error: e.message });
                }
            });
        } catch (e) {
            // Some stylesheets may not be accessible due to CORS
            debugTooltip('Error accessing stylesheet', { error: e.message });
        }
    }
}

// Modify the delve bag tooltip handler to use existing showTooltip function
document.addEventListener('mouseover', function(e) {
    // Find the closest element with data-has-tooltip attribute
    let current = e.target;
    let tooltipElement = null;
    
    // Traverse up the DOM tree to find tooltip element
    while (current && current !== document.body) {
        if (current.dataset && current.dataset.hasTooltip === 'true') {
            tooltipElement = current;
            break;
        }
        current = current.parentElement;
    }
    
    if (tooltipElement) {
        // Special case for delve bag items
        if (tooltipElement.dataset.tooltipSource === 'delve-bag-item' && tooltipElement.dataset.itemData) {
            try {
                // Parse the item reference data
                const itemRef = JSON.parse(tooltipElement.dataset.itemData);
                
                // Find the actual item in the delve bag
                if (window.delveBag && window.delveBag.items) {
                    const delveBagItem = window.delveBag.items.find(item => 
                        item.name === itemRef.name && 
                        (item.id === itemRef.id || !itemRef.id)
                    );
                    
                    if (delveBagItem) {
                        const tooltipContent = getItemTooltipContent(delveBagItem);
                        showTooltip(tooltipContent, tooltipElement);
                    }
                }
            } catch (err) {
                console.error('Error showing delve bag tooltip:', err);
            }
        }
    }
});
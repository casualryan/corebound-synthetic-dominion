// Enemy templates (browser fallback). In Vite, enemies are provided by window.enemies from src/enemies/index.js
// Use a mutable binding and update it once the Vite bundle finishes loading to avoid race conditions.
var enemies = window.enemies || [];

if (!window.enemies) {
    // Try to capture once DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        if (window.enemies && window.enemies.length) {
            enemies = window.enemies;
        }
    });
    // Ensure after load as well
    window.addEventListener('load', () => {
        if (window.enemies && window.enemies.length) {
            enemies = window.enemies;
        }
    });
    // Short polling window to catch late module resolution
    let tries = 0;
    const iv = setInterval(() => {
        if (window.enemies && window.enemies.length) {
            enemies = window.enemies;
            clearInterval(iv);
        }
        if (++tries > 50) clearInterval(iv);
    }, 100);
}
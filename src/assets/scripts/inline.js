import { THEME_KEY } from './utils.js';
import * as storage from './storage.js';

/**
 * Remove "No JavaScript" classname from root element.
 */
document.documentElement.classList.remove('no-js');

/**
 * Theming state initialisation.
 */
const storedTheme = storage.getItem(THEME_KEY);

if (storedTheme) {
  document.documentElement.dataset.theme = storedTheme;
}

/**
 * Cheat codes state initialisation.
 */
const konamiUnlocked = storage.getItem('konami');
const hedgehogUnlocked = storage.getItem('hedgehog');

if (konamiUnlocked) {
  document.documentElement.dataset.konamiUnlocked = 'true';
}

if (hedgehogUnlocked) {
  document.documentElement.dataset.hedgehogUnlocked = 'true';
}

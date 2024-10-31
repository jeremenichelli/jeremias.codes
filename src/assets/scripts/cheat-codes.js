import * as storage from './storage.js';
import { getVisibleThemeOptions, setTheme } from './theming.js';

/**
 * We are setting 750ms in between `keydown` events to keep the current
 * cheat code stored, if not the previous string is dropped.
 */
const TIME_THRESHOLD = 750;

let currentCheatCode = '';
let lastKeyDownTime = performance.now();

const unlockTheme = (theme) => {
  /**
   * Set unlocked state.
   */
  document.documentElement.dataset[`${theme}Unlocked`] = 'true';
  storage.setItem(theme, true);

  /**
   * Set theme and save state in storage.
   */
  setTheme(theme);
};

const lockTheme = (theme) => {
  /**
   * Set unlocked state.
   */
  delete document.documentElement.dataset[`${theme}Unlocked`]
  storage.removeItem(theme, true);
};

const setRandomTheme = () => {
  const currentTheme = document.documentElement.dataset.theme;
  const availableThemes = getVisibleThemeOptions()
    .map((option) => option.dataset.value)
    .filter((theme) => theme !== currentTheme && theme !== 'system');

  const randomIndex = Math.floor(Math.random() * availableThemes.length);
  const randomizedTheme = availableThemes[randomIndex];

  setTheme(randomizedTheme);
};

const resetAllCheatCodes = () => {
  lockTheme('konami');
  lockTheme('hedgehog');

  setTheme('system');
};

const goToTop = () => {
  window.scrollTo(0, 0);
};

const cheatCodes = [
  {
    code: 'ArrowUpArrowUpArrowDownArrowDownArrowLeftArrowRightArrowLeftArrowRightKeyBKeyA',
    action: () => {
      unlockTheme('konami');
    }
  },
  {
    code: 'ArrowUpArrowDownArrowLeftArrowRightKeyAEnter',
    action: () => {
      unlockTheme('hedgehog');
    }
  },
  {
    code: 'KeyGKeyAKeyMKeyEKeyOKeyVKeyEKeyR',
    action: () => {
      resetAllCheatCodes();
    }
  },
  {
    code: 'KeyRKeyAKeyNKeyDKeyOKeyM',
    action: () => {
      setRandomTheme();
    }
  },
  {
    code: 'KeyTKeyOKeyP',
    action: () => {
      goToTop();
    }
  }
];

/**
 * Update locked themes state on `localStorage` event.
 */
window.addEventListener('storage', function (event) {

  if (event.key === 'konami') {
    if (event.newValue === 'true') {
      unlockTheme('konami')
    } else {
      lockTheme('konami')
    }
  }

  if (event.key === 'hedgehog') {
    if (event.newValue === 'true') {
      unlockTheme('hedgehog')
    } else {
      lockTheme('hedgehog')
    }
  }
});

/**
 * Listen to key presses and detect cheat codes.
 */
document.body.addEventListener('keydown', (event) => {
  const now = performance.now();

  if (now - lastKeyDownTime > TIME_THRESHOLD) {
    currentCheatCode = '';
  }

  currentCheatCode += event.code;

  cheatCodes.forEach(({ code, action }) => {
    if (currentCheatCode === code) {
      action();
    }
  });

  lastKeyDownTime = now;
});

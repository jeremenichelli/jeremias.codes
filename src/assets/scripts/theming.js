import * as storage from './storage.js';
import { THEME_KEY } from './utils.ts';

const themeButton = document.querySelector('.navigation__theme-button');
const themeMenuWrapper = document.querySelector('.theme-menu__wrapper');
const themeMenu = document.querySelector('.theme-menu');

/**
 * Enable user agent rendering of menu.
 */
themeMenuWrapper.classList.add('enabled');

/**
 * Method that returns all theme options presented in DOM.
 *
 * @returns {Element[]} All options.
 */
const getThemeOptions = () => {
  return Array.from(document.querySelectorAll('.theme-menu__item'));
};

/**
 * Method that returns only visible theme options.
 *
 * @returns {Element[]} Visible theme options.
 */
export const getVisibleThemeOptions = () => {
  return getThemeOptions().filter(
    (option) => getComputedStyle(option).display !== 'none'
  );
};

/**
 * This flag prevents multiple menu transitions from firing.
 */
let isMenuAnimating = false;

/**
 * Opens theme menu.
 */
const openThemeMenu = async () => {
  if (isMenuAnimating) return false;

  isMenuAnimating = true;

  /**
   * When transition ends, set height to auto to adapt to DOM mutations
   * and later focus on first theme option.
   */
  const onTransitionEnd = (event) => {
    if (event.propertyName === 'height') {
      themeMenuWrapper.style.setProperty('--height', `auto`);

      const themeOptions = getVisibleThemeOptions();
      themeOptions[0]?.focus();

      themeMenuWrapper.removeEventListener('transitionend', onTransitionEnd);

      isMenuAnimating = false;
    }
  };

  themeMenuWrapper.addEventListener('transitionend', onTransitionEnd);

  /**
   * Reset menu height and add expanded class to trigger opening transition.
   */
  themeMenuWrapper.style.setProperty('--height', `${themeMenu.scrollHeight}px`);
  themeMenuWrapper.style.setProperty('--opacity', `1`);

  themeMenuWrapper.setAttribute('aria-hidden', 'false');
  themeButton.setAttribute('aria-expanded', 'true');
};

/**
 * Closes theme menu.
 */
const closeThemeMenu = async (focusOnThemeButton = true) => {
  if (isMenuAnimating) return false;

  isMenuAnimating = true;

  /**
   * When height transition ends, focus on back to the theme menu button.
   */
  const onTransitionEnd = (event) => {
    if (event.propertyName === 'height') {
      if (focusOnThemeButton) {
        themeButton?.focus();
      }

      themeMenuWrapper.removeEventListener('transitionend', onTransitionEnd);

      isMenuAnimating = false;
    }
  };

  themeMenuWrapper.addEventListener('transitionend', onTransitionEnd);

  /**
   * We first set the initial height again because we can't transition from `auto` value,
   * later we wait for two paint rounds to avoid overriding the value during mid-transition.
   *
   * In the end we set it back to `0px`
   */
  themeMenuWrapper.style.setProperty('--height', `${themeMenu.scrollHeight}px`);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      themeMenuWrapper.style.setProperty('--height', `0px`);
      themeMenuWrapper.style.setProperty('--opacity', `0`);
    });
  });

  themeMenuWrapper.setAttribute('aria-hidden', 'true');
  themeButton.setAttribute('aria-expanded', 'false');
};

/**
 * Remove initial attributes to enable functionality
 * on theme button when JavaScript is available.
 */
themeButton?.removeAttribute('tabindex');
themeButton?.classList.add('enabled');

/**
 * Toggle theming menu on click.
 */
themeButton?.addEventListener('click', () => {
  const isExpanded =
    themeButton.getAttribute('aria-expanded') === 'true' ? true : false;

  if (isExpanded) {
    closeThemeMenu();
  } else {
    openThemeMenu();
  }
});

/**
 * Handles all related DOM modifications to set a theme menu in the site.
 *
 * @param {string} theme
 */
export const setTheme = (theme) => {
  const themeOptions = getThemeOptions();

  if (theme) {
    themeOptions.forEach((option) => {
      option?.setAttribute('aria-checked', 'false');
    });

    const themeOption = document.querySelector(`[data-value="${theme}"]`);
    themeOption?.setAttribute('aria-checked', 'true');

    document.documentElement.dataset.theme = theme;

    storage.setItem(THEME_KEY, theme);
  }
};

/**
 * Assign events to theme options.
 */
getThemeOptions().forEach((option) => {
  /**
   * If current theme same as option mark element as checked.
   */
  const currentTheme = document.documentElement.dataset.theme;
  const currentThemeOption = document.querySelector(
    `[data-value="${currentTheme}"]`
  );
  currentThemeOption?.setAttribute('aria-checked', 'true');

  option.addEventListener('click', (event) => {
    const theme = event.currentTarget.dataset.value;
    setTheme(theme);
  });

  option.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key == ' ') {
      event.preventDefault();
      const theme = event.currentTarget.dataset.value;
      setTheme(theme);
    }
  });
});

/**
 * Update theme on `localStorage` event.
 */
window.addEventListener('storage', function (event) {
  /**
   * Handle theme changes across tabs.
   */
  if (event.key === THEME_KEY) {
    setTheme(event.newValue);
  }
});

/**
 * Keyboard navigation for accessibility on theme menu.
 */
themeMenuWrapper.addEventListener('keydown', (event) => {
  const themeOptions = getVisibleThemeOptions();

  if (event.key == 'ArrowDown') {
    event.preventDefault();
    const focusedThemeOptionIndex = themeOptions.findIndex(
      (option) => option === document.activeElement
    );
    const nextIndex =
      focusedThemeOptionIndex + 1 === themeOptions.length
        ? 0
        : focusedThemeOptionIndex + 1;
    themeOptions[nextIndex]?.focus();
  }

  if (event.key == 'ArrowUp') {
    event.preventDefault();
    const focusedThemeOptionIndex = themeOptions.findIndex(
      (option) => option === document.activeElement
    );
    const nextIndex =
      focusedThemeOptionIndex === 0
        ? themeOptions.length - 1
        : focusedThemeOptionIndex - 1;
    themeOptions[nextIndex]?.focus();
  }

  if (event.key == 'Home') {
    event.preventDefault();
    themeOptions[0]?.focus();
  }

  if (event.key == 'End') {
    event.preventDefault();
    themeOptions[themeOptions.length - 1]?.focus();
  }

  if (event.key == 'Tab') {
    closeThemeMenu(false);
  }
});

/**
 * Close Menu when click outside.
 */
window.addEventListener(
  'click',
  (event) => {
    const isExpanded =
      themeButton.getAttribute('aria-expanded') == 'true' ? true : false;
    const isButton = event.target === themeButton;
    const isOption =
      getThemeOptions().findIndex((option) => option === event.target) !== -1;

    if (!isOption && isExpanded && !isButton) {
      closeThemeMenu();
    }
  },
  { capture: true }
);

/**
 * Close Menu when escape key is pressed.
 */
window.addEventListener(
  'keydown',
  (event) => {
    const isExpanded =
      themeButton.getAttribute('aria-expanded') == 'true' ? true : false;

    if (isExpanded && event.key == 'Escape') {
      event.preventDefault();
      closeThemeMenu();
    }
  },
  { capture: true }
);

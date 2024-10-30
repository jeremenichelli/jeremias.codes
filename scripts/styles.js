import k from 'kleur';
import { isProduction } from './utils.js';
import { bundleAsync, browserslistToTargets } from 'lightningcss';
import browserslist from 'browserslist';

/**
 * Variables to cache passed build timestamp and last build promise.
 */
const stylePromiseCache = new Map();
const styleTimestampCache = new Map();

/**
 * Builds and bundles CSS file and outputs a Promise to resolve with the result.
 *
 * Uses `lightningcss` package under-the-hood.
 *
 * @param {string} file
 * @param {string} buildTimestamp
 * @returns {Promise<string>}
 */
async function main(file, buildTimestamp) {
  // If process is triggered within the same build, return the cached promise.
  if (styleTimestampCache.get(file) === buildTimestamp) {
    return stylePromiseCache.get(file);
  }

  const stylePromise = generateStylePromise(file);

  // Cache timestamp and promise for same-build calling usage.
  styleTimestampCache.set(file, buildTimestamp);
  stylePromiseCache.set(file, stylePromise);

  return stylePromise;
}

/**
 * Method that triggers a less build and returns the Promise so it can be
 * cached for build optimization purposes.
 *
 * The promise, when resolved, returns a string of the CSS result.
 *
 * @param {string} file
 * @returns {Promise<string>}
 */
async function generateStylePromise(file) {
  /**
   * performance metric: start
   */
  const start = performance.now();

  return bundleAsync({
    filename: `./src/assets/styles/${file}`,
    minify: isProduction,
    sourceMap: !isProduction,
    drafts: {
      customMedia: true
    },
    targets: browserslistToTargets(
      browserslist(
        'last 2 major versions, not dead, not op_mini all, not kaios > 0, not and_qq > 0, not and_uc > 0'
      )
    )
  })
    .then((result) => {
      const done = (performance.now() - start).toFixed(2);

      console.log(
        `[${k.blue('scripts/styles')}] Styles genereated in ${done}ms`
      );

      return result.code;
    })
    .catch((error) => {
      console.log(
        `[${k.blue('scripts/styles')}] ${k.red(
          'An error occurred while processing styles'
        )}`,
        '\n',
        error.message,
        '\n'
      );
    });
}

export default main;

import { isProduction } from './utils.js';
import { build } from 'esbuild';
import k from 'kleur';

/**
 * Variables to cache passed build timestamp and last build promise.
 */
const bundlePromiseCache = new Map();
const bundleTimestampCache = new Map();

/**
 * Given an input directory, bundle and return whether the inlined bundled result or the source of the file while writing the file at destination.
 *
 * @param {string} file name of the Javascript file, input and output dirs are assumed
 * @param {boolean} inline flag that marks if a file should be written or should return content
 * @param {string} buildTimestamp timestamp identifying unique build run to optimize script running
 * @returns {Promise<string>} bundled JavaScript code or file src dir
 */
function main(file, inline, buildTimestamp) {
  // If process is triggered within the same build, return the cached promise.
  if (bundleTimestampCache.get(file) === buildTimestamp) {
    return bundlePromiseCache.get(file);
  }

  const bundlePromise = generateBundlePromise(file, inline);

  // Cache timestamp and promise for same-build calling usage.
  bundleTimestampCache.set(file, buildTimestamp);
  bundlePromiseCache.set(file, bundlePromise);

  return bundlePromise;
}

/**
 * Helper method that returns a promise of the build for certain file,
 * this helps optimize shortcode script performance by executing one
 * bundling per build, per file.
 *
 * @param {string} file name of the file, rest of directories are constant
 * @param {boolean} inline indicator the result wants to be inlined, no file is written
 * @returns {Promise<string>}
 */
async function generateBundlePromise(file, inline) {
  // performance metric: start bundling
  const start = performance.now();

  const inputDir = `./src/assets/scripts/${file}`;

  try {
    const bundle = await build({
      entryPoints: [inputDir],
      write: !inline,
      outdir: './_site/assets/scripts',
      bundle: true,
      minify: isProduction,
      sourcemap: !isProduction ? 'inline' : false,
      allowOverwrite: true
    });

    // performance metric: done time
    const done = (performance.now() - start).toFixed(2);

    console.log(
      `[${k.blue('scripts/bundle')}] ${file} ${k.gray(`file built in ${done}ms`)}`
    );

    return inline
      ? bundle.outputFiles[0].text.trim()
      : `/assets/scripts/${file}`;
  } catch (error) {
    console.log(
      `[${k.blue('scripts/bundle')}] ${k.red('An error occurred while bundling')}`,
      '\n',
      error.message,
      '\n'
    );
  }
}

export default main;

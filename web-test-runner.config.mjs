// import { playwrightLauncher } from '@web/test-runner-playwright';
import { fromRollup } from '@web/dev-server-rollup';
import rollupReplace from '@rollup/plugin-replace';
const replace = fromRollup(rollupReplace);
import { visualRegressionPlugin } from '@web/test-runner-visual-regression/plugin';

const filteredLogs = ['Running in dev mode', 'Lit is in dev mode.'];

export default /** @type {import("@web/test-runner").TestRunnerConfig} */ ({
  /** Test files to run */
  files: 'out-tsc/test/**/*.test.js',

  /** Resolve bare module imports */
  nodeResolve: {
    exportConditions: ['browser', 'development'],
  },

  /** Filter out lit dev mode logs */
  filterBrowserLogs(log) {
    for (const arg of log.args) {
      if (typeof arg === 'string' && filteredLogs.some(l => arg.includes(l))) {
        return false;
      }
    }
    return true;
  },

  plugins: [
    /** Use Hot Module Replacement by uncommenting. Requires @open-wc/dev-server-hmr plugin */
    // hmr && hmrPlugin({ exclude: ['**/*/node_modules/**/*'], presets: [presets.litElement] }),
    visualRegressionPlugin({
      update: process.argv.includes('--update-visual-baseline'),
      skip: process.argv.includes('--skip-vr'),
      baseDir: '__SCREENSHOTS__',
      diffOptions: {
        threshold: 0.5,
        includeAA: false,
      },
    }), 
    replace({
      'preventAssignment': true,
      'process.env.NODE_ENV': JSON.stringify( 'production' ),
    })
  ],


  /** Compile JS for older browsers. Requires @web/dev-server-esbuild plugin */
  // esbuildTarget: 'auto',

  /** Amount of browsers to run concurrently */
  // concurrentBrowsers: 2,

  /** Amount of test files per browser to test concurrently */
  // concurrency: 1,

  /** Browsers to run tests on */
  // browsers: [
  //   playwrightLauncher({ product: 'chromium' }),
  //   playwrightLauncher({ product: 'firefox' }),
  //   playwrightLauncher({ product: 'webkit' }),
  // ],

  // See documentation for all available options
});

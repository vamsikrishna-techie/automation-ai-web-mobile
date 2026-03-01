// Optional: load `.env` locally (uncomment if you want `.env` to work)
// import 'dotenv/config'

/**
 * Mode selection (Local vs LambdaTest) and Platform (Android vs iOS)
 * - RUN_ON: "local" | "lambdatest"
 * - PLATFORM: "android" | "ios"
 */
const RUN_ON = (process.env.RUN_ON || 'local').toLowerCase()
const isLambdaTest = RUN_ON === 'lambdatest'

const PLATFORM = (process.env.PLATFORM || 'android').toLowerCase()
const isAndroid = PLATFORM === 'android'

/**
 * Cost-control:
 * - Allow LambdaTest only in CI by default
 * - For local debugging on LT: set ALLOW_LT_LOCAL=true explicitly
 */
const IS_CI = (process.env.CI || '').toLowerCase() === 'true'
const ALLOW_LT_LOCAL = (process.env.ALLOW_LT_LOCAL || '').toLowerCase() === 'true'

if (isLambdaTest && !IS_CI && !ALLOW_LT_LOCAL) {
  throw new Error(
    'RUN_ON=lambdatest is blocked locally to control cost. ' +
      'Run in CI, or set ALLOW_LT_LOCAL=true if you really need to debug on LambdaTest.'
  )
}

/**
 * Parallel control:
 * - local default: 1
 * - CI default: 3
 * - override anytime with MAX_INSTANCES
 */
const DEFAULT_MAX_INSTANCES = IS_CI ? 3 : 1
const maxInstancesEnv = Number.parseInt(process.env.MAX_INSTANCES || '', 10)
const maxInstancesFinal =
  Number.isFinite(maxInstancesEnv) && maxInstancesEnv > 0 ? maxInstancesEnv : DEFAULT_MAX_INSTANCES

function requireEnv(name: string): string {
  const v = process.env[name]
  if (!v) throw new Error(`Missing required env var: ${name}`)
  return v
}

if (isLambdaTest) {
  requireEnv('LT_USERNAME')
  requireEnv('LT_ACCESS_KEY')
  // LT_APP_ANDROID / LT_APP_IOS are optional because you fall back to demo apps.
  // In many real projects you'd require them too.
}

export const config: WebdriverIO.Config = {
  //
  // ====================
  // Runner Configuration
  // ====================
  runner: 'local',
  tsConfigPath: './tsconfig.json',

  //
  // =====================
  // Server Configurations
  // =====================
  protocol: isLambdaTest ? 'https' : 'http',
  hostname: isLambdaTest ? 'mobile-hub.lambdatest.com' : 'localhost',
  port: isLambdaTest ? 443 : 4723,
  path: isLambdaTest ? '/wd/hub' : '/',

  //
  // =================
  // Service Providers
  // =================
  user: isLambdaTest ? process.env.LT_USERNAME : undefined,
  key: isLambdaTest ? process.env.LT_ACCESS_KEY : undefined,

  //
  // ==================
  // Specify Test Files
  // ==================
  specs: ['./test/specs/**/*.e2e.ts'],
  exclude: [],

  //
  // ============
  // Capabilities
  // ============
  maxInstances: maxInstancesFinal,

  capabilities: isAndroid
    ? [
        {
          platformName: 'Android',
          'appium:automationName': 'UiAutomator2',
          'appium:deviceName': 'Pixel 7',
          'appium:platformVersion': '13',
          'appium:app': isLambdaTest
            ? process.env.LT_APP_ANDROID || 'lt://proverbial-android'
            : process.env.LOCAL_APP_ANDROID || '/path/to/app.apk',

          ...(isLambdaTest
            ? {
                'lt:options': {
                  build: 'ai-first-mobile-poc',
                  name: 'Android - Login',
                  isRealMobile: true,
                  w3c: true,
                  deviceOrientation: 'portrait'
                }
              }
            : {})
        }
      ]
    : [
        {
          platformName: 'iOS',
          'appium:automationName': 'XCUITest',
          'appium:deviceName': 'iPhone 14',
          'appium:platformVersion': '16',
          'appium:app': isLambdaTest
            ? process.env.LT_APP_IOS || 'lt://proverbial-ios'
            : process.env.LOCAL_APP_IOS || '/path/to/app.app',

          ...(isLambdaTest
            ? {
                'lt:options': {
                  build: 'ai-first-mobile-poc',
                  name: 'iOS - Login',
                  isRealMobile: true,
                  w3c: true
                }
              }
            : {})
        }
      ],

  //
  // ===================
  // Test Configurations
  // ===================
  logLevel: 'info',
  bail: 0,

  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,

  //
  // Services
  //
  services: isLambdaTest
    ? [['lambdatest', { tunnel: false }]]
    : [['appium', { args: { address: '127.0.0.1', port: 4723 } }]],

  framework: 'mocha',

  reporters: ['spec'],

  mochaOpts: {
    ui: 'bdd',
    timeout: 60000
  }

    //
    // =====
    // Hooks
    // =====
    // WebdriverIO provides several hooks you can use to interfere with the test process in order to enhance
    // it and to build services around it. You can either apply a single function or an array of
    // methods to it. If one of them returns with a promise, WebdriverIO will wait until that promise got
    // resolved to continue.
    /**
     * Gets executed once before all workers get launched.
     * @param {object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     */
    // onPrepare: function (config, capabilities) {
    // },
    /**
     * Gets executed before a worker process is spawned and can be used to initialize specific service
     * for that worker as well as modify runtime environments in an async fashion.
     * @param  {string} cid      capability id (e.g 0-0)
     * @param  {object} caps     object containing capabilities for session that will be spawn in the worker
     * @param  {object} specs    specs to be run in the worker process
     * @param  {object} args     object that will be merged with the main configuration once worker is initialized
     * @param  {object} execArgv list of string arguments passed to the worker process
     */
    // onWorkerStart: function (cid, caps, specs, args, execArgv) {
    // },
    /**
     * Gets executed just after a worker process has exited.
     * @param  {string} cid      capability id (e.g 0-0)
     * @param  {number} exitCode 0 - success, 1 - fail
     * @param  {object} specs    specs to be run in the worker process
     * @param  {number} retries  number of retries used
     */
    // onWorkerEnd: function (cid, exitCode, specs, retries) {
    // },
    /**
     * Gets executed just before initialising the webdriver session and test framework. It allows you
     * to manipulate configurations depending on the capability or spec.
     * @param {object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that are to be run
     * @param {string} cid worker id (e.g. 0-0)
     */
    // beforeSession: function (config, capabilities, specs, cid) {
    // },
    /**
     * Gets executed before test execution begins. At this point you can access to all global
     * variables like `browser`. It is the perfect place to define custom commands.
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs        List of spec file paths that are to be run
     * @param {object}         browser      instance of created browser/device session
     */
    // before: function (capabilities, specs) {
    // },
    /**
     * Runs before a WebdriverIO command gets executed.
     * @param {string} commandName hook command name
     * @param {Array} args arguments that command would receive
     */
    // beforeCommand: function (commandName, args) {
    // },
    /**
     * Hook that gets executed before the suite starts
     * @param {object} suite suite details
     */
    // beforeSuite: function (suite) {
    // },
    /**
     * Function to be executed before a test (in Mocha/Jasmine) starts.
     */
    // beforeTest: function (test, context) {
    // },
    /**
     * Hook that gets executed _before_ a hook within the suite starts (e.g. runs before calling
     * beforeEach in Mocha)
     */
    // beforeHook: function (test, context, hookName) {
    // },
    /**
     * Hook that gets executed _after_ a hook within the suite starts (e.g. runs after calling
     * afterEach in Mocha)
     */
    // afterHook: function (test, context, { error, result, duration, passed, retries }, hookName) {
    // },
    /**
     * Function to be executed after a test (in Mocha/Jasmine only)
     * @param {object}  test             test object
     * @param {object}  context          scope object the test was executed with
     * @param {Error}   result.error     error object in case the test fails, otherwise `undefined`
     * @param {*}       result.result    return object of test function
     * @param {number}  result.duration  duration of test
     * @param {boolean} result.passed    true if test has passed, otherwise false
     * @param {object}  result.retries   information about spec related retries, e.g. `{ attempts: 0, limit: 0 }`
     */
    // afterTest: function(test, context, { error, result, duration, passed, retries }) {
    // },


    /**
     * Hook that gets executed after the suite has ended
     * @param {object} suite suite details
     */
    // afterSuite: function (suite) {
    // },
    /**
     * Runs after a WebdriverIO command gets executed
     * @param {string} commandName hook command name
     * @param {Array} args arguments that command would receive
     * @param {number} result 0 - command success, 1 - command error
     * @param {object} error error object if any
     */
    // afterCommand: function (commandName, args, result, error) {
    // },
    /**
     * Gets executed after all tests are done. You still have access to all global variables from
     * the test.
     * @param {number} result 0 - test pass, 1 - test fail
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that ran
     */
    // after: function (result, capabilities, specs) {
    // },
    /**
     * Gets executed right after terminating the webdriver session.
     * @param {object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that ran
     */
    // afterSession: function (config, capabilities, specs) {
    // },
    /**
     * Gets executed after all workers got shut down and the process is about to exit. An error
     * thrown in the onComplete hook will result in the test run failing.
     * @param {object} exitCode 0 - success, 1 - fail
     * @param {object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {<Object>} results object containing test results
     */
    // onComplete: function(exitCode, config, capabilities, results) {
    // },
    /**
    * Gets executed when a refresh happens.
    * @param {string} oldSessionId session ID of the old session
    * @param {string} newSessionId session ID of the new session
    */
    // onReload: function(oldSessionId, newSessionId) {
    // }
    /**
    * Hook that gets executed before a WebdriverIO assertion happens.
    * @param {object} params information about the assertion to be executed
    */
    // beforeAssertion: function(params) {
    // }
    /**
    * Hook that gets executed after a WebdriverIO assertion happened.
    * @param {object} params information about the assertion that was executed, including its results
    */
    // afterAssertion: function(params) {
    // }
}

import { config as baseConfig } from './wdio.conf.js'

export const config = {
  ...baseConfig,

  // Local Appium server
  protocol: 'http',
  hostname: '127.0.0.1',
  port: 4723,
  path: '/',
  services: [],

  // No cloud creds for local run
  user: undefined,
  key: undefined,

  maxInstances: 1,

  capabilities: [
    {
      platformName: 'Android',
      'appium:automationName': 'UiAutomator2',
      'appium:deviceName': 'Android Emulator',
      'appium:platformVersion': '14', // change to 12 if your emulator is 12
      'appium:app': './apps/Android.SauceLabs.Mobile.Sample.app.2.7.1.apk',
      'appium:appPackage': 'com.swaglabsmobileapp',
      'appium:appActivity': 'com.swaglabsmobileapp.MainActivity',
      'appium:appWaitActivity': '*',
      'appium:appWaitDuration': 60000,
      'appium:autoGrantPermissions': true,
      'appium:newCommandTimeout': 120
    }
  ]
}
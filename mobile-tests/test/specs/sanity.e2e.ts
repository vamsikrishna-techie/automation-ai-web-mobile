import { expect } from '@wdio/globals'

describe('Sanity', () => {
  it('should start an Appium session', async () => {
    expect(driver.sessionId).toBeTruthy()
  })
})
describe('Sanity', () => {
  it('should start a session (requires LT App Automation entitlement)', async () => {
    const session = await driver.getSession()
    await expect(session).toHaveProperty('sessionId')
  })
})
import Page from './page'

class MobileLoginPage extends Page {
  // Swag Labs sample app uses accessibility ids
  get username() { return $('~test-Username') }
  get password() { return $('~test-Password') }
  get loginBtn() { return $('~test-LOGIN') }

  async login(user: string, pass: string) {
    await this.username.waitForDisplayed({ timeout: 15000 })
    await this.username.setValue(user)
    await this.password.setValue(pass)
    await this.loginBtn.click()
  }
}

export default new MobileLoginPage()
import { expect } from '@wdio/globals'
import mobileLoginPage from '../pageobjects/mobile.login.page'
import ProductsPage from '../pageobjects/products.page'

describe('Mobile Login', () => {
  it('should login successfully', async () => {
    await mobileLoginPage.login('standard_user', 'secret_sauce')
    await expect(ProductsPage.title).toBeDisplayed()
  })
})
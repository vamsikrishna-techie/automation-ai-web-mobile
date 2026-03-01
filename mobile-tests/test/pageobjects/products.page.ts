import { $ } from '@wdio/globals'

class ProductsPage {
  get title() { return $('~test-PRODUCTS') }
}

export default new ProductsPage()
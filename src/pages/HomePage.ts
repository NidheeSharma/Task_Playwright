import { BasePage } from './BasePage';
import { LoginPage } from './LoginPage';
import { ProductsPage } from './ProductsPage';
import { CartPage } from './CartPage';

export class HomePage extends BasePage {
  async open(): Promise<void> {
    await this.goto('/');
    await this.dismissAds();
  }

  async goToLogin(): Promise<LoginPage> {
    await this.signupLoginLink.click();
    return new LoginPage(this.page);
  }

  async goToProducts(): Promise<ProductsPage> {
    await this.productsLink.click();
    return new ProductsPage(this.page);
  }

  async goToCart(): Promise<CartPage> {
    await this.cartLink.click();
    return new CartPage(this.page);
  }

  async logout(): Promise<LoginPage> {
    await this.logoutLink.click();
    return new LoginPage(this.page);
  }
}

import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { SignupComponent } from './components/pages/signup/signup.component';
import { HomeComponent } from './components/pages/home/home.component';
import { UserProfileComponent } from './components/pages/user-profile/user-profile.component';
import { ViewProductComponent } from './components/pages/view-product/view-product.component';
import { ProductDetailComponent } from './components/pages/product-detail/product-detail.component';
import { WishlistComponent } from './components/pages/wishlist/wishlist.component';
import { CartComponent } from './components/pages/cart/cart.component';
import { OrdersComponent } from './components/pages/orders/orders.component';
import { ForgotpasswordComponent } from './components/pages/forgotpassword/forgotpassword.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'signin', component: SignupComponent },
  { path: 'userprofile', component: UserProfileComponent },
  { path: 'viewproduct', component: ViewProductComponent },
  { path: 'product/:id', component: ProductDetailComponent },
  { path: 'wishlist', component: WishlistComponent },
  { path: 'cart', component: CartComponent },
  { path: 'myorders', component: OrdersComponent },
  { path: 'forgotpassword', component: ForgotpasswordComponent },

  { path: '', redirectTo: '/home', pathMatch: 'full' },
];

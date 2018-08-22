// separator gets rendered always above the indicated route
export const Routes = [
  {
    path: 'dashboard',
    name: 'Dashboard',
    icon: 'material',
    material: 'dashboard',
    separator: 'General'
  },
  {
    path: 'articles',
    name: 'My Articles',
    material: 'create',
    icon: 'material'
  },
  {
    path: 'reviews',
    name: 'My Reviews',
    icon: 'material',
    material: 'rate_review'
  },
  {
    path: 'linked',
    name: 'My Linked Articles',
    icon: 'material',
    material: 'format_quote'
  },
  {
    path: 'wallet',
    name: 'My Wallet',
    icon: 'material',
    material: 'account_balance_wallet',
    separator: 'Personal'
  },
  {
    path: 'account',
    name: 'My Account',
    icon: 'material',
    material: 'account_box'
  },
  {
    path: 'actions',
    name: 'My History',
    icon: 'ethereum',
    separator: 'History'
  }
];

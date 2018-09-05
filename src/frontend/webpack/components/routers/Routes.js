// Separator gets rendered always above the indicated route
import Roles from '../../../../backend/schema/roles-enum.mjs';

export const Routes = [
  {
    path: 'dashboard',
    name: 'Dashboard',
    icon: 'material',
    material: 'dashboard',
    separator: 'General',
    role: Roles.USER
  },
  {
    path: 'articles',
    name: 'My Articles',
    material: 'create',
    icon: 'material',
    role: Roles.USER
  },
  {
    path: 'editorApprovedReviews',
    name: 'My Reviews',
    icon: 'material',
    material: 'rate_review',
    role: Roles.USER
  },
  {
    path: 'linked',
    name: 'My Linked Articles',
    icon: 'material',
    material: 'format_quote',
    role: Roles.USER
  },
  {
    path: 'assigned',
    name: 'Assigned Articles',
    icon: 'material',
    material: 'playlist_add_check',
    role: Roles.USER //TODO set to EDITOR
  },
  {
    path: 'book',
    name: 'Address Book',
    material: 'book',
    icon: 'material',
    role: Roles.USER
  },
  {
    path: 'wallet',
    name: 'My Wallet',
    icon: 'material',
    material: 'account_balance_wallet',
    separator: 'Personal',
    role: Roles.USER
  },
  {
    path: 'account',
    name: 'My Account',
    icon: 'material',
    material: 'account_box',
    role: Roles.USER
  },
  {
    path: 'actions',
    name: 'My History',
    icon: 'material',
    material: 'timeline',
    role: Roles.USER
  },
  {
    path: 'owner',
    name: 'Smart Contract',
    material: 'security',
    icon: 'ethereum',
    separator: 'Admin',
    role: Roles.CONTRACT_OWNER
  }
];

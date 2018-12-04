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
    path: 'documents',
    name: 'Documents',
    material: 'create',
    icon: 'material',
    role: Roles.USER
  },
  {
    path: 'reviews',
    name: 'Reviews',
    icon: 'material',
    material: 'rate_review',
    role: Roles.USER
  },
  {
    path: 'linked',
    name: 'Linked Articles',
    icon: 'material',
    material: 'format_quote',
    role: Roles.USER
  },
  {
    path: 'book',
    name: 'Address Book',
    material: 'book',
    icon: 'material',
    role: Roles.USER
  },
  {
    path: 'editor',
    name: 'Assessment',
    icon: 'material',
    material: 'playlist_add_check',
    separator: 'Editor',
    role: Roles.EDITOR
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

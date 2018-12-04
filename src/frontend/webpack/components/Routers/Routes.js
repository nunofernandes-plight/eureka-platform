// Separator gets rendered always above the indicated route
import Roles from '../../../../backend/schema/roles-enum.mjs';

export const Routes = [
  {
    path: 'dashboard',
    name: 'Dashboard',
    icon: 'dashboard',
    separator: 'General',
    role: Roles.USER
  },
  {
    path: 'documents',
    name: 'Documents',
    icon: 'articles',
    role: Roles.USER
  },
  {
    path: 'reviews',
    name: 'Reviews',
    icon: 'review',
    role: Roles.USER
  },
  {
    path: 'linked',
    name: 'Citations',
    icon: 'citation',
    role: Roles.USER
  },
  {
    path: 'book',
    name: 'Address Book',
    icon: 'addressBook',
    role: Roles.USER
  },
  {
    path: 'editor',
    name: 'Assessment',
    icon: 'assessment',
    separator: 'Editor',
    role: Roles.EDITOR
  },
  {
    path: 'wallet',
    name: 'Wallet',
    icon: 'wallet',
    separator: 'Personal',
    role: Roles.USER
  },
  {
    path: 'account',
    name: 'Account',
    icon: 'account',
    role: Roles.USER
  },
  {
    path: 'actions',
    name: 'History',
    icon: 'history',
    role: Roles.USER
  },
  {
    path: 'owner',
    name: 'Smart Contract',
    icon: 'smartContract',
    separator: 'Admin',
    role: Roles.CONTRACT_OWNER
  }
];

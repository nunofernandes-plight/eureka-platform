import {__ALERT_ERROR, __ALERT_INFO} from '../../../helpers/colors.js';

export const MenuItems = [
  {
    text: 'Edit',
    action: 'articles/drafts/new',
    method: 'GET',
    icon: 'material',
    material: 'edit',
    color: __ALERT_INFO
  },
  {
    text: 'Delete',
    icon: 'material',
    material: 'delete',
    color: __ALERT_ERROR
  }
];

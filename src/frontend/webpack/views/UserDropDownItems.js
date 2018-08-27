import {
	__ALERT_DANGER,
	__ALERT_WARNING,
	__FIFTH,
	__THIRD
} from '../../helpers/colors.js';

export const Items = [
	{
		text: 'Start writing',
		action: 'articles/drafts/new',
		method: 'GET',
		icon: 'material',
		material: 'gesture',
		color: __ALERT_DANGER
	},
	{
		text: 'Settings',
		icon: 'material',
		material: 'settings',
		color: __ALERT_WARNING
	},
	{
		text: 'EUREKA Token',
		icon: 'eureka',
		color: __THIRD
	},
	{
		text: 'Log Out',
		action: 'logout',
		method: 'POST',
		icon: 'material',
		material: 'power_settings_new',
		color: __FIFTH
	}
];

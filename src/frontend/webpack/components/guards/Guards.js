import React from 'react';
import {Redirect} from 'react-router-dom';
import GridSpinner from '../../views/spinners/GridSpinner.js';

export const DashBoardGuard = props => {
	if (props.isAuthenticated === null) {
		return <GridSpinner />;
	}
	if (!props.isAuthenticated) {
		return (
			<Redirect to={{pathname: '/login', state: {from: props.location}}} />
		);
	}
	return props.children;
};

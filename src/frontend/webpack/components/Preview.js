import React from 'react';
import styled from 'styled-components';
import {Card} from '../views/Card.js';

class Preview extends React.Component {
	constructor() {
		super();
	}

	render() {
		return <Card width={1000} title={'Your article'} />;
	}
}

export default Preview;

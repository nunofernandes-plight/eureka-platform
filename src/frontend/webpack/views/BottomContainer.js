import React from 'react';
import styled from 'styled-components';
import Ball from './Ball.js';

const Container = styled.div`
  padding-bottom: 2em;
  position: relative;
`;

const BallsContainer = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: -100000;
`;

export const BottomContainer = props => {
	const rgb = '46,50,145';
	return (
		<Container>
			<BallsContainer>
				<Ball rgb={rgb} left={400} top={100} intensity={0.01} width={300} />
				<Ball rgb={rgb} left={50} top={257} intensity={0.02} width={200} />
				<Ball rgb={rgb} left={606} top={757} intensity={0.015} width={150} />
				<Ball rgb={rgb} left={457} top={200} intensity={0.02} width={400} />
				<Ball rgb={rgb} left={10} top={600} intensity={0.07} width={200} />
				<Ball rgb={rgb} left={50} top={500} intensity={0.03} width={150} />
				<Ball rgb={rgb} right={15} top={100} intensity={0.03} width={124} />
				<Ball rgb={rgb} right={220} top={120} intensity={0.02} width={453} />
				<Ball rgb={rgb} right={360} top={170} intensity={0.01} width={24} />
				<Ball rgb={rgb} right={550} top={350} intensity={0.01} width={124} />
				<Ball rgb={rgb} right={660} top={456} intensity={0.07} width={343} />
				<Ball rgb={rgb} right={15} top={740} intensity={0.03} width={545} />
			</BallsContainer>
			{props.children}
		</Container>
	);
};

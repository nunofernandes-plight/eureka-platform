import React, {Component} from 'react';
import styled from 'styled-components';
import {Route} from 'react-router';
import {withRouter} from 'react-router-dom';
import NavPill from '../../views/NavPill.js';
import {EditorNavPillRoutes} from './EditorNavPillRoutes.js';

const Parent = styled.div`
  display: flex;
  flex-direction: column;
`;

const CardContainer = styled.div`
  transition: all 0.5s;
  display: flex;
  max-width: 1200px;
  justify-content: center;
  margin: 0 auto;
`;

const NavPills = styled.div`
  display: flex;
  margin-bottom: 10px;
  justify-content: center;
`;

const Container = styled.div``;
class ArticlesRouter extends Component {
	constructor() {
		super();
		this.state = {
			currentPath: null
		};
	}

	componentDidMount() {
		this.changeActiveRoute();
	}

	changeActiveRoute() {
		const currentPath = this.props.location.pathname
			.toString()
			.replace(this.props.base.toString(), '')
			.replace(/[^a-zA-Z ]/g, '');
		this.setState({currentPath});
	}

	render() {
		return (
			<Parent>
				<Container>
					<NavPills>
						{EditorNavPillRoutes.map((item, index) => {
							return (
								<NavPill
									name={item.name}
									base={this.props.base}
									key={index}
									path={item.path}
									icon={item.icon}
									material={item.material}
									width={22}
								/>
							);
						})}
					</NavPills>
					<CardContainer>

					</CardContainer>
				</Container>
			</Parent>
		);
	}
}

export default withRouter(ArticlesRouter);

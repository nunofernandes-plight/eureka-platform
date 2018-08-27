import React, {Component} from 'react';
import styled from 'styled-components';
import {Route} from 'react-router';
import {Redirect, withRouter} from 'react-router-dom';
import MyDrafts from '../MyDrafts.js';
import DocumentEditor from '../DocumentEditor.js';
import NavPill from '../../views/NavPill.js';
import MySubmitted from '../MySubmitted.js';
import Preview from '../Preview.js';
import {NavPillRoutes} from './NavPillRoutes.js';

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

const MarginTop = styled.div`
  margin-top: 15px;
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
						{NavPillRoutes.map((item, index) => {
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
						<MarginTop>
							<Route
								exact
								path={`${this.props.base}/drafts`}
								render={() => <MyDrafts base={`${this.props.base}/drafts`} />}
							/>
						</MarginTop>

						<MarginTop>
							<Route
								exact
								path={`${this.props.base}/submitted`}
								render={() => (
									<MySubmitted base={`${this.props.base}/submitted`} />
								)}
							/>
						</MarginTop>

						<MarginTop>
							<Route
								exact
								path={`${this.props.base}/preview/:id`}
								render={() => <Preview base={`${this.props.base}/preview`} />}
							/>
						</MarginTop>

						<Route
							exact
							path={`${this.props.base}/drafts/:id`}
							render={props => (
								<DocumentEditor
									web3={this.props.web3}
									tokenContract={this.props.tokenContract}
									platformContract={this.props.platformContract}
									base={this.props.base}
									user={this.props.user}
									selectedAccount={this.props.selectedAccount}
									{...props}
								/>
							)}
						/>

						<Route
							exact
							path={`${this.props.base}`}
							render={() => <Redirect to={`${this.props.base}/drafts`} />}
						/>
					</CardContainer>
				</Container>
			</Parent>
		);
	}
}

export default withRouter(ArticlesRouter);

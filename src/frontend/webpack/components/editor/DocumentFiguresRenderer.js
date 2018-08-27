import React from 'react';
import styled from 'styled-components';
import {__ALERT_ERROR, __GRAY_300} from '../../../helpers/colors.js';
import Icon from '../../views/icons/Icon.js';
import Modal from '../../design-components/Modal.js';

const Container = styled.div`
  display: flex;
  flex: ${props => (props.figures ? props.figures.length + ' 1 0%' : null)};
  position: relative;
`;

const VerticalContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin: 0 12px;
  position: relative;
  border: 1px solid ${__GRAY_300};
  border-radius: 4px;
`;
const FigureContainer = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Figure = styled.img`
  width: 100%;
  height: auto;
`;

const RemoveIconContainer = styled.div`
  margin: 8px 0;
  align-self: center;
`;

class DocumentFiguresRenderer extends React.Component {
	constructor() {
		super();
		this.state = {
			showDeleteModal: false,
			indexToRemove: null
		};
	}

	renderModal() {
		return (
			<Modal
				action={'DELETE'}
				type={'notification'}
				callback={() => {
					this.setState({showDeleteModal: false});
					this.props.onDelete(this.state.indexToRemove);
				}}
				toggle={showDeleteModal => {
					this.setState({showDeleteModal});
				}}
				show={this.state.showDeleteModal}
				title={'Delete Figure'}
			>
        Are you sure you want to delete this figure?
			</Modal>
		);
	}

	render() {
		return (
			<div>
				{this.renderModal()}
				<Container figures={this.props.figures}>
					{this.props.figures.map((figure, i) => {
						return (
							<VerticalContainer key={figure.id}>
								<FigureContainer>
									<Figure src={figure.cdn} />
								</FigureContainer>
								<RemoveIconContainer>
									<Icon
										icon={'delete'}
										color={__ALERT_ERROR}
										width={15}
										height={15}
										onClick={() => {
											this.setState({indexToRemove: i, showDeleteModal: true});
										}}
									/>
								</RemoveIconContainer>
							</VerticalContainer>
						);
					})}
				</Container>
			</div>
		);
	}
}

export default DocumentFiguresRenderer;

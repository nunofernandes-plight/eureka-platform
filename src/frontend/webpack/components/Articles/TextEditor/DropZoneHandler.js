import React, {Component} from 'react';
import styled from 'styled-components';
import Dropzone from 'react-dropzone';
import randomstring from 'randomstring';
import S3Upload from '../../../../../helpers/s3upload.js';
import {getDomain} from '../../../../../helpers/getDomain.mjs';
import UploadProgressContainer from './UploadProgressContainer.js';

const Container = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`;
const StyledDropzone = styled(Dropzone)`
  width: 100%;
`;

const DropZoneContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  min-width: 200px;
`;

const Dropper = styled.div`
  &:hover {
    border: 1px dashed rgba(0, 0, 0, 0.6);
  }
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  border: 1px dashed rgba(0, 0, 0, 0.2);
  min-height: 150px;
  height: 100%;
  cursor: pointer;
  transition: 0.2s ease-in-out;
`;

const VerticalContainer = styled.div`
  flex: 1;
  flex-direction: column;
  display: flex;
`;

class DropZoneHandler extends Component {
	constructor() {
		super();
		this.state = {
			uploading: []
		};
	}

	onDrop(accepted_files) {
		const new_files = [];
		accepted_files.forEach(file => {
			const {name, type} = file;
			const id = randomstring.generate(8);
			const s3upload = new S3Upload({
				s3_sign_put_url: `${getDomain()}/fileupload`,
				onProgress: percent => {
					this.setState({
						uploading: this.state.uploading.map(u => {
							if (u.id === id) {
								return {
									id,
									progress: percent
								};
							}
							return u;
						})
					});
				},
				onFinishS3Put: public_url => {
					this.props.onChangeFigure({
						contents: [
							{
								url: public_url,
								name,
								type,
								id: 'f-' + Math.floor(Math.random() * 100000000)
							}
						]
					});
					this.setState({
						uploading: this.state.uploading.filter(u => u.id !== id)
					});
				},
				onError: err => {
					alert('Could not upload: ' + err);
				}
			});
			new_files.push({
				id,
				progress: 0
			});
			s3upload.uploadFile(file);
		});
		this.setState({
			uploading: [...this.state.uploading, ...new_files]
		});
	}

	render() {
		return (
			<Container>
				<DropZoneContainer>
					<StyledDropzone onDrop={this.onDrop.bind(this)}>
						{({isDragActive}) => {
							return (
								<Dropper isDragActive={isDragActive}>
									<div style={{padding: 10, textAlign: 'center'}}>
                    Drop an image or click here to select one.
									</div>
								</Dropper>
							);
						}}
					</StyledDropzone>
				</DropZoneContainer>
				{this.state.uploading.map(u => {
					return (
						<VerticalContainer key={u.id}>
							<UploadProgressContainer {...u} />
						</VerticalContainer>
					);
				})}
			</Container>
		);
	}
}

export default DropZoneHandler;

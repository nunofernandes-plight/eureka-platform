import React from 'react';
import styled from 'styled-components';
import {Link} from 'react-router-dom';
import {
	__ALERT_ERROR,
	__GRAY_600,
	__GRAY_200,
	__THIRD,
	__FIFTH
} from '../../helpers/colors.js';
import {renderField} from '../components/editor/DocumentRenderer.js';
import {renderTimestamp} from '../../helpers/timestampRenderer.js';
import {MEDIUM_DEVICES} from '../../helpers/mobile.js';
import Icon from './icons/Icon.js';

const DraftsContainer = styled.div`
  font-size: 14px;
  width: 100%;
  padding: 10px 25px;
  max-height: 400px;
  overflow: scroll;
`;

const Drafts = styled.table`
  width: 100%;
  text-align: left;
  position: relative;
  border-collapse: collapse;
  white-space: nowrap;
`;

const TableTitle = styled.p`
  font-size: 16px;
  font-weight: bold;
`;

const Tr = styled.tr`
  &:hover {
    background: ${__GRAY_200};
  }
  transition: 0.5s all;
`;

const NoDrafts = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

const StartWriting = styled.div`
  &:hover {
    box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
    cursor: pointer;
    background: ${__FIFTH};
    color: white;
  }
  transition: 0.5s all;
  padding: 0.5rem 1.75rem;
  border-radius: 10px;
  text-align: center;
`;

const MyLink = styled(Link)`
  &:hover {
    text-decoration: underline;
  }
  color: ${__THIRD};
  transition: 0.25s all;
  text-decoration: none;
`;

const Authors = styled.td`
  ${MEDIUM_DEVICES`
    display: none; 
  `};
`;

const AuthorsTitle = styled.th`
  ${MEDIUM_DEVICES`
    display: none; 
  `};
`;
const DraftsTable = props => {
	return (
		<DraftsContainer>
			{!props.drafts || props.drafts.length === 0 ? (
				<NoDrafts>
					<Icon
						icon={'material'}
						material={'gesture'}
						width={100}
						height={100}
						color={__FIFTH}
					/>
					<StartWriting onClick={() => props.onSubmit()}>
            Start writing your article exploiting EUREKA's Blockchain
            Technology!
					</StartWriting>
				</NoDrafts>
			) : (
				<Drafts>
					<tbody>
						<tr>
							<th />
							<th>
								<TableTitle>Name</TableTitle>
							</th>
							<AuthorsTitle>
								<TableTitle>Authors</TableTitle>
							</AuthorsTitle>
							<th>
								<TableTitle>Last changed</TableTitle>
							</th>
							<th />
						</tr>
					</tbody>

					<tbody>
						{props.drafts.map(draft => (
							<Tr key={draft._id}>
								<td style={{padding: '20px 15px'}}>
									<Icon
										icon={'file'}
										width={20}
										height={20}
										color={__GRAY_600}
									/>
								</td>
								<td>
									<MyLink to={`${props.base}/${draft._id}`}>
										{renderField(draft.document, 'title')}
									</MyLink>
								</td>
								<Authors>{draft.document.authors}</Authors>
								<td>{renderTimestamp(draft.timestamp)}</td>
								<td>
									<Icon
										icon={'delete'}
										width={20}
										height={20}
										color={__ALERT_ERROR}
										onClick={() => {
											props.onDelete(draft._id);
										}}
									/>
								</td>
							</Tr>
						))}
					</tbody>
				</Drafts>
			)}
		</DraftsContainer>
	);
};

export default DraftsTable;

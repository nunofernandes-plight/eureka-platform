import React from 'react';
import styled from 'styled-components';
import {
  __ALERT_ERROR,
  __GRAY_600,
  __GRAY_200,
  __THIRD
} from '../../helpers/colors.js';
import {Link} from 'react-router-dom';
import Icon from '../views/icons/Icon.js';
import {renderField} from '../components/editor/DocumentRenderer.js';
import {renderTimestamp} from '../../helpers/timestampRenderer.js';

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

const MyLink = styled(Link)`
  &:hover {
    text-decoration: underline;
  }
  
  color: ${__THIRD}
  transition: 0.25s all;
  text-decoration: none;
`;
const DraftsTable = props => {
  return (
    <DraftsContainer>
      <Drafts>
        <tbody>
          <tr>
            <th />
            <th>
              <TableTitle>Name</TableTitle>
            </th>
            <th>
              <TableTitle>Authors</TableTitle>
            </th>
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
                <Icon icon={'file'} width={20} height={20} color={__GRAY_600} />
              </td>
              <td>
                <MyLink to={`${props.base}/${draft._id}`}>
                  {renderField(draft.document, 'title')}
                </MyLink>
              </td>
              <td>{draft.document.authors}</td>
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
    </DraftsContainer>
  );
};

export default DraftsTable;

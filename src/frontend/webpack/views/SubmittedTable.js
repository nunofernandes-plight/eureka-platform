import React from 'react';
import styled from 'styled-components';
import {
  __GRAY_600,
  __GRAY_200,
  __THIRD,
  __FIFTH,
  __ALERT_SUCCESS
} from '../../helpers/colors.js';
import {Link} from 'react-router-dom';
import Icon from '../views/icons/Icon.js';
import {renderTimestamp} from '../../helpers/timestampRenderer.js';
import {MEDIUM_DEVICES} from '../../helpers/mobile.js';
import {renderField} from '../components/editor/DocumentRenderer.js';
import ARTICLE_VERSION_STATE from '../../../backend/schema/article-version-state-enum.mjs';
import PulseSpinner from '../views/spinners/PulseSpinner.js';

const SubmittedContainer = styled.div`
  font-size: 14px;
  width: 100%;
  padding: 10px 25px;
  max-height: 400px;
  overflow: scroll;
`;

const Submitted = styled.table`
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

const NoSubmitted = styled.div`
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

const Preview = styled.td``;

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

const IconContainer = styled.div`
  border-radius: 50%;
  padding: 0.25rem;
  background: ${__ALERT_SUCCESS};
  display: flex;
  justify-content: center;
  align-items: center;
  width: 25px;
  margin: auto;
  height: 25px;
`;
const renderStatus = status => {
  if (status === ARTICLE_VERSION_STATE.FINISHED_DRAFT) {
    return <PulseSpinner />;
  } else if (status === ARTICLE_VERSION_STATE.SUBMITTED) {
    return (
      <IconContainer>
        <Icon
          icon={'material'}
          material={'done'}
          width={18}
          height={18}
          color={'#fff'}
          noMove
        />
      </IconContainer>
    );
  } else {
  }
};
const SubmittedTable = props => {
  return (
    <SubmittedContainer>
      {!props.submitted || props.submitted.length === 0 ? (
        <NoSubmitted>
          <Icon
            icon={'material'}
            material={'gesture'}
            width={100}
            height={100}
            color={__FIFTH}
          />
          <StartWriting onClick={() => props.onSubmit()}>
            Submit your first article with EUREKA and exploit the REWARD
            process!
          </StartWriting>
        </NoSubmitted>
      ) : (
        <Submitted>
          <tbody>
            <tr>
              <th />
              <th>
                <TableTitle>Name</TableTitle>
              </th>
              <AuthorsTitle>
                <TableTitle>Unique Article Hash</TableTitle>
              </AuthorsTitle>
              <th>
                <TableTitle>Last changed</TableTitle>
              </th>
              <th>Status</th>
            </tr>
          </tbody>

          <tbody>
            {props.submitted.map(submitted => (
              <Tr key={submitted._id}>
                <td style={{padding: '20px 15px'}}>
                  <Icon
                    icon={'file'}
                    width={20}
                    height={20}
                    color={__GRAY_600}
                  />
                </td>
                <td>
                  <MyLink
                    to={`${props.base
                      .toString()
                      .replace('/submitted', '')}/preview/${submitted._id}`}
                  >
                    {renderField(submitted.document, 'title')}
                  </MyLink>
                </td>
                <Authors>{submitted.articleHash.substr(0, 55)}...</Authors>
                <td>{renderTimestamp(submitted.timestamp)}</td>
                <td>{renderStatus(submitted.articleVersionState)}</td>
              </Tr>
            ))}
          </tbody>
        </Submitted>
      )}
    </SubmittedContainer>
  );
};

export default SubmittedTable;

import React from 'react';
import styled from 'styled-components';
import {Link} from 'react-router-dom';
import {
  __GRAY_600,
  __GRAY_200,
  __THIRD,
  __FIFTH,
  __ALERT_SUCCESS
} from '../../helpers/colors.js';
import {renderTimestamp} from '../../helpers/timestampRenderer.js';
import {MEDIUM_DEVICES} from '../../helpers/mobile.js';
import {renderField} from '../components/TextEditor/DocumentRenderer.js';
import ARTICLE_VERSION_STATE from '../../../backend/schema/article-version-state-enum.mjs';
import Icon from './icons/Icon.js';
import PulseSpinner from './spinners/PulseSpinner.js';
import {Table} from '../design-components/Table/Table.js';
import AnimatedTooltip from '../design-components/AnimatedTooltip.js';

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

const Hash = styled.div`
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
  }
  if (status === ARTICLE_VERSION_STATE.SUBMITTED) {
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
  }
};

const getData = props => {
  let data = [];
  props.submitted.map(sub => {
    data.push({
      icon: getIcon(sub),
      name: getName(props, sub),
      hash: getHash(sub),
      date: getLastChanged(sub),
      status: getStatus(sub)
    });
  });

  return data;
};

const getStatus = sub => {
  return renderStatus(sub.articleVersionState);
};
const getLastChanged = sub => {
  return renderTimestamp(sub.timestamp);
};
const getHash = sub => {
  return <Hash>{sub.articleHash.substr(0, 48)}...</Hash>;
};
const getName = (props, sub) => {
  return (
    <MyLink
      to={`${props.base.toString().replace('/submitted', '')}/preview/${
        sub._id
      }`}
    >
      {renderField(sub.document, 'title')}
    </MyLink>
  );
};
const getIcon = sub => {
  return (
    <AnimatedTooltip
      isVisible={() => {}}
      noTitle
      width={95}
      position={'bottom'}
      content={sub.articleVersionState}
    >
      {' '}
      <Icon icon={'file'} width={20} height={20} color={__GRAY_600} />
    </AnimatedTooltip>
  );
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
        <Table
          header={['', 'Name', 'Article Hash', 'Last Changed', 'Status']}
          columnWidth={['8', '20', '42', '18', '17']}
          textCenter={'Status'}
          data={getData(props)}
        />
      )}
    </SubmittedContainer>
  );
};

export default SubmittedTable;

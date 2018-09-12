import React from 'react';
import styled from 'styled-components';
import {Link} from 'react-router-dom';
import {
  __ALERT_ERROR,
  __GRAY_600,
  __THIRD,
  __FIFTH
} from '../../helpers/colors.js';
import {renderField} from '../components/TextEditor/DocumentRenderer.js';
import {renderTimestamp} from '../../helpers/timestampRenderer.js';
import Icon from './icons/Icon.js';
import AnimatedTooltip from '../design-components/AnimatedTooltip.js';
import CircleSpinner from '../views/spinners/CircleSpinner.js';
import Author from './Author.js';
import {Table} from '../design-components/Table/Table.js';

const DraftsContainer = styled.div`
  font-size: 14px;
  width: 100%;
  padding: 10px 25px;
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

const getData = props => {
  const data = [];
  props.drafts.map(draft => {
    data.push({
      icon: getIcon(draft),
      title: getTitle(props, draft),
      authors: getAuthors(props, draft),
      lastChange: getLastChange(draft),
      delIcon: getDeleteIcon(props, draft)
    });
  });
  return data;
};

const getIcon = draft => {
  return (
    <AnimatedTooltip
      isVisible={() => {}}
      noTitle
      height={30}
      position={'left'}
      content={draft.articleVersionState}
    >
      {' '}
      <Icon icon={'file'} width={20} height={20} color={__GRAY_600} />
    </AnimatedTooltip>
  );
};

const getTitle = (props, draft) => {
  return (
    <MyLink to={`${props.base}/${draft._id}`}>
      {renderField(draft.document, 'title')}
    </MyLink>
  );
};

const getLastChange = draft => {
  return renderTimestamp(draft.timestamp);
};
const getAuthors = (props, draft) => {
  return draft.document.authors.map(address => {
    return (
      <div style={{padding: '6px 0'}} key={address}>
        <AnimatedTooltip
          isVisible={isVisible => {
            if (isVisible) {
              props.getAuthor(address);
            }
          }}
          title={'Author lookup'}
          width={400}
          position={'top'}
          content={
            <div>
              {props.authorsData ? (
                <Author
                  author={props.authorsData[0]}
                  width={27}
                  height={27}
                  right={10}
                />
              ) : (
                <CircleSpinner />
              )}
            </div>
          }
        >
          {address}
        </AnimatedTooltip>
      </div>
    );
  });
};

const getDeleteIcon = (props, draft) => {
  return (
    <Icon
      icon={'delete'}
      width={20}
      height={20}
      color={__ALERT_ERROR}
      onClick={() => {
        props.onDelete(draft._id);
      }}
    />
  );
};
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
        <Table
          padding={'30px 0'}
          header={['', 'Name', 'Authors', 'Last Changed', '']}
          columnWidth={['8', '30', '40', '17', '5']}
          data={getData(props)}
        />
      )}
    </DraftsContainer>
  );
};

export default DraftsTable;

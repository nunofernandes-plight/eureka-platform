import React, {Component} from 'react';
import styled from 'styled-components';
import NewPopover from './NewPopover.js';
import Icon from '../../views/icons/Icon.js';
import {__GRAY_500} from "../../../helpers/colors.js";

const Container = styled.div`
  color: ${__GRAY_500};
  margin-bottom: 7px;
  display: flex;
  text-align: center;
  cursor: default;
  margin-right: 2px;
`;

const Title = styled.div`
  font-size: 1em;
  opacity: 0.6;
`;

const Body = styled.div`
  margin-bottom: 5px;
  a {
    color: inherit;
  }
`;

const Content = styled.div`
  margin-bottom: ${props => (props.pure ? 0 : -5)}px;
`;

const getUnit = (requirement, count) => {
  if (requirement.array) {
    return count === 1 ? 'item' : 'items';
  }
  return count === 1 ? 'character' : 'characters';
};

const renderRequirement = ({requirement}) => {
  return (
    <div>
      <Title>Requirement</Title>
      <Body>
        {[
          requirement.required ? 'Mandatory' : 'Optional',
          requirement.minCharacters
            ? `min. ${requirement.minCharacters} ${getUnit(
                requirement,
                requirement.minCharacters
              )}`
            : null,
          requirement.maxCharacters
            ? `max. ${requirement.maxCharacters} ${getUnit(
                requirement,
                requirement.maxCharacters
              )}`
            : null
        ]
          .filter(Boolean)
          .join(', ')}
      </Body>
    </div>
  );
};

const renderHint = ({requirement}) => {
  if (!requirement.hint) {
    return null;
  }
  return (
    <div>
      <Title>Hint</Title>
      <Body>{requirement.hint}</Body>
    </div>
  );
};

const renderContent = ({requirement, content}) => {
  if (content) {
    return <Content pure>{content}</Content>;
  }
  return (
    <Content>
      {renderRequirement({requirement})}
      {renderHint({requirement})}
    </Content>
  );
};

class EditorSectionHint extends Component {
  shouldComponentUpdate(nextProps) {
    if (!this.props.document) {
      return true;
    }
    return (
      this.props.document[this.props.field] !==
      nextProps.document[this.props.field]
    );
  }
  render() {
    const {requirement, field, content, document} = this.props;
    if (!requirement && !content) {
      return null;
    }
    if (requirement && !document) {
      console.warn('field', field, 'has requirement but no document');
    }

    return (
      <div style={{display: 'inline-block'}}>
        <NewPopover
          content={renderContent({requirement, content})}
          id={field}
          position="top"
          arrow="center"
        >
          <Container>
            <Icon icon={'question-circle'} width={18} height={18} />
          </Container>
        </NewPopover>
      </div>
    );
  }
}

export default EditorSectionHint;

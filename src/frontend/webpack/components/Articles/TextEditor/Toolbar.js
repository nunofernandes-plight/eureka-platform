import React from 'react';
import styled from 'styled-components';
import Popover from '../../../design-components/Popover.js';
import {__GRAY_200, __GRAY_900, __THIRD} from '../../../../helpers/colors.js';
import Icon from '../../../views/icons/Icon.js';
import {
  BOLD,
  ITALIC,
  UNDERLINE,
  SUPERSCRIPT,
  SUBSCRIPT,
  TEX,
  CITATION,
  EQUATION,
  SAVE,
  PREVIEW
} from './EditorStyles.js';
import {withRouter} from 'react-router-dom';

const MyIcon = styled.img`
  width: ${props => (props.width ? props.width : '18')}px;
  height: ${props => (props.height ? props.height : '18')}px;
  margin: 7px 0;
  vertical-align: middle;
`;
const Button = styled.div`
  opacity: ${props => (props.disabled ? 0.1 : props.active ? 1 : 0.3)};
  cursor: ${props => (props.disabled ? 'default' : 'pointer')};
  pointer-events: ${props => (props.disabled ? 'none' : 'auto')};
  color: ${__THIRD};
  vertical-align: middle;
  display: inline-block;
  transition: 0.1s opacity;
`;

const ToolbarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Separator = styled.div`
  height: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${__GRAY_200};
  margin-top: 25px;
  margin-bottom: 10px;
  width: 100%;
`;

const getContent = style => {
  if (style === BOLD) {
    return <MyIcon src="/img/editor/021-bold.svg" />;
  }
  if (style === ITALIC) {
    return <MyIcon src="/img/editor/020-italic.svg" />;
  }
  if (style === UNDERLINE) {
    return <MyIcon src="/img/editor/019-underline.svg" />;
  }
  if (style === SUPERSCRIPT) {
    return <MyIcon src="/img/editor/029-superscript.svg" />;
  }
  if (style === SUBSCRIPT) {
    return <MyIcon src="/img/editor/031-subscript.svg" />;
  }
  if (style === TEX) {
    return <MyIcon src="/img/editor/subscript_black.png" />;
  }
  if (style === EQUATION) {
    return <MyIcon src="/img/editor/046-formula.svg" />;
  }
  if (style === CITATION) {
    return <MyIcon src="/img/editor/017-left-quote.svg" />;
  }
  if (style === SAVE) {
    return (
      <Icon
        icon={'save'}
        width={20}
        height={20}
        top={7}
        bottom={7}
        color={__GRAY_900}
      />
    );
  }

  if (style === PREVIEW) {
    return <MyIcon width={21} height={21} src="/img/editor/preview.png" />;
  }
  return null;
};

const InlineStyleButton = props => {
  return (
    <StyledButton
      tooltip={props.tooltip}
      id={props.style}
      onClick={() => {
        props.onClick();
      }}
    >
      {getContent(props.style)}
    </StyledButton>
  );
};

const StyledButton = props => {
  const {tooltip, id, ...otherProps} = props;
  return (
    <Button
      onMouseDown={e => e.preventDefault()}
      onClick={e => {
        e.preventDefault();
        props.onClick(e);
      }}
      {...otherProps}
    >
      <Popover
        timeout={0}
        content={tooltip}
        id={id}
        arrow="center"
        position="left"
      >
        {props.children}
      </Popover>
    </Button>
  );
};

const InsertTextButton = props => {
  return (
    <StyledButton
      id="insert-text"
      onClick={() => {
        // Props.onInsert(props.text);
      }}
      tooltip={props.tooltip}
    >
      {getContent(props.style)}
    </StyledButton>
  );
};

const Toolbar = ({document, ...otherProps}) => {
  const props = otherProps;
  return (
    <ToolbarContainer>
      <InlineStyleButton {...props} style={BOLD} tooltip={`Bold`} />
      <InlineStyleButton {...props} style={ITALIC} tooltip={`Italic`} />
      <InlineStyleButton {...props} style={UNDERLINE} tooltip={`Underline`} />
      <InlineStyleButton
        {...props}
        style={SUPERSCRIPT}
        tooltip={`Superscript`}
      />
      <InlineStyleButton {...props} style={SUBSCRIPT} tooltip="Subscript" />
      {/* <RemoveStyleButton {...props} /> */}
      <InsertTextButton
        {...props}
        style={CITATION}
        tooltip={`Insert citation ([)`}
        text="["
      />
      <InsertTextButton
        {...props}
        style={EQUATION}
        tooltip={`Insert equation ($$)`}
        text="$$ e = mc^2 $$"
      />
      <Separator />
      <InlineStyleButton style={SAVE} tooltip="Save" />
      <InlineStyleButton
        style={PREVIEW}
        tooltip="Preview"
        onClick={() => {
          props.history.push({
            pathname: `/app/preview/${props.documentId}`,
            state: {
              from: `/app/articles/drafts/${props.documentId}`
            }
          });
        }}
      />
    </ToolbarContainer>
  );
};

export default withRouter(Toolbar);

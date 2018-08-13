import React from 'react';
import styled from 'styled-components';
import {
  BOLD,
  ITALIC,
  UNDERLINE,
  SUPERSCRIPT,
  SUBSCRIPT,
  TEX,
  CITATION,
  EQUATION
} from './EditorStyles.js';
import Popover from '../../design-components/Popover.js';

const MaterialIcon = styled.i`
  font-size: 22px;
  vertical-align: middle;
`;

const Icon = styled.img`
  width: 24px;
  height: 24px;
  vertical-align: middle;
`;
const Button = styled.div`
  opacity: ${props => (props.disabled ? 0.1 : props.active ? 1 : 0.3)};
  cursor: ${props => (props.disabled ? 'default' : 'pointer')};
  pointer-events: ${props => (props.disabled ? 'none' : 'auto')};
  color: black;
  vertical-align: middle;
  display: inline-block;
  margin-right: 5px;
  transition: 0.1s opacity;
`;

const getContent = style => {
  if (style === BOLD) {
    return <MaterialIcon className="material-icons">format_bold</MaterialIcon>;
  }
  if (style === ITALIC) {
    return (
      <MaterialIcon className="material-icons">format_italic</MaterialIcon>
    );
  }
  if (style === UNDERLINE) {
    return (
      <MaterialIcon className="material-icons">format_underline</MaterialIcon>
    );
  }
  if (style === SUPERSCRIPT) {
    return <Icon src="/img/editor/superscript_black.png" />;
  }
  if (style === SUBSCRIPT) {
    return <Icon src="/img/editor/subscript_black.png" />;
  }
  if (style === TEX) {
    return <Icon src="/img/editor/subscript_black.png" />;
  }
  if (style === EQUATION) {
    return <Icon src="/img/editor/format_black.png" />;
  }
  if (style === CITATION) {
    return <MaterialIcon className="material-icons">format_quote</MaterialIcon>;
  }
  return null;
};

const InlineStyleButton = props => {
  return (
    <StyledButton tooltip={props.tooltip} id={props.style} onClick={() => {}}>
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
        position="bottom"
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
        // props.onInsert(props.text);
      }}
      tooltip={props.tooltip}
    >
      {getContent(props.style)}
    </StyledButton>
  );
};

const Toolbar = props => {
  return (
    <div style={{alignSelf: 'center'}}>
      <InlineStyleButton {...props} style={BOLD} tooltip={`Bold`} />
      <InlineStyleButton {...props} style={ITALIC} tooltip={`Italic`} />
      <InlineStyleButton {...props} style={UNDERLINE} tooltip={`Underline`} />
      <InlineStyleButton
        {...props}
        style={SUPERSCRIPT}
        tooltip={`Superscript`}
      />
      <InlineStyleButton {...props} style={SUBSCRIPT} tooltip="Subscript" />
      {/*<RemoveStyleButton {...props} />*/}
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
    </div>
  );
};

export default Toolbar;

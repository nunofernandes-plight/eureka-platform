import React from 'react';
import styled from 'styled-components';
import {__GRAY_200, __GRAY_700, __GRAY_900} from '../../../helpers/colors.js';
import {renderField} from '../Articles/Online/TextEditor/DocumentRenderer.mjs';
import {Email} from '../../views/Email.js';

const Container = styled.div`
  margin-bottom: 30px;
  color: ${__GRAY_700};
  font-style: italic;
  font-size: 12px;
  border: 1px dashed ${__GRAY_200};
  padding: 12px;
`;

const Line = styled.div`
  padding: 10px 0 4px 4px;
  border-bottom: 1px solid ${__GRAY_200};
  display: flex;
`;

const LineTitle = styled.div`
  align-self: flex-start;
  text-align: left;
  font-weight: bold;
  font-size: 12px;
  margin: 0;
  width: 52px;
`;

const LineContent = styled.div`
  color: ${__GRAY_900};
  text-align: left;
  margin-right: 2.5px;
`;

const EmailContent = styled.p`
  text-align: left;
  padding: 10px 0 4px 4px;
  font-size: 11px;
`;

const MyButton = styled.button`
  margin: 15px 0;
  opacity: 0.5;
  padding: 14px;
  pointer-events: none;
`;

const EmailPreview = props => {
  const title = renderField(props.article, 'title');
  return (
    <Container>
      <Line>
        <LineTitle>To:</LineTitle>
        {props.reviewersToInvite
          ? props.reviewersToInvite.map((r, i) => {
              return (
                <LineContent key={i}>
                  <Email email={r.email} />
                </LineContent>
              );
            })
          : null}
      </Line>
      <Line>
        <LineTitle>From:</LineTitle>
        <LineContent>
          <Email email={'ea-team@eurekatoken.io'} />
        </LineContent>
      </Line>
      <Line>
        <LineTitle>Subject:</LineTitle>
        <LineContent style={{marginLeft: 6}}>
          Invitation for reviewing the article {title}
        </LineContent>
      </Line>
      <EmailContent>
        Dear Reviewer, <br />
        You got an invitation for reviewing a manuscript titled{' '}
        <strong>{title}</strong>. Please let the author now if you are willing
        to submit a review for this manuscript by simply clicking the button
        below. <br />
        <MyButton disabled>Accept invitation</MyButton>
        <br />
        Thanks a lot in advance for your time, <br />
        EUREKA Editorial Team
      </EmailContent>
    </Container>
  );
};

export default EmailPreview;

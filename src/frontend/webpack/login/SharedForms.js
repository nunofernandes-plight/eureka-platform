import styled from 'styled-components';
import {__FOURTH, __THIRD} from '../../helpers/colors.js';
import {Row} from '../../helpers/layout.js';

export const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  position: relative;
`;
export const Title = styled.h1`
  color: ${__THIRD};
  margin: 0;
  text-align: center;
  display: flex;
  justify-content: center;
`;

export const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  border-radius: 5px;
  max-width: 600px;
  min-width: 517px;
  position: relative;
`;

export const Button = styled.button`
  background: -webkit-linear-gradient(0deg, ${__THIRD} 0%, ${__FOURTH} 100%);
  align-self: center;
`;

export const AlertContainer = styled.div`
  word-break: break-word;
  width: 700px;
  margin-bottom: 40px;
  margin-top: 30px;
`;

export const TitleRow = Row.extend`
  flex-direction: column;
`;
export const LoginRow = styled.div`
  margin: 10px 0;
`;

export const ButtonRow = styled.div`
  align-self: center;
  margin: 15px 0;
`;

export const Paragraph = styled.p``;

export const AlertDevContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 20px;
  max-width: 900px;
  color: white;
  border-radius: 4px;
  margin-top: 30px;
`;
export const SubTitle = styled.h2`
  text-align: center;
`;

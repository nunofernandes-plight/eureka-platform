import React from 'react';
import styled from 'styled-components';
import {__FIFTH} from '../../helpers/colors.js';

const Container = styled.div``;

const List = styled.ul`
  list-style: none;
  padding-left: 0;
  border: 1px solid white;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-right: 0;
  border-radius: 5px;
  background: ${__FIFTH};
`;

const Point = styled.li``;

const Content = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h4`
  color: white;
  margin: 5px 0;
`;

const SmartContractInputData = props => {
  return (
    <Container>
      <List>
        <Point>
          <Content>
            <Title>Hash</Title> {props.inputData.hash}
          </Content>
        </Point>
        <Point>
          <Content>
            <Title>Authors</Title> {props.inputData.authors}
          </Content>
        </Point>
        <Point>
          <Content>
            <Title>URL</Title> {props.inputData.url}
          </Content>
        </Point>
      </List>
    </Container>
  );
};

export default SmartContractInputData;

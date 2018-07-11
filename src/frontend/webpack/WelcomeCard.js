import React, {Component} from 'react';
import styled from 'styled-components';
import {__THIRD} from '../helpers/colors.js';
import ReactCardFlip from 'react-card-flip';
import Icon from './icons/Icon.js';
import EurekaLogo from './icons/EurekaLogo.js';

const Container = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-evenly;
  position: absolute;
  margin-top: 80px;
  z-index: 100;
`;
const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0 5px 8px 0 rgba(0, 0, 0, 0.1);
  transition: 0.2s ease;
  width: 275px;
  height: 250px;
  color: ${__THIRD};
  margin: 0 10px;
  padding: 15px;
  z-index: 100;
  position: absolute;
  left: -147px;
`;

const CardTitle = styled.h2`
  margin-bottom: auto;
  text-transform: uppercase;
`;

const CardFigure = styled.img`
  height: 72px;
  width: auto;
  margin-bottom: auto;
`;

const CardFigureBack = styled.div`
  &:hover {
    transition: all 0.25s;
    background: #2e3391;
    border: 1px solid #2e3391;
    color: white;
  }
  display: flex;
  align-items: center;
  justify-content: center;
  height: 72px;
  margin-bottom: auto;
  color: ${__THIRD};
  cursor: pointer;
  background: white;
  border: 1px solid #2e3391;
  padding: 40px 25px;
  border-radius: 50%;
  margin-top: 10px;
`;

const CardDescription = styled.p`
  margin: auto 0;
  word-break: break-word;
`;

class Cards extends Component {
  constructor() {
    super();
    this.state = {
      '1': false,
      '2': false,
      '3': false,
      '4': false
    };
  }

  flipCard(key) {
    const flip = !this.state[key];
    this.setState({[key]: flip});
  }
  render() {
    return (
      <Container>
        <ReactCardFlip isFlipped={this.state['1']}>
          <Card key="front" onMouseEnter={() => this.flipCard('1')}>
            <CardTitle>Become an author</CardTitle>
            <CardFigure src="img/icons/submit.png" />
            <CardDescription>
              Submit your article to be peer-reviewed in the EUREKA ecosystem
            </CardDescription>
          </Card>
          <Card key="back" onMouseLeave={() => this.flipCard('1')}>
            <CardTitle>Submit article</CardTitle>
            <CardFigureBack>
              <Icon icon="plus" width={30} height={30} />
            </CardFigureBack>
            <button>Submit article now!</button>
          </Card>
        </ReactCardFlip>

        <ReactCardFlip isFlipped={this.state['2']}>
          <Card key="front" onMouseEnter={() => this.flipCard('2')}>
            <CardTitle>Start reviewing</CardTitle>
            <CardFigure src="img/icons/become_reviewer.png" />
            <CardDescription>
              Send your reviewer application in a few steps!{' '}
            </CardDescription>
          </Card>
          <Card key="back" onMouseLeave={() => this.flipCard('2')}>
            <CardTitle>Submit application</CardTitle>
            <CardFigureBack>
              <Icon icon="arrow-right" width={30} height={30} />
            </CardFigureBack>
            <button>Become a reviewer!</button>
          </Card>
        </ReactCardFlip>

        <ReactCardFlip isFlipped={this.state['3']}>
          <Card key="front" onMouseEnter={() => this.flipCard('3')}>
            <CardTitle>Validation</CardTitle>

            <CardFigure src="img/icons/validate.png" />
            <CardDescription>
              Validate or invalidate a existing work!
            </CardDescription>
          </Card>
          <Card key="back" onMouseLeave={() => this.flipCard('3')}>
            <CardTitle>Validate a work</CardTitle>
            <CardFigureBack>
              <Icon icon="check" width={30} height={30} />
            </CardFigureBack>
            <button>Validate!</button>
          </Card>
        </ReactCardFlip>

        <ReactCardFlip isFlipped={this.state['4']}>
          <Card key="front" onMouseEnter={() => this.flipCard('4')}>
            <CardTitle>Our Journal</CardTitle>
            <EurekaLogo width={70} height={70} />
            <CardDescription>
              Have a look at the articles which have been published into our
              Journal
            </CardDescription>
          </Card>
          <Card key="back" onMouseLeave={() => this.flipCard(4)}>
            <CardTitle>Our Jorunal</CardTitle>
            <CardFigureBack>
              <Icon icon="read" width={30} height={30} />
            </CardFigureBack>
            <button>Read more...</button>
          </Card>
        </ReactCardFlip>
      </Container>
    );
  }
}

export default Cards;

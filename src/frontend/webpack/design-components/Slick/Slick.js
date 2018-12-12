import React, {Component} from 'react';
import styled from 'styled-components';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import {Carousel} from 'react-responsive-carousel';

const Item = styled.div``;

class Slick extends Component {
  render() {
    return (
      <Carousel {...this.props}>
        <Item>
          <img src="http://placekitten.com/g/200/100" />
          <p className="legend">Legend 1</p>
        </Item>
        <Item>
          <img src="http://placekitten.com/g/200/100" />
          <p className="legend">Legend 2</p>
        </Item>
        <Item>
          <img src="http://placekitten.com/g/200/100" />
          <p className="legend">Legend 3</p>
        </Item>
      </Carousel>
    );
  }
}

export default Slick;

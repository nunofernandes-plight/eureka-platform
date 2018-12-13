import React, {Component} from 'react';
import styled from 'styled-components';
import {Link} from 'react-router-dom';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import {Carousel} from 'react-responsive-carousel';
import './slick.css';

const Item = styled.div``;

const Slick = ({items, ...otherProps}) => {
  return (
    <Carousel {...otherProps}>
      {items.map((item, i) => {
        return (
          <Item key={i}>
            {item.image ? (
              <img src={item.image} style={{borderRadius: '4px'}} />
            ) : null}
            <Link to={item.link}>
              <p className="legend newLegend">{item.legend}</p>
            </Link>
          </Item>
        );
      })}
    </Carousel>
  );
};

export default Slick;

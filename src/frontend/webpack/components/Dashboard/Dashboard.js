import React, {Component} from 'react';
import styled from 'styled-components';
import {getDomain} from '../../../../helpers/getDomain.mjs';
import Modal from '../../design-components/Modal.js';
import DashboardCard from './DashboardCard.js';
import EurekaRotateSpinner from '../../views/spinners/EurekaRotateSpinner.js';
import {EXTRA_LARGE_DEVICES, LARGE_DEVICES} from '../../../helpers/mobile.js';

const Container = styled.div`
  display: flex;
  justify-content: center;
`;

const Cards = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 85%;
  box-sizing: border-box;

  ${EXTRA_LARGE_DEVICES`
   flex-direction: column;
  `};
`;

class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      analytics: null,
      loading: true,
      errorMessage: null
    };
  }

  componentDidMount() {
    fetch(`${getDomain()}/api/dashboard`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
      .then(response => response.json())
      .then(response => {
        if (response.success) {
          this.setState({analytics: response.data, loading: false});
        } else {
          this.setState({
            errorMessage: response.error,
            loading: false
          });
        }
      })
      .catch(err => {
        console.log(err);
        this.setState({
          errorMessage: 'Ouh. Something went wrong.',
          articlesLoading: false
        });
      });
  }

  renderModal() {
    return (
      <Modal
        type={'notification'}
        toggle={() => {
          this.setState({errorMessage: null});
        }}
        show={this.state.errorMessage}
        title={'You got the following error'}
      >
        {this.state.errorMessage}
      </Modal>
    );
  }
  render() {
    return (
      <Container>
        {this.renderModal()}

        {this.state.loading ? (
          <EurekaRotateSpinner />
        ) : (
          <Cards>
            {this.state.analytics.map((stat, i) => {
              return <DashboardCard key={i} stat={stat} />;
            })}
          </Cards>
        )}
      </Container>
    );
  }
}

export default Dashboard;

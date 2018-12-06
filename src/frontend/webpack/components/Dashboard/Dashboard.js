import React, {Component} from 'react';
import styled from 'styled-components';
import {Card} from '../../views/Card.js';
import {getDomain} from '../../../../helpers/getDomain.mjs';
import Modal from '../../design-components/Modal.js';
import GridSpinner from '../../views/spinners/GridSpinner.js';
import DashboardCard from './DashboardCard.js';
import EurekaRotateSpinner from '../../views/spinners/EurekaRotateSpinner.js';

const Container = styled.div`
  display: flex;
  justify-content: center;
`;

const Cards = styled.div`
  display: flex;
  flex-wrap: wrap;
  box-sizing: border-box;
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

        <Card title={'Your Dashboard'}>
          {this.state.loading ? (
            <EurekaRotateSpinner />
          ) : (
            <Cards>
              {this.state.analytics.map((stat, i) => {
                return <DashboardCard key={i} stat={stat} />;
              })}
            </Cards>
          )}
        </Card>
      </Container>
    );
  }
}

export default Dashboard;
